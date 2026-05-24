'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice, DEFAULT_PRODUCT_IMAGE } from '@/lib/utils'
import type { Product } from '@/lib/types'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCartStore()
  const [added, setAdded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
    setAdded(true)
    openCart()
    setTimeout(() => setAdded(false), 1500)
  }

  const outOfStock = product.stock === 0
  const imgSrc = imgError ? DEFAULT_PRODUCT_IMAGE : (product.image_url || DEFAULT_PRODUCT_IMAGE)

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden border border-[#E5E5EA] transition-all duration-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:-translate-y-0.5">

        {/* Imagen */}
        <div className="relative h-52 bg-[#F5F5F7] overflow-hidden">
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            onError={() => setImgError(true)}
          />

          {/* Badge destacado */}
          {product.is_featured && (
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 bg-[#1D1D1F] text-white text-[10px] font-semibold rounded-full tracking-wide">
                DESTACADO
              </span>
            </div>
          )}

          {/* Sin stock overlay */}
          {outOfStock && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="px-4 py-1.5 bg-white border border-[#E5E5EA] text-[#6E6E73] text-xs font-semibold rounded-full shadow-sm">
                Sin stock
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-[#AEAEB2] mb-1 font-medium uppercase tracking-wide">{product.franchise}</p>
          <h3 className="text-sm font-semibold text-[#1D1D1F] leading-tight line-clamp-2 mb-3 group-hover:text-[#3D3D3F] transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-base font-bold text-[#1D1D1F]">
                {formatPrice(product.price)}
              </span>
              {product.stock <= 5 && product.stock > 0 && (
                <p className="text-[10px] text-amber-600 font-medium mt-0.5">
                  Solo {product.stock} restantes
                </p>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                added
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : outOfStock
                  ? 'bg-[#F5F5F7] text-[#AEAEB2] cursor-not-allowed'
                  : 'bg-[#1D1D1F] hover:bg-[#3D3D3F] text-white'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {added ? '¡Listo!' : 'Agregar'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
