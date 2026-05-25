'use client'

import Image from 'next/image'
import { useState } from 'react'

/* Tres Funko Pops locales — sin dependencias de CDN externas */
const HERO_FIGURES = [
  {
    src: '/funkos/grogu-369.jpg',
    alt: 'Grogu Funko Pop',
    rotate: '-rotate-6',
    z: 'z-10',
    translate: '-translate-y-6',
    glow: 'rgba(34,197,94,0.35)',
  },
  {
    src: '/funkos/funko-pop-thanos.jpg',
    alt: 'Thanos Funko Pop',
    rotate: 'rotate-2',
    z: 'z-20',
    translate: 'translate-y-0',
    glow: 'rgba(168,85,247,0.40)',
  },
  {
    src: '/funkos/spider-man-39.jpg',
    alt: 'Spider-Man Funko Pop',
    rotate: 'rotate-6',
    z: 'z-10',
    translate: '-translate-y-3',
    glow: 'rgba(239,68,68,0.35)',
  },
]

export default function HeroShowcase() {
  const [errors, setErrors] = useState<Record<number, boolean>>({})

  return (
    <div className="relative flex items-end justify-center gap-4 select-none pointer-events-none"
      style={{ height: '340px', width: '420px', maxWidth: '100%' }}
    >
      {/* Glow difuso de fondo */}
      <div
        className="absolute inset-0 blur-3xl opacity-40"
        style={{
          background:
            'radial-gradient(ellipse at 50% 80%, rgba(88,86,214,.35) 0%, rgba(168,85,247,.20) 40%, transparent 70%)',
        }}
      />

      {HERO_FIGURES.map((fig, i) => (
        <div
          key={i}
          className={`relative flex-shrink-0 rounded-3xl overflow-hidden border transition-transform duration-500
            ${fig.rotate} ${fig.z} ${fig.translate}
            bg-white dark:bg-[#13131f]
            border-[#E4E4EC] dark:border-[#1e1e35]
          `}
          style={{
            width:     i === 1 ? '145px' : '120px',
            height:    i === 1 ? '195px' : '165px',
            boxShadow: `0 20px 50px rgba(0,0,0,.15), 0 0 40px ${fig.glow}`,
          }}
        >
          {/* Gradiente interior de la tarjeta */}
          <div className="absolute inset-0 gradient-card-img" />

          {!errors[i] ? (
            <Image
              src={fig.src}
              alt={fig.alt}
              fill
              className="object-contain p-4 relative z-10"
              sizes="160px"
              onError={() => setErrors(prev => ({ ...prev, [i]: true }))}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <span className="text-4xl">🎯</span>
            </div>
          )}

          {/* Shimmer en hover */}
          <div
            className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,.1) 0%, transparent 50%, rgba(255,255,255,.05) 100%)',
            }}
          />
        </div>
      ))}

      {/* Reflexión/sombra en el piso */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 blur-xl opacity-20"
        style={{
          width: '300px',
          height: '30px',
          background: 'radial-gradient(ellipse, rgba(88,86,214,1) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}
