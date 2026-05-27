'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { translateSignUpError } from '@/lib/supabase/errors'
import { validateEmail } from '@/lib/emailValidation'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Mail, Lock, User, CheckCircle, AlertCircle } from 'lucide-react'

export default function RegisterPage() {
  // Cliente Supabase: inicializado solo en el cliente para evitar que
  // createBrowserClient acceda a `location` durante el SSR de Next.js.
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)
  if (typeof window !== 'undefined' && !supabaseRef.current) {
    supabaseRef.current = createClient()
  }
  // El operador ! es seguro: los handlers solo se ejecutan en el navegador,
  // donde supabaseRef.current ya fue inicializado por la condición anterior.
  const supabase = supabaseRef.current!

  const [form, setForm]             = useState({ full_name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading]       = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('Creando cuenta...')
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState(false)
  const [needsConfirm, setNeedsConfirm] = useState(true) // ¿el registro requiere confirmación de email?
  // Guard contra doble-submit
  const inFlight = useRef(false)

  const handleChange = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inFlight.current || loading) return
    inFlight.current = true
    setError('')

    // ── Validaciones cliente (síncronas) ─────────────────────
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
      // ── Validación de email (async: blocklist + MX record) ──
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
          // Supabase usará este URL para los links de confirmación de email
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) {
        setError(translateSignUpError(authError.message))
        setLoading(false)
        return
      }

      // ── Determinar si necesita confirmación de email ──────────
      // data.session es null → confirmación requerida (default en Supabase)
      // data.session existe  → confirmación deshabilitada → login automático
      if (data.session) {
        // Sin confirmación requerida: ya está logueado, redirigir a home
        setNeedsConfirm(false)
        setSuccess(true)
        setTimeout(() => { window.location.href = '/' }, 1500)
      } else if (data.user?.identities?.length === 0) {
        // identities vacío = el email ya existe pero el usuario no lo sabe
        setError('Ya existe una cuenta con este email. Intentá iniciar sesión.')
        setLoading(false)
      } else {
        // Caso normal: confirmación de email requerida
        setNeedsConfirm(true)
        setSuccess(true)
      }
    } finally {
      inFlight.current = false
    }
  }

  /* ── Pantalla de éxito ─────────────────────────────────────── */
  if (success) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 bg-[#FAFAFA]">
        <div className="w-full max-w-md">
          <div className="bg-white border border-[#E4E4EC] rounded-2xl p-8 shadow-card text-center space-y-5">

            {/* Icono */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>

            {needsConfirm ? (
              /* Confirmación de email requerida */
              <>
                <div>
                  <h2 className="text-2xl font-bold text-[#0F0F14]">¡Cuenta creada!</h2>
                  <p className="text-[#6B6B7B] mt-2 text-sm leading-relaxed">
                    Te enviamos un email a{' '}
                    <span className="font-semibold text-[#0F0F14]">{form.email}</span>.
                    <br />
                    Hacé click en el link para confirmar tu cuenta.
                  </p>
                  <p className="text-[#B0B0BE] mt-3 text-xs">
                    Revisá también la carpeta de spam si no aparece.
                  </p>
                </div>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center w-full py-3 px-6 bg-[#5856D6] hover:bg-[#4644b8] text-white font-semibold rounded-xl transition-colors"
                >
                  Ir al login
                </Link>
              </>
            ) : (
              /* Sin confirmación — acceso inmediato */
              <>
                <div>
                  <h2 className="text-2xl font-bold text-[#0F0F14]">¡Bienvenido!</h2>
                  <p className="text-[#6B6B7B] mt-2 text-sm">
                    Tu cuenta fue creada. Redirigiendo...
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className="w-6 h-6 border-2 border-[#5856D6] border-t-transparent rounded-full animate-spin" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  /* ── Formulario de registro ────────────────────────────────── */
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
