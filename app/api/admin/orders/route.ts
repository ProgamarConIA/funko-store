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

export async function PATCH(request: Request) {
  const admin = await checkAdmin()
  if (!admin) return NextResponse.json({ error: 'Sin autorización' }, { status: 403 })

  const { orderId, status } = await request.json()
  if (!orderId || !status) return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })

  const VALID = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']
  if (!VALID.includes(status)) return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function GET() {
  const admin = await checkAdmin()
  if (!admin) return NextResponse.json({ error: 'Sin autorización' }, { status: 403 })

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*, profiles(full_name, email), order_items(*, product:products(name))')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
