'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { CSSProperties } from 'react'
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/utils'

/* ─────────────────────────────────────────────────────────────────
   Tipos
───────────────────────────────────────────────────────────────── */
interface CharImg {
  name: string
  url: string
  rotation: number
  yOffset: number
}

interface Theme {
  label: string
  tagline: string
  emoji: string
  bgCss: string
  accent: string
  accentRgb: string
  pattern: CSSProperties
  chars: CharImg[]
  chipBg: string
  chipColor: string
  chipBorder: string
}

type FKey =
  | 'Marvel'
  | 'DC'
  | 'Disney'
  | 'Anime'
  | 'Star Wars'
  | 'Harry Potter'
  | 'Juegos'

/* ─────────────────────────────────────────────────────────────────
   Configuración visual por franquicia
───────────────────────────────────────────────────────────────── */
const THEMES: Record<FKey, Theme> = {

  Marvel: {
    label: 'Universo Marvel',
    tagline: 'Los héroes y villanos más poderosos del cómic.',
    emoji: '🦸',
    bgCss: 'linear-gradient(135deg, #1a0406 0%, #3b0909 40%, #1f0307 100%)',
    accent: '#E8293C',
    accentRgb: '232,41,60',
    pattern: {
      backgroundImage:
        'radial-gradient(circle, rgba(232,41,60,0.18) 1.5px, transparent 1.5px)',
      backgroundSize: '26px 26px',
    },
    chars: [
      { name: 'Spider-Man', rotation: -7, yOffset: -14,
        url: 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2016/12/Funko-Pop-Spider-Man-03-Spider-Man.jpg' },
      { name: 'Iron Man', rotation: 4, yOffset: 8,
        url: 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2016/12/Funko-Pop-Iron-Man-04-Iron-Man.jpg' },
      { name: 'Thanos', rotation: -3, yOffset: -6,
        url: 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2018/03/Funko-Pop-Avengers-Infinity-War-289-Thanos.jpg' },
      { name: 'Wolverine', rotation: 6, yOffset: 4,
        url: 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2016/10/Funko-Pop-X-Men-05-Wolverine.jpg' },
    ],
    chipBg: 'rgba(232,41,60,0.18)',
    chipColor: '#FF8090',
    chipBorder: 'rgba(232,41,60,0.35)',
  },

  DC: {
    label: 'Universo DC',
    tagline: 'Los guardianes de Gotham y Metrópolis.',
    emoji: '🦇',
    bgCss: 'linear-gradient(135deg, #04071a 0%, #0b1535 45%, #050913 100%)',
    accent: '#1E90FF',
    accentRgb: '30,144,255',
    pattern: {
      backgroundImage:
        'linear-gradient(rgba(30,144,255,0.08) 1px, transparent 1px), ' +
        'linear-gradient(90deg, rgba(30,144,255,0.08) 1px, transparent 1px)',
      backgroundSize: '38px 38px',
    },
    chars: [
      { name: 'Batman', rotation: -7, yOffset: -14,
        url: 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2017/12/Funko-Pop-Batman-01-Batman.jpg' },
      { name: 'Joker', rotation: 5, yOffset: 8,
        url: 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2017/01/Funko-Pop-DC-Universe-06-Joker.jpg' },
      { name: 'Wonder Woman', rotation: -3, yOffset: -4,
        url: 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2016/12/Funko-Pop-DC-Universe-08-Wonder-Woman.jpg' },
      { name: 'Superman', rotation: 5, yOffset: 6,
        url: 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2017/03/Funko-Pop-Superman-07-Superman.jpg' },
    ],
    chipBg: 'rgba(30,144,255,0.14)',
    chipColor: '#72B8FF',
    chipBorder: 'rgba(30,144,255,0.3)',
  },

  Disney: {
    label: 'Magia Disney',
    tagline: 'Donde los sueños se hacen realidad.',
    emoji: '✨',
    bgCss: 'linear-gradient(135deg, #060f38 0%, #16084a 45%, #070e30 100%)',
    accent: '#FFD700',
    accentRgb: '255,215,0',
    pattern: {
      backgroundImage:
        'radial-gradient(circle, rgba(255,215,0,0.28) 1.5px, transparent 1.5px), ' +
        'radial-gradient(circle, rgba(255,215,0,0.12) 1px, transparent 1px)',
      backgroundSize: '48px 48px, 24px 24px',
      backgroundPosition: '0 0, 24px 24px',
    },
    chars: [
      { name: 'Elsa', rotation: -7, yOffset: -14,
        url: 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2017/10/Funko-Pop-Frozen-82-Elsa.jpg' },
      { name: 'Simba', rotation: 5, yOffset: 8,
        url: 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2014/06/2014-Funko-Pop-Lion-King-Simba.jpg' },
      { name: 'Stitch', rotation: -3, yOffset: -5,
        url: 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2017/05/Funko-Pop-Lilo-and-Stitch-12-Stitch.jpg' },
      { name: 'Mickey Mouse', rotation: 6, yOffset: 5,
        url: 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2015/06/Funko-Pop-Disney-01-Mickey-Mouse.jpg' },
    ],
    chipBg: 'rgba(255,215,0,0.14)',
    chipColor: '#FFE57A',
    chipBorder: 'rgba(255,215,0,0.3)',
  },

  Anime: {
    label: 'Mundo Anime',
    tagline: 'Los guerreros más épicos del manga y anime.',
    emoji: '⚡',
    bgCss: 'linear-gradient(135deg, #130420 0%, #270840 45%, #0e0520 100%)',
    accent: '#FF6B6B',
    accentRgb: '255,107,107',
    pattern: {
      backgroundImage:
        'repeating-linear-gradient(' +
        '-45deg, rgba(255,107,107,0.07), rgba(255,107,107,0.07) 1px, ' +
        'transparent 1px, transparent 14px)',
    },
    chars: [
      { name: 'Naruto', rotation: -7, yOffset: -14,
        url: 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2016/12/Funko-Pop-Naruto-Shippuden-71-Naruto.jpg' },
      { name: 'Goku', rotation: 5, yOffset: 8,
        url: 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2014/06/2014-Funko-Pop-Animation-Dragon-Ball-Z-14-Super-Saiyan-Goku.jpg' },
      { name: 'Pikachu', rotation: -3, yOffset: -5,
        url: 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2018/07/Funko-Pop-Pokemon-353-Pikachu-Target-Exclusive.jpg' },
      { name: 'Luffy', rotation: 6, yOffset: 5,
        url: 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2016/02/2016-Funko-Pop-One-Piece-Vinyl-Figures-98-Monkey-D.-Luffy.jpg' },
    ],
    chipBg: 'rgba(255,107,107,0.18)',
    chipColor: '#FF9999',
    chipBorder: 'rgba(255,107,107,0.35)',
  },

  'Star Wars': {
    label: 'Galaxia Muy Lejana',
    tagline: 'Que la Fuerza te acompañe.',
    emoji: '🌌',
    bgCss: 'linear-gradient(135deg, #020408 0%, #060d1e 45%, #020408 100%)',
    accent: '#4169E1',
    accentRgb: '65,105,225',
    pattern: {
      backgroundImage:
        'radial-gradient(circle, rgba(255,255,255,0.30) 1px, transparent 1px), ' +
        'radial-gradient(circle, rgba(65,105,225,0.25) 1.5px, transparent 1.5px)',
      backgroundSize: '56px 56px, 88px 88px',
      backgroundPosition: '12px 18px, 44px 60px',
    },
    chars: [
      { name: 'Darth Vader', rotation: -7, yOffset: -14,
        url: 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2014/12/Funko-Pop-Star-Wars-01-Darth-Vader.jpg' },
      { name: 'Grogu', rotation: 5, yOffset: 8,
        url: 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2020/03/Funko-Pop-Star-Wars-Figures-Funko-Pop-The-Mandalorian-Star-Wars-Figures-368-The-Child-Baby-Yoda.jpg' },
      { name: 'Yoda', rotation: -3, yOffset: -5,
        url: 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2014/12/Funko-Pop-Star-Wars-02-Yoda.jpg' },
      { name: 'Mandalorian', rotation: 6, yOffset: 5,
        url: 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2019/10/Funko-Pop-Star-Wars-The-Mandalorian-Figures-326-The-Mandalorian-.jpg' },
    ],
    chipBg: 'rgba(65,105,225,0.15)',
    chipColor: '#88AAFF',
    chipBorder: 'rgba(65,105,225,0.3)',
  },

  'Harry Potter': {
    label: 'Mundo Mágico',
    tagline: 'Hogwarts siempre será tu hogar.',
    emoji: '🪄',
    bgCss: 'linear-gradient(135deg, #090612 0%, #130820 45%, #090612 100%)',
    accent: '#C5A028',
    accentRgb: '197,160,40',
    pattern: {
      backgroundImage:
        'radial-gradient(ellipse, rgba(197,160,40,0.18) 1.5px, transparent 1.5px)',
      backgroundSize: '34px 34px',
    },
    chars: [
      { name: 'Harry Potter', rotation: -5, yOffset: -10,
        url: 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2015/06/2015-Funko-Pop-Harry-Potter-01-Harry-Potter.jpg' },
      { name: 'Hermione', rotation: 5, yOffset: 10,
        url: 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2015/06/2015-Funko-Pop-Harry-Potter-03-Hermione-Granger.jpg' },
    ],
    chipBg: 'rgba(197,160,40,0.14)',
    chipColor: '#DDBB55',
    chipBorder: 'rgba(197,160,40,0.3)',
  },

  Juegos: {
    label: 'Mundo Gaming',
    tagline: 'Los íconos más legendarios del gaming.',
    emoji: '🎮',
    bgCss: 'linear-gradient(135deg, #040404 0%, #080818 45%, #040404 100%)',
    accent: '#00E676',
    accentRgb: '0,230,118',
    pattern: {
      backgroundImage:
        'linear-gradient(rgba(0,230,118,0.08) 1px, transparent 1px), ' +
        'linear-gradient(90deg, rgba(0,230,118,0.08) 1px, transparent 1px)',
      backgroundSize: '18px 18px',
    },
    chars: [
      { name: 'Kratos', rotation: -5, yOffset: -10,
        url: 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2017/09/Funko-Pop-God-of-War-25-Kratos.jpg' },
      { name: 'Master Chief', rotation: 5, yOffset: 10,
        url: 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2017/04/Funko-Pop-Halo-01-Master-Chief.jpg' },
    ],
    chipBg: 'rgba(0,230,118,0.12)',
    chipColor: '#66FFB3',
    chipBorder: 'rgba(0,230,118,0.25)',
  },
}

const PILLS = [
  { label: 'Todos',        href: '/',                        emoji: '✨' },
  { label: 'Marvel',       href: '/?franchise=Marvel',       emoji: '🦸' },
  { label: 'DC',           href: '/?franchise=DC',           emoji: '🦇' },
  { label: 'Disney',       href: '/?franchise=Disney',       emoji: '🏰' },
  { label: 'Anime',        href: '/?franchise=Anime',        emoji: '⚡' },
  { label: 'Star Wars',    href: '/?franchise=Star Wars',    emoji: '🌌' },
  { label: 'Harry Potter', href: '/?franchise=Harry Potter', emoji: '🪄' },
  { label: 'Juegos',       href: '/?franchise=Juegos',       emoji: '🎮' },
]

/* ─────────────────────────────────────────────────────────────────
   Componente
───────────────────────────────────────────────────────────────── */
interface Props {
  franchise: string
  activeFranchise: string
  count: number
}

export default function FranchiseBanner({ franchise, activeFranchise, count }: Props) {
  const theme = THEMES[franchise as FKey]
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})

  if (!theme) return null

  const isFewChars = theme.chars.length <= 2
  const cardW      = isFewChars ? 'w-36 sm:w-44' : 'w-28 sm:w-32'
  const cardH      = isFewChars ? 'h-52 sm:h-60' : 'h-40 sm:h-48'

  return (
    <section
      className="relative overflow-hidden border-b border-white/5"
      style={{ background: theme.bgCss }}
    >
      {/* Patrón temático */}
      <div className="absolute inset-0 pointer-events-none" style={theme.pattern} />

      {/* Glow radial derecha */}
      <div
        className="absolute -right-24 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none opacity-70"
        style={{
          background: `radial-gradient(circle, rgba(${theme.accentRgb},0.18) 0%, transparent 70%)`,
        }}
      />

      {/* Vignette top/bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.35) 100%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 py-12 lg:py-10">

          {/* ── TEXTO ── */}
          <div className="flex-1 text-center lg:text-left">

            {/* Badge */}
            <span
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold rounded-full mb-5 tracking-widest uppercase"
              style={{
                background: theme.chipBg,
                color: theme.chipColor,
                border: `1px solid ${theme.chipBorder}`,
              }}
            >
              {theme.emoji} {theme.label}
            </span>

            {/* Título */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-white leading-tight mb-2">
              {franchise}
            </h1>
            <p className="text-2xl sm:text-3xl font-light mb-4 tracking-wide" style={{ color: 'rgba(255,255,255,0.38)' }}>
              Funko Pops
            </p>

            {/* Tagline */}
            <p className="text-sm sm:text-base max-w-sm mx-auto lg:mx-0 mb-6 leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {theme.tagline}
            </p>

            {/* Count badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-7"
              style={{
                background: theme.chipBg,
                color: theme.chipColor,
                border: `1px solid ${theme.chipBorder}`,
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: theme.accent }}
              />
              {count} figura{count !== 1 ? 's' : ''} disponible{count !== 1 ? 's' : ''}
            </div>

            {/* Pills de navegación entre franquicias */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {PILLS.map((pill) => {
                const isActive =
                  (pill.label === 'Todos' ? '' : pill.label) === activeFranchise
                return (
                  <Link
                    key={pill.href}
                    href={pill.href}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium"
                    style={
                      isActive
                        ? { background: theme.accent, color: '#fff' }
                        : {
                            background: 'rgba(255,255,255,0.07)',
                            color: 'rgba(255,255,255,0.5)',
                            border: '1px solid rgba(255,255,255,0.12)',
                          }
                    }
                  >
                    {pill.emoji} {pill.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* ── PERSONAJES ── */}
          <div
            className="w-full lg:w-auto lg:flex-shrink-0 flex items-end justify-center select-none pointer-events-none"
            style={{ gap: isFewChars ? '20px' : '12px' }}
          >
            {theme.chars.map((char, i) => (
              <div
                key={char.name}
                className={`relative ${cardW} ${cardH} rounded-2xl overflow-hidden flex-shrink-0`}
                style={{
                  transform: `rotate(${char.rotation}deg) translateY(${char.yOffset}px)`,
                  background: `linear-gradient(145deg, rgba(${theme.accentRgb},0.12), rgba(0,0,0,0.5))`,
                  border: `1px solid rgba(${theme.accentRgb},0.2)`,
                  boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 25px rgba(${theme.accentRgb},0.15)`,
                  zIndex: theme.chars.length - i,
                }}
              >
                {/* Reflejo superior */}
                <div
                  className="absolute inset-x-0 top-0 h-1/3 pointer-events-none"
                  style={{
                    background: `linear-gradient(to bottom, rgba(${theme.accentRgb},0.06), transparent)`,
                  }}
                />
                <Image
                  src={imgErrors[char.name] ? DEFAULT_PRODUCT_IMAGE : char.url}
                  alt={char.name}
                  fill
                  className="object-contain p-3"
                  sizes={isFewChars ? '176px' : '128px'}
                  onError={() =>
                    setImgErrors((prev) => ({ ...prev, [char.name]: true }))
                  }
                />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
