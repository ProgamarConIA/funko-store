'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { translateAuthError, isRateLimitError } from '@/lib/supabase/errors'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import OTPInput from '@/components/ui/OTPInput'
import { Mail, Lock, AlertCircle, RefreshCw, Info } from 'lucide-react'

export default function LoginForm() {
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)
  if (typeof window !== 'undefined' && !supabaseRef.current) {
    supabaseRef.current = createClient()
  }
  const supabase = supabaseRef.current!

  const searchParams  = useSearchParams()
  const redirect      = searchParams.get('redirect') ?? '/'
  const callbackError = searchParams.get('error')

  // ── Login form state ──────────────────────────────────────────────────────
  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState(callbackError ?? '')
  const [noAccountFound, setNoAccountFound] = useState(false)
  const inFlight = useRef(false)

  const isUnconfirmed = error.toLowerCase().includes('confirmar')
  const [resending, setResending] = useState(false)

  // ── OTP state (shown after successful resend confirmation) ────────────────
  const [pendingOtpEmail, setPendingOtpEmail]       = useState('')
  const [otpSent, setOtpSent]                       = useState(false)
  const [otpPreviouslySent, setOtpPreviouslySent]   = useState(false)
  const [otpError, setOtpError]                     = useState('')
  const [otpLoading, setOtpLoading]                 = useState(false)
  const [otpKey, setOtpKey]                         = useState(0)
  const [resendCooldown, setResendCooldown]         = useState(0)
  const [resendLoading, setResendLoading]           = useState(false)

  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1_000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inFlight.current || loading) return
    inFlight.current = true
    setLoading(true)
    setError('')
    setNoAccountFound(false)

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email:    email.trim().toLowerCase(),
        password,
      })

      if (authError) {
        const rawMsg = authError.message.toLowerCase()
        const isInvalidCreds = (
          rawMsg.includes('invalid login credentials') ||
          rawMsg.includes('invalid_credentials') ||
          rawMsg.includes('invalid email or password')
        )

        if (isInvalidCreds) {
          try {
            const res = await fetch('/api/auth/email-exists', {
              method:  'POST',
              headers: { 'Content-Type': 'application/json' },
              body:    JSON.stringify({ email: email.trim().toLowerCase() }),
            })
            if (res.ok) {
              const { exists } = await res.json()
              if (!exists) {
                setNoAccountFound(true)
                setError('No existe ninguna cuenta registrada con este email.')
                setLoading(false)
                return
              }
            }
          } catch {
            // Network error → fall through to generic error
          }
        }

        setNoAccountFound(false)
        setError(translateAuthError(authError.message))
        setLoading(false)
      } else {
        window.location.href = redirect
      }
    } finally {
      inFlight.current = false
    }
  }

  // Triggered by "Reenviar email de confirmación" — only shown when login
  // returns email_not_confirmed, which means the user EXISTS but is unconfirmed.
  const handleResend = async () => {
    if (resending || !email) return
    setResending(true)
    const normalizedEmail = email.trim().toLowerCase()

    const { error: resendError } = await supabase.auth.resend({
      type:  'signup',
      email: normalizedEmail,
    })
    setResending(false)

    if (!resendError || isRateLimitError(resendError.message)) {
      // Code sent or already active → transition to OTP screen
      setPendingOtpEmail(normalizedEmail)
      setOtpPreviouslySent(!!resendError && isRateLimitError(resendError.message))
      setOtpSent(true)
      setError('')
      setResendCooldown(60)
    } else {
      setError(translateAuthError(resendError.message))
    }
  }

  const handleVerifyOTP = async (code: string) => {
    if (otpLoading) return
    setOtpLoading(true)
    setOtpError('')

    const { error } = await supabase.auth.verifyOtp({
      email: pendingOtpEmail,
      token: code,
      type:  'signup',
    })

    if (error) {
      const m = error.message.toLowerCase()
      setOtpError(
        m.includes('expired')
          ? 'El código expiró. Solicitá uno nuevo haciendo click en "Reenviar código".'
          : isRateLimitError(error.message)
            ? 'Demasiados intentos. Esperá un momento antes de volver a intentar.'
            : 'Código incorrecto. Verificá los dígitos e intentá de nuevo.'
      )
      setOtpKey(k => k + 1)
      setOtpLoading(false)
      return
    }

    // Account confirmed → navigate
    window.location.href = redirect
  }

  const handleOtpResend = async () => {
    if (resendCooldown > 0 || resendLoading) return
    setResendLoading(true)
    setOtpError('')

    const { error } = await supabase.auth.resend({
      type:  'signup',
      email: pendingOtpEmail,
    })
    setResendLoading(false)

    if (error) {
      if (isRateLimitError(error.message)) {
        setOtpError('El código anterior sigue activo. Esperá 1 minuto antes de pedir otro.')
        setResendCooldown(60)
      } else {
        setOtpError(translateAuthError(error.message))
      }
    } else {
      setOtpKey(k => k + 1)
      setOtpPreviouslySent(false)
      setResendCooldown(60)
    }
  }

  // ── OTP verification screen ───────────────────────────────────────────────
  if (otpSent) {
    return (
      <>
        <div className="bg-white border border-[#E4E4EC] rounded-2xl p-8 shadow-card space-y-6">

          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="w-14 h-14 bg-[#F5F4FF] border border-[#DDDCFF] rounded-2xl flex items-center justify-center">
                <Mail className="w-7 h-7 text-[#5856D6]" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0F0F14]">Verificá tu email</h2>
              <p className="text-[#6B6B7B] text-sm mt-1.5">
                {otpPreviouslySent ? 'Ya enviamos un código a' : 'Enviamos un código de 6 dígitos a'}
              </p>
              <p className="font-semibold text-[#0F0F14] text-sm mt-0.5 break-all">
                {pendingOtpEmail}
              </p>
            </div>
          </div>

          {otpPreviouslySent && !otpError && (
            <div className="flex items-start gap-2.5 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
              <Info className="w-4 h-4 mt-0.5 shrink-0" />
              <span>Ingresá el código que ya recibiste. Si no llegó, esperá 1 minuto para reenviar.</span>
            </div>
          )}

          <OTPInput
            key={otpKey}
            length={6}
            onComplete={handleVerifyOTP}
            loading={otpLoading}
            hasError={!!otpError}
          />

          {otpLoading && (
            <div className="flex items-center justify-center gap-2 text-[#6B6B7B] text-sm">
              <div className="w-4 h-4 border-2 border-[#5856D6] border-t-transparent rounded-full animate-spin" />
              <span>Verificando...</span>
            </div>
          )}

          {otpError && (
            <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{otpError}</span>
            </div>
          )}

          <p className="text-center text-xs text-[#B0B0BE]">
            El código vence en 10 minutos · Revisá también spam
          </p>

          <div className="text-center space-y-1.5">
            <p className="text-sm text-[#6B6B7B]">¿No llegó el código?</p>
            <button
              onClick={handleOtpResend}
              disabled={resendCooldown > 0 || resendLoading}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5856D6] hover:text-[#4644b8] disabled:text-[#B0B0BE] disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resendLoading ? 'animate-spin' : ''}`} />
              {resendCooldown > 0
                ? `Reenviar en ${resendCooldown}s`
                : resendLoading
                  ? 'Enviando...'
                  : 'Reenviar código'}
            </button>
          </div>

          <div className="pt-3 border-t border-[#F0EFF8] text-center">
            <button
              onClick={() => { setOtpSent(false); setOtpError(''); setOtpKey(k => k + 1) }}
              className="text-xs text-[#B0B0BE] hover:text-[#6B6B7B] transition-colors"
            >
              ← Volver al login
            </button>
          </div>

        </div>

        <p className="text-center text-sm text-[#6B6B7B] mt-5">
          ¿No tenés cuenta?{' '}
          <Link href="/auth/register" className="text-[#5856D6] hover:text-[#4644b8] font-semibold transition-colors">
            Registrarse gratis
          </Link>
        </p>
      </>
    )
  }

  // ── Login form ─────────────────────────────────────────────────────────────
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
        <div className="space-y-1">
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
          <div className="text-right">
            <Link
              href="/auth/forgot-password"
              className="text-xs text-[#6B6B7B] hover:text-[#5856D6] transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        {/* Error genérico */}
        {error && !isUnconfirmed && !noAccountFound && (
          <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Email no registrado — ofrece ir a registro */}
        {noAccountFound && (
          <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              {error}{' '}
              <Link
                href="/auth/register"
                className="font-semibold underline underline-offset-2 hover:text-red-700"
              >
                ¿Querés registrarte gratis?
              </Link>
            </span>
          </div>
        )}

        {/* Email sin confirmar — ofrece reenviar y abrir OTP */}
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
