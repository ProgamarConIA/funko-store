import { Suspense } from 'react'
import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-[#FAFAFA]">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#EEEDFF] rounded-2xl mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F0F14]">Bienvenido de vuelta</h1>
          <p className="text-[#6B6B7B] mt-1.5 text-sm">Ingresá a tu cuenta de FunkoStore</p>
        </div>

        {/* Suspense necesario por useSearchParams en LoginForm */}
        <Suspense
          fallback={
            <div className="h-56 bg-white border border-[#E4E4EC] rounded-2xl animate-pulse" />
          }
        >
          <LoginForm />
        </Suspense>

      </div>
    </div>
  )
}
