import Link from 'next/link'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{ order?: string }>
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const { order } = await searchParams

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icono */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-[#4ade80]/10 border border-[#4ade80]/30 rounded-full flex items-center justify-center animate-glow">
            <CheckCircle className="w-12 h-12 text-[#4ade80]" />
          </div>
        </div>

        {/* Mensaje */}
        <div>
          <h1 className="text-3xl font-extrabold text-[#f1f0ff] mb-3">
            ¡Pedido confirmado! 🎉
          </h1>
          <p className="text-[#a09dbd] leading-relaxed">
            Tu pedido ha sido procesado exitosamente. Recibirás tus Funko Pops pronto.
          </p>
          {order && (
            <p className="mt-2 text-xs text-[#64607a]">
              Número de pedido: <span className="font-mono text-[#a855f7]">#{order.slice(0, 8).toUpperCase()}</span>
            </p>
          )}
        </div>

        {/* Info de envío */}
        <div className="bg-[#12121f] border border-[#1e1e35] rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <Package className="w-5 h-5 text-[#a855f7]" />
            <span className="font-semibold text-[#f1f0ff]">Estado del pedido</span>
          </div>
          <div className="space-y-2 text-sm">
            {[
              { label: 'Pedido recibido', done: true },
              { label: 'En preparación', done: false },
              { label: 'Enviado', done: false },
              { label: 'Entregado', done: false },
            ].map(({ label, done }) => (
              <div key={label} className={`flex items-center gap-2 ${done ? 'text-[#4ade80]' : 'text-[#64607a]'}`}>
                <div className={`w-2 h-2 rounded-full ${done ? 'bg-[#4ade80]' : 'bg-[#1e1e35]'}`} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/profile/orders"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#a855f7] hover:bg-[#9333ea] text-white font-bold rounded-xl shadow-[0_0_16px_rgba(168,85,247,0.4)] transition-all"
          >
            Ver mis pedidos <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="flex-1 py-3 bg-[#12121f] border border-[#1e1e35] hover:border-[#a855f7]/40 text-[#a09dbd] hover:text-[#f1f0ff] font-semibold rounded-xl transition-all text-center"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  )
}
