'use client'

import { useState } from 'react'
import { Shield, User, Loader2, Check, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props {
  userId:       string
  currentRole:  'user' | 'admin'
  userEmail:    string
  isProtected:  boolean   // true = admin primario o el propio caller
}

export default function RoleToggleClient({ userId, currentRole, userEmail, isProtected }: Props) {
  const router = useRouter()
  const [status, setStatus]   = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [errMsg, setErrMsg]   = useState('')

  const nextRole = currentRole === 'admin' ? 'user' : 'admin'

  const handleToggle = async () => {
    setStatus('loading')
    setErrMsg('')
    try {
      const res  = await fetch(`/api/admin/users/${userId}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ role: nextRole }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Error desconocido')
      setStatus('ok')
      setTimeout(() => { setStatus('idle'); router.refresh() }, 1500)
    } catch (e: unknown) {
      setErrMsg(e instanceof Error ? e.message : 'Error')
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  if (isProtected) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-[#B0B0BE] select-none">
        <Shield className="w-3.5 h-3.5" />
        Protegido
      </span>
    )
  }

  const isAdmin = currentRole === 'admin'

  return (
    <div className="flex items-center gap-2">
      {/* Badge de rol actual */}
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
        isAdmin
          ? 'bg-[#EEEDFF] text-[#5856D6] border-[#C9C8FF]'
          : 'bg-[#F5F5F5] text-[#6B6B7B] border-[#E4E4EC]'
      }`}>
        {isAdmin ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
        {isAdmin ? 'Admin' : 'Usuario'}
      </span>

      {/* Botón de toggle */}
      <button
        onClick={handleToggle}
        disabled={status === 'loading' || status === 'ok'}
        title={`Cambiar a ${nextRole}`}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
          status === 'ok'
            ? 'bg-green-50 text-green-600 border-green-200'
            : status === 'error'
            ? 'bg-red-50 text-red-500 border-red-200'
            : isAdmin
            ? 'bg-white text-[#6B6B7B] border-[#E4E4EC] hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50'
            : 'bg-white text-[#6B6B7B] border-[#E4E4EC] hover:border-[#5856D6] hover:text-[#5856D6] hover:bg-[#F5F4FF]'
        }`}
      >
        {status === 'loading' && <Loader2 className="w-3 h-3 animate-spin" />}
        {status === 'ok'      && <Check   className="w-3 h-3" />}
        {status === 'error'   && <AlertCircle className="w-3 h-3" />}
        {status === 'idle'    && (isAdmin
          ? <User   className="w-3 h-3" />
          : <Shield className="w-3 h-3" />
        )}

        {status === 'loading' ? 'Guardando…'
          : status === 'ok'   ? '¡Listo!'
          : status === 'error' ? 'Error'
          : isAdmin            ? '→ Usuario'
          :                      '→ Admin'
        }
      </button>

      {status === 'error' && errMsg && (
        <span className="text-[10px] text-red-500 max-w-[120px] truncate" title={errMsg}>
          {errMsg}
        </span>
      )}
    </div>
  )
}
