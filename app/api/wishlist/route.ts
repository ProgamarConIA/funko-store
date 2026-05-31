import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const tag = '[wishlist:api]'
const short = (id: string) => id.slice(0, 8)

// ── GET /api/wishlist — lista de product_ids del usuario ──────────────────────
export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    console.warn(tag, 'GET 401 — not authenticated')
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('wishlist')
    .select('product_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(tag, 'GET error user:', short(user.id), '—', error.message, '| code:', error.code)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const ids = (data ?? []).map((r) => r.product_id)
  console.log(tag, 'GET user:', short(user.id), '— returned', ids.length, 'ids')
  return NextResponse.json({ data: ids })
}

// ── POST /api/wishlist — agregar { product_id } ───────────────────────────────
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    console.warn(tag, 'POST 401 — not authenticated')
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  let product_id: string | undefined
  try {
    const body = await request.json()
    product_id = body?.product_id
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  if (!product_id) {
    return NextResponse.json({ error: 'product_id requerido' }, { status: 400 })
  }

  console.log(tag, 'POST user:', short(user.id), 'product:', short(product_id))

  const { error } = await supabase
    .from('wishlist')
    .upsert(
      { user_id: user.id, product_id },
      { onConflict: 'user_id,product_id' }
    )

  if (error) {
    console.error(tag, 'POST error user:', short(user.id), 'product:', short(product_id), '—', error.message, '| code:', error.code)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  console.log(tag, 'POST success user:', short(user.id), 'product:', short(product_id))
  return NextResponse.json({ data: { action: 'added', product_id } }, { status: 201 })
}

// ── DELETE /api/wishlist — eliminar { product_id } ────────────────────────────
export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    console.warn(tag, 'DELETE 401 — not authenticated')
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  let product_id: string | undefined
  try {
    const body = await request.json()
    product_id = body?.product_id
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  if (!product_id) {
    return NextResponse.json({ error: 'product_id requerido' }, { status: 400 })
  }

  console.log(tag, 'DELETE user:', short(user.id), 'product:', short(product_id))

  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('user_id', user.id)
    .eq('product_id', product_id)

  if (error) {
    console.error(tag, 'DELETE error user:', short(user.id), 'product:', short(product_id), '—', error.message, '| code:', error.code)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  console.log(tag, 'DELETE success user:', short(user.id), 'product:', short(product_id))
  return NextResponse.json({ data: { action: 'removed', product_id } })
}
