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
      { name: 'Spider-Man', initial: '🕷', rotation: -6, yOffset: -10,
        url: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1e/Spider-Man_Homecoming_poster.jpg/290px-Spider-Man_Homecoming_poster.jpg' },
      { name: 'Iron Man', initial: '⚙', rotation: 4, yOffset: 8,
        url: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Iron_Man_%28film%29.jpg/290px-Iron_Man_%28film%29.jpg' },
      { name: 'Thor', initial: '⚡', rotation: -4, yOffset: -6,
        url: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f0/Thor_-_Movie_Poster.jpg/290px-Thor_-_Movie_Poster.jpg' },
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
      { name: 'Batman', initial: '🦇', rotation: -7, yOffset: -14,
        url: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Dark_knight_rises.jpg/290px-Dark_knight_rises.jpg' },
      { name: 'Wonder Woman', initial: '⭐', rotation: 5, yOffset: 8,
        url: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f4/Wonder_Woman_%282017_film%29.png/290px-Wonder_Woman_%282017_film%29.png' },
      { name: 'Superman', initial: '🔵', rotation: -3, yOffset: -4,
        url: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/ef/Man_of_Steel_2013_Poster.jpg/290px-Man_of_Steel_2013_Poster.jpg' },
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
      { name: 'Mickey Mouse', initial: '🐭', rotation: -5, yOffset: -10,
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Mickey_Mouse_Poster.jpg/290px-Mickey_Mouse_Poster.jpg' },
      { name: 'Elsa', initial: '❄', rotation: 4, yOffset: 8,
        url: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Frozen_%282013_film%29_poster.jpg/290px-Frozen_%282013_film%29_poster.jpg' },
      { name: 'Simba', initial: '🦁', rotation: -4, yOffset: -5,
        url: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3d/The_Lion_King_2019_film_poster.jpg/290px-The_Lion_King_2019_film_poster.jpg' },
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
      { name: 'Naruto', initial: '🍥', rotation: -7, yOffset: -14,
        url: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/93/Naruto_Shippuden_poster.jpg/290px-Naruto_Shippuden_poster.jpg' },
      { name: 'Goku', initial: '🔥', rotation: 5, yOffset: 8,
        url: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5b/Dragon_Ball_Super_broly_poster.jpg/290px-Dragon_Ball_Super_broly_poster.jpg' },
      { name: 'Pikachu', initial: '⚡', rotation: -3, yOffset: -5,
        url: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/af/Pokemon_2019_poster.png/290px-Pokemon_2019_poster.png' },
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
      { name: 'Darth Vader', initial: '🌑', rotation: -7, yOffset: -14,
        url: 'https://upload.wikimedia.org/wikipedia/en/7/76/Darth_Vader.png' },
      { name: 'Yoda', initial: '🟢', rotation: 5, yOffset: 8,
        url: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6f/Yoda_Attack_of_the_Clones.png/290px-Yoda_Attack_of_the_Clones.png' },
      { name: 'Grogu', initial: '👶', rotation: -3, yOffset: -5,
        url: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7f/Grogu_and_the_Mandalorian.jpg/290px-Grogu_and_the_Mandalorian.jpg' },
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
      { name: 'Harry Potter', initial: '⚡', rotation: -5, yOffset: -10,
        url: 'https://upload.wikimedia.org/wikipedia/en/thumb/j/j0/Harry_Potter_and_the_Deathly_Hallows_%E2%80%93_Part_2_film_poster.jpg/290px-Harry_Potter_and_the_Deathly_Hallows_%E2%80%93_Part_2_film_poster.jpg' },
      { name: 'Hermione', initial: '📚', rotation: 5, yOffset: 10,
        url: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/19/Harry_Potter_and_the_Philosopher%27s_Stone_film_poster.jpg/290px-Harry_Potter_and_the_Philosopher%27s_Stone_film_poster.jpg' },
      { name: 'Dumbledore', initial: '🪄', rotation: -3, yOffset: -5,
        url: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b1/Harry_Potter_and_the_Order_of_the_Phoenix_movie.jpg/290px-Harry_Potter_and_the_Order_of_the_Phoenix_movie.jpg' },
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
      { name: 'Kratos', initial: '🪓', rotation: -5, yOffset: -10,
        url: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1a/God_of_War_%282018%29.jpg/290px-God_of_War_%282018%29.jpg' },
      { name: 'Master Chief', initial: '🪖', rotation: 5, yOffset: 10,
        url: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/33/Halo_Infinite_cover_art.jpg/290px-Halo_Infinite_cover_art.jpg' },
      { name: 'Link', initial: '🗡', rotation: -3, yOffset: -5,
        url: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/The_Legend_of_Zelda_Breath_of_the_Wild.jpg/290px-The_Legend_of_Zelda_Breath_of_the_Wild.jpg' },
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
   Tarjeta de personaje — imagen real con fallback gradiente
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
      className="relative flex-shrink-0 rounded-2xl overflow-hidden select-none"
      style={{
        width:     '130px',
        height:    '190px',
        transform: `rotate(${char.rotation}deg) translateY(${char.yOffset}px)`,
        background: `linear-gradient(145deg, rgba(${theme.accentRgb},0.15), rgba(0,0,0,0.55))`,
        border:    `1px solid rgba(${theme.accentRgb},0.22)`,
        boxShadow: `0 20px 50px rgba(0,0,0,0.65), 0 0 25px rgba(${theme.accentRgb},0.18)`,
      }}
    >
      {/* Fallback: inicial + nombre del personaje */}
      {(failed || !loaded) && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3"
          style={{ opacity: failed ? 1 : 0, transition: 'opacity 0.3s' }}
        >
          <span className="text-4xl">{char.initial}</span>
          <span
            className="text-[10px] font-bold text-center leading-tight"
            style={{ color: theme.chipColor }}
          >
            {char.name}
          </span>
        </div>
      )}

      {/* Imagen real del personaje */}
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={char.url}
          alt={char.name}
          onLoad={() => setLoaded(true)}
          onError={() => { setFailed(true); setLoaded(false) }}
          style={{
            position:  'absolute',
            inset:     0,
            width:     '100%',
            height:    '100%',
            objectFit: 'cover',
            opacity:   loaded ? 1 : 0,
            transition:'opacity 0.4s ease',
          }}
        />
      )}

      {/* Brillo superior */}
      <div
        className="absolute inset-x-0 top-0 h-1/3 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgba(${theme.accentRgb},0.08), transparent)`,
        }}
      />

      {/* Etiqueta nombre en la base */}
      <div
        className="absolute inset-x-0 bottom-0 px-2 py-1.5 text-center"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)',
        }}
      >
        <span
          className="text-[9px] font-bold tracking-wider uppercase"
          style={{ color: theme.chipColor }}
        >
          {char.name}
        </span>
      </div>
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
        <div className="flex flex-col lg:flex-row items-center gap-8 py-12 lg:py-10">

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
          <div className="flex items-end justify-center gap-3 pointer-events-none lg:flex-shrink-0">
            {theme.chars.map((char) => (
              <CharCard key={char.name} char={char} theme={theme} />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
