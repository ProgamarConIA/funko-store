import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const body = await request.json()
    const { items, total, shipping_address, currency, display_total } = body

    if (!items?.length || !total || !shipping_address) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    // Sanitizar moneda: acepta solo códigos ISO válidos de nuestro catálogo
    const VALID_CURRENCIES = ['EUR', 'USD', 'ARS', 'MXN', 'COP', 'CLP', 'BRL', 'JPY']
    const safeCurrency     = VALID_CURRENCIES.includes(currency) ? currency : 'EUR'
    const safeDisplayTotal = typeof display_total === 'number' && display_total >= 0
      ? display_total
      : total   // fallback: si no vino display_total, usar el total EUR

    // Verificar stock de cada producto
    for (const item of items) {
      const { data: product } = await supabaseAdmin
        .from('products')
        .select('stock, name')
        .eq('id', item.product_id)
        .single()

      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Sin stock suficiente para: ${product?.name ?? item.product_id}` },
          { status: 400 }
        )
      }
    }

    // Crear la orden
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id:        user.id,
        status:         'paid',
        total,                      // EUR — base contable interna
        currency:       safeCurrency,
        display_total:  safeDisplayTotal,
        shipping_address,
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Crear los items de la orden
    const orderItems = items.map((item: { product_id: string; quantity: number; unit_price: number }) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }))

    const { error: itemsError } = await supabaseAdmin.from('order_items').insert(orderItems)
    if (itemsError) throw itemsError

    // Descontar stock
    for (const item of items) {
      await supabaseAdmin.rpc('decrement_stock', {
        product_id: item.product_id,
        qty: item.quantity,
      })
    }

    return NextResponse.json({ data: order }, { status: 201 })
  } catch (error: unknown) {
    console.error('Error creando orden:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, product:products(name, image_url))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
