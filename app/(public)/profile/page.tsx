import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { User, ShoppingBag, Calendar } from 'lucide-react'
import RecentOrdersWidget from './RecentOrdersWidget'

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

  const initialOrders = (orders ?? []).map((o) => ({
    id:            o.id,
    status:        o.status,
    total:         o.total,
    currency:      (o as { currency?: string | null }).currency ?? null,
    display_total: (o as { display_total?: number | null }).display_total ?? null,
    created_at:    o.created_at,
  }))

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

            {/* Últimos pedidos — realtime */}
            <RecentOrdersWidget initialOrders={initialOrders} userId={user.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
