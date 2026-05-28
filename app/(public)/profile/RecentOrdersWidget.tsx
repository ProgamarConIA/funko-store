'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDateTime, formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { Package, Wifi } from 'lucide-react'

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  delivered: { bg: '#dcfce7', color: '#15803d' },
  shipped:   { bg: '#dbeafe', color: '#1d4ed8' },
  paid:      { bg: '#cffafe', color: '#0e7490' },
  pending:   { bg: '#fef9c3', color: '#a16207' },
  cancelled: { bg: '#fee2e2', color: '#b91c1c' },
}
const STATUS_LABEL: Record<string, string> = {
  pending: 'Pendiente', paid: 'Pagado', shipped: 'Enviado',
  delivered: 'Entregado', cancelled: 'Cancelado',
}

interface Order {
  id:            string
  status:        string
  total:         number
  currency:      string | null
  display_total: number | null
  created_at:    string
}

interface Props {
  initialOrders: Order[]
  userId:        string
}

export default function RecentOrdersWidget({ initialOrders, userId }: Props) {
  const [orders,    setOrders]    = useState<Order[]>(initialOrders)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`orders:user:${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `user_id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newOrder = payload.new as Order
            setOrders((prev) => [newOrder, ...prev].slice(0, 5))
          } else if (payload.eventType === 'UPDATE') {
            setOrders((prev) =>
              prev.map((o) => o.id === (payload.new as Order).id ? { ...o, ...(payload.new as Order) } : o)
            )
          }
        },
      )
      .subscribe((status) => {
        setConnected(status === 'SUBSCRIBED')
      })

    return () => { supabase.removeChannel(channel) }
  }, [userId])

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#0F0F14] flex items-center gap-2">
          <Package className="w-4 h-4 text-[#5856D6]" />
          Últimos pedidos
          {connected && (
            <span title="Actualizaciones en tiempo real activas" className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
              <Wifi className="w-2.5 h-2.5" /> en vivo
            </span>
          )}
        </h3>
        <Link
          href="/profile/orders"
          className="text-xs font-medium text-[#5856D6] hover:text-[#4644b8] transition-colors"
        >
          Ver todos →
        </Link>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-2">
          {orders.map((order) => {
            const s = STATUS_STYLE[order.status] ?? { bg: '#f3f4f6', color: '#6b7280' }
            return (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100"
              >
                <div>
                  <p className="text-sm font-semibold text-[#0F0F14] font-mono">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDateTime(order.created_at)}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <p className="text-sm font-bold text-[#5856D6]">
                    {formatPrice(order.display_total ?? order.total, order.currency ?? 'EUR')}
                  </p>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: s.bg, color: s.color }}
                  >
                    {STATUS_LABEL[order.status] ?? order.status}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-400">Aún no tenés pedidos</p>
          <Link
            href="/"
            className="mt-3 inline-block text-sm font-medium text-[#5856D6] hover:text-[#4644b8] transition-colors"
          >
            ¡Empezar a comprar! →
          </Link>
        </div>
      )}
    </div>
  )
}
