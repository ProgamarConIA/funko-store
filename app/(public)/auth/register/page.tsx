'use client'

/**
 * Flujo de registro con verificación OTP:
 *
 *  Paso 1 — Formulario  : email + contraseña + nombre
 *  Paso 2 — OTP         : código de 6 dígitos enviado al email
 *  Paso 3 — Verificado  : cuenta confirmada → redirect a /
 *
 * ⚠️  REQUISITO EN SUPABASE DASHBOARD:
 *   Authentication → Email Templates → "Confirm signup"
 *   El template debe incluir {{ .Token }} para mostrar el código OTP.
 *   Ver supabase/email-templates/confirm-signup.html como referencia.
 */

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { translateAuthError, translateSignUpError } from '@/lib/supabase/errors'
import { validateEmail } from '@/lib/emailValidation'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import OTPInput from '@/components/ui/OTPInput'
import { Mail, Lock, User, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'

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
  const inFlight = useRef(false)

  // ── Estado del OTP ────────────────────────────────────────────
  const [otpError, setOtpError]         = useState('')
  const [otpLoading, setOtpLoading]     = useState(false)
  const [otpKey, setOtpKey]             = useState(0)   // remonta OTPInput para limpiar al error
  const [resendLoading, setResendLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  // Countdown para reenvío (decrementa cada segundo)
  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1_000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  const handleChange = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))

  // ═══════════════════════════════════════════════════════════════
  //  PASO 1 — Envío del formulario
  // ═══════════════════════════════════════════════════════════════
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inFlight.current || loading) return
    inFlight.current = true
    setError('')

    // Validaciones síncronas
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
      // Validación de email (formato + blocklist + MX record)
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
          // Fallback por si el usuario llega vía link en lugar de OTP
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) {
        setError(translateSignUpError(authError.message))
        setLoading(false)
        return
      }

      if (data.session) {
        // Confirmación deshabilitada en Supabase → sesión inmediata
        setStep('verified')
        setTimeout(() => { window.location.href = '/' }, 2_000)
      } else if (data.user?.identities?.length === 0) {
        // Email ya registrado (Supabase no expone esto directamente, pero a veces sí)
        setError('Ya existe una cuenta con este email. Intentá iniciar sesión.')
        setLoading(false)
      } else {
        // Flujo normal: Supabase envió el email con el código OTP
        setStep('otp')
        setResendCooldown(60)
      }
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
      type:  'email',   // 'email' verifica tokens de confirmación de signup
    })

    if (error) {
      const m = error.message.toLowerCase()
      setOtpError(
        m.includes('expired')
          ? 'El código expiró. Hacé click en "Reenviar código" para obtener uno nuevo.'
          : m.includes('invalid') || m.includes('incorrect') || m.includes('not found')
            ? 'Código incorrecto. Verificá los dígitos e intentá de nuevo.'
            : translateAuthError(error.message)
      )
      setOtpKey(k => k + 1)   // limpia los inputs
      setOtpLoading(false)
      return
    }

    // ✅ Verificación exitosa — Supabase creó la sesión
    setStep('verified')
    setTimeout(() => { window.location.href = '/' }, 2_000)
  }

  // ═══════════════════════════════════════════════════════════════
  //  Reenvío del código
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
      setOtpError(translateSignUpError(error.message))
    } else {
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
                  Enviamos un código de 6 dígitos a
                </p>
                <p className="font-semibold text-[#0F0F14] text-sm mt-0.5 break-all">
                  {form.email}
                </p>
              </div>
            </div>

            {/* Inputs OTP */}
            <OTPInput
              key={otpKey}
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
                onClick={() => { setStep('form'); setError(''); setOtpError('') }}
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
