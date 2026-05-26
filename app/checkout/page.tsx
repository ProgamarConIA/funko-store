'use client'

import { useRef, useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import PriceDisplay from '@/components/ui/PriceDisplay'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { CreditCard, MapPin, Lock, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/utils'
import type { ShippingAddress } from '@/lib/types'

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore()
  const router = useRouter()
  // Inicializado solo en el cliente para evitar que createBrowserClient
  // acceda a `location` durante el SSR de Next.js.
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)
  if (typeof window !== 'undefined' && !supabaseRef.current) {
    supabaseRef.current = createClient()
  }
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [address, setAddress] = useState<ShippingAddress>({
    full_name: '', address: '', city: '', state: '', zip_code: '', country: 'Argentina', phone: '',
  })

  const [payment, setPayment] = useState({ card_number: '', card_name: '', expiry: '', cvv: '' })

  if (items.length === 0) {
    router.replace('/')
    return null
  }

  const handleOrder = async () => {
    setLoading(true)
    setError('')
    try {
      const { data: { user } } = await supabaseRef.current!.auth.getUser()
      if (!user) { router.push('/auth/login?redirect=/checkout'); return }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ product_id: i.product.id, quantity: i.quantity, unit_price: i.product.price })),
          total: totalPrice(),
          shipping_address: address,
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Error al procesar el pedido')

      clearCart()
      router.push(`/checkout/success?order=${json.data.id}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const total = totalPrice()

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0F0F14]">Checkout</h1>
          <p className="text-[#6B6B7B] text-sm mt-1">Completá tu pedido en pocos pasos</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Formulario */}
          <div className="flex-1 space-y-4">

            {/* Stepper */}
            <div className="flex items-center gap-3 mb-6">
              {[
                { key: 'shipping', label: '1. Envío', icon: <MapPin className="w-3.5 h-3.5" /> },
                { key: 'payment', label: '2. Pago',  icon: <CreditCard className="w-3.5 h-3.5" /> },
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => key === 'payment' ? null : setStep('shipping')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    step === key
                      ? 'bg-[#0F0F14] text-white shadow-sm'
                      : step === 'payment' && key === 'shipping'
                      ? 'bg-green-50 text-green-600 border border-green-200'
                      : 'bg-white text-[#6B6B7B] border border-[#E4E4EC]'
                  }`}
                >
                  {step === 'payment' && key === 'shipping'
                    ? <CheckCircle className="w-3.5 h-3.5" />
                    : icon
                  }
                  {label}
                </button>
              ))}
            </div>

            {/* Paso 1: Envío */}
            {step === 'shipping' && (
              <div className="bg-white border border-[#E4E4EC] rounded-2xl p-6 space-y-4 shadow-card">
                <h2 className="font-semibold text-[#0F0F14] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#5856D6]" /> Dirección de envío
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Input label="Nombre completo" value={address.full_name} onChange={(e) => setAddress({ ...address, full_name: e.target.value })} placeholder="Juan Pérez" required />
                  </div>
                  <div className="sm:col-span-2">
                    <Input label="Dirección" value={address.address} onChange={(e) => setAddress({ ...address, address: e.target.value })} placeholder="Av. Corrientes 1234, Piso 3" required />
                  </div>
                  <Input label="Ciudad" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="Buenos Aires" required />
                  <Input label="Provincia" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} placeholder="CABA" />
                  <Input label="Código Postal" value={address.zip_code} onChange={(e) => setAddress({ ...address, zip_code: e.target.value })} placeholder="C1043" />
                  <Input label="Teléfono" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} placeholder="+54 11 1234 5678" type="tel" />
                </div>
                <Button onClick={() => setStep('payment')} className="w-full" size="lg" disabled={!address.full_name || !address.address || !address.city}>
                  Continuar al pago →
                </Button>
              </div>
            )}

            {/* Paso 2: Pago */}
            {step === 'payment' && (
              <div className="bg-white border border-[#E4E4EC] rounded-2xl p-6 space-y-4 shadow-card">
                <h2 className="font-semibold text-[#0F0F14] flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#5856D6]" /> Datos de pago
                </h2>
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs font-medium flex items-center gap-2">
                  💳 Este checkout es <strong>simulado</strong>. No se realiza ningún cargo real.
                </div>
                <Input label="Número de tarjeta" value={payment.card_number} onChange={(e) => setPayment({ ...payment, card_number: e.target.value })} placeholder="4242 4242 4242 4242" maxLength={19} />
                <Input label="Nombre en la tarjeta" value={payment.card_name} onChange={(e) => setPayment({ ...payment, card_name: e.target.value })} placeholder="JUAN PEREZ" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Vencimiento" value={payment.expiry} onChange={(e) => setPayment({ ...payment, expiry: e.target.value })} placeholder="MM/AA" maxLength={5} />
                  <Input label="CVV" value={payment.cvv} onChange={(e) => setPayment({ ...payment, cvv: e.target.value })} placeholder="123" maxLength={4} type="password" />
                </div>

                {error && (
                  <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
                )}

                <Button onClick={handleOrder} loading={loading} className="w-full" size="lg" icon={<Lock className="w-4 h-4" />}>
                  {loading ? 'Procesando...' : <span>Confirmar — <PriceDisplay priceEUR={total} /></span>}
                </Button>
                <button onClick={() => setStep('shipping')} className="w-full text-sm text-[#6B6B7B] hover:text-[#0F0F14] transition-colors">
                  ← Volver al envío
                </button>
              </div>
            )}
          </div>

          {/* Resumen */}
          <div className="lg:w-72">
            <div className="sticky top-24 bg-white border border-[#E4E4EC] rounded-2xl p-5 space-y-4 shadow-card">
              <h2 className="font-semibold text-[#0F0F14] text-sm">Resumen del pedido</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-2.5 items-center">
                    <div className="relative w-10 h-10 bg-[#F5F4FF] rounded-xl overflow-hidden flex-shrink-0">
                      <Image src={product.image_url || DEFAULT_PRODUCT_IMAGE} alt={product.name} fill className="object-contain p-1" sizes="40px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#0F0F14] line-clamp-1">{product.name}</p>
                      <p className="text-xs text-[#6B6B7B]">x{quantity}</p>
                    </div>
                    <PriceDisplay
                      priceEUR={product.price * quantity}
                      className="text-xs font-bold text-[#5856D6] whitespace-nowrap"
                    />
                  </div>
                ))}
              </div>
              <div className="border-t border-[#E4E4EC] pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-[#6B6B7B]">
                  <span>Subtotal</span><PriceDisplay priceEUR={total} />
                </div>
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Envío</span><span>Gratis</span>
                </div>
                <div className="flex justify-between font-bold text-[#0F0F14] text-base pt-1">
                  <span>Total</span><PriceDisplay priceEUR={total} className="font-bold text-[#0F0F14] text-base" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
