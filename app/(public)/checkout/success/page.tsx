import Link from 'next/link'
import { CheckCircle, Package, ShoppingBag, ArrowRight, Truck, Home } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Compra confirmada' }

interface PageProps {
  searchParams: Promise<{ order?: string; total?: string; currency?: string }>
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const { order, total, currency } = await searchParams

  const displayAmount = total && !isNaN(parseFloat(total))
    ? formatPrice(parseFloat(total), currency ?? 'EUR')
    : null

  const orderShort = order?.slice(0, 8).toUpperCase()

  const timeline = [
    { label: 'Pedido recibido',  icon: <CheckCircle className="w-4 h-4" />, done: true  },
    { label: 'En preparación',   icon: <Package     className="w-4 h-4" />, done: false },
    { label: 'En camino',        icon: <Truck       className="w-4 h-4" />, done: false },
    { label: 'Entregado',        icon: <Home        className="w-4 h-4" />, done: false },
  ]

  return (
    <div className="min-h-screen bg-[#FAFAFF] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full space-y-6">

        {/* Icono de éxito */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-emerald-50 border-2 border-emerald-200 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-emerald-500" strokeWidth={1.75} />
            </div>
            {/* Pulso sutil */}
            <div className="absolute inset-0 rounded-full border-2 border-emerald-300/40 animate-ping" />
          </div>
        </div>

        {/* Titular */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-[#0F0F14] mb-2">
            ¡Compra confirmada!
          </h1>
          <p className="text-[#6B6B7B] leading-relaxed">
            Tu pedido ha sido procesado exitosamente. Recibirás tus Funko Pops muy pronto.
          </p>
        </div>

        {/* Tarjeta de resumen */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

          {/* Header de la tarjeta */}
          <div className="flex items-center gap-3 px-6 py-4 bg-emerald-50 border-b border-emerald-100">
            <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-4.5 h-4.5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0F0F14]">Pedido realizado</p>
              {orderShort && (
                <p className="text-xs text-[#6B6B7B] font-mono">#{orderShort}</p>
              )}
            </div>
            {displayAmount && (
              <span className="ml-auto text-lg font-extrabold text-emerald-600">
                {displayAmount}
              </span>
            )}
          </div>

          {/* Timeline de estado */}
          <div className="px-6 py-5">
            <p className="text-xs font-semibold text-[#B0B0BE] uppercase tracking-widest mb-4">
              Estado del pedido
            </p>
            <div className="space-y-3">
              {timeline.map(({ label, icon, done }, i) => (
                <div key={label} className="flex items-center gap-3">
                  {/* Línea vertical */}
                  <div className="flex flex-col items-center self-stretch">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      done
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-gray-50 text-gray-300 border border-gray-200'
                    }`}>
                      {icon}
                    </div>
                    {i < timeline.length - 1 && (
                      <div className={`w-px flex-1 my-1 ${done ? 'bg-emerald-200' : 'bg-gray-100'}`} />
                    )}
                  </div>
                  <span className={`text-sm pb-3 ${done ? 'font-semibold text-[#0F0F14]' : 'text-[#B0B0BE]'}`}>
                    {label}
                    {done && <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded-full">✓ Listo</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer informativo */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-[#6B6B7B]">
            📦 El tiempo de entrega estimado es de <strong>3–7 días hábiles</strong>.
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/profile/orders"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#5856D6] hover:bg-[#4644b8] text-white font-bold rounded-xl shadow-sm transition-all text-sm"
          >
            Ver mis pedidos <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center py-3.5 bg-white border border-gray-200 hover:border-[#5856D6]/40 hover:text-[#5856D6] text-[#6B6B7B] font-semibold rounded-xl transition-all text-sm"
          >
            Seguir comprando
          </Link>
        </div>

      </div>
    </div>
  )
}
