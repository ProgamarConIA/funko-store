'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Check } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/utils'
import PriceDisplay from '@/components/ui/PriceDisplay'
import type { Product } from '@/lib/types'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore()
  const [added, setAdded]       = useState(false)
  const [imgError, setImgError] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const outOfStock = product.stock === 0
  const imgSrc = imgError ? DEFAULT_PRODUCT_IMAGE : (product.image_url || DEFAULT_PRODUCT_IMAGE)

  return (
    <Link
      href={`/product/${product.id}`}
      className="group relative block h-full hover:z-10 transition-transform duration-300 ease-out hover:scale-[1.03]"
    >
      <div
        className={[
          'h-full flex flex-col rounded-2xl overflow-hidden border shadow-card',
          'group-hover:shadow-card-lg transition-all duration-300',
          /* light */
          'bg-white border-[#E0DFFF]',
          /* dark */
          'dark:bg-[#13131f] dark:border-[#1e1e35]',
        ].join(' ')}
      >

        {/* ── Imagen ───────────────────────────────────────────── */}
        <div
          className={[
            'relative h-52 overflow-hidden flex-shrink-0',
            'gradient-card-img dark:bg-[#0e0e1c]',
          ].join(' ')}
        >
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            className="object-contain p-5 transition-transform duration-300 group-hover:scale-[1.06] product-img-shadow"
            sizes="(max-width: 480px) 100vw, (max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            quality={100}
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
            <div className="absolute inset-0 bg-white/80 dark:bg-[#0e0e1c]/80 flex items-center justify-center">
              <span className="px-4 py-1.5 bg-white dark:bg-[#13131f] border border-[#E4E4EC] dark:border-[#1e1e35] text-[#6B6B7B] dark:text-[#6060a0] text-xs font-semibold rounded-full shadow-sm">
                Sin stock
              </span>
            </div>
          )}

          {/* Franquicia pill */}
          <div className="absolute bottom-3 right-3">
            <span className="px-2.5 py-1 bg-white/90 dark:bg-[#1a1a2e]/90 text-[#6B6B7B] dark:text-[#8888aa] text-[10px] font-semibold rounded-full border border-[#E4E4EC] dark:border-[#2a2a40]">
              {product.franchise}
            </span>
          </div>
        </div>

        {/* ── Info ─────────────────────────────────────────────── */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          <div className="flex-1">
            <h3 className="text-sm font-semibold leading-tight line-clamp-2 transition-colors text-[#0F0F14] dark:text-[#f1f0ff] group-hover:text-[#5856D6] dark:group-hover:text-[#a88dff]">
              {product.name}
            </h3>
            <p className="text-xs mt-1 text-[#B0B0BE] dark:text-[#5a5a80]">
              {product.character}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div>
              <PriceDisplay
                priceEUR={product.price}
                className="text-base font-bold text-[#0F0F14] dark:text-[#f1f0ff]"
              />
              {product.stock <= 5 && product.stock > 0 && (
                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                  ¡Solo {product.stock} restantes!
                </p>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                added
                  ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-700'
                  : outOfStock
                  ? 'bg-[#F5F4FF] dark:bg-[#1a1a2e] text-[#B0B0BE] dark:text-[#4a4a6a] cursor-not-allowed'
                  : 'bg-[#5856D6] dark:bg-[#5856D6] hover:bg-[#4644b8] dark:hover:bg-[#4644b8] text-white shadow-sm'
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
