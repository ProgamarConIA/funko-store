'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlistStore'
import { useRouter } from 'next/navigation'

interface Props {
  productId: string
  className?: string
}

export default function WishlistButton({ productId, className = '' }: Props) {
  const router = useRouter()

  // Subscribe directly to a primitive — Zustand detects the change correctly
  const isWished = useWishlistStore((s) => s.ids.includes(productId))
  const toggle   = useWishlistStore((s) => s.toggle)
  const loading  = useWishlistStore((s) => s.loading)

  // Key trick: remount the icon to re-trigger the CSS animation on every click
  const [animKey, setAnimKey] = useState(0)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setAnimKey((k) => k + 1)          // re-trigger animation

    const result = await toggle(productId)
    if (result === 'auth_required') {
      router.push('/auth/login?redirect=/wishlist')
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      aria-label={isWished ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      className={[
        'flex items-center justify-center rounded-full w-8 h-8',
        'transition-colors duration-200',
        isWished
          ? 'bg-red-500 shadow-md shadow-red-500/30'
          : 'bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100',
        className,
      ].join(' ')}
    >
      {/* key remount re-fires the CSS animation on every click */}
      <Heart
        key={animKey}
        className={[
          'w-4 h-4',
          isWished ? 'fill-white stroke-white' : 'stroke-[#6B6B7B]',
          animKey > 0 ? 'animate-heart-pop' : '',
        ].join(' ')}
      />
    </button>
  )
}
