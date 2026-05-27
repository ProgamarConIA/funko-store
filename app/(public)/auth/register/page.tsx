'use client'

/**
 * Flujo de registro con verificación OTP — versión con hardening de seguridad.
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
 * ─── Casos cubiertos ──────────────────────────────────────────────────────────
 *
 *  A) Usuario nuevo               → OTP enviado, mostrar pantalla OTP
 *  B) Email ya confirmado         → error claro, no se envía nada
 *  C) Email pendiente (sin OTP)   → Supabase reenvía OTP, pantalla OTP
 *  D) Rate-limit en signUp()      → resend() confirma si el OTP existe para
 *                                   ESTE email específico antes de mostrar OTP
 *  E) Rate-limit en resend()      → mensaje suave + cooldown extendido
 *  F) OTP expirado                → error específico + prompt reenvío
 *  G) OTP incorrecto              → error + limpiar inputs + contador de intentos
 *  H) Usuario abandona flujo OTP  → "← Usar otro email" resetea TODO el estado
 *
 * ─── Modelo de seguridad ──────────────────────────────────────────────────────
 *
 *  pendingOtpEmail (state)
 *    ↳ Se fija SOLAMENTE cuando signUp() o resend() confirman que Supabase
 *      tiene un OTP challenge activo para ese email.
 *    ↳ verifyOtp() usa SIEMPRE este valor — nunca form.email directamente.
 *    ↳ Se limpia en goBackToForm(), invalidando cualquier challenge anterior.
 *    ↳ Esto previene que un OTP de email A verifique la cuenta de email B.
 *
 *  otpAttempts (ref)
 *    ↳ Cuenta intentos fallidos en la sesión actual del challenge.
 *    ↳ Al llegar a MAX_OTP_ATTEMPTS se bloquea la verificación y se fuerza
 *      al usuario a reiniciar el flujo completo.
 *    ↳ Se resetea a 0 en goBackToForm() y en cada resend exitoso.
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

/** Máximo de intentos OTP fallidos antes de forzar reinicio del flujo */
const MAX_OTP_ATTEMPTS = 5

