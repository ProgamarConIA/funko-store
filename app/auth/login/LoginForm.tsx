'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Mail, Lock } from 'lucide-react'

export default function LoginForm() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Credenciales incorrectas. Verificá tu email y contraseña.')
      setLoading(false)
    } else {
      router.push(redirect)
      router.refresh()
    }
  }

  return (
    <>
      <form onSubmit={handleLogin} className="bg-[#12121f] border border-[#1e1e35] rounded-2xl p-6 space-y-4">
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
          <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}
        <Button type="submit" loading={loading} className="w-full">
          {loading ? 'Ingresando...' : 'Iniciar sesión'}
        </Button>
      </form>
      <p className="text-center text-sm text-[#64607a] mt-6">
        ¿No tenés cuenta?{' '}
        <Link href="/auth/register" className="text-[#a855f7] hover:text-[#c084fc] font-semibold transition-colors">
          Registrarse gratis
        </Link>
      </p>
    </>
  )
}
