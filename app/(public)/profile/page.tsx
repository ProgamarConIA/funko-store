import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatDate, formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { User, Package, ShoppingBag, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Mi perfil' }

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  delivered: { bg: '#dcfce7', color: '#15803d' },
  shipped:   { bg: '#dbeafe', color: '#1d4ed8' },
  paid:      { bg: '#cffafe', color: '#0e7490' },
  pending:   { bg: '#fef9c3', color: '#a16207' },
  cancelled: { bg: '#fee2e2', color: '#b91c1c' },
}

function statusStyle(status: string) {
  return STATUS_STYLE[status] ?? { bg: '#f3f4f6', color: '#6b7280' }
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pendiente', paid: 'Pagado', shipped: 'Enviado',
  delivered: 'Entregado', cancelled: 'Cancelado',
}

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
    .select('id, status, total, currency, display_total, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    { label: 'Pedidos totales', value: orders?.length ?? 0,         icon: <ShoppingBag className="w-5 h-5 text-[#5856D6]" /> },
    { label: 'Miembro desde',   value: formatDate(user.created_at), icon: <Calendar    className="w-5 h-5 text-[#5856D6]" /> },
    { label: 'Rol',             value: profile?.role === 'admin' ? '👑 Admin' : 'Coleccionista',
                                                                     icon: <User        className="w-5 h-5 text-[#5856D6]" /> },
  ]

  return (
    <div className="min-h-screen bg-[#FAFAFF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Título */}
        <h1 className="text-3xl font-extrabold text-[#0F0F14] mb-8">
          Mi perfil
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Tarjeta principal de usuario ─────────────────────── */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm">

              {/* Avatar */}
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#5856D6]/30 bg-[#EEEDFF]">
                <User className="w-10 h-10 text-[#5856D6]" />
              </div>

              <h2 className="font-bold text-xl text-[#0F0F14] mb-1">
                {profile?.full_name ?? user.email?.split('@')[0]}
              </h2>
              <p className="text-sm text-gray-500">
                {user.email}
              </p>

              {profile?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="mt-4 inline-block px-4 py-2 text-xs font-bold rounded-full border transition-all bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                >
                  👑 Panel de administrador
                </Link>
              )}
            </div>
          </div>

          {/* ── Stats + pedidos ──────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map(({ label, value, icon }) => (
                <div
                  key={label}
                  className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {icon}
                  </div>
                  <p className="text-xl font-bold text-[#0F0F14]">{value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Últimos pedidos */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#0F0F14] flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#5856D6]" />
                  Últimos pedidos
                </h3>
                <Link
                  href="/profile/orders"
                  className="text-xs font-medium text-[#5856D6] hover:text-[#4644b8] transition-colors"
                >
                  Ver todos →
                </Link>
              </div>

              {orders && orders.length > 0 ? (
                <div className="space-y-2">
                  {orders.map((order) => {
                    const s = statusStyle(order.status)
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
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1">
                          <p className="text-sm font-bold text-[#5856D6]">
                            {formatPrice(
                              (order as { display_total?: number; currency?: string }).display_total ?? order.total,
                              (order as { currency?: string }).currency ?? 'EUR',
                            )}
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
          </div>
        </div>
      </div>
    </div>
  )
}
