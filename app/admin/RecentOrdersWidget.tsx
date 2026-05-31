'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice, formatDateTime, getOrderStatusColor, getOrderStatusLabel, DEFAULT_PRODUCT_IMAGE } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { TrendingUp, Wifi, ShoppingBag, User } from 'lucide-react'

interface OrderItem {
  quantity:   number
  unit_price: number
  product:    { id: string; name: string; image_url: string | null } | null
}

interface Order {
  id:            string
  status:        string
  total:         number
  currency:      string | null
  display_total: number | null
  created_at:    string
  profiles:      { full_name: string | null; email: string } | null
  order_items:   OrderItem[]
}

export default function RecentOrdersWidget({ initialOrders }: { initialOrders: Order[] }) {
  const [orders,    setOrders]    = useState<Order[]>(initialOrders)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('admin:orders:rich')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        async (payload) => {
          const newId     = (payload.new as { id: string; user_id: string }).id
          const newUserId = (payload.new as { id: string; user_id: string }).user_id

          // Fetch order + profile + items in parallel (no join to avoid FK issues)
          const [
            { data: orderRow },
            { data: profileRow },
            { data: itemRows },
          ] = await Promise.all([
            supabase
              .from('orders')
              .select('id, status, total, currency, display_total, created_at, user_id')
              .eq('id', newId)
              .single(),
            supabase
              .from('profiles')
              .select('id, full_name, email')
              .eq('id', newUserId)
              .single(),
            supabase
              .from('order_items')
              .select('order_id, quantity, unit_price, product:products(id, name, image_url)')
              .eq('order_id', newId),
          ])

          if (!orderRow) return

          const newOrder: Order = {
            id:            orderRow.id,
            status:        orderRow.status,
            total:         orderRow.total,
            currency:      (orderRow as unknown as { currency: string | null }).currency ?? null,
            display_total: (orderRow as unknown as { display_total: number | null }).display_total ?? null,
            created_at:    orderRow.created_at,
            profiles:      profileRow ?? null,
            order_items:   (itemRows ?? []).map((i) => ({
              quantity:   i.quantity,
              unit_price: i.unit_price,
              product:    (i.product as unknown as { id: string; name: string; image_url: string | null } | null),
            })),
          }
          setOrders((prev) => [newOrder, ...prev].slice(0, 10))
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          const u = payload.new as Partial<Order>
          setOrders((prev) =>
            prev.map((o) => o.id === u.id ? { ...o, ...u } : o)
          )
        },
      )
      .subscribe((status) => setConnected(status === 'SUBSCRIBED'))

    return () => { supabase.removeChannel(channel) }
  }, [])

  return (
    <div className="bg-white border border-[#E4E4EC] rounded-2xl overflow-hidden shadow-card">

      {/* ── Cabecera ─────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E4E4EC]">
        <h2 className="font-semibold text-[#0F0F14] text-sm flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#5856D6]" />
          Pedidos recientes
          {connected && (
            <span
              title="Supabase Realtime activo"
              className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full"
            >
              <Wifi className="w-2.5 h-2.5" /> en vivo
            </span>
          )}
        </h2>
        <Link href="/admin/orders" className="text-xs text-[#5856D6] hover:text-[#4644b8] font-medium">
          Ver todos →
        </Link>
      </div>

      {/* ── Lista de órdenes ─────────────────────────── */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-6">
          <div className="w-14 h-14 bg-[#EEEDFF] rounded-2xl flex items-center justify-center mb-4">
            <ShoppingBag className="w-7 h-7 text-[#5856D6]" />
          </div>
          <p className="text-sm font-semibold text-[#0F0F14] mb-1">Sin pedidos aún</p>
          <p className="text-xs text-[#B0B0BE]">Las compras de usuarios aparecerán aquí en tiempo real.</p>
        </div>
      ) : (
        <div className="divide-y divide-[#F0F0F6]">
          {orders.map((order) => {
            const user         = order.profiles
            const displayName  = user?.full_name ?? user?.email ?? 'Usuario desconocido'
            const displayEmail = user?.email
            const initial      = (displayEmail?.[0] ?? displayName?.[0] ?? '?').toUpperCase()
            const amount       = formatPrice(order.display_total ?? order.total, order.currency ?? 'EUR')
            const statusClass  = getOrderStatusColor(order.status)
            const statusLabel  = getOrderStatusLabel(order.status)
            const itemCount    = order.order_items.reduce((s, i) => s + i.quantity, 0)

            return (
              <div key={order.id} className="px-4 sm:px-6 py-4 hover:bg-[#FAFAFF] transition-colors">

                {/* ── Fila superior: usuario · ID · fecha · estado ─── */}
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">

                  {/* Usuario */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#EEEDFF] flex items-center justify-center text-xs font-bold text-[#5856D6] flex-shrink-0">
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0F0F14] truncate max-w-[140px] sm:max-w-[200px]">
                        {displayName}
                      </p>
                      {user?.full_name && displayEmail && (
                        <p className="text-[11px] text-[#B0B0BE] truncate max-w-[140px] sm:max-w-[200px]">{displayEmail}</p>
                      )}
                    </div>
                  </div>

                  {/* Meta: ID + fecha + estado */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-mono font-semibold text-[#6B6B7B] bg-[#F5F5F7] px-2 py-0.5 rounded-lg">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="text-[10px] text-[#B0B0BE] hidden sm:inline whitespace-nowrap">
                      {formatDateTime(order.created_at)}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusClass}`}>
                      {statusLabel}
                    </span>
                  </div>
                </div>

                {/* Fecha en mobile (debajo de la fila superior) */}
                <p className="text-[10px] text-[#B0B0BE] mb-2 sm:hidden">
                  {formatDateTime(order.created_at)}
                </p>

                {/* ── Fila de productos + total ────────────────────── */}
                <div className="flex items-end justify-between gap-3">

                  {/* Miniaturas + lista */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    {order.order_items.length === 0 ? (
                      <p className="text-xs text-[#B0B0BE] italic">Sin items registrados</p>
                    ) : (
                      order.order_items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#F5F4FF] rounded-lg overflow-hidden flex-shrink-0 border border-[#E4E4EC]">
                            <Image
                              src={item.product?.image_url || DEFAULT_PRODUCT_IMAGE}
                              alt={item.product?.name ?? 'Producto'}
                              width={32}
                              height={32}
                              className="object-contain w-full h-full p-0.5"
                            />
                          </div>
                          <p className="text-xs text-[#6B6B7B] truncate max-w-[160px] sm:max-w-[260px]">
                            <span className="font-medium text-[#0F0F14]">
                              {item.product?.name ?? 'Producto eliminado'}
                            </span>
                            <span className="text-[#B0B0BE] ml-1">× {item.quantity}</span>
                          </p>
                        </div>
                      ))
                    )}
                    <p className="text-[10px] text-[#B0B0BE] mt-1">
                      <User className="w-3 h-3 inline mr-0.5" />
                      {itemCount} producto{itemCount !== 1 ? 's' : ''} · {order.currency ?? 'EUR'}
                    </p>
                  </div>

                  {/* Total */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-base sm:text-lg font-extrabold text-[#0F0F14] leading-none">{amount}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}
