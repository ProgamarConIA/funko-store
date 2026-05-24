import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  return profile?.role === 'admin' ? user : null
}

export async function POST(request: Request) {
  const admin = await checkAdmin()
  if (!admin) return NextResponse.json({ error: 'Sin autorización' }, { status: 403 })

  const body = await request.json()
  const { name, slug, description, price, image_url, franchise, character, category, stock, is_featured } = body

  if (!name || !price || !franchise || !character) {
    return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('products')
    .insert({ name, slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), description, price, image_url, franchise, character, category: category ?? 'Standard', stock: stock ?? 10, is_featured: is_featured ?? false })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}

export async function PUT(request: Request) {
  const admin = await checkAdmin()
  if (!admin) return NextResponse.json({ error: 'Sin autorización' }, { status: 403 })

  const body = await request.json()
  const { id, ...updates } = body
  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('products')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function DELETE(request: Request) {
  const admin = await checkAdmin()
  if (!admin) return NextResponse.json({ error: 'Sin autorización' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

  const { error } = await supabaseAdmin.from('products').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
