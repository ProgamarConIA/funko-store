'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Mail, Lock } from 'lucide-react'

export default function LoginForm() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/'

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email o contraseña incorrectos.')
      setLoading(false)
    } else {
      // Recarga completa para que el servidor reciba la sesión correctamente
      window.location.href = redirect
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
        />

        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <Button type="submit" variant="accent" loading={loading} className="w-full" size="lg">
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
