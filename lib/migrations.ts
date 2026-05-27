/**
 * lib/migrations.ts
 *
 * Runner de migraciones de base de datos para Supabase.
 * Se invoca automáticamente desde instrumentation.ts en cada cold-start.
 *
 * Estrategia de dos pasos:
 *   1. CHECK  — usa supabaseAdmin (service_role) para detectar columnas faltantes.
 *               No requiere variables de entorno nuevas.
 *   2. APPLY  — si se necesita migrar, ejecuta el SQL via Supabase Management API.
 *               Requiere SUPABASE_ACCESS_TOKEN (personal access token de Supabase).
 *
 * Es idempotente: seguro de correr en cada cold-start.
 * Si las columnas ya existen, termina en < 100 ms sin hacer nada.
 */

import { getSupabaseAdmin } from '@/lib/supabase/admin'

// ─── SQL de migración ──────────────────────────────────────────────────────────
// Usamos IF NOT EXISTS en todas las sentencias: seguro de ejecutar múltiples veces.
const MIGRATION_SQL = `
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS currency VARCHAR(3) NOT NULL DEFAULT 'EUR';

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS display_total NUMERIC(14, 2);

UPDATE public.orders
  SET display_total = total
  WHERE display_total IS NULL;
`.trim()

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Detecta si la migración es necesaria consultando la tabla `orders`.
 * Si `currency` o `display_total` no existen, PostgREST devuelve el código
 * PostgreSQL 42703 (undefined_column) — señal clara de que hay que migrar.
 *
 * Usa el service_role key (ya disponible) — no requiere env vars nuevas.
 */
async function isMigrationNeeded(): Promise<boolean> {
  try {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase
      .from('orders')
      .select('currency, display_total')
      .limit(0)

    if (!error) return false  // Columnas presentes, todo bien

    // Código 42703 = column does not exist (PostgreSQL)
    const isColumnMissing =
      error.code === '42703' ||
      error.message?.toLowerCase().includes('does not exist') ||
      error.message?.toLowerCase().includes('column')

    return isColumnMissing
  } catch {
    // Ante la duda, intentar la migración (es idempotente)
    return true
  }
}

/**
 * Ejecuta el SQL de migración via Supabase Management API.
 *
 * Requiere:
 *   - NEXT_PUBLIC_SUPABASE_URL  (ya configurada)
 *   - SUPABASE_ACCESS_TOKEN     (personal access token — ver instrucciones abajo)
 *
 * Para generar el token:
 *   1. Ir a https://app.supabase.com/account/tokens
 *   2. Crear un nuevo Access Token
 *   3. Agregar SUPABASE_ACCESS_TOKEN=sbp_xxxx en Vercel → Settings → Environment Variables
 *   4. Redesplegar
 *
 * Sin el token, se muestra una advertencia y se salta la migración automática.
 * En ese caso, ejecutar supabase/add_currency_to_orders.sql manualmente.
 */
async function applyMigration(): Promise<void> {
  const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL
  const accessToken  = process.env.SUPABASE_ACCESS_TOKEN

  if (!supabaseUrl || !accessToken) {
    console.warn(
      '\n[migrations] ⚠️  Migración pendiente — columnas currency/display_total no existen en orders.\n' +
      '  Para automatizar la migración, configurar en Vercel → Environment Variables:\n' +
      '    SUPABASE_ACCESS_TOKEN = <personal access token>\n' +
      '  Generar en: https://app.supabase.com/account/tokens\n' +
      '  O ejecutar manualmente: supabase/add_currency_to_orders.sql\n'
    )
    return
  }

  // Extraer project ref: https://ABCDEF.supabase.co → "ABCDEF"
  let projectRef: string
  try {
    projectRef = new URL(supabaseUrl).hostname.split('.')[0]
    if (!projectRef) throw new Error('No se pudo extraer el project ref de NEXT_PUBLIC_SUPABASE_URL')
  } catch (err) {
    throw new Error(`[migrations] URL de Supabase inválida: ${err}`)
  }

  const endpoint = `https://api.supabase.com/v1/projects/${projectRef}/database/query`

  const response = await fetch(endpoint, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: MIGRATION_SQL }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '(sin cuerpo)')
    throw new Error(
      `[migrations] Management API respondió ${response.status} ${response.statusText}: ${body}`
    )
  }

  console.log(
    '[migrations] ✅ Migración aplicada: columnas currency y display_total agregadas a orders.'
  )
}

// ─── Punto de entrada público ─────────────────────────────────────────────────

/**
 * Verifica si la migración es necesaria y la aplica automáticamente.
 *
 * - Si las columnas ya existen → retorna inmediatamente (< 100 ms).
 * - Si faltan y SUPABASE_ACCESS_TOKEN está configurado → migra via API.
 * - Si faltan y no hay token → imprime instrucciones y continúa sin error.
 *
 * Llamar desde instrumentation.ts (corre en cada cold-start de Next.js).
 */
export async function runMigrations(): Promise<void> {
  const needed = await isMigrationNeeded()
  if (!needed) return

  console.log('[migrations] 🔄 Columnas currency/display_total no encontradas. Aplicando migración...')
  await applyMigration()
}
