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

  const isWished = useWishlistStore((s) => s.ids.includes(productId))
  const toggle   = useWishlistStore((s) => s.toggle)
  const loading  = useWishlistStore((s) => s.loading)

  const [animKey,  setAnimKey]  = useState(0)
  const [errShake, setErrShake] = useState(false)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (loading) return

    setAnimKey((k) => k + 1)

    const result = await toggle(productId)

    if (result === 'auth_required') {
      router.push('/auth/login?redirect=/wishlist')
    } else if (result === 'error') {
      // Brief shake to signal the save failed
      setErrShake(true)
      setTimeout(() => setErrShake(false), 500)
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
        // Always visible — not hidden behind opacity-0
        isWished
          ? 'bg-red-500 shadow-md shadow-red-500/30 scale-100'
          : 'bg-white/70 backdrop-blur-sm shadow-sm',
        errShake ? 'animate-shake' : '',
        className,
      ].join(' ')}
    >
      <Heart
        key={animKey}
        className={[
          'w-4 h-4',
          isWished ? 'fill-white stroke-white' : 'stroke-[#9090aa]',
          animKey > 0 ? 'animate-heart-pop' : '',
        ].join(' ')}
      />
    </button>
  )
}
