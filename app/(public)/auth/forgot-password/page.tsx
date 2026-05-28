'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { isRateLimitError } from '@/lib/supabase/errors'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Mail, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react'

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

  // Leer error pasado por el callback de Supabase (ej: link de recovery expirado)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlError = params.get('error')
    if (urlError) setError(urlError)
  }, [])

  // Countdown del cooldown
  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown(c => c - 1), 1_000)
    return () => clearTimeout(t)
  }, [cooldown])

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    if (inFlight.current || loading || cooldown > 0) return
    inFlight.current = true
    setError('')
    setLoading(true)

    try {
      // Hard gate: only call resetPasswordForEmail when email-exists explicitly
      // confirms the account. On any failure (network, API error, env vars missing)
      // we block rather than silently proceeding — Supabase never errors for
      // non-existent emails, so a silent proceed would always show the success screen.
      let emailConfirmed = false
      try {
        const res = await fetch('/api/auth/email-exists', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ email: email.trim().toLowerCase() }),
        })
        if (res.ok) {
          const { exists } = await res.json()
          emailConfirmed = exists === true
        }
      } catch {
        // Network error → emailConfirmed stays false
      }

      if (!emailConfirmed) {
        setError('No existe ninguna cuenta asociada a este email.')
        return
      }

      const { error: authError } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          // El callback intercambia el code y redirige a /auth/reset-password.
          // ⚠️ Esta URL DEBE estar en la whitelist de Supabase Dashboard →
          //    Authentication → URL Configuration → Redirect URLs.
          //    Ver supabase/SUPABASE_SETUP.md para instrucciones.
          redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
        }
      )

      if (authError) {
        if (isRateLimitError(authError.message)) {
          // Rate-limit = Supabase ya procesó un recovery request recientemente.
          // El email debería estar en camino. Mostrar pantalla de instrucciones.
          setPreviouslySent(true)
          setSent(true)
          setCooldown(60)
          return
        }
        setError('No se pudo procesar la solicitud. Intentá de nuevo.')
        return
      }

      // Supabase aceptó el request (no garantiza que el email haya llegado aún)
      setSent(true)
      setCooldown(60)

    } finally {
      inFlight.current = false
      setLoading(false)
    }
  }

  // ── Pantalla post-envío ────────────────────────────────────────────────────
  if (sent) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 bg-[#FAFAFA]">
        <div className="w-full max-w-sm bg-white border border-[#E4E4EC] rounded-2xl p-8 shadow-card space-y-5">

          {/* Ícono — neutral (mail), no verde "éxito", porque no sabemos si llegó */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-[#F5F4FF] border border-[#DDDCFF] rounded-2xl flex items-center justify-center">
              <Mail className="w-8 h-8 text-[#5856D6]" />
            </div>
          </div>

          {/* Título + descripción */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-[#0F0F14]">Revisá tu email</h2>

            {previouslySent ? (
              <p className="text-[#6B6B7B] mt-2 text-sm leading-relaxed">
                Ya procesamos un pedido de recuperación para{' '}
                <span className="font-semibold text-[#0F0F14]">{email}</span>{' '}
                recientemente. El link debería estar en tu bandeja.
              </p>
            ) : (
              <p className="text-[#6B6B7B] mt-2 text-sm leading-relaxed">
                Si{' '}
                <span className="font-semibold text-[#0F0F14]">{email}</span>{' '}
                tiene una cuenta registrada, deberías recibir el link
                de recuperación en los próximos minutos.
              </p>
            )}
          </div>

          {/* Checklist de dónde buscar — lo más importante */}
          <div className="bg-[#FAFAFA] border border-[#E4E4EC] rounded-xl p-4 space-y-2.5">
            <p className="text-xs font-semibold text-[#6B6B7B] uppercase tracking-wide">
              Si no aparece en tu bandeja, revisá:
            </p>
            <div className="space-y-2">
              {[
                { icon: '📥', label: 'Carpeta de Spam' },
                { icon: '🏷️', label: 'Pestaña Promociones (Gmail)' },
                { icon: '⏱️', label: 'Puede tardar hasta 5 minutos' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 text-sm text-[#4B4B5A]">
                  <span className="text-base leading-none">{icon}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nota sobre expiración */}
          <p className="text-center text-xs text-[#B0B0BE]">
            El link vence en <strong className="text-[#6B6B7B]">1 hora</strong> · Usalo solo una vez
          </p>

          {/* Botón de volver */}
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center w-full py-3 px-6 bg-[#0F0F14] hover:bg-[#2A2A35] text-white font-semibold rounded-xl transition-colors text-sm"
          >
            Volver al login
          </Link>

          {/* Reenviar (con cooldown) */}
          <div className="text-center pt-1 space-y-1.5">
            <p className="text-xs text-[#B0B0BE]">¿No llegó después de 5 minutos?</p>
            <button
              onClick={() => { setSent(false); setPreviouslySent(false) }}
              disabled={cooldown > 0}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5856D6] hover:text-[#4644b8] disabled:text-[#B0B0BE] disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {cooldown > 0 ? `Reenviar en ${cooldown}s` : 'Intentar de nuevo'}
            </button>
          </div>

        </div>
      </div>
    )
  }

  // ── Formulario ─────────────────────────────────────────────────────────────
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
