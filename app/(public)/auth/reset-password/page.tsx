'use client'

/**
 * Página de restablecimiento de contraseña.
 *
 * El usuario llega aquí después de:
 *   1. Pedir recuperación en /auth/forgot-password
 *   2. Hacer click en el link del email → /auth/callback?code=xxx&next=/auth/reset-password
 *   3. El callback intercambia el code → sesión de recovery → redirige aquí
 *
 * Si no hay sesión activa (link expirado o navegación directa):
 *   → mostrar pantalla de "link inválido"
 */

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { translateAuthError } from '@/lib/supabase/errors'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Lock, CheckCircle, AlertCircle, XCircle } from 'lucide-react'

export default function ResetPasswordPage() {
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)
  if (typeof window !== 'undefined' && !supabaseRef.current) {
    supabaseRef.current = createClient()
  }
  const supabase = supabaseRef.current!

  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [loading, setLoading]     = useState(false)
  const [success, setSuccess]     = useState(false)
  const [error, setError]         = useState('')
  // Estados de sesión
  const [sessionReady, setSessionReady] = useState(false)  // terminó de chequear
  const [hasSession, setHasSession]     = useState(false)  // hay sesión activa
  const inFlight = useRef(false)

  // Verificar si hay sesión de recovery disponible (seteada por el callback)
  useEffect(() => {
    const check = async () => {
      if (typeof window === 'undefined') return
      const { data: { session } } = await supabase.auth.getSession()
      setHasSession(!!session)
      setSessionReady(true)
    }
    check()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inFlight.current || loading) return
    inFlight.current = true
    setError('')

    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      inFlight.current = false
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      inFlight.current = false
      return
    }

    setLoading(true)

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })

      if (updateError) {
        const m = updateError.message.toLowerCase()
        if (m.includes('session') || m.includes('not authenticated') || m.includes('expired')) {
          // Sesión de recovery inválida o expirada → mostrar pantalla de link inválido
          setError('La sesión expiró. Solicitá un nuevo link de recuperación.')
          setHasSession(false)
        } else {
          // Otros errores (contraseña débil, igual a la anterior, error SMTP, etc.)
          // → usar traductor para mostrar el mensaje más preciso disponible
          setError(translateAuthError(updateError.message))
        }
        setLoading(false)
        return
      }

      setSuccess(true)
      // Cerrar la sesión de recovery y redirigir al login
      await supabase.auth.signOut()
      setTimeout(() => { window.location.href = '/auth/login' }, 3_000)
    } finally {
      inFlight.current = false
    }
  }

  // ── Cargando sesión ───────────────────────────────────────────
  if (!sessionReady) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#5856D6] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // ── Link inválido o expirado ──────────────────────────────────
  if (!hasSession) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 bg-[#FAFAFA]">
        <div className="w-full max-w-sm text-center space-y-5 bg-white border border-[#E4E4EC] rounded-2xl p-8 shadow-card">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0F0F14]">Link inválido o expirado</h2>
            <p className="text-[#6B6B7B] mt-2 text-sm leading-relaxed">
              Este link de recuperación ya no es válido.
              Los links expiran después de unos minutos por seguridad.
            </p>
          </div>
          <Link
            href="/auth/forgot-password"
            className="inline-flex items-center justify-center w-full py-3 px-6 bg-[#5856D6] hover:bg-[#4644b8] text-white font-semibold rounded-xl transition-colors text-sm"
          >
            Solicitar nuevo link
          </Link>
          <Link
            href="/auth/login"
            className="block text-sm text-[#6B6B7B] hover:text-[#0F0F14] transition-colors"
          >
            Volver al login
          </Link>
        </div>
      </div>
    )
  }

  // ── Contraseña actualizada con éxito ──────────────────────────
  if (success) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 bg-[#FAFAFA]">
        <div className="w-full max-w-sm text-center space-y-5 bg-white border border-[#E4E4EC] rounded-2xl p-8 shadow-card">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#0F0F14]">¡Contraseña actualizada!</h2>
            <p className="text-[#6B6B7B] mt-2 text-sm">Redirigiendo al login...</p>
          </div>
          <div className="flex justify-center">
            <div className="w-6 h-6 border-2 border-[#5856D6] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  // ── Formulario de nueva contraseña ────────────────────────────
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 bg-[#FAFAFA]">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#EEEDFF] rounded-2xl mb-4">
            <span className="text-2xl">🔐</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F0F14]">Nueva contraseña</h1>
          <p className="text-[#6B6B7B] mt-1.5 text-sm">Elegí una contraseña segura para tu cuenta.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#E4E4EC] rounded-2xl p-6 space-y-4 shadow-card"
        >
          <Input
            id="password"
            label="Nueva contraseña"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            icon={<Lock className="w-4 h-4" />}
            required
            autoComplete="new-password"
          />
          <Input
            id="confirm"
            label="Confirmar contraseña"
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="Repetí tu nueva contraseña"
            icon={<Lock className="w-4 h-4" />}
            required
            autoComplete="new-password"
          />

          {error && (
            <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            variant="accent"
            loading={loading}
            className="w-full"
            size="lg"
          >
            {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
          </Button>
        </form>

      </div>
    </div>
  )
}
