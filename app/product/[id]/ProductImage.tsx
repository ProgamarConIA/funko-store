'use client'

import Image from 'next/image'
import { useState } from 'react'
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/utils'

export default function ProductImage({
  src,
  alt,
}: {
  src: string | null
  alt: string
}) {
  const [imgSrc, setImgSrc] = useState(src || DEFAULT_PRODUCT_IMAGE)

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className="object-contain p-10"
      sizes="(max-width: 1024px) 100vw, 50vw"
      priority
      onError={() => setImgSrc(DEFAULT_PRODUCT_IMAGE)}
    />
  )
}
