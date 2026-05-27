-- ═══════════════════════════════════════════════════════════════
--  FunkoStore — Migración: moneda en órdenes
--
--  ✅ MIGRACIÓN AUTOMÁTICA: Este SQL lo aplica automáticamente
--     instrumentation.ts en cada cold-start de Next.js/Vercel,
--     siempre que SUPABASE_ACCESS_TOKEN esté configurado.
--
--  🔧 CONFIGURACIÓN ÚNICA REQUERIDA:
--     1. Generar un Personal Access Token en:
--        https://app.supabase.com/account/tokens
--     2. Agregarlo a Vercel → Settings → Environment Variables:
--        SUPABASE_ACCESS_TOKEN = sbp_xxxxxxxxxxxx
--     3. Redesplegar. La migración correrá sola.
--
--  📋 EJECUCIÓN MANUAL (fallback si no usás el token):
--     Copiar y ejecutar en Supabase Dashboard → SQL Editor.
--     Todas las sentencias son idempotentes (IF NOT EXISTS / WHERE IS NULL).
-- ═══════════════════════════════════════════════════════════════

-- ─── 1. Columna de moneda ─────────────────────────────────────
--  Código ISO 4217 (EUR, ARS, USD, MXN, etc.)
--  DEFAULT 'EUR': compatibilidad con órdenes anteriores.
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS currency VARCHAR(3) NOT NULL DEFAULT 'EUR';

-- ─── 2. Total en la moneda del usuario ───────────────────────
--  display_total: monto en la moneda elegida al momento del checkout.
--  total (EUR) se mantiene intacto como base contable para el admin.
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS display_total NUMERIC(14, 2);

-- ─── 3. Backfill para órdenes existentes ─────────────────────
--  Las órdenes anteriores estaban en EUR → display_total = total.
UPDATE public.orders
  SET display_total = total
  WHERE display_total IS NULL;

-- ─── 4. Verificación ─────────────────────────────────────────
SELECT id, total, currency, display_total
FROM public.orders
ORDER BY created_at DESC
LIMIT 5;
