import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse, type NextRequest } from 'next/server'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? ''

// ── CAPA 3: Verificación en API route
async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !ADMIN_EMAIL || user.email !== ADMIN_EMAIL) return null
  return user
}

// PATCH /api/admin/products/[id] → actualiza precio y/o stock
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyAdmin()
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()
  const updates: Record<string, number> = {}

  if (body.price !== undefined) {
    const price = parseFloat(body.price)
    if (isNaN(price) || price < 0) {
      return NextResponse.json({ error: 'Precio inválido' }, { status: 400 })
    }
    updates.price = price
  }

  if (body.stock !== undefined) {
    const stock = parseInt(body.stock, 10)
    if (isNaN(stock) || stock < 0) {
      return NextResponse.json({ error: 'Stock inválido' }, { status: 400 })
    }
    updates.stock = stock
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Sin cambios' }, { status: 400 })
  }

  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}
