'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { CreditCard, MapPin, Lock } from 'lucide-react'
import Image from 'next/image'
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/utils'
import type { ShippingAddress } from '@/lib/types'

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore()
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [address, setAddress] = useState<ShippingAddress>({
    full_name: '', address: '', city: '', state: '', zip_code: '', country: 'Argentina', phone: '',
  })

  const [payment, setPayment] = useState({
    card_number: '', card_name: '', expiry: '', cvv: '',
  })

  if (items.length === 0) {
    router.replace('/cart')
    return null
  }

  const handleOrder = async () => {
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login?redirect=/checkout'); return }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            product_id: i.product.id,
            quantity: i.quantity,
            unit_price: i.product.price,
          })),
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-[#f1f0ff] mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Formulario */}
        <div className="flex-1 space-y-6">
          {/* Pasos */}
          <div className="flex gap-4 mb-6">
            {[
              { key: 'shipping', label: 'Envío', icon: <MapPin className="w-4 h-4" /> },
              { key: 'payment', label: 'Pago', icon: <CreditCard className="w-4 h-4" /> },
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => key === 'payment' && step === 'shipping' ? null : setStep(key as 'shipping' | 'payment')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  step === key
                    ? 'bg-[#a855f7] text-white shadow-[0_0_12px_rgba(168,85,247,0.35)]'
                    : 'bg-[#12121f] border border-[#1e1e35] text-[#64607a]'
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          {/* Paso 1: Envío */}
          {step === 'shipping' && (
            <div className="bg-[#12121f] border border-[#1e1e35] rounded-2xl p-6 space-y-4">
              <h2 className="font-bold text-[#f1f0ff] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#a855f7]" /> Dirección de envío
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input label="Nombre completo" value={address.full_name} onChange={(e) => setAddress({ ...address, full_name: e.target.value })} placeholder="Juan Pérez" />
                </div>
                <div className="sm:col-span-2">
                  <Input label="Dirección" value={address.address} onChange={(e) => setAddress({ ...address, address: e.target.value })} placeholder="Av. Corrientes 1234, Piso 3" />
                </div>
                <Input label="Ciudad" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="Buenos Aires" />
                <Input label="Provincia" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} placeholder="CABA" />
                <Input label="Código Postal" value={address.zip_code} onChange={(e) => setAddress({ ...address, zip_code: e.target.value })} placeholder="C1043" />
                <Input label="Teléfono" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} placeholder="+54 11 1234 5678" type="tel" />
              </div>
              <Button
                onClick={() => setStep('payment')}
                className="w-full mt-2"
                disabled={!address.full_name || !address.address || !address.city}
              >
                Continuar al pago →
              </Button>
            </div>
          )}

          {/* Paso 2: Pago */}
          {step === 'payment' && (
            <div className="bg-[#12121f] border border-[#1e1e35] rounded-2xl p-6 space-y-4">
              <h2 className="font-bold text-[#f1f0ff] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#a855f7]" /> Datos de pago (simulado)
              </h2>
              <div className="p-3 bg-[#facc15]/10 border border-[#facc15]/30 rounded-xl text-[#facc15] text-xs">
                💳 Este es un checkout <strong>simulado</strong>. No se realizará ningún cargo real.
              </div>
              <Input
                label="Número de tarjeta"
                value={payment.card_number}
                onChange={(e) => setPayment({ ...payment, card_number: e.target.value })}
                placeholder="4242 4242 4242 4242"
                maxLength={19}
              />
              <Input
                label="Nombre en la tarjeta"
                value={payment.card_name}
                onChange={(e) => setPayment({ ...payment, card_name: e.target.value })}
                placeholder="JUAN PEREZ"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Vencimiento" value={payment.expiry} onChange={(e) => setPayment({ ...payment, expiry: e.target.value })} placeholder="MM/AA" maxLength={5} />
                <Input label="CVV" value={payment.cvv} onChange={(e) => setPayment({ ...payment, cvv: e.target.value })} placeholder="123" maxLength={4} type="password" />
              </div>

              {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">{error}</p>}

              <Button onClick={handleOrder} loading={loading} className="w-full" icon={<Lock className="w-4 h-4" />}>
                {loading ? 'Procesando...' : `Confirmar pedido — ${formatPrice(total)}`}
              </Button>

              <button onClick={() => setStep('shipping')} className="w-full text-sm text-[#64607a] hover:text-[#a09dbd] transition-colors">
                ← Volver al envío
              </button>
            </div>
          )}
        </div>

        {/* Resumen del pedido */}
        <div className="lg:w-80">
          <div className="sticky top-24 bg-[#12121f] border border-[#1e1e35] rounded-2xl p-5 space-y-4">
            <h2 className="font-bold text-[#f1f0ff]">Tu pedido</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3">
                  <div className="relative w-12 h-12 bg-[#1a1a2e] rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={product.image_url || DEFAULT_PRODUCT_IMAGE} alt={product.name} fill className="object-contain p-1" sizes="48px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#f1f0ff] line-clamp-1">{product.name}</p>
                    <p className="text-xs text-[#64607a]">x{quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-[#a855f7] whitespace-nowrap">
                    {formatPrice(product.price * quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-[#1e1e35] pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-[#a09dbd]">
                <span>Subtotal</span><span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-[#4ade80]">
                <span>Envío</span><span>Gratis</span>
              </div>
              <div className="flex justify-between font-bold text-[#f1f0ff] text-base pt-1">
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
