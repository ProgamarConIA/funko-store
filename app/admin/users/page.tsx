import { supabaseAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import { Users, Shield, User } from 'lucide-react'
import UsersTableClient from './UsersTableClient'
import type { UserProfile } from './UserDetailModal'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Admin — Usuarios' }

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? ''

export default async function AdminUsersPage() {
  // Caller (para marcar fila propia como protegida)
  const supabase = await createClient()
  const { data: { user: caller } } = await supabase.auth.getUser()

  // Todos los perfiles
  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('id, email, full_name, role, created_at')
    .order('created_at', { ascending: true })

  // Estadísticas de órdenes por usuario (agrupadas en JS)
  const { data: allOrders } = await supabaseAdmin
    .from('orders')
    .select('user_id, total')

  const orderStats: Record<string, { count: number; total: number }> = {}
  allOrders?.forEach((o) => {
    if (!o.user_id) return
    if (!orderStats[o.user_id]) orderStats[o.user_id] = { count: 0, total: 0 }
    orderStats[o.user_id].count++
    orderStats[o.user_id].total += Number(o.total ?? 0)
  })

  // Combinar perfiles + stats
  const enrichedProfiles: UserProfile[] = (profiles ?? []).map((p) => ({
    ...p,
    orders_count: orderStats[p.id]?.count ?? 0,
    orders_total: orderStats[p.id]?.total ?? 0,
  }))

  const total  = enrichedProfiles.length
  const admins = enrichedProfiles.filter((p) => p.role === 'admin').length

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F0F14]">Usuarios</h1>
          <p className="text-[#6B6B7B] text-sm mt-1">{total} usuarios registrados</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs px-3 py-1.5 bg-[#EEEDFF] text-[#5856D6] border border-[#C9C8FF] rounded-full font-semibold flex items-center gap-1.5">
            <Shield className="w-3 h-3" /> {admins} admin{admins !== 1 ? 's' : ''}
          </span>
          <span className="text-xs px-3 py-1.5 bg-[#F5F5F5] text-[#6B6B7B] border border-[#E4E4EC] rounded-full font-semibold flex items-center gap-1.5">
            <User className="w-3 h-3" /> {total - admins} usuarios
          </span>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white border border-[#E4E4EC] rounded-2xl overflow-hidden shadow-card">

        {/* Cabecera */}
        <div className="flex items-center gap-2 px-5 py-4 border-b border-[#E4E4EC]">
          <Users className="w-4 h-4 text-[#5856D6]" />
          <span className="text-sm font-semibold text-[#0F0F14]">Gestión de usuarios</span>
          <span className="ml-auto text-xs text-[#B0B0BE] hidden sm:block">
            Clic en cualquier usuario para ver detalles, cambiar rol o eliminar cuenta
          </span>
        </div>

        <UsersTableClient
          initialProfiles={enrichedProfiles}
          callerId={caller?.id ?? ''}
          adminEmail={ADMIN_EMAIL}
        />

        {enrichedProfiles.length === 0 && (
          <div className="text-center py-16 text-[#B0B0BE] text-sm">
            No hay usuarios registrados
          </div>
        )}
      </div>

      {/* Nota de seguridad */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-700">
        <Shield className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold mb-1">Seguridad de roles y eliminación</p>
          <p>
            Todas las acciones se validan en el backend con el service role key de Supabase.
            La política RLS impide que los usuarios modifiquen su propio rol o eliminen cuentas directamente.
            El admin principal (<span className="font-mono">{ADMIN_EMAIL}</span>) y tu propia cuenta
            están protegidos contra modificaciones accidentales.
            La eliminación de cuentas es permanente e irreversible.
          </p>
        </div>
      </div>
    </div>
  )
}
