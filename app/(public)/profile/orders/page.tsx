import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatDate, formatPrice, getOrderStatusColor, getOrderStatusLabel } from '@/lib/utils'
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/profile" className="text-[#64607a] hover:text-[#a855f7] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-extrabold text-[#f1f0ff]">Mis pedidos</h1>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ShoppingBag className="w-16 h-16 text-[#64607a] mb-4" />
          <h2 className="text-xl font-bold text-[#f1f0ff] mb-2">Sin pedidos aún</h2>
          <p className="text-[#64607a] mb-6">Explorá el catálogo y empezá tu colección</p>
          <Link href="/" className="px-8 py-3 bg-[#a855f7] hover:bg-[#9333ea] text-white font-bold rounded-xl shadow-[0_0_16px_rgba(168,85,247,0.4)] transition-all">
            Ver catálogo
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-[#12121f] border border-[#1e1e35] rounded-2xl overflow-hidden hover:border-[#a855f7]/30 transition-all">
              {/* Header del pedido */}
              <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-[#1e1e35]">
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-[#a855f7]" />
                  <div>
                    <p className="font-bold text-[#f1f0ff] font-mono text-sm">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs text-[#64607a]">{formatDate(order.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-[#f1f0ff]">
                    {formatPrice(
                      (order as { display_total?: number; currency?: string }).display_total ?? order.total,
                      (order as { display_total?: number; currency?: string }).currency ?? 'EUR',
                    )}
                  </p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getOrderStatusColor(order.status)}`}>
                    {getOrderStatusLabel(order.status)}
                  </span>
                </div>
              </div>

              {/* Items del pedido */}
              <div className="px-6 py-4">
                <div className="space-y-2">
                  {(order.order_items as unknown as Array<{
                    id: string
                    quantity: number
                    unit_price: number
                    product: { id: string; name: string; image_url: string | null; character: string } | null
                  }>)?.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-[#a855f7]/40 rounded-full flex-shrink-0" />
                      <span className="text-[#a09dbd] flex-1">
                        {item.product?.name ?? 'Producto eliminado'} × {item.quantity}
                      </span>
                      <span className="text-[#f1f0ff] font-semibold">
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
                  <div className="mt-3 pt-3 border-t border-[#1e1e35] text-xs text-[#64607a]">
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
  )
}
