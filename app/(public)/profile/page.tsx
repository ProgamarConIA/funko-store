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
    { label: 'Pedidos totales', value: orders?.length ?? 0,         icon: <ShoppingBag className="w-5 h-5" /> },
    { label: 'Miembro desde',   value: formatDate(user.created_at), icon: <Calendar className="w-5 h-5" /> },
    { label: 'Rol', value: profile?.role === 'admin' ? '👑 Admin' : 'Coleccionista', icon: <User className="w-5 h-5" /> },
  ]

  /* ─── Colores de estado (inline style para garantizar dark mode) ─── */
  const statusStyle = (status: string) => {
    const map: Record<string, { bg: string; color: string }> = {
      delivered: { bg: 'rgba(74,222,128,.12)', color: '#4ade80' },
      shipped:   { bg: 'rgba(96,165,250,.12)', color: '#60a5fa' },
      paid:      { bg: 'rgba(34,211,238,.12)', color: '#22d3ee' },
      pending:   { bg: 'rgba(250,204,21,.12)', color: '#facc15' },
    }
    return map[status] ?? { bg: 'rgba(160,160,184,.10)', color: '#a0a0b8' }
  }

  const statusLabel = (status: string) =>
    ({ pending:'Pendiente', paid:'Pagado', shipped:'Enviado', delivered:'Entregado' }[status] ?? status)

  return (
    /*
      Usamos var(--text-primary) y var(--surface) en lugar de clases Tailwind dark:
      para garantizar que el dark mode funcione independientemente de la versión
      o configuración de Tailwind.
    */
    <div
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      style={{ color: 'var(--text-primary)' }}
    >
      <h1 className="text-3xl font-extrabold mb-8" style={{ color: 'var(--text-primary)' }}>
        Mi perfil
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Info principal ──────────────────────────────────── */}
        <div className="lg:col-span-1">
          <div
            className="theme-surface border rounded-2xl p-6 text-center shadow-card"
            style={{
              background:   'var(--surface)',
              borderColor:  'var(--border-color)',
            }}
          >
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-2"
              style={{
                background:   'var(--accent-glow)',
                borderColor:  'var(--accent-icon)',
              }}
            >
              <User className="w-10 h-10" style={{ color: 'var(--accent-icon)' }} />
            </div>

            <h2 className="font-bold text-xl mb-1" style={{ color: 'var(--text-primary)' }}>
              {profile?.full_name ?? user.email?.split('@')[0]}
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {user.email}
            </p>

            {profile?.role === 'admin' && (
              <Link
                href="/admin"
                className="mt-4 inline-block px-4 py-2 text-xs font-bold rounded-full transition-all"
                style={{
                  background:  'rgba(250,204,21,.10)',
                  border:      '1px solid rgba(250,204,21,.30)',
                  color:       '#c89800',
                }}
              >
                👑 Panel de administrador
              </Link>
            )}
          </div>
        </div>

        {/* ── Stats y pedidos ─────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map(({ label, value, icon }) => (
              <div
                key={label}
                className="rounded-xl p-4 shadow-card border"
                style={{
                  background:  'var(--surface)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--accent-icon)' }}>
                  {icon}
                </div>
                <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
                <p className="text-xs mt-0.5"    style={{ color: 'var(--text-muted)' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Últimos pedidos */}
          <div
            className="rounded-2xl p-5 shadow-card border"
            style={{
              background:  'var(--surface)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Package className="w-4 h-4" style={{ color: 'var(--accent-icon)' }} />
                Últimos pedidos
              </h3>
              <Link
                href="/profile/orders"
                className="text-xs font-medium transition-colors"
                style={{ color: 'var(--accent-icon)' }}
              >
                Ver todos →
              </Link>
            </div>

            {orders && orders.length > 0 ? (
              <div className="space-y-3">
                {orders.map((order) => {
                  const s = statusStyle(order.status)
                  return (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 rounded-xl border"
                      style={{
                        background:  'var(--surface-raised)',
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold" style={{ color: 'var(--accent-icon)' }}>
                          ${order.total.toFixed(2)}
                        </p>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: s.bg, color: s.color }}
                        >
                          {statusLabel(order.status)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Aún no tenés pedidos</p>
                <Link
                  href="/"
                  className="mt-3 inline-block text-sm font-medium transition-colors"
                  style={{ color: 'var(--accent-icon)' }}
                >
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
