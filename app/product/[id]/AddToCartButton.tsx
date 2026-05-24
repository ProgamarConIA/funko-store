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
      {/* Selector cantidad */}
      <div className="flex items-center gap-3 bg-[#F5F4FF] border border-[#E4E4EC] rounded-xl px-4 py-3">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
          className="text-[#6B6B7B] hover:text-[#0F0F14] disabled:opacity-30 transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center font-bold text-[#0F0F14] text-lg">{quantity}</span>
        <button
          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
          disabled={quantity >= product.stock || outOfStock}
          className="text-[#6B6B7B] hover:text-[#0F0F14] disabled:opacity-30 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Botón */}
      <button
        onClick={handleAdd}
        disabled={outOfStock}
        className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-base transition-all ${
          added
            ? 'bg-green-50 border border-green-200 text-green-600'
            : outOfStock
            ? 'bg-[#F5F4FF] text-[#B0B0BE] cursor-not-allowed border border-[#E4E4EC]'
            : 'bg-[#0F0F14] hover:bg-[#2A2A35] text-white shadow-sm'
        }`}
      >
        {added
          ? <><Check className="w-5 h-5" /> ¡Agregado!</>
          : <><ShoppingCart className="w-5 h-5" /> {outOfStock ? 'Sin stock' : 'Agregar al carrito'}</>
        }
      </button>
    </div>
  )
}
