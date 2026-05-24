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
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white border-l border-[#E5E5EA] z-50 flex flex-col transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E5EA]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#1D1D1F]" />
            <h2 className="font-semibold text-[#1D1D1F]">Mi carrito</h2>
            {items.length > 0 && (
              <span className="bg-[#1D1D1F] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-full text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center pb-16">
              <div className="w-16 h-16 bg-[#F5F5F7] rounded-full flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-[#AEAEB2]" />
              </div>
              <div>
                <p className="text-[#1D1D1F] font-semibold">Tu carrito está vacío</p>
                <p className="text-[#6E6E73] text-sm mt-1">¡Agrega algunos Funko Pops!</p>
              </div>
              <button
                onClick={closeCart}
                className="mt-1 px-6 py-2.5 bg-[#1D1D1F] hover:bg-[#3D3D3F] text-white text-sm font-medium rounded-full transition-colors"
              >
                Ver catálogo
              </button>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex gap-3 p-3 bg-[#F5F5F7] rounded-2xl"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-[#E5E5EA]">
                  <Image
                    src={imgErrors[product.id] ? DEFAULT_PRODUCT_IMAGE : (product.image_url || DEFAULT_PRODUCT_IMAGE)}
                    alt={product.name}
                    fill
                    className="object-contain p-1"
                    sizes="64px"
                    onError={() => setImgErrors(prev => ({ ...prev, [product.id]: true }))}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1D1D1F] truncate">{product.name}</p>
                  <p className="text-xs text-[#6E6E73] mt-0.5">{product.franchise}</p>
                  <p className="text-sm font-bold text-[#1D1D1F] mt-1">
                    {formatPrice(product.price * quantity)}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-[#AEAEB2] hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2 bg-white rounded-xl px-2 py-1 border border-[#E5E5EA]">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-semibold text-[#1D1D1F] w-4 text-center">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="text-[#6E6E73] hover:text-[#1D1D1F] transition-colors disabled:opacity-30"
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
          <div className="px-6 py-5 border-t border-[#E5E5EA] space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-[#6E6E73] text-sm">Total</span>
              <span className="text-xl font-bold text-[#1D1D1F]">{formatPrice(totalPrice())}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full text-center py-3 bg-[#1D1D1F] hover:bg-[#3D3D3F] text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Ir al checkout →
            </Link>
            <button
              onClick={clearCart}
              className="w-full py-2 text-xs text-[#AEAEB2] hover:text-red-500 transition-colors"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
