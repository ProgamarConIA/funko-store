'use client'

import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/utils'
import { useState } from 'react'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore()
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-[#0F0F14]/30 z-40" onClick={closeCart} />
      )}

      <aside className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 flex flex-col transform transition-transform duration-300 shadow-drawer ${
        isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
      }`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E4E4EC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#F5F4FF] rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-[#5856D6]" />
            </div>
            <h2 className="font-semibold text-[#0F0F14]">Mi carrito</h2>
            {items.length > 0 && (
              <span className="bg-[#5856D6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            )}
          </div>
          <button onClick={closeCart} className="p-2 rounded-xl text-[#6B6B7B] hover:text-[#0F0F14] hover:bg-[#F5F4FF] transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center pb-16">
              <div className="w-16 h-16 bg-[#F5F4FF] rounded-2xl flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-[#5856D6]/40" />
              </div>
              <div>
                <p className="text-[#0F0F14] font-semibold">Tu carrito está vacío</p>
                <p className="text-[#6B6B7B] text-sm mt-1">Explorá nuestra colección</p>
              </div>
              <button onClick={closeCart} className="mt-1 px-6 py-2.5 bg-[#0F0F14] hover:bg-[#2A2A35] text-white text-sm font-medium rounded-xl transition-colors">
                Ver catálogo
              </button>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-3 p-3 bg-[#F9F8FF] rounded-2xl border border-[#EDEDF5]">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-[#E4E4EC]">
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
                  <p className="text-sm font-semibold text-[#0F0F14] truncate">{product.name}</p>
                  <p className="text-xs text-[#6B6B7B] mt-0.5">{product.franchise}</p>
                  <p className="text-sm font-bold text-[#5856D6] mt-1">
                    {formatPrice(product.price * quantity)}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeItem(product.id)} className="text-[#B0B0BE] hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center gap-2 bg-white rounded-xl px-2 py-1.5 border border-[#E4E4EC]">
                    <button onClick={() => updateQuantity(product.id, quantity - 1)} className="text-[#6B6B7B] hover:text-[#0F0F14] transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-bold text-[#0F0F14] w-4 text-center">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="text-[#6B6B7B] hover:text-[#0F0F14] transition-colors disabled:opacity-30"
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
          <div className="px-6 py-5 border-t border-[#E4E4EC] space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-[#6B6B7B] text-sm">Total</span>
              <span className="text-xl font-bold text-[#0F0F14]">{formatPrice(totalPrice())}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full text-center py-3.5 bg-[#0F0F14] hover:bg-[#2A2A35] text-white font-semibold rounded-xl transition-colors text-sm shadow-sm"
            >
              Confirmar pedido →
            </Link>
            <button onClick={clearCart} className="w-full py-1.5 text-xs text-[#B0B0BE] hover:text-red-500 transition-colors">
              Vaciar carrito
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
