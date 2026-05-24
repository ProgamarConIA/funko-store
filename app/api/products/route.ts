import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const supabase = await createClient()

  let query = supabase.from('products').select('*')

  const search    = searchParams.get('search')
  const franchise = searchParams.get('franchise')
  const category  = searchParams.get('category')
  const min_price = searchParams.get('min_price')
  const max_price = searchParams.get('max_price')

  if (search)    query = query.ilike('name', `%${search}%`)
  if (franchise) query = query.eq('franchise', franchise)
  if (category)  query = query.eq('category', category)
  if (min_price) query = query.gte('price', Number(min_price))
  if (max_price) query = query.lte('price', Number(max_price))

  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
