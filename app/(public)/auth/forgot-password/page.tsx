'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { isRateLimitError } from '@/lib/supabase/errors'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Mail, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)
  if (typeof window !== 'undefined' && !supabaseRef.current) {
    supabaseRef.current = createClient()
  }
  const supabase = supabaseRef.current!

  const [email, setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]     = useState(false)
  const [error, setError]   = useState('')
  const inFlight = useRef(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inFlight.current || loading) return
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
        setError(
          isRateLimitError(authError.message)
            ? 'Demasiados intentos. Esperá unos minutos e intentá de nuevo.'
            : 'No se pudo enviar el email. Intentá de nuevo.'
        )
        setLoading(false)
        return
      }

      // Siempre mostrar éxito: no revelar si el email existe o no (seguridad)
      setSent(true)
    } finally {
      inFlight.current = false
    }
  }

  // ── Pantalla de éxito ─────────────────────────────────────────
  if (sent) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 bg-[#FAFAFA]">
        <div className="w-full max-w-sm text-center space-y-5 bg-white border border-[#E4E4EC] rounded-2xl p-8 shadow-card">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0F0F14]">Revisá tu email</h2>
            <p className="text-[#6B6B7B] mt-2 text-sm leading-relaxed">
              Si existe una cuenta con{' '}
              <span className="font-semibold text-[#0F0F14]">{email}</span>,
              recibirás un link para restablecer tu contraseña en los próximos minutos.
            </p>
            <p className="text-[#B0B0BE] mt-2 text-xs">Revisá también la carpeta de spam.</p>
          </div>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center w-full py-3 px-6 bg-[#0F0F14] hover:bg-[#2A2A35] text-white font-semibold rounded-xl transition-colors text-sm"
          >
            Volver al login
          </Link>
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
            // eslint-disable-next-line jsx-a11y/no-autofocus
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
            className="w-full"
            size="lg"
          >
            {loading ? 'Enviando...' : 'Enviar link de recuperación'}
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
