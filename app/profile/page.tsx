import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { User, Package, ShoppingBag, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Mi perfil' }

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirect=/profile')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: orders } = await supabase
    .from('orders')
    .select('id, status, total, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    { label: 'Pedidos totales', value: orders?.length ?? 0, icon: <ShoppingBag className="w-5 h-5" /> },
    { label: 'Miembro desde', value: formatDate(user.created_at), icon: <Calendar className="w-5 h-5" /> },
    { label: 'Rol', value: profile?.role === 'admin' ? '👑 Admin' : 'Coleccionista', icon: <User className="w-5 h-5" /> },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-[#f1f0ff] mb-8">Mi perfil</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info principal */}
        <div className="lg:col-span-1">
          <div className="bg-[#12121f] border border-[#1e1e35] rounded-2xl p-6 text-center">
            <div className="w-20 h-20 bg-[#a855f7]/20 border-2 border-[#a855f7]/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-[#a855f7]" />
            </div>
            <h2 className="font-bold text-xl text-[#f1f0ff] mb-1">
              {profile?.full_name ?? user.email?.split('@')[0]}
            </h2>
            <p className="text-sm text-[#64607a]">{user.email}</p>
            {profile?.role === 'admin' && (
              <Link
                href="/admin"
                className="mt-4 inline-block px-4 py-2 bg-[#facc15]/10 border border-[#facc15]/30 text-[#facc15] text-xs font-bold rounded-full hover:bg-[#facc15]/20 transition-all"
              >
                👑 Panel de administrador
              </Link>
            )}
          </div>
        </div>

        {/* Stats y pedidos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map(({ label, value, icon }) => (
              <div key={label} className="bg-[#12121f] border border-[#1e1e35] rounded-xl p-4">
                <div className="flex items-center gap-2 text-[#a855f7] mb-2">{icon}</div>
                <p className="text-xl font-bold text-[#f1f0ff]">{value}</p>
                <p className="text-xs text-[#64607a] mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Últimos pedidos */}
          <div className="bg-[#12121f] border border-[#1e1e35] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#f1f0ff] flex items-center gap-2">
                <Package className="w-4 h-4 text-[#a855f7]" /> Últimos pedidos
              </h3>
              <Link href="/profile/orders" className="text-xs text-[#a855f7] hover:text-[#c084fc] transition-colors">
                Ver todos →
              </Link>
            </div>

            {orders && orders.length > 0 ? (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-[#1a1a2e] rounded-xl">
                    <div>
                      <p className="text-sm font-semibold text-[#f1f0ff]">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-[#64607a]">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#a855f7]">${order.total.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        order.status === 'delivered' ? 'bg-[#4ade80]/10 text-[#4ade80]' :
                        order.status === 'shipped'   ? 'bg-blue-500/10 text-blue-400' :
                        order.status === 'paid'      ? 'bg-[#22d3ee]/10 text-[#22d3ee]' :
                        'bg-[#facc15]/10 text-[#facc15]'
                      }`}>
                        {order.status === 'pending' ? 'Pendiente' :
                         order.status === 'paid' ? 'Pagado' :
                         order.status === 'shipped' ? 'Enviado' : 'Entregado'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-10 h-10 text-[#64607a] mx-auto mb-3" />
                <p className="text-[#64607a] text-sm">Aún no tenés pedidos</p>
                <Link href="/" className="mt-3 inline-block text-sm text-[#a855f7] hover:text-[#c084fc] transition-colors">
                  ¡Empezar a comprar! →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
