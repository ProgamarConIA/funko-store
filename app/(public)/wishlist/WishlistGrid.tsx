'use client'

import { useWishlistStore } from '@/store/wishlistStore'
import ProductCard from '@/components/products/ProductCard'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import type { Product } from '@/lib/types'

export default function WishlistGrid({ initialProducts }: { initialProducts: Product[] }) {
  const has         = useWishlistStore((s) => s.has)
  const initializing = useWishlistStore((s) => s.initializing)

  // While store is loading, show all initial products (avoid flash of empty state)
  const products = initializing
    ? initialProducts
    : initialProducts.filter((p) => has(p.id))

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mb-5">
          <Heart className="w-10 h-10 text-red-300" />
        </div>
        <h2 className="text-xl font-bold text-[#0F0F14] mb-2">Todavía no tenés favoritos</h2>
        <p className="text-[#6B6B7B] mb-6 max-w-xs">
          Guardá los Funkos que te gusten para encontrarlos fácilmente después.
        </p>
        <Link
          href="/"
          className="px-8 py-3 bg-[#5856D6] hover:bg-[#4644b8] text-white font-bold rounded-xl shadow-sm transition-all"
        >
          Explorar catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
