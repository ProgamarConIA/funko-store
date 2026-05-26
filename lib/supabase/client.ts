'use client'

import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Instancia singleton del cliente Supabase para el navegador.
 * Se crea solo una vez por sesión de browser y se reutiliza en todos
 * los componentes que lo necesiten.
 */
let _client: SupabaseClient | null = null

/**
 * Retorna el cliente Supabase para uso en componentes 'use client'.
 *
 * El import de @supabase/ssr se hace con require() DENTRO de la función
 * (no como import estático en la cabecera del módulo).
 * Motivo: @supabase/ssr accede a la variable global `location` del navegador
 * al ser evaluado. Con un import estático, Next.js evaluaba el paquete durante
 * la generación de páginas estáticas (SSR), donde `location` no existe,
 * causando `ReferenceError: location is not defined` en el build.
 * Con require() lazy, el paquete solo se carga cuando createClient() se llama,
 * lo cual solo ocurre en el navegador (donde `location` existe).
 */
export function createClient(): SupabaseClient {
  if (!_client) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createBrowserClient } = require('@supabase/ssr') as typeof import('@supabase/ssr')
    _client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }
  return _client
}
