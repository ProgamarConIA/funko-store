import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Cliente con service_role — bypasea RLS.
 * SOLO usar en Server Components, API Routes o Server Actions.
 * NUNCA exponer en el frontend.
 */
let _adminClient: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  if (!_adminClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      throw new Error('Variables de entorno de Supabase Admin no configuradas. Ver .env.local.example')
    }
    _adminClient = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }
  return _adminClient
}

// Exportar como proxy para mantener compatibilidad con el código existente
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabaseAdmin() as unknown as Record<string | symbol, unknown>)[prop]
  },
})
