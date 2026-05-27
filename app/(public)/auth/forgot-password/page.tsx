'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { isRateLimitError } from '@/lib/supabase/errors'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Mail, CheckCircle, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react'

export default function ForgotPasswordPage() {
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)
  if (typeof window !== 'undefined' && !supabaseRef.current) {
    supabaseRef.current = createClient()
  }
  const supabase = supabaseRef.current!

  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState('')
  // Si llegamos a "sent" por rate-limit, el email ya fue enviado antes
  const [previouslySent, setPreviouslySent] = useState(false)
  // Cooldown para no spamear (sincronizado con el límite real de Supabase: 60s)
  const [cooldown, setCooldown] = useState(0)
  const inFlight = useRef(false)

  // Countdown del cooldown
  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown(c => c - 1), 1_000)
    return () => clearTimeout(t)
  }, [cooldown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inFlight.current || loading || cooldown > 0) return
    inFlight.current = true
    setError('')
    setLoading(true)

    try {
      const { error: authError } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          // El callback intercambia el code y redirige a /auth/reset-password
          redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
        }
      )

      if (authError) {
        if (isRateLimitError(authError.message)) {
          // ─── Rate-limit: el email YA fue enviado recientemente ───────────
          // Supabase comparte el límite entre signUp OTP y resetPassword.
          // Si llegamos aquí, hay un link válido en la bandeja del usuario.
          // → mostrar pantalla "revisá tu email" con mensaje contextual,
          //   NO bloquear con un error que confunde.
          setPreviouslySent(true)
          setSent(true)
          setCooldown(60)
          return
        }
        // Cualquier otro error sí merece mensaje de error
        setError('No se pudo enviar el email. Intentá de nuevo.')
        return
      }

      // Envío exitoso
      setSent(true)
      setCooldown(60)

    } finally {
      inFlight.current = false
      setLoading(false)   // siempre resetear loading, incluso en éxito
    }
  }

  // ── Pantalla post-envío (éxito o rate-limit) ──────────────────
  if (sent) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 bg-[#FAFAFA]">
        <div className="w-full max-w-sm text-center space-y-5 bg-white border border-[#E4E4EC] rounded-2xl p-8 shadow-card">

          {/* Ícono */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          {/* Mensaje */}
          <div>
            <h2 className="text-xl font-bold text-[#0F0F14]">Revisá tu email</h2>

            {previouslySent ? (
              /* Rate-limit: ya hay un email en la bandeja */
              <>
                <p className="text-[#6B6B7B] mt-2 text-sm leading-relaxed">
                  Ya enviamos un link de recuperación a{' '}
                  <span className="font-semibold text-[#0F0F14]">{email}</span>{' '}
                  recientemente. Revisá tu bandeja de entrada.
                </p>
                <p className="text-[#B0B0BE] mt-2 text-xs">
                  Revisá también spam · El link vence en 1 hora
                </p>
              </>
            ) : (
              /* Envío fresco */
              <>
                <p className="text-[#6B6B7B] mt-2 text-sm leading-relaxed">
                  Si existe una cuenta con{' '}
                  <span className="font-semibold text-[#0F0F14]">{email}</span>,
                  recibirás un link para restablecer tu contraseña en los próximos minutos.
                </p>
                <p className="text-[#B0B0BE] mt-2 text-xs">
                  Revisá también spam · El link vence en 1 hora
                </p>
              </>
            )}
          </div>

          {/* Botón de volver */}
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center w-full py-3 px-6 bg-[#0F0F14] hover:bg-[#2A2A35] text-white font-semibold rounded-xl transition-colors text-sm"
          >
            Volver al login
          </Link>

          {/* Reenviar (con cooldown) */}
          <div className="pt-1">
            <p className="text-xs text-[#B0B0BE] mb-1.5">¿No llegó nada?</p>
            <button
              onClick={() => { setSent(false); setPreviouslySent(false) }}
              disabled={cooldown > 0}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5856D6] hover:text-[#4644b8] disabled:text-[#B0B0BE] disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {cooldown > 0 ? `Reenviar en ${cooldown}s` : 'Volver a intentar'}
            </button>
          </div>

        </div>
      </div>
    )
  }

  // ── Formulario ────────────────────────────────────────────────
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 bg-[#FAFAFA]">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#EEEDFF] rounded-2xl mb-4">
            <span className="text-2xl">🔑</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F0F14]">Recuperar contraseña</h1>
          <p className="text-[#6B6B7B] mt-1.5 text-sm">
            Ingresá tu email y te enviamos un link para crear una nueva contraseña.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#E4E4EC] rounded-2xl p-6 space-y-4 shadow-card"
        >
          <Input
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="tu@email.com"
            icon={<Mail className="w-4 h-4" />}
            required
            autoComplete="email"
            autoFocus
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
            disabled={cooldown > 0}
            className="w-full"
            size="lg"
          >
            {loading
              ? 'Enviando...'
              : cooldown > 0
                ? `Reenviar en ${cooldown}s`
                : 'Enviar link de recuperación'}
          </Button>
        </form>

        <div className="text-center mt-5">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1.5 text-sm text-[#6B6B7B] hover:text-[#0F0F14] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver al login
          </Link>
        </div>

      </div>
    </div>
  )
}
