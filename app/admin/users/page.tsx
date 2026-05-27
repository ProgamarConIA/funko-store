import { supabaseAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import { Users, Shield, User } from 'lucide-react'
import RoleToggleClient from './RoleToggleClient'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Admin — Usuarios' }

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? ''

export default async function AdminUsersPage() {
  // Obtener el admin caller (para marcar su propia fila como protegida)
  const supabase = await createClient()
  const { data: { user: caller } } = await supabase.auth.getUser()

  // Obtener todos los perfiles (service role omite RLS)
  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('id, email, full_name, role, created_at')
    .order('created_at', { ascending: true })

  const total  = profiles?.length ?? 0
  const admins = profiles?.filter((p) => p.role === 'admin').length ?? 0

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
          <span className="ml-auto text-xs text-[#B0B0BE]">
            Podés promover o revocar el rol admin de cualquier usuario
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-[#E4E4EC]">
                {['#', 'Email', 'Nombre', 'Rol actual', 'Registrado', 'Acciones'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold text-[#B0B0BE] uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {profiles?.map((profile, idx) => {
                // Un perfil es "protegido" si es el admin primario (env) o el propio caller
                const isProtected =
                  profile.email === ADMIN_EMAIL || profile.id === caller?.id

                return (
                  <tr
                    key={profile.id}
                    className={`border-b border-[#E4E4EC] transition-colors ${
                      isProtected ? 'bg-[#FAFAFA]' : 'hover:bg-[#F9F8FF]'
                    }`}
                  >
                    {/* # */}
                    <td className="px-4 py-3 text-xs text-[#B0B0BE] tabular-nums">{idx + 1}</td>

                    {/* Email */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          profile.role === 'admin'
                            ? 'bg-[#EEEDFF] text-[#5856D6]'
                            : 'bg-[#F5F5F5] text-[#6B6B7B]'
                        }`}>
                          {(profile.email?.[0] ?? '?').toUpperCase()}
                        </div>
                        <span className="text-sm text-[#0F0F14] font-medium truncate max-w-[200px]">
                          {profile.email}
                        </span>
                        {profile.id === caller?.id && (
                          <span className="text-[10px] bg-[#F5F4FF] text-[#5856D6] border border-[#DDDCFF] rounded-full px-1.5 py-0.5 font-semibold whitespace-nowrap">
                            Tú
                          </span>
                        )}
                        {profile.email === ADMIN_EMAIL && profile.id !== caller?.id && (
                          <span className="text-[10px] bg-[#EEEDFF] text-[#5856D6] border border-[#C9C8FF] rounded-full px-1.5 py-0.5 font-semibold whitespace-nowrap">
                            Principal
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Nombre */}
                    <td className="px-4 py-3 text-xs text-[#6B6B7B]">
                      {profile.full_name ?? <span className="text-[#D0D0D8] italic">Sin nombre</span>}
                    </td>

                    {/* Rol */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        profile.role === 'admin'
                          ? 'bg-[#EEEDFF] text-[#5856D6] border-[#C9C8FF]'
                          : 'bg-[#F5F5F5] text-[#6B6B7B] border-[#E4E4EC]'
                      }`}>
                        {profile.role === 'admin'
                          ? <><Shield className="w-3 h-3" /> Admin</>
                          : <><User   className="w-3 h-3" /> Usuario</>
                        }
                      </span>
                    </td>

                    {/* Fecha */}
                    <td className="px-4 py-3 text-xs text-[#B0B0BE] tabular-nums whitespace-nowrap">
                      {new Date(profile.created_at).toLocaleDateString('es-AR', {
                        day:   '2-digit',
                        month: 'short',
                        year:  'numeric',
                      })}
                    </td>

                    {/* Acciones */}
                    <td className="px-4 py-3">
                      <RoleToggleClient
                        userId={profile.id}
                        currentRole={profile.role as 'user' | 'admin'}
                        userEmail={profile.email ?? ''}
                        isProtected={isProtected}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {(!profiles || profiles.length === 0) && (
          <div className="text-center py-16 text-[#B0B0BE] text-sm">
            No hay usuarios registrados
          </div>
        )}
      </div>

      {/* Nota de seguridad */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-700">
        <Shield className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold mb-1">Seguridad de roles</p>
          <p>Los cambios de rol se validan en el backend con el service role key de Supabase — no dependen del frontend.
             La política RLS impide que los usuarios modifiquen su propio rol directamente.
             El admin principal (<span className="font-mono">{ADMIN_EMAIL}</span>) y tu propia cuenta están protegidos contra modificaciones accidentales.</p>
        </div>
      </div>
    </div>
  )
}
