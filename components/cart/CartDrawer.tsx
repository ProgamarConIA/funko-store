'use client'

import { useCartStore } from '@/store/cartStore'
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/utils'
import { useState } from 'react'
import PriceDisplay from '@/components/ui/PriceDisplay'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore()
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-[#0F0F14]/30 z-40" onClick={closeCart} />
      )}

      <aside className={`fixed top-0 right-0 h-full w-full sm:w-[400px] z-50 flex flex-col transform transition-transform duration-300 shadow-drawer
        bg-white dark:bg-[#0e0e16]
        ${isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'}
      `}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E4E4EC] dark:border-[#1e1e35]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#F5F4FF] dark:bg-[#1a1a2e] rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-[#5856D6] dark:text-[#a88dff]" />
            </div>
            <h2 className="font-semibold text-[#0F0F14] dark:text-[#f1f0ff]">Mi carrito</h2>
            {items.length > 0 && (
              <span className="bg-[#5856D6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            )}
          </div>
          <button onClick={closeCart} className="p-2 rounded-xl text-[#6B6B7B] dark:text-[#9090aa] hover:text-[#0F0F14] dark:hover:text-[#f1f0ff] hover:bg-[#F5F4FF] dark:hover:bg-[#1e1e35] transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center pb-16">
              <div className="w-16 h-16 bg-[#F5F4FF] dark:bg-[#1a1a2e] rounded-2xl flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-[#5856D6]/40 dark:text-[#a88dff]/40" />
              </div>
              <div>
                <p className="text-[#0F0F14] dark:text-[#f1f0ff] font-semibold">Tu carrito está vacío</p>
                <p className="text-[#6B6B7B] dark:text-[#9090aa] text-sm mt-1">Explorá nuestra colección</p>
              </div>
              <button onClick={closeCart} className="mt-1 px-6 py-2.5 bg-[#0F0F14] dark:bg-[#5856D6] hover:bg-[#2A2A35] dark:hover:bg-[#4644b8] text-white text-sm font-medium rounded-xl transition-colors">
                Ver catálogo
              </button>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-3 p-3 bg-[#F9F8FF] dark:bg-[#13131f] rounded-2xl border border-[#EDEDF5] dark:border-[#1e1e35]">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white dark:bg-[#1a1a2e] flex-shrink-0 border border-[#E4E4EC] dark:border-[#2a2a40]">
                  <Image
                    src={imgErrors[product.id] ? DEFAULT_PRODUCT_IMAGE : (product.image_url || DEFAULT_PRODUCT_IMAGE)}
                    alt={product.name}
                    fill
                    className="object-contain p-1.5"
                    sizes="64px"
                    onError={() => setImgErrors(prev => ({ ...prev, [product.id]: true }))}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0F0F14] dark:text-[#f1f0ff] truncate">{product.name}</p>
                  <p className="text-xs text-[#6B6B7B] dark:text-[#6060a0] mt-0.5">{product.franchise}</p>
                  <PriceDisplay
                    priceEUR={product.price * quantity}
                    className="text-sm font-bold text-[#5856D6] dark:text-[#a88dff] mt-1"
                  />
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeItem(product.id)} className="text-[#B0B0BE] dark:text-[#4a4a6a] hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center gap-2 bg-white dark:bg-[#1a1a2e] rounded-xl px-2 py-1.5 border border-[#E4E4EC] dark:border-[#2a2a40]">
                    <button onClick={() => updateQuantity(product.id, quantity - 1)} className="text-[#6B6B7B] dark:text-[#9090aa] hover:text-[#0F0F14] dark:hover:text-[#f1f0ff] transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-bold text-[#0F0F14] dark:text-[#f1f0ff] w-4 text-center">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="text-[#6B6B7B] dark:text-[#9090aa] hover:text-[#0F0F14] dark:hover:text-[#f1f0ff] transition-colors disabled:opacity-30"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-[#E4E4EC] dark:border-[#1e1e35] space-y-3 bg-white dark:bg-[#0e0e16]">
            <div className="flex items-center justify-between">
              <span className="text-[#6B6B7B] dark:text-[#9090aa] text-sm">Total</span>
              <PriceDisplay
                priceEUR={totalPrice()}
                className="text-xl font-bold text-[#0F0F14] dark:text-[#f1f0ff]"
              />
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full text-center py-3.5 bg-[#0F0F14] dark:bg-[#5856D6] hover:bg-[#2A2A35] dark:hover:bg-[#4644b8] text-white font-semibold rounded-xl transition-colors text-sm shadow-sm"
            >
              Confirmar pedido →
            </Link>
            <button onClick={clearCart} className="w-full py-1.5 text-xs text-[#B0B0BE] dark:text-[#4a4a6a] hover:text-red-500 transition-colors">
              Vaciar carrito
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
