'use client'

/**
 * Flujo de registro con verificación OTP:
 *
 *  Paso 1 — Formulario  : email + contraseña + nombre
 *  Paso 2 — OTP         : código de 8 dígitos enviado al email
 *  Paso 3 — Verificado  : cuenta confirmada → redirect a /
 *
 * ⚠️  REQUISITO EN SUPABASE DASHBOARD:
 *   Authentication → Email Templates → "Confirm signup"
 *   El template debe incluir {{ .Token }} para mostrar el código OTP.
 *   Ver supabase/email-templates/confirm-signup.html como referencia.
 *
 * ─── Casos cubiertos ──────────────────────────────────────────────
 *
 *  A) Usuario nuevo               → OTP enviado, mostrar pantalla OTP
 *  B) Email ya confirmado         → error claro, no se envía nada
 *  C) Email pendiente (sin OTP)   → Supabase reenvía OTP, pantalla OTP
 *  D) Rate-limit en signUp()      → OTP ya fue enviado antes,
 *                                   mostrar pantalla OTP con aviso
 *  E) Rate-limit en resend()      → mensaje suave + cooldown extendido
 *  F) OTP expirado                → error específico + prompt reenvío
 *  G) OTP incorrecto              → error + limpiar inputs
 *  H) Usuario abandona flujo OTP  → "← Usar otro email" resetea todo
 */

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { translateAuthError, translateSignUpError, isRateLimitError } from '@/lib/supabase/errors'
import { validateEmail } from '@/lib/emailValidation'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import OTPInput from '@/components/ui/OTPInput'
import { Mail, Lock, User, CheckCircle, AlertCircle, RefreshCw, Info, LogIn } from 'lucide-react'

type Step = 'form' | 'otp' | 'verified'

