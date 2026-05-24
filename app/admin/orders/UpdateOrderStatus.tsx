'use client'

import { useRouter } from 'next/navigation'
import type { OrderStatus } from '@/lib/types'

const STATUSES: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']
const LABELS: Record<OrderStatus, string> = {
  pending: 'Pendiente', paid: 'Pagado', shipped: 'Enviado', delivered: 'Entregado', cancelled: 'Cancelado',
}

export default function UpdateOrderStatus({ orderId, currentStatus }: { orderId: string; currentStatus: OrderStatus }) {
  const router = useRouter()

  const handleChange = async (newStatus: string) => {
    await fetch(`/api/admin/orders`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status: newStatus }),
    })
    router.refresh()
  }

  return (
    <select
      value={currentStatus}
      onChange={(e) => handleChange(e.target.value)}
      className="bg-[#1a1a2e] border border-[#1e1e35] text-[#f1f0ff] text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#a855f7] cursor-pointer"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{LABELS[s]}</option>
      ))}
    </select>
  )
}
