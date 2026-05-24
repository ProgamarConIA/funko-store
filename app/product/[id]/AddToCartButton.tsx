'use client'

import { useState } from 'react'
import { ShoppingCart, Check, Minus, Plus } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/lib/types'

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem, openCart } = useCartStore()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const outOfStock = product.stock === 0

  const handleAdd = () => {
    addItem(product, quantity)
    setAdded(true)
    openCart()
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Selector de cantidad */}
      <div className="flex items-center gap-3 bg-[#12121f] border border-[#1e1e35] rounded-xl px-4 py-3">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
          className="text-[#64607a] hover:text-[#f1f0ff] disabled:opacity-30 transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center font-bold text-[#f1f0ff] text-lg">{quantity}</span>
        <button
          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
          disabled={quantity >= product.stock || outOfStock}
          className="text-[#64607a] hover:text-[#f1f0ff] disabled:opacity-30 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Botón agregar */}
      <button
        onClick={handleAdd}
        disabled={outOfStock}
        className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-base transition-all ${
          added
            ? 'bg-[#4ade80]/20 border border-[#4ade80]/40 text-[#4ade80]'
            : outOfStock
            ? 'bg-[#1a1a2e] text-[#64607a] cursor-not-allowed border border-[#1e1e35]'
            : 'bg-[#a855f7] hover:bg-[#9333ea] text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]'
        }`}
      >
        {added ? (
          <><Check className="w-5 h-5" /> ¡Agregado al carrito!</>
        ) : (
          <><ShoppingCart className="w-5 h-5" /> {outOfStock ? 'Sin stock' : 'Agregar al carrito'}</>
        )}
      </button>
    </div>
  )
}
