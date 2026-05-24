'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import type { OrderStatus } from '@/lib/types'

const STATUSES: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']
const LABELS: Record<OrderStatus, string> = {
  pending:   'Pendiente',
  paid:      'Pagado',
  shipped:   'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

const STATUS_COLOR: Record<OrderStatus, string> = {
  pending:   'bg-amber-50 text-amber-700 border-amber-200',
  paid:      'bg-blue-50 text-blue-600 border-blue-200',
  shipped:   'bg-indigo-50 text-indigo-600 border-indigo-200',
  delivered: 'bg-green-50 text-green-600 border-green-200',
  cancelled: 'bg-red-50 text-red-500 border-red-200',
}

export default function UpdateOrderStatus({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: OrderStatus
}) {
  const router   = useRouter()
  const [loading, setLoading] = useState(false)

  const handleChange = async (newStatus: string) => {
    setLoading(true)
    await fetch('/api/admin/orders', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ orderId, status: newStatus }),
    })
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="relative inline-flex items-center gap-1.5">
      {loading && <Loader2 className="w-3 h-3 text-[#5856D6] animate-spin flex-shrink-0" />}
      <select
        value={currentStatus}
        onChange={(e) => handleChange(e.target.value)}
        disabled={loading}
        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-[#5856D6]/20 transition-all
          disabled:opacity-50 disabled:cursor-not-allowed
          ${STATUS_COLOR[currentStatus] ?? 'bg-[#F5F4FF] text-[#5856D6] border-[#E4E4EC]'}`}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{LABELS[s]}</option>
        ))}
      </select>
    </div>
  )
}
