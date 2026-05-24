import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { formatPrice } from '@/lib/utils'
import { Package, Users, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Admin — Dashboard' }

export default async function AdminDashboard() {
  const [
    { count: totalProducts },
    { count: totalOrders },
    { count: totalUsers },
    { data: recentOrders },
    { data: revenue },
  ] = await Promise.all([
    supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('orders').select('id, status, total, created_at, profiles(full_name, email)').order('created_at', { ascending: false }).limit(5),
    supabaseAdmin.from('orders').select('total').eq('status', 'paid'),
  ])

  const totalRevenue = revenue?.reduce((acc, o) => acc + o.total, 0) ?? 0

  const stats = [
    { label: 'Productos',   value: totalProducts ?? 0, icon: <Package className="w-6 h-6" />,    color: 'text-[#a855f7]', bg: 'bg-[#a855f7]/10 border-[#a855f7]/20' },
    { label: 'Pedidos',     value: totalOrders ?? 0,   icon: <ShoppingBag className="w-6 h-6" />, color: 'text-[#22d3ee]', bg: 'bg-[#22d3ee]/10 border-[#22d3ee]/20' },
    { label: 'Usuarios',    value: totalUsers ?? 0,    icon: <Users className="w-6 h-6" />,       color: 'text-[#f472b6]', bg: 'bg-[#f472b6]/10 border-[#f472b6]/20' },
    { label: 'Ingresos',    value: formatPrice(totalRevenue), icon: <DollarSign className="w-6 h-6" />, color: 'text-[#4ade80]', bg: 'bg-[#4ade80]/10 border-[#4ade80]/20' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-[#f1f0ff]">Dashboard</h1>
        <p className="text-[#64607a] text-sm mt-1">Bienvenido al panel de administración de FunkoStore</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon, color, bg }) => (
          <div key={label} className="bg-[#12121f] border border-[#1e1e35] rounded-2xl p-5">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl border ${bg} ${color} mb-4`}>
              {icon}
            </div>
            <p className="text-2xl font-extrabold text-[#f1f0ff]">{value}</p>
            <p className="text-sm text-[#64607a] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Pedidos recientes */}
      <div className="bg-[#12121f] border border-[#1e1e35] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e35]">
          <h2 className="font-bold text-[#f1f0ff] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#a855f7]" /> Pedidos recientes
          </h2>
          <a href="/admin/orders" className="text-xs text-[#a855f7] hover:text-[#c084fc] transition-colors">
            Ver todos →
          </a>
        </div>
        <div className="divide-y divide-[#1e1e35]">
          {recentOrders && recentOrders.length > 0 ? (
            recentOrders.map((order) => {
              const profile = (order.profiles as unknown) as { full_name: string | null; email: string } | null
              return (
                <div key={order.id} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="text-sm font-semibold text-[#f1f0ff] font-mono">#{order.id.slice(0,8).toUpperCase()}</p>
                    <p className="text-xs text-[#64607a]">{profile?.full_name ?? profile?.email ?? 'Usuario'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#a855f7]">{formatPrice(order.total)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.status === 'paid' ? 'bg-[#22d3ee]/10 text-[#22d3ee]' :
                      order.status === 'delivered' ? 'bg-[#4ade80]/10 text-[#4ade80]' :
                      'bg-[#facc15]/10 text-[#facc15]'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="px-6 py-8 text-center text-[#64607a] text-sm">Sin pedidos aún</div>
          )}
        </div>
      </div>
    </div>
  )
}
