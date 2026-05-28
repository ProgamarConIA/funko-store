import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatDateTime, formatPrice, getOrderStatusColor, getOrderStatusLabel } from '@/lib/utils'
import Link from 'next/link'
import { Package, ArrowLeft, ShoppingBag } from 'lucide-react'

export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Mis pedidos' }

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirect=/profile/orders')

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      id, status, total, currency, display_total, created_at, shipping_address,
      order_items (
        id, quantity, unit_price,
        product:products (id, name, image_url, character)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#FAFAFF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/profile"
            className="p-2 rounded-xl text-gray-400 hover:text-[#5856D6] hover:bg-[#EEEDFF] transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-extrabold text-[#0F0F14]">Mis pedidos</h1>
        </div>

        {/* Sin pedidos */}
        {!orders || orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-[#EEEDFF] rounded-2xl flex items-center justify-center mb-5">
              <ShoppingBag className="w-10 h-10 text-[#5856D6]" />
            </div>
            <h2 className="text-xl font-bold text-[#0F0F14] mb-2">Sin pedidos aún</h2>
            <p className="text-gray-500 mb-6">Explorá el catálogo y empezá tu colección</p>
            <Link
              href="/"
              className="px-8 py-3 bg-[#5856D6] hover:bg-[#4644b8] text-white font-bold rounded-xl shadow-sm transition-all"
            >
              Ver catálogo
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#5856D6]/20 transition-all duration-200"
              >
                {/* Header del pedido */}
                <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-gray-100 bg-gray-50/60">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#EEEDFF] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-[#5856D6]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0F0F14] font-mono text-sm tracking-wide">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400">{formatDateTime(order.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-extrabold text-[#0F0F14]">
                      {formatPrice(
                        (order as { display_total?: number; currency?: string }).display_total ?? order.total,
                        (order as { currency?: string }).currency ?? 'EUR',
                      )}
                    </p>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getOrderStatusColor(order.status)}`}>
                      {getOrderStatusLabel(order.status)}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="px-6 py-4">
                  <div className="space-y-2">
                    {(order.order_items as unknown as Array<{
                      id: string
                      quantity: number
                      unit_price: number
                      product: { id: string; name: string; image_url: string | null; character: string } | null
                    }>)?.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 text-sm py-0.5">
                        <span className="w-1.5 h-1.5 bg-[#5856D6]/40 rounded-full flex-shrink-0" />
                        <span className="text-gray-600 flex-1">
                          {item.product?.name ?? 'Producto eliminado'} × {item.quantity}
                        </span>
                        <span className="text-[#0F0F14] font-semibold">
                          {formatPrice(
                            item.unit_price * item.quantity,
                            (order as { currency?: string }).currency ?? 'EUR',
                          )}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Dirección */}
                  {order.shipping_address && (
                    <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                      📍 {(order.shipping_address as { address: string; city: string; state: string }).address},{' '}
                      {(order.shipping_address as { address: string; city: string; state: string }).city},{' '}
                      {(order.shipping_address as { address: string; city: string; state: string }).state}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
