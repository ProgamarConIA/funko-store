import { supabaseAdmin } from '@/lib/supabase/admin'
import { formatDate, formatPrice, getOrderStatusColor, getOrderStatusLabel } from '@/lib/utils'
import UpdateOrderStatus from './UpdateOrderStatus'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Admin — Pedidos' }

export default async function AdminOrdersPage() {
  const { data: orders } = await supabaseAdmin
    .from('orders')
    .select('*, profiles(full_name, email)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#f1f0ff]">Pedidos</h1>
        <p className="text-[#64607a] text-sm mt-1">{orders?.length ?? 0} pedidos en total</p>
      </div>

      <div className="bg-[#12121f] border border-[#1e1e35] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-[#1e1e35]">
                {['ID', 'Cliente', 'Total', 'Estado', 'Fecha', 'Acción'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#64607a] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e35]">
              {orders?.map((order) => {
                const profile = order.profiles as { full_name: string | null; email: string } | null
                return (
                  <tr key={order.id} className="hover:bg-[#1a1a2e] transition-colors">
                    <td className="px-5 py-4 font-mono text-[#a09dbd] text-xs">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#f1f0ff]">{profile?.full_name ?? 'Sin nombre'}</p>
                      <p className="text-xs text-[#64607a]">{profile?.email}</p>
                    </td>
                    <td className="px-5 py-4 font-bold text-[#a855f7]">{formatPrice(order.total)}</td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getOrderStatusColor(order.status)}`}>
                        {getOrderStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#64607a] text-xs">{formatDate(order.created_at)}</td>
                    <td className="px-5 py-4">
                      <UpdateOrderStatus orderId={order.id} currentStatus={order.status} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {(!orders || orders.length === 0) && (
          <div className="text-center py-12 text-[#64607a] text-sm">Sin pedidos aún</div>
        )}
      </div>
    </div>
  )
}
