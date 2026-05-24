'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Mail, Lock, User, Zap, CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  const supabase = createClient()
  const router = useRouter()

  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.full_name },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-[#4ade80]/10 border border-[#4ade80]/30 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-[#4ade80]" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[#f1f0ff]">¡Cuenta creada!</h2>
          <p className="text-[#a09dbd]">
            Revisá tu email <strong className="text-[#f1f0ff]">{form.email}</strong> y confirmá tu cuenta para empezar.
          </p>
          <Link href="/auth/login" className="inline-block px-8 py-3 bg-[#a855f7] text-white font-bold rounded-xl shadow-[0_0_16px_rgba(168,85,247,0.4)] hover:bg-[#9333ea] transition-all">
            Ir al login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#a855f7] rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.5)] mb-4">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#f1f0ff]">Crear cuenta</h1>
          <p className="text-[#64607a] mt-2 text-sm">Únete a miles de coleccionistas</p>
        </div>

        <form onSubmit={handleRegister} className="bg-[#12121f] border border-[#1e1e35] rounded-2xl p-6 space-y-4">
          <Input
            id="full_name"
            label="Nombre completo"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            placeholder="Juan Pérez"
            icon={<User className="w-4 h-4" />}
            required
          />
          <Input
            id="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="tu@email.com"
            icon={<Mail className="w-4 h-4" />}
            required
          />
          <Input
            id="password"
            label="Contraseña"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Mínimo 6 caracteres"
            icon={<Lock className="w-4 h-4" />}
            required
          />
          <Input
            id="confirm"
            label="Confirmar contraseña"
            type="password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            placeholder="Repetí tu contraseña"
            icon={<Lock className="w-4 h-4" />}
            required
          />

          {error && (
            <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} className="w-full">
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </Button>
        </form>

        <p className="text-center text-sm text-[#64607a] mt-6">
          ¿Ya tenés cuenta?{' '}
          <Link href="/auth/login" className="text-[#a855f7] hover:text-[#c084fc] font-semibold transition-colors">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
