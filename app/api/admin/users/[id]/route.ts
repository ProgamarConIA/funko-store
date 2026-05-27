import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? ''
const VALID_ROLES  = ['user', 'admin'] as const
type Role = typeof VALID_ROLES[number]

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  return profile?.role === 'admin' ? user : null
}

/**
 * PATCH /api/admin/users/[id]
 * Actualiza el rol de un usuario. Solo accesible para admins.
 *
 * Protecciones:
 *  - Caller debe ser admin (checkAdmin)
 *  - Role debe ser 'user' o 'admin'
 *  - No se puede modificar al admin primario (ADMIN_EMAIL)
 *  - No se puede automodificar (el admin no cambia su propio rol)
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await checkAdmin()
  if (!admin) return NextResponse.json({ error: 'Sin autorización' }, { status: 403 })

  const { id } = await params
  const body    = await request.json() as { role?: unknown }
  const role    = body.role as Role

  // Validar rol
  if (!VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: `Rol inválido. Valores permitidos: ${VALID_ROLES.join(', ')}` }, { status: 400 })
  }

  // No permitir que el admin se modifique a sí mismo
  if (id === admin.id) {
    return NextResponse.json({ error: 'No podés modificar tu propio rol' }, { status: 403 })
  }

  // No permitir modificar al admin primario configurado en env
  const { data: target } = await supabaseAdmin
    .from('profiles')
    .select('email')
    .eq('id', id)
    .single()

  if (target?.email === ADMIN_EMAIL) {
    return NextResponse.json({ error: 'No se puede modificar el rol del admin principal' }, { status: 403 })
  }

  // Actualizar rol (service role key omite RLS — única forma de cambiar roles)
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id, email, role')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
