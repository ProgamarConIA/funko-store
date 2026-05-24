import { supabaseAdmin } from '@/lib/supabase/admin'
import { formatDate, formatPrice } from '@/lib/utils'
import UpdateOrderStatus from './UpdateOrderStatus'
import type { Metadata } from 'next'
import { ShoppingBag } from 'lucide-react'
import type { OrderStatus } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Admin — Pedidos' }

const STATUS_BADGE: Record<string, string> = {
  pending:   'bg-amber-50 text-amber-700 border-amber-200',
  paid:      'bg-blue-50 text-blue-600 border-blue-200',
  shipped:   'bg-indigo-50 text-indigo-600 border-indigo-200',
  delivered: 'bg-green-50 text-green-600 border-green-200',
  cancelled: 'bg-red-50 text-red-500 border-red-200',
}

const STATUS_LABEL: Record<string, string> = {
  pending:   'Pendiente',
  paid:      'Pagado',
  shipped:   'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

export default async function AdminOrdersPage() {
  const { data: orders } = await supabaseAdmin
    .from('orders')
    .select('*, profiles(full_name, email)')
    .order('created_at', { ascending: false })

  const total     = orders?.length ?? 0
  const ingresos  = orders?.filter((o) => o.status === 'paid' || o.status === 'delivered')
                           .reduce((acc, o) => acc + o.total, 0) ?? 0

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F0F14]">Pedidos</h1>
          <p className="text-[#6B6B7B] text-sm mt-1">{total} pedidos en total</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#6B6B7B]">Ingresos confirmados</p>
          <p className="text-lg font-bold text-[#5856D6]">
            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(ingresos)}
          </p>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white border border-[#E4E4EC] rounded-2xl overflow-hidden shadow-card">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-[#E4E4EC]">
          <ShoppingBag className="w-4 h-4 text-[#5856D6]" />
          <span className="text-sm font-semibold text-[#0F0F14]">Historial de pedidos</span>
          <span className="ml-auto text-xs text-[#6B6B7B]">Cambia el estado directamente en la tabla</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-[#E4E4EC]">
                {['ID', 'Cliente', 'Total', 'Estado actual', 'Fecha', 'Cambiar estado'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] font-semibold text-[#B0B0BE] uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => {
                const profile = order.profiles as { full_name: string | null; email: string } | null
                const badgeClass = STATUS_BADGE[order.status] ?? 'bg-[#F5F4FF] text-[#5856D6] border-[#E4E4EC]'
                return (
                  <tr key={order.id} className="border-b border-[#E4E4EC] hover:bg-[#F9F8FF] transition-colors">

                    {/* ID */}
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-mono font-semibold text-[#0F0F14]">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>

                    {/* Cliente */}
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-[#0F0F14]">
                        {profile?.full_name ?? 'Sin nombre'}
                      </p>
                      <p className="text-xs text-[#6B6B7B]">{profile?.email}</p>
                    </td>

                    {/* Total */}
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-bold text-[#0F0F14]">{formatPrice(order.total)}</span>
                    </td>

                    {/* Estado actual (badge visual) */}
                    <td className="px-5 py-3.5">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${badgeClass}`}>
                        {STATUS_LABEL[order.status] ?? order.status}
                      </span>
                    </td>

                    {/* Fecha */}
                    <td className="px-5 py-3.5 text-xs text-[#6B6B7B] whitespace-nowrap">
                      {formatDate(order.created_at)}
                    </td>

                    {/* Select para cambiar estado */}
                    <td className="px-5 py-3.5">
                      <UpdateOrderStatus
                        orderId={order.id}
                        currentStatus={order.status as OrderStatus}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {(!orders || orders.length === 0) && (
          <div className="text-center py-16 text-[#B0B0BE] text-sm">
            Aún no hay pedidos registrados
          </div>
        )}
      </div>
    </div>
  )
}
