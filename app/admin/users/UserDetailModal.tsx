'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  X, Shield, User, Trash2, Loader2, Check, AlertCircle,
  Mail, Calendar, Hash, ShoppingBag, DollarSign, AlertTriangle,
} from 'lucide-react'

export interface UserProfile {
  id:           string
  email:        string | null
  full_name:    string | null
  role:         string
  created_at:   string
  orders_count: number
  orders_total: number
}

interface Props {
  user:          UserProfile
  callerId:      string
  adminEmail:    string
  onClose:       () => void
  onDeleted:     (id: string) => void
  onRoleChanged: (id: string, newRole: string) => void
}

export default function UserDetailModal({
  user, callerId, adminEmail, onClose, onDeleted, onRoleChanged,
}: Props) {
  const isProtected = user.email === adminEmail || user.id === callerId

  // ── Rol toggle ──────────────────────────────────────────────────────────────
  const [roleStatus, setRoleStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [roleErr,    setRoleErr]    = useState('')
  const nextRole = user.role === 'admin' ? 'user' : 'admin'

  const handleRoleToggle = async () => {
    setRoleStatus('loading'); setRoleErr('')
    try {
      const res  = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: nextRole }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Error')
      setRoleStatus('ok')
      onRoleChanged(user.id, nextRole)
      setTimeout(() => setRoleStatus('idle'), 1500)
    } catch (e: unknown) {
      setRoleErr(e instanceof Error ? e.message : 'Error')
      setRoleStatus('error')
      setTimeout(() => setRoleStatus('idle'), 3000)
    }
  }

  // ── Eliminación (dos pasos) ──────────────────────────────────────────────────
  const [deleteStep,   setDeleteStep]   = useState<'idle' | 'confirm'>('idle')
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [deleteErr,    setDeleteErr]    = useState('')

  const handleDelete = async () => {
    setDeleteStatus('loading'); setDeleteErr('')
    try {
      const res  = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Error')
      onDeleted(user.id)
    } catch (e: unknown) {
      setDeleteErr(e instanceof Error ? e.message : 'Error')
      setDeleteStatus('error')
    }
  }

  // ── Cerrar con Escape ────────────────────────────────────────────────────────
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [handleKey])

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const initial    = (user.email?.[0] ?? '?').toUpperCase()
  const isAdmin    = user.role === 'admin'
  const joinDate   = new Date(user.created_at).toLocaleString('es-AR', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  })

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">

        {/* ── Cabecera ──────────────────────────────────────────── */}
        <div className={`px-6 pt-6 pb-5 ${isAdmin ? 'bg-[#EEEDFF]' : 'bg-[#F9F8FF]'}`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-[#B0B0BE] hover:text-[#0F0F14] hover:bg-white/60 transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4">
            {/* Avatar grande */}
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0 shadow-sm ${
              isAdmin ? 'bg-[#5856D6] text-white' : 'bg-white text-[#5856D6] border border-[#E4E4EC]'
            }`}>
              {initial}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-[#0F0F14] truncate">
                  {user.full_name ?? user.email ?? 'Sin nombre'}
                </h2>
                {user.id === callerId && (
                  <span className="text-[10px] bg-[#5856D6] text-white rounded-full px-2 py-0.5 font-semibold">Tú</span>
                )}
                {user.email === adminEmail && (
                  <span className="text-[10px] bg-[#5856D6] text-white rounded-full px-2 py-0.5 font-semibold">Principal</span>
                )}
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded-full text-xs font-semibold border ${
                isAdmin
                  ? 'bg-[#5856D6] text-white border-[#5856D6]'
                  : 'bg-white text-[#6B6B7B] border-[#E4E4EC]'
              }`}>
                {isAdmin ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                {isAdmin ? 'Admin' : 'Usuario'}
              </span>
            </div>
          </div>
        </div>

        {/* ── Cuerpo ────────────────────────────────────────────── */}
        <div className="px-6 py-5 space-y-5">

          {/* Info de cuenta */}
          <section className="space-y-2.5">
            <h3 className="text-[10px] font-semibold text-[#B0B0BE] uppercase tracking-widest">Cuenta</h3>
            <div className="space-y-2">
              <InfoRow icon={<Mail className="w-3.5 h-3.5" />}      label="Email"       value={user.email ?? '—'} mono />
              <InfoRow icon={<Calendar className="w-3.5 h-3.5" />} label="Registrado"  value={joinDate} />
              <InfoRow icon={<Hash className="w-3.5 h-3.5" />}     label="ID"          value={user.id.slice(0, 18) + '…'} mono />
            </div>
          </section>

          {/* Actividad */}
          <section className="space-y-2.5">
            <h3 className="text-[10px] font-semibold text-[#B0B0BE] uppercase tracking-widest">Actividad</h3>
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={<ShoppingBag className="w-4 h-4 text-[#5856D6]" />}
                value={String(user.orders_count)}
                label="Pedidos"
              />
              <StatCard
                icon={<DollarSign className="w-4 h-4 text-green-600" />}
                value={`€${user.orders_total.toFixed(2)}`}
                label="Total gastado"
              />
            </div>
          </section>

          {/* Rol */}
          {!isProtected && (
            <section className="space-y-2.5">
              <h3 className="text-[10px] font-semibold text-[#B0B0BE] uppercase tracking-widest">Rol</h3>
              <div className="flex items-center justify-between p-3 bg-[#FAFAFA] rounded-xl border border-[#E4E4EC]">
                <span className="text-sm text-[#0F0F14]">
                  Rol actual: <strong>{isAdmin ? 'Administrador' : 'Usuario'}</strong>
                </span>
                <button
                  onClick={handleRoleToggle}
                  disabled={roleStatus === 'loading' || roleStatus === 'ok'}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    roleStatus === 'ok'
                      ? 'bg-green-50 text-green-600 border-green-200'
                      : roleStatus === 'error'
                      ? 'bg-red-50 text-red-500 border-red-200'
                      : isAdmin
                      ? 'bg-white text-amber-600 border-amber-200 hover:bg-amber-50'
                      : 'bg-white text-[#5856D6] border-[#C9C8FF] hover:bg-[#EEEDFF]'
                  }`}
                >
                  {roleStatus === 'loading' && <Loader2 className="w-3 h-3 animate-spin" />}
                  {roleStatus === 'ok'      && <Check   className="w-3 h-3" />}
                  {roleStatus === 'error'   && <AlertCircle className="w-3 h-3" />}
                  {roleStatus === 'idle'    && (isAdmin
                    ? <User   className="w-3 h-3" />
                    : <Shield className="w-3 h-3" />
                  )}
                  {roleStatus === 'loading' ? 'Cambiando…'
                    : roleStatus === 'ok'   ? '¡Listo!'
                    : roleStatus === 'error' ? 'Error'
                    : isAdmin               ? '→ Quitar admin'
                    :                         '→ Hacer admin'}
                </button>
              </div>
              {roleStatus === 'error' && roleErr && (
                <p className="text-xs text-red-500">{roleErr}</p>
              )}
            </section>
          )}

          {/* Zona peligrosa */}
          {!isProtected && (
            <section className="space-y-2.5">
              <h3 className="text-[10px] font-semibold text-red-400 uppercase tracking-widest">Zona peligrosa</h3>

              {deleteStep === 'idle' ? (
                <button
                  onClick={() => setDeleteStep('confirm')}
                  className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar cuenta
                </button>
              ) : (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-3">
                  <div className="flex items-start gap-2 text-xs text-red-700">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-0.5">Esta acción es permanente</p>
                      <p>Se eliminará la cuenta de <span className="font-mono font-bold">{user.email}</span> y todos sus datos. No se puede deshacer.</p>
                    </div>
                  </div>

                  {deleteStatus === 'error' && deleteErr && (
                    <p className="text-xs text-red-600 font-medium">{deleteErr}</p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => { setDeleteStep('idle'); setDeleteErr(''); setDeleteStatus('idle') }}
                      disabled={deleteStatus === 'loading'}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold bg-white border border-[#E4E4EC] text-[#6B6B7B] hover:border-[#B0B0BE] transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleteStatus === 'loading'}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-red-500 hover:bg-red-600 text-white transition-all disabled:opacity-60"
                    >
                      {deleteStatus === 'loading'
                        ? <><Loader2 className="w-3 h-3 animate-spin" /> Eliminando…</>
                        : <><Trash2  className="w-3 h-3" /> Sí, eliminar</>
                      }
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Aviso si es cuenta protegida */}
          {isProtected && (
            <div className="flex items-center gap-2 p-3 bg-[#F9F8FF] border border-[#E4E4EC] rounded-xl text-xs text-[#6B6B7B]">
              <Shield className="w-3.5 h-3.5 text-[#5856D6] shrink-0" />
              Esta cuenta está protegida y no puede modificarse desde aquí.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Subcomponentes internos ───────────────────────────────────────────────────

function InfoRow({ icon, label, value, mono = false }: {
  icon: React.ReactNode; label: string; value: string; mono?: boolean
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[#B0B0BE] shrink-0">{icon}</span>
      <span className="text-xs text-[#6B6B7B] shrink-0 w-20">{label}</span>
      <span className={`text-xs text-[#0F0F14] truncate ${mono ? 'font-mono' : 'font-medium'}`}>
        {value}
      </span>
    </div>
  )
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-[#FAFAFA] rounded-xl border border-[#E4E4EC]">
      {icon}
      <div>
        <p className="text-sm font-bold text-[#0F0F14]">{value}</p>
        <p className="text-[10px] text-[#B0B0BE]">{label}</p>
      </div>
    </div>
  )
}
