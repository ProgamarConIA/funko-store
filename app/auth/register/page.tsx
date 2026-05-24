'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Mail, Lock, User, CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  const supabase = createClient()

  const [form, setForm]     = useState({ full_name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
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
      options: { data: { full_name: form.full_name } },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  /* ── Pantalla de éxito ── */
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

            {/* Texto */}
            <div>
              <h2 className="text-2xl font-bold text-[#0F0F14]">¡Cuenta creada!</h2>
              <p className="text-[#6B6B7B] mt-2 text-sm leading-relaxed">
                Revisá tu email{' '}
                <span className="font-semibold text-[#0F0F14]">{form.email}</span>{' '}
                y confirmá tu cuenta para empezar a coleccionar.
              </p>
            </div>

            {/* CTA */}
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center w-full py-3 px-6 bg-[#5856D6] hover:bg-[#4644b8] text-white font-semibold rounded-xl transition-colors"
            >
              Ir al login
            </Link>

          </div>
        </div>
      </div>
    )
  }

  /* ── Formulario de registro ── */
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
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <Button type="submit" variant="accent" loading={loading} className="w-full" size="lg">
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
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
