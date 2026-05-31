import { supabaseAdmin } from '@/lib/supabase/admin'
import { formatDateTime, formatPrice, getOrderStatusColor, getOrderStatusLabel } from '@/lib/utils'
import UpdateOrderStatus from './UpdateOrderStatus'
import type { Metadata } from 'next'
import { ShoppingBag } from 'lucide-react'
import type { OrderStatus } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Admin — Pedidos' }

export default async function AdminOrdersPage() {
  // ── 1. Órdenes sin join (evita fallos silenciosos por FK a auth.users) ──────
  const { data: orders, error: ordersError } = await supabaseAdmin
    .from('orders')
    .select('id, status, total, currency, display_total, created_at, user_id, shipping_address')
    .order('created_at', { ascending: false })

  if (ordersError) console.error('[admin/orders] orders query error:', ordersError)

  // ── 2. Perfiles de los usuarios involucrados ─────────────────────────────
  const userIds = [...new Set((orders ?? []).map((o) => o.user_id).filter(Boolean))]
  const { data: profiles } = userIds.length > 0
    ? await supabaseAdmin.from('profiles').select('id, full_name, email').in('id', userIds)
    : { data: [] }

  const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]))

  // ── Stats ────────────────────────────────────────────────────────────────
  const total    = orders?.length ?? 0
  const ingresos = (orders ?? [])
    .filter((o) => o.status === 'paid' || o.status === 'delivered')
    .reduce((acc, o) => acc + (o.total ?? 0), 0)

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0F0F14]">Pedidos</h1>
          <p className="text-[#6B6B7B] text-sm mt-1">{total} pedido{total !== 1 ? 's' : ''} en total</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-[#6B6B7B]">Ingresos confirmados (EUR)</p>
          <p className="text-lg font-bold text-[#5856D6]">
            {formatPrice(ingresos, 'EUR')}
          </p>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white border border-[#E4E4EC] rounded-2xl overflow-hidden shadow-card">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-[#E4E4EC]">
          <ShoppingBag className="w-4 h-4 text-[#5856D6]" />
          <span className="text-sm font-semibold text-[#0F0F14]">Historial de pedidos</span>
          <span className="ml-auto text-xs text-[#B0B0BE] hidden sm:block">
            Cambia el estado directamente en la tabla
          </span>
        </div>

        {total > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[760px]">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-[#E4E4EC]">
                  {['ID', 'Cliente', 'Total', 'Moneda', 'Estado', 'Fecha', 'Cambiar estado'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] font-semibold text-[#B0B0BE] uppercase tracking-widest">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders!.map((order) => {
                  const profile  = profileMap[order.user_id]
                  const currency = (order as { currency?: string | null }).currency ?? 'EUR'
                  const amount   = (order as { display_total?: number | null }).display_total ?? order.total

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
                        <p className="text-xs text-[#6B6B7B]">{profile?.email ?? order.user_id.slice(0, 12) + '…'}</p>
                      </td>

                      {/* Total en divisa original */}
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-bold text-[#0F0F14]">
                          {formatPrice(amount, currency)}
                        </span>
                      </td>

                      {/* Moneda */}
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-mono text-[#6B6B7B] bg-[#F5F5F7] px-2 py-0.5 rounded-lg">
                          {currency}
                        </span>
                      </td>

                      {/* Estado */}
                      <td className="px-5 py-3.5">
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${getOrderStatusColor(order.status)}`}>
                          {getOrderStatusLabel(order.status)}
                        </span>
                      </td>

                      {/* Fecha */}
                      <td className="px-5 py-3.5 text-xs text-[#6B6B7B] whitespace-nowrap">
                        {formatDateTime(order.created_at)}
                      </td>

                      {/* Cambiar estado */}
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
        ) : (
          <div className="text-center py-16 text-[#B0B0BE] text-sm">
            Aún no hay pedidos registrados
          </div>
        )}
      </div>
    </div>
  )
}
