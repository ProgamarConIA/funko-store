'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Check } from 'lucide-react'
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
    <Link href={`/product/${product.id}`} className="group block h-full">
      <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E4E4EC] shadow-card hover:shadow-card-lg hover:-translate-y-0.5 transition-all duration-200">

        {/* Imagen */}
        <div className="relative h-52 gradient-card-img overflow-hidden flex-shrink-0">
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            className="object-contain p-5 transition-transform duration-300 group-hover:scale-[1.06]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            onError={() => setImgError(true)}
          />

          {/* Badge destacado */}
          {product.is_featured && !outOfStock && (
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 bg-[#5856D6] text-white text-[10px] font-bold rounded-full tracking-wide shadow-sm">
                ★ DESTACADO
              </span>
            </div>
          )}

          {/* Sin stock */}
          {outOfStock && (
            <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] flex items-center justify-center">
              <span className="px-4 py-1.5 bg-white border border-[#E4E4EC] text-[#6B6B7B] text-xs font-semibold rounded-full shadow-sm">
                Sin stock
              </span>
            </div>
          )}

          {/* Franquicia pill */}
          <div className="absolute bottom-3 right-3">
            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[#6B6B7B] text-[10px] font-semibold rounded-full border border-[#E4E4EC]">
              {product.franchise}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-[#0F0F14] leading-tight line-clamp-2 group-hover:text-[#5856D6] transition-colors">
              {product.name}
            </h3>
            <p className="text-xs text-[#B0B0BE] mt-1">{product.character}</p>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-base font-bold text-[#0F0F14]">
                {formatPrice(product.price)}
              </p>
              {product.stock <= 5 && product.stock > 0 && (
                <p className="text-[10px] text-amber-600 font-medium mt-0.5">
                  ¡Solo {product.stock} restantes!
                </p>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                added
                  ? 'bg-green-50 text-green-600 border border-green-200'
                  : outOfStock
                  ? 'bg-[#F5F4FF] text-[#B0B0BE] cursor-not-allowed'
                  : 'bg-[#0F0F14] hover:bg-[#2A2A35] text-white shadow-sm'
              }`}
            >
              {added
                ? <><Check className="w-3.5 h-3.5" /> ¡Listo!</>
                : <><ShoppingCart className="w-3.5 h-3.5" /> Agregar</>
              }
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
