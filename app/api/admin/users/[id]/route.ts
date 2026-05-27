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

/** Carga el target y aplica protecciones comunes a PATCH y DELETE. */
async function getTarget(id: string) {
  const { data } = await supabaseAdmin
    .from('profiles')
    .select('id, email')
    .eq('id', id)
    .single()
  return data
}

// ─── PATCH /api/admin/users/[id] ─────────────────────────────────────────────
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await checkAdmin()
  if (!admin) return NextResponse.json({ error: 'Sin autorización' }, { status: 403 })

  const { id } = await params
  const body    = await request.json() as { role?: unknown }
  const role    = body.role as Role

  if (!VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: `Rol inválido. Permitidos: ${VALID_ROLES.join(', ')}` }, { status: 400 })
  }
  if (id === admin.id) {
    return NextResponse.json({ error: 'No podés modificar tu propio rol' }, { status: 403 })
  }

  const target = await getTarget(id)
  if (target?.email === ADMIN_EMAIL) {
    return NextResponse.json({ error: 'No se puede modificar el rol del admin principal' }, { status: 403 })
  }

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id, email, role')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

// ─── DELETE /api/admin/users/[id] ────────────────────────────────────────────
/**
 * Elimina un usuario de auth.users (cascadea a profiles por FK ON DELETE CASCADE).
 * Usa supabaseAdmin.auth.admin.deleteUser() — requiere service role key.
 *
 * Protecciones:
 *  - Caller debe ser admin
 *  - No se puede eliminar al admin principal (ADMIN_EMAIL)
 *  - El admin no puede eliminar su propia cuenta
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await checkAdmin()
  if (!admin) return NextResponse.json({ error: 'Sin autorización' }, { status: 403 })

  const { id } = await params

  if (id === admin.id) {
    return NextResponse.json({ error: 'No podés eliminar tu propia cuenta desde aquí' }, { status: 403 })
  }

  const target = await getTarget(id)
  if (!target) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })

  if (target.email === ADMIN_EMAIL) {
    return NextResponse.json({ error: 'No se puede eliminar el admin principal' }, { status: 403 })
  }

  // Eliminar de auth.users → cascadea a profiles automáticamente
  const { error } = await supabaseAdmin.auth.admin.deleteUser(id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
