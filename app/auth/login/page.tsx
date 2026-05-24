import { Suspense } from 'react'
import LoginForm from './LoginForm'
import { Zap } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#a855f7] rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.5)] mb-4">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#f1f0ff]">Iniciar sesión</h1>
          <p className="text-[#64607a] mt-2 text-sm">Bienvenido de vuelta, coleccionista</p>
        </div>
        <Suspense fallback={<div className="h-64 bg-[#12121f] border border-[#1e1e35] rounded-2xl animate-pulse" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
