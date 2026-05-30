'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlistStore'
import { useRouter } from 'next/navigation'

interface Props {
  productId: string
  /** Extra Tailwind classes for custom positioning in parent */
  className?: string
}

export default function WishlistButton({ productId, className = '' }: Props) {
  const router  = useRouter()
  const has     = useWishlistStore((s) => s.has)
  const toggle  = useWishlistStore((s) => s.toggle)
  const loading = useWishlistStore((s) => s.loading)

  const [popping, setPopping] = useState(false)

  const isWished = has(productId)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setPopping(true)
    setTimeout(() => setPopping(false), 300)

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
        'transition-all duration-200',
        isWished
          ? 'bg-red-500 shadow-md shadow-red-500/30'
          : 'bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100',
        popping ? 'scale-125' : 'scale-100',
        className,
      ].join(' ')}
    >
      <Heart
        className={[
          'w-4 h-4 transition-all duration-200',
          isWished
            ? 'fill-white stroke-white'
            : 'stroke-[#6B6B7B]',
        ].join(' ')}
      />
    </button>
  )
}
