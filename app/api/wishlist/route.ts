import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// ── GET /api/wishlist — lista de product_ids del usuario ──────────────────────
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { data, error } = await supabase
    .from('wishlist')
    .select('product_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data: (data ?? []).map((r) => r.product_id) })
}

// ── POST /api/wishlist — agregar { product_id } ───────────────────────────────
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { product_id } = (await request.json()) as { product_id?: string }
  if (!product_id) return NextResponse.json({ error: 'product_id requerido' }, { status: 400 })

  // upsert — ignora duplicados gracias a UNIQUE(user_id, product_id)
  const { error } = await supabase
    .from('wishlist')
    .upsert({ user_id: user.id, product_id }, { onConflict: 'user_id,product_id' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data: { action: 'added', product_id } }, { status: 201 })
}

// ── DELETE /api/wishlist — eliminar { product_id } ────────────────────────────
export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { product_id } = (await request.json()) as { product_id?: string }
  if (!product_id) return NextResponse.json({ error: 'product_id requerido' }, { status: 400 })

  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('user_id', user.id)
    .eq('product_id', product_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data: { action: 'removed', product_id } })
}
