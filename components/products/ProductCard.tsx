'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Check } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/utils'
import PriceDisplay from '@/components/ui/PriceDisplay'
import type { Product } from '@/lib/types'
import { useState } from 'react'

interface ProductCardProps { product: Product }

/* Glow radial por franquicia — se usa en la imagen y en el shimmer de la card */
const FRANCHISE_GLOW: Record<string, string> = {
  'Marvel':       'rgba(232,41,60,.22)',
  'DC':           'rgba(30,144,255,.22)',
  'Disney':       'rgba(255,215,0,.22)',
  'Anime':        'rgba(255,107,107,.22)',
  'Star Wars':    'rgba(65,105,225,.22)',
  'Harry Potter': 'rgba(197,160,40,.22)',
  'Juegos':       'rgba(0,230,118,.20)',
}

function getGlow(franchise: string) {
  return FRANCHISE_GLOW[franchise] ?? 'rgba(88,86,214,.20)'
}

/* Badges de estado — prioridad de arriba a abajo */
function getBadge(product: Product): { label: string; style: React.CSSProperties } | null {
  if (product.stock === 0) return null

  const ageDays = (Date.now() - new Date(product.created_at).getTime()) / 86_400_000

  if (product.category === 'Chase')
    return { label: '🔮 CHASE', style: { background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff' } }
  if (product.is_featured)
    return { label: '★ DESTACADO', style: { background: 'linear-gradient(135deg,#5856D6,#7c3aed)', color: '#fff' } }
  if (ageDays <= 14)
    return { label: '✦ NUEVO', style: { background: 'linear-gradient(135deg,#a8ff78,#78ffd6)', color: '#0a0a14' } }
  if (product.stock <= 3)
    return { label: '⚡ ÚLTIMOS', style: { background: 'linear-gradient(135deg,#f59e0b,#ef4444)', color: '#fff' } }
  if (product.category === 'Deluxe')
    return { label: '◆ DELUXE', style: { background: 'linear-gradient(135deg,#FFD700,#FFA040)', color: '#0a0a14' } }

  return null
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

  const outOfStock      = product.stock === 0
  const imgSrc          = imgError ? DEFAULT_PRODUCT_IMAGE : (product.image_url || DEFAULT_PRODUCT_IMAGE)
  const glow            = getGlow(product.franchise)
  const badge           = getBadge(product)
  const showLowStock    = !outOfStock && product.stock <= 5 && !badge?.label.includes('ÚLTIMOS')

  return (
    <Link
      href={`/product/${product.id}`}
      className="group relative block h-full hover:z-10"
    >
      <div className={[
        'relative h-full flex flex-col rounded-2xl overflow-hidden border',
        'transition-all duration-300 ease-out',
        'group-hover:-translate-y-1 group-hover:scale-[1.02]',
        /* Light */
        'bg-white border-[#E0DFFF] shadow-card',
        'group-hover:border-[#5856D6]/30 group-hover:shadow-card-hover',
        /* Dark */
        'dark:bg-[#12121f] dark:border-[#1e1e35]',
        'dark:group-hover:border-[#5856D6]/45',
      ].join(' ')}>

        {/* ── Top shimmer — franchise glow at card top on hover ──────────── */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-32 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 100% 80% at 50% 0%, ${glow} 0%, transparent 80%)` }}
        />

        {/* ── Image ────────────────────────────────────────────────────────── */}
        <div className="relative h-52 overflow-hidden flex-shrink-0 gradient-card-img dark:bg-[#0e0e1c]">

          {/* Franchise glow under product feet */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-28 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: `radial-gradient(ellipse 80% 100% at 50% 100%, ${glow} 0%, transparent 70%)` }}
          />

          <Image
            src={imgSrc}
            alt={product.name}
            fill
            className="z-10 object-contain p-5 transition-transform duration-300 group-hover:scale-[1.08] product-img-shadow"
            sizes="(max-width: 480px) 100vw, (max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            quality={90}
            onError={() => setImgError(true)}
          />

          {/* Badge */}
          {badge && (
            <div className="absolute top-2.5 left-2.5 z-20">
              <span
                className="px-2.5 py-1 text-[10px] font-extrabold rounded-full tracking-wider shadow-md leading-none"
                style={badge.style}
              >
                {badge.label}
              </span>
            </div>
          )}

          {/* Out of stock overlay */}
          {outOfStock && (
            <div className="absolute inset-0 bg-white/85 dark:bg-[#0e0e1c]/85 flex items-center justify-center z-20 backdrop-blur-[2px]">
              <span className="px-4 py-1.5 bg-white dark:bg-[#13131f] border border-[#E4E4EC] dark:border-[#1e1e35] text-[#6B6B7B] dark:text-[#6060a0] text-xs font-semibold rounded-full shadow-sm">
                Sin stock
              </span>
            </div>
          )}
        </div>

        {/* ── Info ─────────────────────────────────────────────────────────── */}
        <div className="relative z-10 flex flex-col flex-1 p-4 gap-2.5">

          {/* Franchise + category pill */}
          <span className="self-start px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#F0EFFF] dark:bg-[#5856D6]/15 text-[#5856D6] dark:text-[#a88dff] leading-tight">
            {product.franchise}
            {product.category !== 'Standard' && (
              <span className="ml-1 opacity-60">· {product.category}</span>
            )}
          </span>

          {/* Name + character */}
          <div className="flex-1 min-h-0">
            <h3 className="text-sm font-bold leading-snug line-clamp-2 text-[#0F0F14] dark:text-[#f1f0ff] group-hover:text-[#5856D6] dark:group-hover:text-[#a88dff] transition-colors duration-200">
              {product.name}
            </h3>
            {product.character && product.character !== product.name && (
              <p className="text-[11px] mt-0.5 text-[#9090aa] dark:text-[#5a5a80] font-medium truncate">
                {product.character}
              </p>
            )}
          </div>

          {/* Price row */}
          <div className="flex items-end justify-between gap-2 pt-1 border-t border-[#F0EFFF] dark:border-[#1a1a30]">
            <div>
              <PriceDisplay
                priceEUR={product.price}
                className="text-base font-extrabold text-[#0F0F14] dark:text-[#f1f0ff] leading-none"
              />
              {showLowStock && (
                <p className="text-[10px] text-amber-500 dark:text-amber-400 font-semibold mt-1 leading-none">
                  ⚡ Solo {product.stock} restantes
                </p>
              )}
            </div>

            {/* Cart button — dimmed until hover on desktop */}
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className={[
                'shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold',
                'transition-all duration-200 ease-out',
                'md:translate-y-0.5 md:opacity-55 md:group-hover:translate-y-0 md:group-hover:opacity-100',
                added
                  ? 'bg-emerald-500 text-white active:scale-95 scale-95'
                  : outOfStock
                  ? 'bg-[#F5F4FF] dark:bg-[#1a1a2e] text-[#C0C0D0] dark:text-[#4a4a6a] cursor-not-allowed'
                  : 'bg-[#5856D6] hover:bg-[#4644b8] active:scale-95 text-white shadow-sm hover:shadow-[0_4px_16px_rgba(88,86,214,.55)]',
              ].join(' ')}
              aria-label={added ? 'Agregado al carrito' : `Agregar ${product.name} al carrito`}
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
