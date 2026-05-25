'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { CSSProperties } from 'react'

/* ─────────────────────────────────────────────────────────────────
   Tipos
───────────────────────────────────────────────────────────────── */
interface CharInfo {
  name:     string
  url:      string
  rotation: number
  yOffset:  number
  initial:  string  // fallback inicial si la imagen no carga
}

interface Theme {
  label:       string
  tagline:     string
  emoji:       string
  bgCss:       string
  accent:      string
  accentRgb:   string
  pattern:     CSSProperties
  chars:       CharInfo[]
  chipBg:      string
  chipColor:   string
  chipBorder:  string
}

type FKey = 'Marvel' | 'DC' | 'Disney' | 'Anime' | 'Star Wars' | 'Harry Potter' | 'Juegos'

/* ─────────────────────────────────────────────────────────────────
   Temas visuales + personajes reales por franquicia
   Nota: las imágenes usan <img> HTML (sin restricciones de dominio).
   Si alguna URL falla, se muestra una tarjeta gradiente con inicial.
───────────────────────────────────────────────────────────────── */
const THEMES: Record<FKey, Theme> = {

  Marvel: {
    label:    'Universo Marvel',
    tagline:  'Los héroes más poderosos del cosmos.',
    emoji:    '🦸',
    bgCss:    'linear-gradient(135deg, #1a0406 0%, #3b0909 40%, #1f0307 100%)',
    accent:   '#E8293C',
    accentRgb:'232,41,60',
    pattern: {
      backgroundImage: 'radial-gradient(circle, rgba(232,41,60,0.20) 1.5px, transparent 1.5px)',
      backgroundSize:  '26px 26px',
    },
    chars: [
      { name: 'Spider-Man', initial: '🕷', rotation: -2, yOffset: 0,
        url: 'https://pngimg.com/uploads/spiderman/spiderman_PNG30.png' },
      { name: 'Iron Man', initial: '⚙', rotation: 1, yOffset: 0,
        url: 'https://pngimg.com/uploads/iron_man/iron_man_PNG28.png' },
      { name: 'Thor', initial: '⚡', rotation: -1, yOffset: 0,
        url: 'https://pngimg.com/uploads/thor/thor_PNG7.png' },
    ],
    chipBg:    'rgba(232,41,60,0.18)',
    chipColor: '#FF8090',
    chipBorder:'rgba(232,41,60,0.35)',
  },

  DC: {
    label:    'Universo DC',
    tagline:  'Los guardianes de Gotham y Metrópolis.',
    emoji:    '🦇',
    bgCss:    'linear-gradient(135deg, #04071a 0%, #0b1535 45%, #050913 100%)',
    accent:   '#1E90FF',
    accentRgb:'30,144,255',
    pattern: {
      backgroundImage:
        'linear-gradient(rgba(30,144,255,0.09) 1px, transparent 1px), ' +
        'linear-gradient(90deg, rgba(30,144,255,0.09) 1px, transparent 1px)',
      backgroundSize: '38px 38px',
    },
    chars: [
      { name: 'Batman', initial: '🦇', rotation: -2, yOffset: 0,
        url: 'https://pngimg.com/uploads/batman/batman_PNG14.png' },
      { name: 'Wonder Woman', initial: '⭐', rotation: 1, yOffset: 0,
        url: 'https://pngimg.com/uploads/wonder_woman/wonder_woman_PNG33.png' },
      { name: 'Superman', initial: '🔵', rotation: -1, yOffset: 0,
        url: 'https://pngimg.com/uploads/superman/superman_PNG13.png' },
    ],
    chipBg:    'rgba(30,144,255,0.14)',
    chipColor: '#72B8FF',
    chipBorder:'rgba(30,144,255,0.3)',
  },

  Disney: {
    label:    'Magia Disney',
    tagline:  'Donde los sueños se hacen realidad.',
    emoji:    '✨',
    bgCss:    'linear-gradient(135deg, #060f38 0%, #16084a 45%, #070e30 100%)',
    accent:   '#FFD700',
    accentRgb:'255,215,0',
    pattern: {
      backgroundImage:
        'radial-gradient(circle, rgba(255,215,0,0.28) 1.5px, transparent 1.5px), ' +
        'radial-gradient(circle, rgba(255,215,0,0.12) 1px, transparent 1px)',
      backgroundSize:    '48px 48px, 24px 24px',
      backgroundPosition:'0 0, 24px 24px',
    },
    chars: [
      { name: 'Mickey Mouse', initial: '🐭', rotation: -2, yOffset: 0,
        url: 'https://pngimg.com/uploads/mickey_mouse/mickey_mouse_PNG3.png' },
      { name: 'Elsa', initial: '❄', rotation: 1, yOffset: 0,
        url: 'https://pngimg.com/uploads/elsa/elsa_PNG9.png' },
      { name: 'Simba', initial: '🦁', rotation: -1, yOffset: 0,
        url: 'https://pngimg.com/uploads/simba/simba_PNG3.png' },
    ],
    chipBg:    'rgba(255,215,0,0.14)',
    chipColor: '#FFE57A',
    chipBorder:'rgba(255,215,0,0.3)',
  },

  Anime: {
    label:    'Mundo Anime',
    tagline:  'Los guerreros más épicos del manga y anime.',
    emoji:    '⚡',
    bgCss:    'linear-gradient(135deg, #130420 0%, #270840 45%, #0e0520 100%)',
    accent:   '#FF6B6B',
    accentRgb:'255,107,107',
    pattern: {
      backgroundImage:
        'repeating-linear-gradient(' +
        '-45deg, rgba(255,107,107,0.07), rgba(255,107,107,0.07) 1px, ' +
        'transparent 1px, transparent 14px)',
    },
    chars: [
      { name: 'Naruto', initial: '🍥', rotation: -2, yOffset: 0,
        url: 'https://pngimg.com/uploads/naruto/naruto_PNG42.png' },
      { name: 'Goku', initial: '🔥', rotation: 1, yOffset: 0,
        url: 'https://pngimg.com/uploads/goku/goku_PNG11.png' },
      { name: 'Pikachu', initial: '⚡', rotation: -1, yOffset: 0,
        url: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png' },
    ],
    chipBg:    'rgba(255,107,107,0.18)',
    chipColor: '#FF9999',
    chipBorder:'rgba(255,107,107,0.35)',
  },

  'Star Wars': {
    label:    'Galaxia Muy Lejana',
    tagline:  'Que la Fuerza te acompañe.',
    emoji:    '🌌',
    bgCss:    'linear-gradient(135deg, #020408 0%, #060d1e 45%, #020408 100%)',
    accent:   '#4169E1',
    accentRgb:'65,105,225',
    pattern: {
      backgroundImage:
        'radial-gradient(circle, rgba(255,255,255,0.30) 1px, transparent 1px), ' +
        'radial-gradient(circle, rgba(65,105,225,0.25) 1.5px, transparent 1.5px)',
      backgroundSize:    '56px 56px, 88px 88px',
      backgroundPosition:'12px 18px, 44px 60px',
    },
    chars: [
      { name: 'Darth Vader', initial: '🌑', rotation: -2, yOffset: 0,
        url: 'https://pngimg.com/uploads/darth_vader/darth_vader_PNG3.png' },
      { name: 'Yoda', initial: '🟢', rotation: 1, yOffset: 0,
        url: 'https://pngimg.com/uploads/yoda/yoda_PNG19.png' },
      { name: 'Stormtrooper', initial: '⬜', rotation: -1, yOffset: 0,
        url: 'https://pngimg.com/uploads/stormtrooper/stormtrooper_PNG18.png' },
    ],
    chipBg:    'rgba(65,105,225,0.15)',
    chipColor: '#88AAFF',
    chipBorder:'rgba(65,105,225,0.3)',
  },

  'Harry Potter': {
    label:    'Mundo Mágico',
    tagline:  'Hogwarts siempre será tu hogar.',
    emoji:    '🪄',
    bgCss:    'linear-gradient(135deg, #090612 0%, #130820 45%, #090612 100%)',
    accent:   '#C5A028',
    accentRgb:'197,160,40',
    pattern: {
      backgroundImage: 'radial-gradient(ellipse, rgba(197,160,40,0.18) 1.5px, transparent 1.5px)',
      backgroundSize:  '34px 34px',
    },
    chars: [
      { name: 'Harry Potter', initial: '⚡', rotation: -2, yOffset: 0,
        url: 'https://pngimg.com/uploads/harry_potter/harry_potter_PNG49.png' },
      { name: 'Hermione', initial: '📚', rotation: 1, yOffset: 0,
        url: 'https://pngimg.com/uploads/harry_potter/harry_potter_PNG80.png' },
      { name: 'Dumbledore', initial: '🪄', rotation: -1, yOffset: 0,
        url: 'https://pngimg.com/uploads/harry_potter/harry_potter_PNG66.png' },
    ],
    chipBg:    'rgba(197,160,40,0.14)',
    chipColor: '#DDBB55',
    chipBorder:'rgba(197,160,40,0.3)',
  },

  Juegos: {
    label:    'Mundo Gaming',
    tagline:  'Los íconos más legendarios del gaming.',
    emoji:    '🎮',
    bgCss:    'linear-gradient(135deg, #040404 0%, #080818 45%, #040404 100%)',
    accent:   '#00E676',
    accentRgb:'0,230,118',
    pattern: {
      backgroundImage:
        'linear-gradient(rgba(0,230,118,0.08) 1px, transparent 1px), ' +
        'linear-gradient(90deg, rgba(0,230,118,0.08) 1px, transparent 1px)',
      backgroundSize: '18px 18px',
    },
    chars: [
      { name: 'Kratos', initial: '🪓', rotation: -2, yOffset: 0,
        url: 'https://pngimg.com/uploads/kratos/kratos_PNG5.png' },
      { name: 'Mario', initial: '🍄', rotation: 1, yOffset: 0,
        url: 'https://pngimg.com/uploads/mario/mario_PNG72.png' },
      { name: 'Link', initial: '🗡', rotation: -1, yOffset: 0,
        url: 'https://pngimg.com/uploads/link/link_PNG39.png' },
    ],
    chipBg:    'rgba(0,230,118,0.12)',
    chipColor: '#66FFB3',
    chipBorder:'rgba(0,230,118,0.25)',
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
   Tarjeta de personaje — PNG transparente + fallback gradiente
───────────────────────────────────────────────────────────────── */
function CharCard({
  char, theme,
}: {
  char:  CharInfo
  theme: Theme
}) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  return (
    <div
      className="relative flex-shrink-0 select-none"
      style={{
        width:     '170px',
        height:    '290px',
        transform: `rotate(${char.rotation}deg)`,
        filter:    `drop-shadow(0 16px 40px rgba(0,0,0,0.75)) drop-shadow(0 0 20px rgba(${theme.accentRgb},0.40))`,
      }}
    >
      {/* Fondo (visible cuando falla la imagen) */}
      {(failed || !loaded) && (
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-3 p-4"
          style={{
            background: `linear-gradient(145deg, rgba(${theme.accentRgb},0.30) 0%, rgba(0,0,0,0.65) 100%)`,
            border:     `1px solid rgba(${theme.accentRgb},0.28)`,
            opacity:    failed ? 1 : 0.4,
            transition: 'opacity 0.3s',
          }}
        >
          <span className="text-6xl">{char.initial}</span>
          <span
            className="text-[11px] font-bold text-center leading-tight tracking-widest uppercase"
            style={{ color: theme.chipColor }}
          >
            {char.name}
          </span>
        </div>
      )}

      {/* Imagen PNG transparente */}
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={char.url}
          alt={char.name}
          onLoad={() => setLoaded(true)}
          onError={() => { setFailed(true); setLoaded(false) }}
          style={{
            position:       'absolute',
            inset:          0,
            width:          '100%',
            height:         '100%',
            objectFit:      'contain',
            objectPosition: 'bottom center',
            opacity:        loaded ? 1 : 0,
            transition:     'opacity 0.45s ease',
          }}
        />
      )}

      {/* Nombre con glow bajo el personaje */}
      {loaded && (
        <div className="absolute inset-x-0 bottom-0 text-center">
          <span
            className="text-[10px] font-bold tracking-widest uppercase"
            style={{
              color:      theme.chipColor,
              textShadow: `0 0 10px rgba(${theme.accentRgb},0.9), 0 0 20px rgba(${theme.accentRgb},0.5)`,
            }}
          >
            {char.name}
          </span>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   Componente principal
───────────────────────────────────────────────────────────────── */
interface Props {
  franchise:       string
  activeFranchise: string
  count:           number
}

export default function FranchiseBanner({ franchise, activeFranchise, count }: Props) {
  const theme = THEMES[franchise as FKey]

  // Si la franquicia no tiene tema configurado, no renderiza nada
  if (!theme) return null

  return (
    <section
      className="relative overflow-hidden border-b border-white/5"
      style={{ background: theme.bgCss }}
    >
      {/* Patrón de fondo temático */}
      <div className="absolute inset-0 pointer-events-none" style={theme.pattern} />

      {/* Glow radial derecha */}
      <div
        className="absolute -right-24 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none opacity-60"
        style={{
          background: `radial-gradient(circle, rgba(${theme.accentRgb},0.20) 0%, transparent 70%)`,
        }}
      />

      {/* Vignette superior e inferior */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 py-10 lg:py-8">

          {/* ── TEXTO ────────────────────────────────────────────── */}
          <div className="flex-1 text-center lg:text-left">

            {/* Chip franquicia */}
            <span
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold rounded-full mb-5 tracking-widest uppercase"
              style={{
                background: theme.chipBg,
                color:      theme.chipColor,
                border:     `1px solid ${theme.chipBorder}`,
              }}
            >
              {theme.emoji} {theme.label}
            </span>

            {/* Título principal */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold tracking-tight text-white leading-tight mb-2">
              {franchise}
            </h1>
            <p
              className="text-2xl sm:text-3xl font-light mb-4 tracking-wide"
              style={{ color: 'rgba(255,255,255,0.38)' }}
            >
              Funko Pops
            </p>

            {/* Tagline */}
            <p
              className="text-sm sm:text-base max-w-sm mx-auto lg:mx-0 mb-6 leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              {theme.tagline}
            </p>

            {/* Cantidad disponible */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-7"
              style={{
                background: theme.chipBg,
                color:      theme.chipColor,
                border:     `1px solid ${theme.chipBorder}`,
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: theme.accent }}
              />
              {count} figura{count !== 1 ? 's' : ''} disponible{count !== 1 ? 's' : ''}
            </div>

            {/* Pills de navegación */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {PILLS.map((pill) => {
                const isActive = (pill.label === 'Todos' ? '' : pill.label) === activeFranchise
                return (
                  <Link
                    key={pill.href}
                    href={pill.href}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all"
                    style={
                      isActive
                        ? { background: theme.accent, color: '#fff' }
                        : {
                            background: 'rgba(255,255,255,0.07)',
                            color:      'rgba(255,255,255,0.5)',
                            border:     '1px solid rgba(255,255,255,0.12)',
                          }
                    }
                  >
                    {pill.emoji} {pill.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* ── PERSONAJES ───────────────────────────────────────── */}
          <div
            className="flex items-end justify-center pointer-events-none lg:flex-shrink-0"
            style={{ gap: '20px' }}
          >
            {theme.chars.map((char) => (
              <CharCard key={char.name} char={char} theme={theme} />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
