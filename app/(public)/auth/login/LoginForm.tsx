'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { translateAuthError } from '@/lib/supabase/errors'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Mail, Lock, AlertCircle, MailCheck } from 'lucide-react'

export default function LoginForm() {
  // Cliente Supabase: inicializado solo en el cliente para evitar que
  // createBrowserClient acceda a `location` durante el SSR de Next.js.
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)
  if (typeof window !== 'undefined' && !supabaseRef.current) {
    supabaseRef.current = createClient()
  }
  // El operador ! es seguro: los handlers solo se ejecutan en el navegador,
  // donde supabaseRef.current ya fue inicializado por la condición anterior.
  const supabase = supabaseRef.current!

  const searchParams  = useSearchParams()
  const redirect      = searchParams.get('redirect') ?? '/'
  const callbackError = searchParams.get('error') // viene del callback de confirmación

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(callbackError ?? '')
  // Flag ref para evitar doble-submit incluso en el mismo tick de render
  const inFlight = useRef(false)

  // Detectar si el error es de "email no confirmado" para mostrar CTA de reenvío
  const isUnconfirmed = error.toLowerCase().includes('confirmar')
  const [resending, setResending]   = useState(false)
  const [resendDone, setResendDone] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inFlight.current || loading) return   // doble-click guard
    inFlight.current = true

    setLoading(true)
    setError('')
    setResendDone(false)

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email:    email.trim().toLowerCase(),
        password,
      })

      if (authError) {
        setError(translateAuthError(authError.message))
        setLoading(false)
      } else {
        // Recarga completa para que el servidor reciba la sesión correctamente
        // (el middleware actualiza las cookies en el primer request post-login)
        window.location.href = redirect
        // Nota: no ponemos setLoading(false) aquí a propósito —
        // el spinner sigue mientras navega para indicar que algo está pasando
      }
    } finally {
      inFlight.current = false
    }
  }

  const handleResend = async () => {
    if (resending || !email) return
    setResending(true)
    const { error: resendError } = await supabase.auth.resend({
      type:  'signup',
      email: email.trim().toLowerCase(),
    })
    setResending(false)
    if (!resendError) {
      setResendDone(true)
      setError('')
    } else {
      setError(translateAuthError(resendError.message))
    }
  }

  return (
    <>
      <form
        onSubmit={handleLogin}
        className="bg-white border border-[#E4E4EC] rounded-2xl p-6 space-y-4 shadow-card"
      >
        <Input
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          icon={<Mail className="w-4 h-4" />}
          required
          autoComplete="email"
        />
        <Input
          id="password"
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          icon={<Lock className="w-4 h-4" />}
          required
          autoComplete="current-password"
        />

        {/* ── Error genérico ── */}
        {error && !isUnconfirmed && (
          <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ── Error específico: email sin confirmar + botón de reenvío ── */}
        {error && isUnconfirmed && (
          <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm space-y-2">
            <div className="flex items-start gap-2.5 text-amber-700">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || !email}
              className="text-[#5856D6] hover:text-[#4644b8] font-semibold underline underline-offset-2 disabled:opacity-50"
            >
              {resending ? 'Enviando...' : 'Reenviar email de confirmación'}
            </button>
          </div>
        )}

        {/* ── Confirmación de reenvío exitoso ── */}
        {resendDone && (
          <div className="flex items-start gap-2.5 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
            <MailCheck className="w-4 h-4 mt-0.5 shrink-0" />
            <span>Email de confirmación reenviado. Revisá tu bandeja de entrada.</span>
          </div>
        )}

        <Button
          type="submit"
          variant="accent"
          loading={loading}
          className="w-full"
          size="lg"
        >
          {loading ? 'Ingresando...' : 'Iniciar sesión'}
        </Button>
      </form>

      <p className="text-center text-sm text-[#6B6B7B] mt-5">
        ¿No tenés cuenta?{' '}
        <Link
          href="/auth/register"
          className="text-[#5856D6] hover:text-[#4644b8] font-semibold transition-colors"
        >
          Registrarse gratis
        </Link>
      </p>
    </>
  )
}
