'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { CSSProperties } from 'react'

/* ─────────────────────────────────────────────────────────────────
   Tipos
───────────────────────────────────────────────────────────────── */
interface CharInfo {
  name:    string
  url:     string
  initial: string
  /** scale relativo al tamaño base (1 = normal, 1.15 = más grande) */
  scale?:  number
  /** desplazamiento horizontal en px para ajuste fino */
  offsetX?: number
}

interface Theme {
  label:      string
  tagline:    string
  emoji:      string
  bgCss:      string
  accent:     string
  accentRgb:  string
  pattern:    CSSProperties
  chars:      CharInfo[]
  chipBg:     string
  chipColor:  string
  chipBorder: string
  /** color del glow lateral derecho */
  glowColor?: string
}

type FKey = 'Marvel' | 'DC' | 'Disney' | 'Anime' | 'Star Wars' | 'Harry Potter' | 'Juegos'

/* ─────────────────────────────────────────────────────────────────
   Temas visuales + personajes por franquicia
   Las imágenes son PNGs transparentes — <img> sin restricciones.
   Si una URL falla → fallback emoji con gradiente temático.
───────────────────────────────────────────────────────────────── */
const THEMES: Record<FKey, Theme> = {

  Marvel: {
    label:    'Universo Marvel',
    tagline:  'Los héroes más poderosos del cosmos.',
    emoji:    '🦸',
    bgCss:    'linear-gradient(125deg, #0d0205 0%, #2a0607 35%, #1a0304 65%, #0d0205 100%)',
    accent:   '#E8293C',
    accentRgb:'232,41,60',
    glowColor:'rgba(232,41,60,0.35)',
    pattern: {
      backgroundImage: 'radial-gradient(circle, rgba(232,41,60,0.18) 1.5px, transparent 1.5px)',
      backgroundSize:  '28px 28px',
    },
    chars: [
      { name: 'Spider-Man', initial: '🕷',
        url: 'https://pngimg.com/uploads/spiderman/spiderman_PNG30.png', scale: 1.05 },
      { name: 'Iron Man', initial: '⚙',
        url: 'https://pngimg.com/uploads/iron_man/iron_man_PNG28.png', scale: 1.0 },
      { name: 'Thor', initial: '⚡',
        url: 'https://pngimg.com/uploads/thor/thor_PNG7.png', scale: 1.1 },
    ],
    chipBg:    'rgba(232,41,60,0.18)',
    chipColor: '#FF8090',
    chipBorder:'rgba(232,41,60,0.35)',
  },

  DC: {
    label:    'Universo DC',
    tagline:  'Los guardianes de Gotham y Metrópolis.',
    emoji:    '🦇',
    bgCss:    'linear-gradient(125deg, #020510 0%, #070d22 35%, #040a1a 65%, #020510 100%)',
    accent:   '#1E90FF',
    accentRgb:'30,144,255',
    glowColor:'rgba(30,144,255,0.30)',
    pattern: {
      backgroundImage:
        'linear-gradient(rgba(30,144,255,0.08) 1px, transparent 1px), ' +
        'linear-gradient(90deg, rgba(30,144,255,0.08) 1px, transparent 1px)',
      backgroundSize: '40px 40px',
    },
    chars: [
      { name: 'Batman', initial: '🦇',
        url: 'https://pngimg.com/uploads/batman/batman_PNG14.png', scale: 1.1 },
      { name: 'Wonder Woman', initial: '⭐',
        url: 'https://pngimg.com/uploads/wonder_woman/wonder_woman_PNG33.png', scale: 1.0 },
      { name: 'Superman', initial: '🔵',
        url: 'https://pngimg.com/uploads/superman/superman_PNG13.png', scale: 1.05 },
    ],
    chipBg:    'rgba(30,144,255,0.14)',
    chipColor: '#72B8FF',
    chipBorder:'rgba(30,144,255,0.3)',
  },

  Disney: {
    label:    'Magia Disney',
    tagline:  'Donde los sueños se hacen realidad.',
    emoji:    '✨',
    bgCss:    'linear-gradient(125deg, #03062a 0%, #0f0537 35%, #080428 65%, #03062a 100%)',
    accent:   '#FFD700',
    accentRgb:'255,215,0',
    glowColor:'rgba(255,215,0,0.25)',
    pattern: {
      backgroundImage:
        'radial-gradient(circle, rgba(255,215,0,0.22) 1.5px, transparent 1.5px), ' +
        'radial-gradient(circle, rgba(255,215,0,0.10) 1px, transparent 1px)',
      backgroundSize:    '50px 50px, 25px 25px',
      backgroundPosition:'0 0, 25px 25px',
    },
    chars: [
      { name: 'Mickey Mouse', initial: '🐭',
        url: 'https://pngimg.com/uploads/mickey_mouse/mickey_mouse_PNG3.png', scale: 1.0 },
      { name: 'Elsa', initial: '❄',
        url: 'https://pngimg.com/uploads/elsa/elsa_PNG9.png', scale: 1.1 },
      { name: 'Simba', initial: '🦁',
        url: 'https://pngimg.com/uploads/simba/simba_PNG3.png', scale: 1.0 },
    ],
    chipBg:    'rgba(255,215,0,0.14)',
    chipColor: '#FFE57A',
    chipBorder:'rgba(255,215,0,0.3)',
  },

  Anime: {
    label:    'Mundo Anime',
    tagline:  'Los guerreros más épicos del manga y anime.',
    emoji:    '⚡',
    bgCss:    'linear-gradient(125deg, #0c0318 0%, #1d0630 35%, #110420 65%, #0c0318 100%)',
    accent:   '#FF6B6B',
    accentRgb:'255,107,107',
    glowColor:'rgba(255,107,107,0.30)',
    pattern: {
      backgroundImage:
        'repeating-linear-gradient(-45deg, rgba(255,107,107,0.06), ' +
        'rgba(255,107,107,0.06) 1px, transparent 1px, transparent 16px)',
    },
    chars: [
      { name: 'Naruto', initial: '🍥',
        url: 'https://pngimg.com/uploads/naruto/naruto_PNG42.png', scale: 1.05 },
      { name: 'Goku', initial: '🔥',
        url: 'https://pngimg.com/uploads/goku/goku_PNG11.png', scale: 1.15 },
      { name: 'Pikachu', initial: '⚡',
        url: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png', scale: 0.85 },
    ],
    chipBg:    'rgba(255,107,107,0.18)',
    chipColor: '#FF9999',
    chipBorder:'rgba(255,107,107,0.35)',
  },

  'Star Wars': {
    label:    'Galaxia Muy Lejana',
    tagline:  'Que la Fuerza te acompañe.',
    emoji:    '🌌',
    bgCss:    'linear-gradient(125deg, #010204 0%, #040a16 35%, #020610 65%, #010204 100%)',
    accent:   '#4169E1',
    accentRgb:'65,105,225',
    glowColor:'rgba(65,105,225,0.28)',
    pattern: {
      backgroundImage:
        'radial-gradient(circle, rgba(255,255,255,0.28) 1px, transparent 1px), ' +
        'radial-gradient(circle, rgba(65,105,225,0.22) 1.5px, transparent 1.5px)',
      backgroundSize:    '60px 60px, 96px 96px',
      backgroundPosition:'15px 20px, 50px 70px',
    },
    chars: [
      { name: 'Darth Vader', initial: '🌑',
        url: 'https://pngimg.com/uploads/darth_vader/darth_vader_PNG3.png', scale: 1.1 },
      { name: 'Yoda', initial: '🟢',
        url: 'https://pngimg.com/uploads/yoda/yoda_PNG19.png', scale: 0.9 },
      { name: 'Stormtrooper', initial: '⬜',
        url: 'https://pngimg.com/uploads/stormtrooper/stormtrooper_PNG18.png', scale: 1.0 },
    ],
    chipBg:    'rgba(65,105,225,0.15)',
    chipColor: '#88AAFF',
    chipBorder:'rgba(65,105,225,0.3)',
  },

  'Harry Potter': {
    label:    'Mundo Mágico',
    tagline:  'Hogwarts siempre será tu hogar.',
    emoji:    '🪄',
    bgCss:    'linear-gradient(125deg, #07040f 0%, #100718 35%, #09050f 65%, #07040f 100%)',
    accent:   '#C5A028',
    accentRgb:'197,160,40',
    glowColor:'rgba(197,160,40,0.28)',
    pattern: {
      backgroundImage: 'radial-gradient(ellipse, rgba(197,160,40,0.16) 1.5px, transparent 1.5px)',
      backgroundSize:  '36px 36px',
    },
    chars: [
      { name: 'Harry Potter', initial: '⚡',
        url: 'https://pngimg.com/uploads/harry_potter/harry_potter_PNG49.png', scale: 1.05 },
      { name: 'Hermione', initial: '📚',
        url: 'https://pngimg.com/uploads/harry_potter/harry_potter_PNG80.png', scale: 1.0 },
      { name: 'Dumbledore', initial: '🪄',
        url: 'https://pngimg.com/uploads/harry_potter/harry_potter_PNG66.png', scale: 1.1 },
    ],
    chipBg:    'rgba(197,160,40,0.14)',
    chipColor: '#DDBB55',
    chipBorder:'rgba(197,160,40,0.3)',
  },

  Juegos: {
    label:    'Mundo Gaming',
    tagline:  'Los íconos más legendarios del gaming.',
    emoji:    '🎮',
    bgCss:    'linear-gradient(125deg, #020202 0%, #050514 35%, #030310 65%, #020202 100%)',
    accent:   '#00E676',
    accentRgb:'0,230,118',
    glowColor:'rgba(0,230,118,0.25)',
    pattern: {
      backgroundImage:
        'linear-gradient(rgba(0,230,118,0.07) 1px, transparent 1px), ' +
        'linear-gradient(90deg, rgba(0,230,118,0.07) 1px, transparent 1px)',
      backgroundSize: '20px 20px',
    },
    chars: [
      { name: 'Kratos', initial: '🪓',
        url: 'https://pngimg.com/uploads/kratos/kratos_PNG5.png', scale: 1.1 },
      { name: 'Mario', initial: '🍄',
        url: 'https://pngimg.com/uploads/mario/mario_PNG72.png', scale: 0.95 },
      { name: 'Link', initial: '🗡',
        url: 'https://pngimg.com/uploads/link/link_PNG39.png', scale: 1.0 },
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
   Personaje individual — PNG transparente a altura completa
───────────────────────────────────────────────────────────────── */
function CharacterImage({
  char,
  theme,
  index,
}: {
  char:  CharInfo
  theme: Theme
  index: number
}) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  /* Leve variación de escala entre personajes para dar profundidad */
  const baseScale  = char.scale ?? 1.0
  /* El personaje central es siempre el más grande */
  const depthScale = index === 1 ? 1.08 : index === 0 ? 0.92 : 1.0
  const finalScale = baseScale * depthScale

  /* Superposición: cada personaje se superpone ligeramente al siguiente */
  const zIndex = index === 1 ? 3 : index === 0 ? 2 : 1

  return (
    <div
      className="relative select-none flex-shrink-0"
      style={{
        /* La altura la hereda del contenedor padre (h-full) */
        width:    `${Math.round(180 * finalScale)}px`,
        height:   '100%',
        zIndex,
        /* Superposición negativa para que los personajes se "toquen" */
        marginLeft: index > 0 ? '-24px' : '0',
      }}
    >
      {/* Fallback: gradiente + emoji cuando la imagen no carga */}
      {(failed || !loaded) && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-end pb-6 gap-2"
          style={{ opacity: failed ? 1 : 0.3, transition: 'opacity 0.3s' }}
        >
          <span style={{ fontSize: `${Math.round(72 * finalScale)}px`, lineHeight: 1 }}>
            {char.initial}
          </span>
          <span
            className="text-[10px] font-bold tracking-widest uppercase text-center px-2"
            style={{ color: theme.chipColor }}
          >
            {char.name}
          </span>
        </div>
      )}

      {/* Imagen PNG transparente — ocupa toda la altura del contenedor */}
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={char.url}
          alt={char.name}
          onLoad={() => setLoaded(true)}
          onError={() => { setFailed(true); setLoaded(false) }}
          style={{
            position:       'absolute',
            bottom:         0,
            left:           '50%',
            transform:      'translateX(-50%)',
            width:          '100%',
            height:         '100%',
            objectFit:      'contain',
            objectPosition: 'bottom center',
            opacity:        loaded ? 1 : 0,
            transition:     'opacity 0.5s ease',
            filter:
              `drop-shadow(0 20px 50px rgba(0,0,0,0.85)) ` +
              `drop-shadow(0 0 30px rgba(${theme.accentRgb},0.45))`,
          }}
        />
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
  if (!theme) return null

  return (
    <section
      className="relative overflow-hidden border-b border-white/5"
      style={{
        background: theme.bgCss,
        minHeight:  '380px',
      }}
    >
      {/* Patrón de fondo */}
      <div className="absolute inset-0 pointer-events-none" style={theme.pattern} />

      {/* Vignette superior/inferior */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 20%, transparent 70%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* Glow izquierdo (color del acento, desde el texto) */}
      <div
        className="absolute left-0 top-0 bottom-0 w-3/4 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, rgba(0,0,0,0.55) 0%, transparent 100%)`,
        }}
      />

      {/* Glow derecho (color de acento temático) */}
      <div
        className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 100% 50%, ${theme.glowColor ?? `rgba(${theme.accentRgb},0.25)`} 0%, transparent 70%)`,
        }}
      />

      {/* ── CONTENIDO PRINCIPAL ────────────────────────────────── */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
           style={{ minHeight: '380px' }}>
        <div className="flex items-stretch h-full" style={{ minHeight: '380px' }}>

          {/* ── TEXTO (izquierda) ──────────────────────────────── */}
          <div className="flex-1 flex flex-col justify-center py-10 pr-4 lg:pr-12 z-10">

            {/* Chip franquicia */}
            <span
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold rounded-full mb-5 tracking-widest uppercase w-fit"
              style={{
                background: theme.chipBg,
                color:      theme.chipColor,
                border:     `1px solid ${theme.chipBorder}`,
              }}
            >
              {theme.emoji} {theme.label}
            </span>

            {/* Título */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold tracking-tight text-white leading-[1.05] mb-2">
              {franchise}
            </h1>
            <p
              className="text-2xl sm:text-3xl font-light mb-4 tracking-wide"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              Funko Pops
            </p>

            {/* Tagline */}
            <p
              className="text-sm sm:text-base max-w-xs mb-5 leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.52)' }}
            >
              {theme.tagline}
            </p>

            {/* Badge de cantidad */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-7 w-fit"
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
            <div className="flex flex-wrap gap-2">
              {PILLS.map((pill) => {
                const isActive = (pill.label === 'Todos' ? '' : pill.label) === activeFranchise
                return (
                  <Link
                    key={pill.href}
                    href={pill.href}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all"
                    style={
                      isActive
                        ? { background: theme.accent, color: '#fff', boxShadow: `0 0 14px rgba(${theme.accentRgb},0.45)` }
                        : {
                            background: 'rgba(255,255,255,0.07)',
                            color:      'rgba(255,255,255,0.48)',
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

          {/* ── PERSONAJES (derecha, a plena altura) ─────────────── */}
          {/*
              Los personajes ocupan toda la altura del banner.
              Se alinean a la derecha y "salen" del borde derecho del
              contenedor — el overflow:hidden del <section> los recorta.
          */}
          <div
            className="hidden lg:flex items-end justify-end pointer-events-none flex-shrink-0"
            style={{
              /* ancho fijo que deja espacio a los personajes */
              width:          '480px',
              /* igual que minHeight del contenedor */
              height:         '380px',
              /* sin padding derecho — los personajes llegan al borde */
              paddingRight:   '0',
              /* leve desplazamiento a la derecha para que el último personaje
                 sobresalga fuera del contenedor max-w-7xl */
              marginRight:    '-32px',
            }}
          >
            {theme.chars.map((char, i) => (
              <CharacterImage key={char.name} char={char} theme={theme} index={i} />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
