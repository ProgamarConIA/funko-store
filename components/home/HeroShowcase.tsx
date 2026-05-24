'use client'

import Image from 'next/image'
import { useState } from 'react'

const HERO_FIGURES = [
  {
    src: 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2020/03/Funko-Pop-Star-Wars-Figures-Funko-Pop-The-Mandalorian-Star-Wars-Figures-368-The-Child-Baby-Yoda.jpg',
    alt: 'Baby Yoda Funko Pop',
    rotate: '-rotate-6',
    z: 'z-10',
    translate: '-translate-y-4',
    shadow: 'shadow-[0_20px_60px_rgba(88,86,214,0.25)]',
  },
  {
    src: 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2018/03/Funko-Pop-Avengers-Infinity-War-289-Thanos.jpg',
    alt: 'Thanos Funko Pop',
    rotate: 'rotate-3',
    z: 'z-20',
    translate: 'translate-y-2',
    shadow: 'shadow-[0_24px_70px_rgba(88,86,214,0.30)]',
  },
  {
    src: 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2016/12/Funko-Pop-Spider-Man-03-Spider-Man.jpg',
    alt: 'Spider-Man Funko Pop',
    rotate: 'rotate-6',
    z: 'z-10',
    translate: '-translate-y-2',
    shadow: 'shadow-[0_20px_60px_rgba(88,86,214,0.25)]',
  },
]

export default function HeroShowcase() {
  const [errors, setErrors] = useState<Record<number, boolean>>({})

  return (
    <div className="relative flex items-end justify-center gap-3 h-72 sm:h-80 select-none pointer-events-none">
      {/* Glow de fondo */}
      <div className="absolute inset-0 bg-gradient-radial from-[#5856D6]/10 via-transparent to-transparent blur-2xl" />

      {HERO_FIGURES.map((fig, i) => (
        <div
          key={i}
          className={`relative w-36 sm:w-40 h-48 sm:h-56 rounded-3xl overflow-hidden bg-white border border-[#E4E4EC] transition-transform duration-500 hover:scale-105 ${fig.rotate} ${fig.z} ${fig.translate} ${fig.shadow}`}
        >
          <div className="absolute inset-0 gradient-card-img" />
          {!errors[i] && (
            <Image
              src={fig.src}
              alt={fig.alt}
              fill
              className="object-contain p-4"
              sizes="160px"
              onError={() => setErrors(prev => ({ ...prev, [i]: true }))}
            />
          )}
          {errors[i] && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl">🎯</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
