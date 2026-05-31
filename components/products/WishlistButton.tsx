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

  // Subscribe to primitives so Zustand detects changes correctly
  const isWished    = useWishlistStore((s) => s.ids.includes(productId))
  const isToggling  = useWishlistStore((s) => s.toggling.includes(productId))
  const toggle      = useWishlistStore((s) => s.toggle)

  const [animKey,  setAnimKey]  = useState(0)
  const [errShake, setErrShake] = useState(false)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Per-product lock: if THIS product is already toggling, ignore extra clicks
    if (isToggling) return

    setAnimKey((k) => k + 1)

    const result = await toggle(productId)

    if (result === 'auth_required') {
      router.push('/auth/login?redirect=/wishlist')
    } else if (result === 'error') {
      setErrShake(true)
      setTimeout(() => setErrShake(false), 500)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isToggling}
      aria-label={isWished ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      className={[
        'flex items-center justify-center rounded-full w-8 h-8',
        'transition-all duration-200',
        isWished
          ? 'bg-red-500 shadow-md shadow-red-500/30'
          : 'bg-white/70 backdrop-blur-sm shadow-sm',
        errShake ? 'animate-shake' : '',
        isToggling ? 'opacity-70 cursor-wait' : '',
        className,
      ].join(' ')}
    >
      {isToggling ? (
        /* Spinner while this specific product is being saved */
        <div className={`w-3.5 h-3.5 border-2 border-t-transparent rounded-full animate-spin ${
          isWished ? 'border-white' : 'border-[#9090aa]'
        }`} />
      ) : (
        <Heart
          key={animKey}
          className={[
            'w-4 h-4',
            isWished ? 'fill-white stroke-white' : 'stroke-[#9090aa]',
            animKey > 0 ? 'animate-heart-pop' : '',
          ].join(' ')}
        />
      )}
    </button>
  )
}
