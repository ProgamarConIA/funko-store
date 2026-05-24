'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Star, Package } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice, DEFAULT_PRODUCT_IMAGE } from '@/lib/utils'
import type { Product } from '@/lib/types'
import { useState } from 'react'
import Badge from '@/components/ui/Badge'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCartStore()
  const [added, setAdded] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
    setAdded(true)
    openCart()
    setTimeout(() => setAdded(false), 1500)
  }

  const outOfStock = product.stock === 0

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative bg-[#12121f] border border-[#1e1e35] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#a855f7]/50 hover:shadow-[0_8px_32px_rgba(168,85,247,0.15)] hover:-translate-y-1">

        {/* Imagen */}
        <div className="relative h-52 bg-gradient-to-b from-[#1a1a2e] to-[#12121f] overflow-hidden">
          <Image
            src={product.image_url || DEFAULT_PRODUCT_IMAGE}
            alt={product.name}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Badge destacado */}
          {product.is_featured && (
            <div className="absolute top-3 left-3">
              <span className="flex items-center gap-1 px-2 py-1 bg-[#facc15]/15 border border-[#facc15]/30 text-[#facc15] text-xs font-bold rounded-full">
                <Star className="w-3 h-3 fill-current" /> Destacado
              </span>
            </div>
          )}

          {/* Badge sin stock */}
          {outOfStock && (
            <div className="absolute inset-0 bg-[#08080f]/70 flex items-center justify-center">
              <span className="px-4 py-2 bg-[#1a1a2e] border border-[#1e1e35] text-[#64607a] text-sm font-semibold rounded-full">
                Sin stock
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#64607a] mb-1">{product.franchise}</p>
              <h3 className="text-sm font-bold text-[#f1f0ff] leading-tight line-clamp-2 group-hover:text-[#c084fc] transition-colors">
                {product.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Badge variant="purple">{product.character}</Badge>
            {product.category !== 'Standard' && (
              <Badge variant="cyan">{product.category}</Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-[#f1f0ff]">
                {formatPrice(product.price)}
              </span>
              {product.stock <= 5 && product.stock > 0 && (
                <p className="text-xs text-[#facc15] flex items-center gap-1 mt-0.5">
                  <Package className="w-3 h-3" /> Solo {product.stock} restantes
                </p>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                added
                  ? 'bg-[#4ade80]/20 border border-[#4ade80]/40 text-[#4ade80]'
                  : outOfStock
                  ? 'bg-[#1a1a2e] text-[#64607a] cursor-not-allowed'
                  : 'bg-[#a855f7] hover:bg-[#9333ea] text-white shadow-[0_0_10px_rgba(168,85,247,0.3)] hover:shadow-[0_0_16px_rgba(168,85,247,0.5)]'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {added ? '¡Listo!' : 'Agregar'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
