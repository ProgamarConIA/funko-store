'use client'

import { useCartStore } from '@/store/cartStore'
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/utils'
import PriceDisplay from '@/components/ui/PriceDisplay'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center px-4">
        <div className="w-24 h-24 bg-[#12121f] border border-[#1e1e35] rounded-full flex items-center justify-center">
          <ShoppingBag className="w-12 h-12 text-[#64607a]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#f1f0ff] mb-2">Tu carrito está vacío</h2>
          <p className="text-[#64607a]">¡Agrega algunos Funko Pops increíbles!</p>
        </div>
        <Link
          href="/"
          className="px-8 py-3 bg-[#a855f7] hover:bg-[#9333ea] text-white font-bold rounded-xl shadow-[0_0_16px_rgba(168,85,247,0.4)] transition-all"
        >
          Ver catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-[#f1f0ff] mb-8">
        Mi carrito <span className="text-neon">({items.length})</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Lista de items */}
        <div className="flex-1 space-y-4">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex gap-4 p-4 bg-[#12121f] border border-[#1e1e35] rounded-2xl hover:border-[#a855f7]/30 transition-all"
            >
              <Link href={`/product/${product.id}`} className="relative w-24 h-24 bg-[#1a1a2e] rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src={product.image_url || DEFAULT_PRODUCT_IMAGE}
                  alt={product.name}
                  fill
                  className="object-contain p-2"
                  sizes="96px"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/product/${product.id}`}>
                  <h3 className="font-bold text-[#f1f0ff] hover:text-[#c084fc] transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-xs text-[#64607a] mt-0.5">{product.franchise} · {product.character}</p>
                <PriceDisplay priceEUR={product.price} className="text-lg font-bold text-[#a855f7] mt-2" />
              </div>

              <div className="flex flex-col items-end justify-between">
                <button onClick={() => removeItem(product.id)} className="text-[#64607a] hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>

                <div>
                  <PriceDisplay
                    priceEUR={product.price * quantity}
                    className="text-sm font-bold text-[#f1f0ff] text-right mb-2"
                  />
                  <div className="flex items-center gap-2 bg-[#1a1a2e] rounded-lg px-3 py-1.5">
                    <button onClick={() => updateQuantity(product.id, quantity - 1)} className="text-[#64607a] hover:text-[#f1f0ff] transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-bold text-[#f1f0ff] text-sm">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="text-[#64607a] hover:text-[#f1f0ff] disabled:opacity-30 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-300 transition-colors">
            Vaciar carrito
          </button>
        </div>

        {/* Resumen */}
        <div className="lg:w-80">
          <div className="sticky top-24 bg-[#12121f] border border-[#1e1e35] rounded-2xl p-6 space-y-4">
            <h2 className="font-bold text-[#f1f0ff] text-lg">Resumen del pedido</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-[#a09dbd]">
                <span>Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} items)</span>
                <PriceDisplay priceEUR={totalPrice()} />
              </div>
              <div className="flex justify-between text-[#a09dbd]">
                <span>Envío</span>
                <span className="text-[#4ade80]">Gratis</span>
              </div>
              <div className="border-t border-[#1e1e35] pt-3 flex justify-between font-bold text-[#f1f0ff] text-base">
                <span>Total</span>
                <PriceDisplay priceEUR={totalPrice()} />
              </div>
            </div>

            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#a855f7] hover:bg-[#9333ea] text-white font-bold rounded-xl shadow-[0_0_16px_rgba(168,85,247,0.4)] hover:shadow-[0_0_24px_rgba(168,85,247,0.6)] transition-all"
            >
              Continuar al pago <ArrowRight className="w-4 h-4" />
            </Link>

            <Link href="/" className="block text-center text-sm text-[#64607a] hover:text-[#a09dbd] transition-colors">
              ← Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
