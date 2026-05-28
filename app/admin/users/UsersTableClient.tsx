'use client'

import { useState } from 'react'
import { Shield, User, ChevronRight } from 'lucide-react'
import UserDetailModal, { type UserProfile } from './UserDetailModal'

interface Props {
  initialProfiles: UserProfile[]
  callerId:        string
  adminEmail:      string
}

export default function UsersTableClient({ initialProfiles, callerId, adminEmail }: Props) {
  const [profiles,     setProfiles]     = useState<UserProfile[]>(initialProfiles)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)

  // ── Callbacks del modal ────────────────────────────────────────────────────
  const handleDeleted = (deletedId: string) => {
    setProfiles((prev) => prev.filter((p) => p.id !== deletedId))
    setSelectedUser(null)
  }

  const handleRoleChanged = (userId: string, newRole: string) => {
    setProfiles((prev) =>
      prev.map((p) => p.id === userId ? { ...p, role: newRole } : p)
    )
    // Actualizar también el usuario seleccionado en el modal
    setSelectedUser((prev) => prev?.id === userId ? { ...prev, role: newRole } : prev)
  }

  // ── Abrir modal ────────────────────────────────────────────────────────────
  const openModal = (profile: UserProfile) => setSelectedUser(profile)

  if (profiles.length === 0) {
    return (
      <div className="text-center py-16 text-[#B0B0BE] text-sm">
        No hay usuarios registrados
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="bg-[#FAFAFA] border-b border-[#E4E4EC]">
              {['#', 'Email', 'Nombre', 'Rol', 'Registrado', 'Pedidos', ''].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-[10px] font-semibold text-[#B0B0BE] uppercase tracking-widest"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile, idx) => {
              const isProtected = profile.email === adminEmail || profile.id === callerId
              const isAdmin     = profile.role === 'admin'

              return (
                <tr
                  key={profile.id}
                  onClick={() => openModal(profile)}
                  className={`border-b border-[#E4E4EC] cursor-pointer group transition-colors ${
                    isProtected ? 'bg-[#FAFAFA] hover:bg-[#F0EFFF]' : 'hover:bg-[#F9F8FF]'
                  }`}
                >
                  {/* # */}
                  <td className="px-4 py-3 text-xs text-[#B0B0BE] tabular-nums">{idx + 1}</td>

                  {/* Email + avatar */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isAdmin ? 'bg-[#EEEDFF] text-[#5856D6]' : 'bg-[#F5F5F5] text-[#6B6B7B]'
                      }`}>
                        {(profile.email?.[0] ?? '?').toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#0F0F14] truncate max-w-[180px] group-hover:text-[#5856D6] transition-colors">
                          {profile.email}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          {profile.id === callerId && (
                            <span className="text-[9px] bg-[#5856D6] text-white rounded-full px-1.5 py-px font-bold">TÚ</span>
                          )}
                          {profile.email === adminEmail && (
                            <span className="text-[9px] bg-[#EEEDFF] text-[#5856D6] border border-[#C9C8FF] rounded-full px-1.5 py-px font-bold">PRINCIPAL</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Nombre */}
                  <td className="px-4 py-3 text-xs text-[#6B6B7B]">
                    {profile.full_name ?? <span className="italic text-[#D0D0D8]">—</span>}
                  </td>

                  {/* Rol */}
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      isAdmin
                        ? 'bg-[#EEEDFF] text-[#5856D6] border-[#C9C8FF]'
                        : 'bg-[#F5F5F5] text-[#6B6B7B] border-[#E4E4EC]'
                    }`}>
                      {isAdmin ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {isAdmin ? 'Admin' : 'Usuario'}
                    </span>
                  </td>

                  {/* Fecha + hora */}
                  <td className="px-4 py-3 tabular-nums whitespace-nowrap">
                    <p className="text-xs text-[#B0B0BE]">
                      {new Date(profile.created_at).toLocaleDateString('es-AR', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </p>
                    <p className="text-[10px] text-[#D0D0D8] mt-0.5">
                      {new Date(profile.created_at).toLocaleTimeString('es-AR', {
                        hour: '2-digit', minute: '2-digit', hour12: false,
                      })}
                    </p>
                  </td>

                  {/* Pedidos */}
                  <td className="px-4 py-3">
                    {profile.orders_count > 0 ? (
                      <span className="text-xs font-semibold text-[#0F0F14]">
                        {profile.orders_count}
                        <span className="text-[#B0B0BE] font-normal ml-1">
                          · €{profile.orders_total.toFixed(2)}
                        </span>
                      </span>
                    ) : (
                      <span className="text-xs text-[#D0D0D8] italic">Sin pedidos</span>
                    )}
                  </td>

                  {/* Chevron */}
                  <td className="px-4 py-3 text-[#D0D0D8] group-hover:text-[#5856D6] transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          callerId={callerId}
          adminEmail={adminEmail}
          onClose={() => setSelectedUser(null)}
          onDeleted={handleDeleted}
          onRoleChanged={handleRoleChanged}
        />
      )}
    </>
  )
}