export default function RegisterPage() {
  // Cliente Supabase: inicializado solo en el cliente para evitar que
  // createBrowserClient acceda a `location` durante el SSR de Next.js.
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)
  if (typeof window !== 'undefined' && !supabaseRef.current) {
    supabaseRef.current = createClient()
  }
  const supabase = supabaseRef.current!

  // ── Estado del formulario ─────────────────────────────────────
  const [step, setStep]             = useState<Step>('form')
  const [form, setForm]             = useState({ full_name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading]       = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('Creando cuenta...')
  const [error, setError]           = useState('')
  // Flag especial: email duplicado → render con links en lugar de texto plano
  const [isDuplicateEmail, setIsDuplicateEmail] = useState(false)
  const inFlight = useRef(false)

  // ── Estado del OTP ────────────────────────────────────────────
  const [otpError, setOtpError]             = useState('')
  const [otpLoading, setOtpLoading]         = useState(false)
  const [otpKey, setOtpKey]                 = useState(0)      // remonta OTPInput para limpiar al error
  const [resendLoading, setResendLoading]   = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  // True cuando llegamos al OTP por rate-limit: el código ya fue enviado antes
  const [otpPreviouslySent, setOtpPreviouslySent] = useState(false)

  // Countdown para reenvío (decrementa cada segundo)
  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1_000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  const handleChange = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))

  /**
   * Vuelve al formulario reseteando TODOS los estados relacionados con OTP.
   * Usado en el botón "← Usar otro email".
   */
  const goBackToForm = () => {
    setStep('form')
    setError('')
    setIsDuplicateEmail(false)
    setOtpError('')
    setOtpPreviouslySent(false)
    setResendCooldown(0)
    setOtpKey(k => k + 1)     // limpia los inputs físicamente
    setOtpLoading(false)
  }

  // ═══════════════════════════════════════════════════════════════
  //  PASO 1 — Envío del formulario
  // ═══════════════════════════════════════════════════════════════
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inFlight.current || loading) return
    inFlight.current = true
    setError('')

    // ── Validaciones síncronas ────────────────────────────────────
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden.')
      inFlight.current = false
      return
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      inFlight.current = false
      return
    }

    setLoading(true)

    try {
      // ── Validación async de email (blocklist + MX) ────────────
      setLoadingMsg('Verificando email...')
      const emailCheck = await validateEmail(form.email)
      if (!emailCheck.valid) {
        setError(emailCheck.error ?? 'Email no válido.')
        setLoading(false)
        inFlight.current = false
        return
      }
      setLoadingMsg('Creando cuenta...')

      const { data, error: authError } = await supabase.auth.signUp({
        email:    form.email.trim().toLowerCase(),
        password: form.password,
        options: {
          data: { full_name: form.full_name.trim() },
          // Fallback: si el usuario llega al link del email en lugar de ingresar el OTP
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      // ── Manejo de errores de Supabase ──────────────────────────
      if (authError) {
        if (isRateLimitError(authError.message)) {
          // Rate-limit significa que este email ya tiene un OTP enviado.
          // En lugar de mostrar error, llevamos al usuario a la pantalla OTP
          // para que ingrese el código que ya recibió (o espere para reenviar).
          setOtpPreviouslySent(true)
          setStep('otp')
          setResendCooldown(60)
          setLoading(false)
          return
        }
        setError(translateSignUpError(authError.message))
        setLoading(false)
        return
      }

      // ── Respuesta exitosa de Supabase ──────────────────────────
      //
      // Supabase señala "email ya registrado" de dos formas según versión:
      //   a) data.user === null (sin error explícito)
      //   b) data.user existe pero identities: [] (ghost user)
      // Ambos casos = el email ya tiene una cuenta → activar render especial con links.
      if (!data.user || !data.user.identities?.length) {
        setIsDuplicateEmail(true)
        setError('')
        setLoading(false)
        return
      }

      if (data.session) {
        // Confirmación de email deshabilitada en Supabase → sesión inmediata
        setStep('verified')
        setTimeout(() => { window.location.href = '/' }, 2_000)
        return
      }

      // Caso normal: confirmación de email requerida, OTP enviado
      setOtpPreviouslySent(false)
      setStep('otp')
      setResendCooldown(60)

    } finally {
      inFlight.current = false
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  PASO 2 — Verificación del código OTP
  // ═══════════════════════════════════════════════════════════════
  const handleVerifyOTP = async (code: string) => {
    if (otpLoading) return
    setOtpLoading(true)
    setOtpError('')

    const { error } = await supabase.auth.verifyOtp({
      email: form.email.trim().toLowerCase(),
      token: code,
      type:  'email',   // 'email' = confirmación de signup via OTP
    })

    if (error) {
      const m = error.message.toLowerCase()
      setOtpError(
        m.includes('expired')
          ? 'El código expiró. Hacé click en "Reenviar código" para obtener uno nuevo.'
          : m.includes('invalid') || m.includes('incorrect') || m.includes('not found')
            ? 'Código incorrecto. Verificá los dígitos e intentá de nuevo.'
            : isRateLimitError(error.message)
              ? 'Demasiados intentos. Esperá un momento antes de volver a intentar.'
              : translateAuthError(error.message)
      )
      setOtpKey(k => k + 1)   // limpia los inputs para nueva entrada
      setOtpLoading(false)
      return
    }

    // ✅ Verificación exitosa — Supabase creó la sesión automáticamente
    setStep('verified')
    setTimeout(() => { window.location.href = '/' }, 2_000)
  }

  // ═══════════════════════════════════════════════════════════════
  //  Reenvío del código OTP
  // ═══════════════════════════════════════════════════════════════
  const handleResend = async () => {
    if (resendCooldown > 0 || resendLoading) return
    setResendLoading(true)
    setOtpError('')

    const { error } = await supabase.auth.resend({
      type:  'signup',
      email: form.email.trim().toLowerCase(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })

    setResendLoading(false)

    if (error) {
      if (isRateLimitError(error.message)) {
        // Supabase rate-limitó el reenvío: el código anterior sigue vigente
        setOtpError('El código anterior sigue activo. Esperá 1 minuto antes de pedir otro.')
        setResendCooldown(60)   // resetear countdown para sincronizar con Supabase
      } else {
        setOtpError(translateSignUpError(error.message))
      }
    } else {
      setOtpPreviouslySent(false)   // el nuevo código ya no es "el de antes"
      setResendCooldown(60)
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  Pantalla: cuenta verificada
  // ═══════════════════════════════════════════════════════════════
  if (step === 'verified') {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 bg-[#FAFAFA]">
        <div className="w-full max-w-sm text-center space-y-5 bg-white border border-[#E4E4EC] rounded-2xl p-8 shadow-card">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#0F0F14]">¡Cuenta verificada!</h2>
            <p className="text-[#6B6B7B] mt-2 text-sm">Bienvenido/a. Redirigiendo...</p>
          </div>
          <div className="flex justify-center">
            <div className="w-6 h-6 border-2 border-[#5856D6] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════
  //  Pantalla: ingreso del código OTP
  // ═══════════════════════════════════════════════════════════════
  if (step === 'otp') {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 bg-[#FAFAFA]">
        <div className="w-full max-w-sm">
          <div className="bg-white border border-[#E4E4EC] rounded-2xl p-8 shadow-card space-y-6">

            {/* Ícono + título */}
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="w-14 h-14 bg-[#F5F4FF] border border-[#DDDCFF] rounded-2xl flex items-center justify-center">
                  <Mail className="w-7 h-7 text-[#5856D6]" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#0F0F14]">Verificá tu email</h2>
                <p className="text-[#6B6B7B] text-sm mt-1.5 leading-relaxed">
                  {otpPreviouslySent
                    ? 'Ya enviamos un código a'
                    : 'Enviamos un código de 8 dígitos a'}
                </p>
                <p className="font-semibold text-[#0F0F14] text-sm mt-0.5 break-all">
                  {form.email}
                </p>
              </div>
            </div>

            {/* Info: código enviado previamente (caso rate-limit en signUp) */}
            {otpPreviouslySent && !otpError && (
              <div className="flex items-start gap-2.5 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
                <Info className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  Ingresá el código que ya recibiste en tu email.
                  Si no llegó, esperá 1 minuto para reenviar.
                </span>
              </div>
            )}

            {/* Inputs OTP */}
            <OTPInput
              key={otpKey}
              length={8}
              onComplete={handleVerifyOTP}
              loading={otpLoading}
              hasError={!!otpError}
            />

            {/* Verificando... */}
            {otpLoading && (
              <div className="flex items-center justify-center gap-2 text-[#6B6B7B] text-sm">
                <div className="w-4 h-4 border-2 border-[#5856D6] border-t-transparent rounded-full animate-spin" />
                <span>Verificando...</span>
              </div>
            )}

            {/* Error OTP */}
            {otpError && (
              <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{otpError}</span>
              </div>
            )}

            {/* Nota de expiración */}
            <p className="text-center text-xs text-[#B0B0BE]">
              El código vence en 10 minutos · Revisá también spam
            </p>

            {/* Reenvío */}
            <div className="text-center space-y-1.5">
              <p className="text-sm text-[#6B6B7B]">¿No llegó el código?</p>
              <button
                onClick={handleResend}
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

            {/* Volver al formulario */}
            <div className="pt-3 border-t border-[#F0EFF8] text-center">
              <button
                onClick={goBackToForm}
                className="text-xs text-[#B0B0BE] hover:text-[#6B6B7B] transition-colors"
              >
                ← Usar otro email
              </button>
            </div>

          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════
  //  Pantalla: formulario de registro (paso 1)
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 bg-[#FAFAFA]">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#EEEDFF] rounded-2xl mb-4">
            <span className="text-2xl">✨</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F0F14]">Crear cuenta</h1>
          <p className="text-[#6B6B7B] mt-1.5 text-sm">Únete a miles de coleccionistas</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleRegister}
          className="bg-white border border-[#E4E4EC] rounded-2xl p-6 space-y-4 shadow-card"
        >
          <Input
            id="full_name"
            label="Nombre completo"
            value={form.full_name}
            onChange={handleChange('full_name')}
            placeholder="Juan Pérez"
            icon={<User className="w-4 h-4" />}
            required
            autoComplete="name"
          />
          <Input
            id="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder="tu@email.com"
            icon={<Mail className="w-4 h-4" />}
            required
            autoComplete="email"
          />
          <Input
            id="password"
            label="Contraseña"
            type="password"
            value={form.password}
            onChange={handleChange('password')}
            placeholder="Mínimo 6 caracteres"
            icon={<Lock className="w-4 h-4" />}
            required
            autoComplete="new-password"
          />
          <Input
            id="confirm"
            label="Confirmar contraseña"
            type="password"
            value={form.confirm}
            onChange={handleChange('confirm')}
            placeholder="Repetí tu contraseña"
            icon={<Lock className="w-4 h-4" />}
            required
            autoComplete="new-password"
          />

          {/* Error: email ya registrado — con links accionables */}
          {isDuplicateEmail && (
            <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm space-y-2">
              <div className="flex items-start gap-2.5 text-amber-800">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="font-medium">Este email ya tiene una cuenta creada.</span>
              </div>
              <div className="flex items-center gap-3 pl-6">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-1 text-[#5856D6] hover:text-[#4644b8] font-semibold underline underline-offset-2 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Iniciar sesión
                </Link>
                <span className="text-amber-500">·</span>
                <Link
                  href="/auth/forgot-password"
                  className="text-[#5856D6] hover:text-[#4644b8] font-semibold underline underline-offset-2 transition-colors"
                >
                  Recuperar contraseña
                </Link>
              </div>
            </div>
          )}

          {/* Error genérico */}
          {error && !isDuplicateEmail && (
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
            {loading ? loadingMsg : 'Crear cuenta'}
          </Button>
        </form>

        <p className="text-center text-sm text-[#6B6B7B] mt-5">
          ¿Ya tenés cuenta?{' '}
          <Link
            href="/auth/login"
            className="text-[#5856D6] hover:text-[#4644b8] font-semibold transition-colors"
          >
            Iniciar sesión
          </Link>
        </p>

      </div>
    </div>
  )
}
