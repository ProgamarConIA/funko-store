'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { TrendingUp, Wifi } from 'lucide-react'

const STATUS_COLOR: Record<string, string> = {
  paid:      'bg-blue-50 text-blue-600 border-blue-200',
  delivered: 'bg-green-50 text-green-600 border-green-200',
  shipped:   'bg-indigo-50 text-indigo-600 border-indigo-200',
  cancelled: 'bg-red-50 text-red-500 border-red-200',
  pending:   'bg-amber-50 text-amber-600 border-amber-200',
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
  profiles:      { full_name: string | null; email: string } | null
}

export default function RecentOrdersWidget({ initialOrders }: { initialOrders: Order[] }) {
  const [orders,    setOrders]    = useState<Order[]>(initialOrders)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('admin:orders:recent')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        async (payload) => {
          // Fetch full row with profile join since realtime payload won't include joins
          const { data } = await supabase
            .from('orders')
            .select('id, status, total, currency, display_total, created_at, profiles(full_name, email)')
            .eq('id', (payload.new as { id: string }).id)
            .single()
          if (data) {
            setOrders((prev) => [data as unknown as Order, ...prev].slice(0, 6))
          }
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          const updated = payload.new as Order
          setOrders((prev) =>
            prev.map((o) => o.id === updated.id ? { ...o, ...updated } : o)
          )
        },
      )
      .subscribe((status) => {
        setConnected(status === 'SUBSCRIBED')
      })

    return () => { supabase.removeChannel(channel) }
  }, [])

  return (
    <div className="bg-white border border-[#E4E4EC] rounded-2xl overflow-hidden shadow-card">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E4E4EC]">
        <h2 className="font-semibold text-[#0F0F14] text-sm flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#5856D6]" />
          Pedidos recientes
          {connected && (
            <span title="Actualizaciones en tiempo real activas" className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
              <Wifi className="w-2.5 h-2.5" /> en vivo
            </span>
          )}
        </h2>
        <Link href="/admin/orders" className="text-xs text-[#5856D6] hover:text-[#4644b8] font-medium">
          Ver todos →
        </Link>
      </div>
      <div className="divide-y divide-[#E4E4EC]">
        {orders.length > 0 ? orders.map((order) => (
          <div key={order.id} className="flex items-center justify-between px-5 py-3">
            <div>
              <p className="text-xs font-mono font-semibold text-[#0F0F14]">#{order.id.slice(0, 8).toUpperCase()}</p>
              <p className="text-xs text-[#6B6B7B]">
                {order.profiles?.full_name ?? order.profiles?.email ?? 'Usuario'}
              </p>
            </div>
            <div className="text-right flex flex-col items-end gap-1">
              <p className="text-sm font-bold text-[#0F0F14]">
                {formatPrice(order.display_total ?? order.total, order.currency ?? 'EUR')}
              </p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${STATUS_COLOR[order.status] ?? 'bg-[#F5F5F7] text-[#6E6E73] border-[#E5E5EA]'}`}>
                {STATUS_LABEL[order.status] ?? order.status}
              </span>
            </div>
          </div>
        )) : (
          <div className="px-5 py-8 text-center text-[#B0B0BE] text-sm">Sin pedidos aún</div>
        )}
      </div>
    </div>
  )
}
