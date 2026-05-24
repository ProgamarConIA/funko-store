'use client'

import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/utils'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore()

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in-up"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#0f0f1a] border-l border-[#1e1e35] z-50 flex flex-col transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e35]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#a855f7]" />
            <h2 className="font-bold text-lg text-[#f1f0ff]">Mi carrito</h2>
            {items.length > 0 && (
              <span className="bg-[#a855f7] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-lg text-[#64607a] hover:text-[#f1f0ff] hover:bg-[#1a1a2e] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-16 h-16 bg-[#1a1a2e] rounded-full flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-[#64607a]" />
              </div>
              <div>
                <p className="text-[#a09dbd] font-medium">Tu carrito está vacío</p>
                <p className="text-[#64607a] text-sm mt-1">¡Agrega algunos Funko Pops!</p>
              </div>
              <button
                onClick={closeCart}
                className="mt-2 px-6 py-2 bg-[#a855f7] text-white text-sm font-semibold rounded-lg hover:bg-[#9333ea] transition-all shadow-[0_0_12px_rgba(168,85,247,0.35)]"
              >
                Ver catálogo
              </button>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex gap-3 p-3 bg-[#12121f] rounded-xl border border-[#1e1e35] hover:border-[#a855f7]/30 transition-all"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#1a1a2e] flex-shrink-0">
                  <Image
                    src={product.image_url || DEFAULT_PRODUCT_IMAGE}
                    alt={product.name}
                    fill
                    className="object-contain p-1"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#f1f0ff] truncate">{product.name}</p>
                  <p className="text-xs text-[#64607a] mt-0.5">{product.franchise}</p>
                  <p className="text-sm font-bold text-[#a855f7] mt-1">
                    {formatPrice(product.price * quantity)}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-[#64607a] hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2 bg-[#1a1a2e] rounded-lg px-2 py-1">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="text-[#64607a] hover:text-[#f1f0ff] transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-bold text-[#f1f0ff] w-4 text-center">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="text-[#64607a] hover:text-[#f1f0ff] transition-colors disabled:opacity-30"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer con total y botones */}
        {items.length > 0 && (
          <div className="px-6 py-4 border-t border-[#1e1e35] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[#a09dbd] text-sm">Total</span>
              <span className="text-xl font-bold text-[#f1f0ff]">{formatPrice(totalPrice())}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full text-center py-3 bg-[#a855f7] hover:bg-[#9333ea] text-white font-bold rounded-xl shadow-[0_0_16px_rgba(168,85,247,0.4)] hover:shadow-[0_0_24px_rgba(168,85,247,0.6)] transition-all"
            >
              Ir al checkout →
            </Link>
            <button
              onClick={clearCart}
              className="w-full py-2 text-sm text-[#64607a] hover:text-red-400 transition-colors"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