export default function RegisterPage() {
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)
  if (typeof window !== 'undefined' && !supabaseRef.current) {
    supabaseRef.current = createClient()
  }
  const supabase = supabaseRef.current!

  // ── Estado del formulario ─────────────────────────────────────────────────
  const [step, setStep]             = useState<Step>('form')
  const [form, setForm]             = useState({ full_name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading]       = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('Creando cuenta...')
  const [error, setError]           = useState('')
  const [isDuplicateEmail, setIsDuplicateEmail] = useState(false)
  const inFlight = useRef(false)

  // ── Estado del OTP ────────────────────────────────────────────────────────
  /**
   * pendingOtpEmail: el email para el cual Supabase tiene un OTP challenge activo.
   *
   * Se fija cuando se confirma que el challenge existe (signUp exitoso, o resend
   * exitoso/rate-limited al intentar confirmar el challenge tras un rate-limit en signUp).
   * Se usa EXCLUSIVAMENTE en verifyOtp() — nunca se usa form.email directamente.
   * Se limpia en goBackToForm() para invalidar el challenge anterior.
   */
  const [pendingOtpEmail, setPendingOtpEmail]       = useState('')
  const [otpError, setOtpError]                     = useState('')
  const [otpLoading, setOtpLoading]                 = useState(false)
  const [otpKey, setOtpKey]                         = useState(0)
  const [resendLoading, setResendLoading]           = useState(false)
  const [resendCooldown, setResendCooldown]         = useState(0)
  const [otpPreviouslySent, setOtpPreviouslySent]   = useState(false)

  /**
   * otpAttempts: contador de intentos fallidos del challenge actual.
   * Ref (no state) para no causar re-renders en cada incremento.
   * Se resetea en goBackToForm() y después de cada resend exitoso.
   */
  const otpAttempts = useRef(0)

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
   * Vuelve al formulario invalidando el challenge OTP activo.
   *
   * Es CRÍTICO limpiar pendingOtpEmail aquí: garantiza que cualquier
   * intento de verificación posterior requiera un nuevo challenge,
   * previniendo que un código de un email anterior valide otro email.
   */
  const goBackToForm = () => {
    setStep('form')
    setError('')
    setIsDuplicateEmail(false)
    setOtpError('')
    setOtpPreviouslySent(false)
    setResendCooldown(0)
    setOtpKey(k => k + 1)
    setOtpLoading(false)
    // ⚠️ Invalida el challenge activo: el próximo verifyOtp() requiere
    //    un nuevo signUp() o resend() para fijar un nuevo pendingOtpEmail.
    setPendingOtpEmail('')
    otpAttempts.current = 0
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  PASO 1 — Envío del formulario
  // ═══════════════════════════════════════════════════════════════════════════
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inFlight.current || loading) return
    inFlight.current = true
    setError('')
    setIsDuplicateEmail(false)

    // ── Validaciones síncronas ──────────────────────────────────────────────
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
      // ── Validación async de email (blocklist + MX) ──────────────────────
      setLoadingMsg('Verificando email...')
      const emailCheck = await validateEmail(form.email)
      if (!emailCheck.valid) {
        setError(emailCheck.error ?? 'Email no válido.')
        setLoading(false)
        inFlight.current = false
        return
      }
      setLoadingMsg('Creando cuenta...')

      const normalizedEmail = form.email.trim().toLowerCase()

      const { data, error: authError } = await supabase.auth.signUp({
        email:    normalizedEmail,
        password: form.password,
        options: {
          data: { full_name: form.full_name.trim() },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      // ── Manejo de errores de Supabase ───────────────────────────────────
      if (authError) {
        if (isRateLimitError(authError.message)) {
          // ─── Rate-limit en signUp ───────────────────────────────────────
          // No asumimos automáticamente que hay un OTP pendiente para ESTE email.
          // El rate-limit puede ser:
          //   a) Email-específico: OTP ya enviado a este email → challenge activo
          //   b) IP/global: ningún OTP fue enviado para este email
          //
          // Para distinguir los casos, llamamos resend():
          //   • Si resend() tiene éxito o rate-limita → challenge activo para este email
          //   • Si resend() falla con otro error (ej: "user not found") → no hay challenge
          setLoadingMsg('Verificando estado...')
          const { error: resendErr } = await supabase.auth.resend({
            type:  'signup',
            email: normalizedEmail,
            options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
          })

          if (!resendErr || isRateLimitError(resendErr.message)) {
            // ✅ resend confirmó que hay un challenge activo para este email
            setPendingOtpEmail(normalizedEmail)
            otpAttempts.current = 0
            setOtpPreviouslySent(true)
            setStep('otp')
            setResendCooldown(60)
          } else {
            // ❌ resend falló con error distinto de rate-limit.
            // Puede ser: usuario no existe (IP rate-limit en signUp) o error SMTP real.
            // Usar translateSignUpError para dar el mensaje más preciso posible.
            setError(translateSignUpError(resendErr.message))
          }
          setLoading(false)
          return
        }

        setError(translateSignUpError(authError.message))
        setLoading(false)
        return
      }

      // ── Respuesta exitosa de Supabase ───────────────────────────────────
      //
      // Supabase señala "email ya registrado" de dos formas según versión:
      //   a) data.user === null (sin error explícito)
      //   b) data.user existe pero identities: [] (ghost user)
      // Supabase signals existing CONFIRMED email with identities: []
      // When data.user is null, some Supabase configs omit it on email-confirm-required —
      // that is a NEW user, so we must NOT show duplicate message in that case.
      if (Array.isArray(data.user?.identities) && data.user!.identities.length === 0) {
        setIsDuplicateEmail(true)
        setError('')
        setLoading(false)
        return
      }

      if (data.session) {
        // Confirmación de email deshabilitada → sesión inmediata
        setStep('verified')
        setTimeout(() => { window.location.href = '/' }, 2_000)
        return
      }

      // ✅ OTP enviado: fijar el email del challenge ANTES de cambiar el step.
      // A partir de aquí, pendingOtpEmail es el único email válido para verifyOtp().
      setPendingOtpEmail(normalizedEmail)
      otpAttempts.current = 0
      setOtpPreviouslySent(false)
      setStep('otp')
      setResendCooldown(60)

    } finally {
      inFlight.current = false
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  PASO 2 — Verificación del código OTP
  // ═══════════════════════════════════════════════════════════════════════════
  const handleVerifyOTP = async (code: string) => {
    if (otpLoading) return

    // ── Guardia de seguridad #1: challenge válido ──────────────────────────
    // pendingOtpEmail debe estar fijado. Si está vacío, el estado es inválido
    // (no se llegó por el flujo normal, o goBackToForm limpió el challenge).
    if (!pendingOtpEmail) {
      setOtpError('Sesión de verificación inválida. Usá "← Usar otro email" para reiniciar.')
      return
    }

    // ── Guardia de seguridad #2: límite de intentos ────────────────────────
    // Evita fuerza bruta y limita el daño de códigos robados/filtrados.
    if (otpAttempts.current >= MAX_OTP_ATTEMPTS) {
      setOtpError(
        `Demasiados intentos fallidos (${MAX_OTP_ATTEMPTS}/${MAX_OTP_ATTEMPTS}). ` +
        'Usá "← Usar otro email" para solicitar un código nuevo.'
      )
      return
    }

    setOtpLoading(true)
    setOtpError('')

    // ⚠️ CRÍTICO: siempre usamos pendingOtpEmail, NUNCA form.email.
    // pendingOtpEmail fue fijado cuando Supabase confirmó el challenge para ese email.
    // Esto previene que un OTP generado para email A verifique la cuenta de email B.
    const { error } = await supabase.auth.verifyOtp({
      email: pendingOtpEmail,
      token: code,
      type:  'email',
    })

    if (error) {
      // Incrementar contador SOLO en error (un éxito no cuenta como intento fallido)
      otpAttempts.current++
      const attemptsLeft = MAX_OTP_ATTEMPTS - otpAttempts.current

      const m = error.message.toLowerCase()
      setOtpError(
        m.includes('expired')
          ? 'El código expiró. Hacé click en "Reenviar código" para obtener uno nuevo.'
          : m.includes('invalid') || m.includes('incorrect') || m.includes('not found')
            ? attemptsLeft > 0
              ? `Código incorrecto. Verificá los dígitos e intentá de nuevo.${attemptsLeft === 1 ? ' (último intento)' : ''}`
              : `Código incorrecto. Alcanzaste el límite de intentos. Usá "← Usar otro email" para reiniciar.`
            : isRateLimitError(error.message)
              ? 'Demasiados intentos. Esperá un momento antes de volver a intentar.'
              : translateAuthError(error.message)
      )
      setOtpKey(k => k + 1)   // limpia los inputs físicamente para nueva entrada
      setOtpLoading(false)
      return
    }

    // ✅ Verificación exitosa — Supabase crea la sesión automáticamente
    otpAttempts.current = 0
    setStep('verified')
    setTimeout(() => { window.location.href = '/' }, 2_000)
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  Reenvío del código OTP
  // ═══════════════════════════════════════════════════════════════════════════
  const handleResend = async () => {
    if (resendCooldown > 0 || resendLoading) return
    setResendLoading(true)
    setOtpError('')

    // Usar el email del challenge activo (pendingOtpEmail), que debe ser idéntico
    // a form.email mientras el usuario está en la pantalla OTP (no puede modificarlo).
    // Si pendingOtpEmail está vacío (estado inválido), usar form.email como fallback.
    const emailToResend = pendingOtpEmail || form.email.trim().toLowerCase()

    const { error } = await supabase.auth.resend({
      type:  'signup',
      email: emailToResend,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })

    setResendLoading(false)

    if (error) {
      if (isRateLimitError(error.message)) {
        // El código anterior sigue activo; pendingOtpEmail ya es correcto
        setOtpError('El código anterior sigue activo. Esperá 1 minuto antes de pedir otro.')
        setResendCooldown(60)
      } else {
        setOtpError(translateSignUpError(error.message))
      }
    } else {
      // ✅ Nuevo código enviado: actualizar/confirmar el email del challenge
      // y resetear el contador de intentos (código nuevo = oportunidad nueva).
      setPendingOtpEmail(emailToResend)
      otpAttempts.current = 0
      setOtpPreviouslySent(false)
      setResendCooldown(60)
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  Pantalla: cuenta verificada
  // ═══════════════════════════════════════════════════════════════════════════
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

  // ═══════════════════════════════════════════════════════════════════════════
  //  Pantalla: ingreso del código OTP
  // ═══════════════════════════════════════════════════════════════════════════
  if (step === 'otp') {
    // El email que se muestra y se usa para verificar es pendingOtpEmail,
    // no form.email. Ambos deberían ser iguales en condiciones normales,
    // pero usar pendingOtpEmail es explícito y elimina cualquier ambigüedad.
    const displayEmail = pendingOtpEmail || form.email

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
                {/* ⚠️ Mostrar el email del challenge activo, no form.email */}
                <p className="font-semibold text-[#0F0F14] text-sm mt-0.5 break-all">
                  {displayEmail}
                </p>
              </div>
            </div>

            {/* Aviso cuando llegamos al OTP por rate-limit */}
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

            {/* Volver al formulario — invalida el challenge activo */}
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

  // ═══════════════════════════════════════════════════════════════════════════
  //  Pantalla: formulario de registro (paso 1)
  // ═══════════════════════════════════════════════════════════════════════════
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
