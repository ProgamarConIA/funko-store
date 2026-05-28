/**
 * FranchiseBanner — hero temático por franquicia.
 *
 * El lado derecho (desktop) muestra CharacterTrio con los 3 personajes
 * representativos de cada universo.
 *
 * Imágenes:
 *   Formato : PNG con fondo transparente, 400×600 px mínimo
 *   Ruta    : /public/characters/{universo}/{personaje}.png
 *   Fallback: emoji definido en `images.*` de cada tema (se activa si la imagen no carga)
 *
 * Fuentes recomendadas para las imágenes:
 *   • Marvel     → press.marvel.com  (press kit oficial)
 *   • DC         → dccomics.com/media (assets de prensa)
 *   • Disney     → disneyplus.com press kit / studio.helloworld.com
 *   • Anime      → assets de Bandai Namco / Toei Animation press kit
 *   • Star Wars  → starwars.com/databank (imágenes de personajes)
 *   • HP         → wizardingworld.com/explore-the-story (renders oficiales)
 *   • Juegos     → press.nintendo.com / news.xbox.com (press kits oficiales)
 *
 * ⚠️  NO usar imágenes de terceros sin licencia. Los press kits oficiales
 *     incluyen assets de alta resolución con fondo transparente listos para usar.
 */

import Link from 'next/link'
import CharacterTrio, { type CharacterSlot } from './CharacterTrio'

/* ─────────────────────────────────────────────────────────────────
   Tipos
───────────────────────────────────────────────────────────────── */
interface CharacterImages {
  left:   CharacterSlot
  center: CharacterSlot
  right:  CharacterSlot
}

interface Theme {
  label:      string
  tagline:    string
  icon:       string
  bg:         string
  accent:     string
  rgb:        string
  accentDark: string
  pattern:    React.CSSProperties
  chipBg:     string
  chipColor:  string
  chipBorder: string
  /** Color base más oscuro del bg — usado para el fade inferior del CharacterTrio */
  bgBase:     string
  /** Imágenes de los 3 personajes. Fallback a emoji si el archivo no existe. */
  images:     CharacterImages
}

type FKey = 'Marvel' | 'DC' | 'Disney' | 'Anime' | 'Star Wars' | 'Harry Potter' | 'Juegos'

/* ─────────────────────────────────────────────────────────────────
   Temas por franquicia
───────────────────────────────────────────────────────────────── */
const THEMES: Record<FKey, Theme> = {

  Marvel: {
    label: 'Universo Marvel', tagline: 'Los héroes más poderosos del cosmos.',
    icon: '🦸',
    accent: '#E8293C', rgb: '232,41,60', accentDark: '#8B0000',
    bg: 'linear-gradient(135deg,#060000 0%,#200408 45%,#3a0610 75%,#1a020a 100%)',
    pattern: {
      backgroundImage: 'radial-gradient(circle,rgba(232,41,60,.18) 1.5px,transparent 1.5px)',
      backgroundSize: '28px 28px',
    },
    chipBg: 'rgba(232,41,60,.18)', chipColor: '#FF8090', chipBorder: 'rgba(232,41,60,.40)',
    bgBase: '#060000',
    images: {
      // /public/characters/marvel/iron-man.png — Iron Man render PNG transparente
      left:   { src: '/characters/marvel/iron-man.png',   alt: 'Iron Man',   emoji: '⚙️' },
      // /public/characters/marvel/spider-man.png
      center: { src: '/characters/marvel/spider-man.png', alt: 'Spider-Man', emoji: '🕷️' },
      // /public/characters/marvel/wolverine.png
      right:  { src: '/characters/marvel/wolverine.png',  alt: 'Wolverine',  emoji: '🦁' },
    },
  },

  DC: {
    label: 'Universo DC', tagline: 'Los guardianes de Gotham y Metrópolis.',
    icon: '🦇',
    accent: '#1E90FF', rgb: '30,144,255', accentDark: '#003080',
    bg: 'linear-gradient(135deg,#000207 0%,#03091e 45%,#060f2b 75%,#010313 100%)',
    pattern: {
      backgroundImage:
        'linear-gradient(rgba(30,144,255,.08) 1px,transparent 1px),' +
        'linear-gradient(90deg,rgba(30,144,255,.08) 1px,transparent 1px)',
      backgroundSize: '44px 44px',
    },
    chipBg: 'rgba(30,144,255,.14)', chipColor: '#72B8FF', chipBorder: 'rgba(30,144,255,.35)',
    bgBase: '#000207',
    images: {
      left:   { src: '/characters/dc/batman.png',   alt: 'Batman',    emoji: '🦇' },
      center: { src: '/characters/dc/superman.png', alt: 'Superman',  emoji: '🔵' },
      right:  { src: '/characters/dc/flash.png',    alt: 'The Flash', emoji: '⚡' },
    },
  },

  Disney: {
    label: 'Magia Disney', tagline: 'Donde los sueños se hacen realidad.',
    icon: '✨',
    accent: '#FFD700', rgb: '255,215,0', accentDark: '#8B6900',
    bg: 'linear-gradient(135deg,#010218 0%,#080430 45%,#120852 75%,#04021f 100%)',
    pattern: {
      backgroundImage:
        'radial-gradient(circle,rgba(255,215,0,.22) 1.5px,transparent 1.5px),' +
        'radial-gradient(circle,rgba(255,215,0,.08) 1px,transparent 1px)',
      backgroundSize: '54px 54px,27px 27px',
      backgroundPosition: '0 0,27px 27px',
    },
    chipBg: 'rgba(255,215,0,.14)', chipColor: '#FFE57A', chipBorder: 'rgba(255,215,0,.35)',
    bgBase: '#010218',
    images: {
      left:   { src: '/characters/disney/mickey.png',         alt: 'Mickey Mouse',   emoji: '🐭' },
      center: { src: '/characters/disney/stitch.png',         alt: 'Stitch',         emoji: '💙' },
      right:  { src: '/characters/disney/buzz-lightyear.png', alt: 'Buzz Lightyear', emoji: '🚀' },
    },
  },

  Anime: {
    label: 'Mundo Anime', tagline: 'Los guerreros más épicos del manga.',
    icon: '⚡',
    accent: '#FF6B6B', rgb: '255,107,107', accentDark: '#8B0000',
    bg: 'linear-gradient(135deg,#080012 0%,#150325 45%,#220540 75%,#0c0218 100%)',
    pattern: {
      backgroundImage:
        'repeating-linear-gradient(-45deg,rgba(255,107,107,.07),rgba(255,107,107,.07) 1px,transparent 1px,transparent 18px)',
    },
    chipBg: 'rgba(255,107,107,.18)', chipColor: '#FF9999', chipBorder: 'rgba(255,107,107,.40)',
    bgBase: '#080012',
    images: {
      left:   { src: '/characters/anime/naruto.png', alt: 'Naruto', emoji: '🍥' },
      center: { src: '/characters/anime/goku.png',   alt: 'Goku',   emoji: '🔥' },
      right:  { src: '/characters/anime/luffy.png',  alt: 'Luffy',  emoji: '⚓' },
    },
  },

  'Star Wars': {
    label: 'Galaxia Muy Lejana', tagline: 'Que la Fuerza te acompañe.',
    icon: '🌌',
    accent: '#4169E1', rgb: '65,105,225', accentDark: '#1a2860',
    bg: 'linear-gradient(135deg,#000103 0%,#020816 45%,#040e22 75%,#010206 100%)',
    pattern: {
      backgroundImage:
        'radial-gradient(circle,rgba(255,255,255,.28) 1px,transparent 1px),' +
        'radial-gradient(circle,rgba(65,105,225,.20) 1.5px,transparent 1.5px)',
      backgroundSize: '64px 64px,100px 100px',
      backgroundPosition: '15px 20px,55px 75px',
    },
    chipBg: 'rgba(65,105,225,.15)', chipColor: '#88AAFF', chipBorder: 'rgba(65,105,225,.35)',
    bgBase: '#000103',
    images: {
      left:   { src: '/characters/star-wars/luke.png',        alt: 'Luke Skywalker', emoji: '⚔️' },
      center: { src: '/characters/star-wars/darth-vader.png', alt: 'Darth Vader',    emoji: '🔴' },
      right:  { src: '/characters/star-wars/mandalorian.png', alt: 'Mandalorian',    emoji: '🪖' },
    },
  },

  'Harry Potter': {
    label: 'Mundo Mágico', tagline: 'Hogwarts siempre será tu hogar.',
    icon: '🪄',
    accent: '#C5A028', rgb: '197,160,40', accentDark: '#6B5500',
    bg: 'linear-gradient(135deg,#030210 0%,#0b0520 45%,#160a30 75%,#07030e 100%)',
    pattern: {
      backgroundImage: 'radial-gradient(ellipse,rgba(197,160,40,.18) 1.5px,transparent 1.5px)',
      backgroundSize: '38px 38px',
    },
    chipBg: 'rgba(197,160,40,.14)', chipColor: '#DDBB55', chipBorder: 'rgba(197,160,40,.35)',
    bgBase: '#030210',
    images: {
      left:   { src: '/characters/hp/voldemort.png',     alt: 'Voldemort',    emoji: '💀' },
      center: { src: '/characters/hp/harry-potter.png',  alt: 'Harry Potter', emoji: '⚡' },
      right:  { src: '/characters/hp/hermione.png',      alt: 'Hermione',     emoji: '📚' },
    },
  },

  Juegos: {
    label: 'Mundo Gaming', tagline: 'Los íconos más legendarios del gaming.',
    icon: '🎮',
    accent: '#00E676', rgb: '0,230,118', accentDark: '#006630',
    bg: 'linear-gradient(135deg,#010101 0%,#03040f 45%,#050618 75%,#020208 100%)',
    pattern: {
      backgroundImage:
        'linear-gradient(rgba(0,230,118,.08) 1px,transparent 1px),' +
        'linear-gradient(90deg,rgba(0,230,118,.08) 1px,transparent 1px)',
      backgroundSize: '22px 22px',
    },
    chipBg: 'rgba(0,230,118,.12)', chipColor: '#66FFB3', chipBorder: 'rgba(0,230,118,.28)',
    bgBase: '#010101',
    images: {
      left:   { src: '/characters/games/kratos.png',       alt: 'Kratos',       emoji: '🪓' },
      center: { src: '/characters/games/master-chief.png', alt: 'Master Chief', emoji: '🪖' },
      right:  { src: '/characters/games/mario.png',        alt: 'Mario',        emoji: '⭐' },
    },
  },
}

/* ─────────────────────────────────────────────────────────────────
   Pills de navegación
───────────────────────────────────────────────────────────────── */
const PILLS = [
  { label: 'Todos',        href: '/',                        icon: '✨' },
  { label: 'Marvel',       href: '/?franchise=Marvel',       icon: '🦸' },
  { label: 'DC',           href: '/?franchise=DC',           icon: '🦇' },
  { label: 'Disney',       href: '/?franchise=Disney',       icon: '🏰' },
  { label: 'Anime',        href: '/?franchise=Anime',        icon: '⚡' },
  { label: 'Star Wars',    href: '/?franchise=Star Wars',    icon: '🌌' },
  { label: 'Harry Potter', href: '/?franchise=Harry Potter', icon: '🪄' },
  { label: 'Juegos',       href: '/?franchise=Juegos',       icon: '🎮' },
]

const BANNER_H = 470

/* ─────────────────────────────────────────────────────────────────
   Banner principal
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
      style={{ background: theme.bg, minHeight: `${BANNER_H}px` }}
    >
      {/* Patrón de fondo */}
      <div className="absolute inset-0 pointer-events-none" style={theme.pattern} />

      {/* Vignette vertical */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background:
          'linear-gradient(to bottom,' +
          'rgba(0,0,0,.60) 0%,transparent 16%,transparent 64%,rgba(0,0,0,.75) 100%)',
      }} />

      {/* Gradiente lateral izquierdo */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background:
          'linear-gradient(90deg,' +
          'rgba(0,0,0,.88) 0%,rgba(0,0,0,.55) 32%,rgba(0,0,0,.15) 52%,transparent 65%)',
      }} />

      {/* Resplandor de acento derecho */}
      <div className="absolute right-0 top-0 bottom-0 w-2/3 pointer-events-none" style={{
        background: `radial-gradient(ellipse at 78% 55%, rgba(${theme.rgb},.25) 0%, transparent 55%)`,
      }} />

      {/* Layout principal */}
      <div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-stretch"
        style={{ minHeight: `${BANNER_H}px` }}
      >

        {/* TEXTO ─────────────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col justify-center py-14 z-10 pr-4 lg:pr-14">

          <span
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold rounded-full mb-5 tracking-widest uppercase w-fit"
            style={{
              background: theme.chipBg,
              color:      theme.chipColor,
              border:     `1px solid ${theme.chipBorder}`,
            }}
          >
            {theme.icon}&nbsp;{theme.label}
          </span>

          <h1
            className="font-extrabold tracking-tight text-white leading-[1.03] mb-2"
            style={{ fontSize: 'clamp(2.4rem,5vw,3.8rem)' }}
          >
            {franchise}
          </h1>

          <p
            className="font-light mb-4 tracking-wide"
            style={{ fontSize: 'clamp(1.2rem,2.5vw,1.8rem)', color: 'rgba(255,255,255,.28)' }}
          >
            Funko Pops
          </p>

          <p
            className="max-w-xs mb-6 leading-relaxed"
            style={{ fontSize: 'clamp(.85rem,1.5vw,1rem)', color: 'rgba(255,255,255,.50)' }}
          >
            {theme.tagline}
          </p>

          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 w-fit"
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                  style={
                    isActive
                      ? {
                          background: theme.accent,
                          color: '#fff',
                          boxShadow: `0 0 18px rgba(${theme.rgb},.55)`,
                        }
                      : {
                          background: 'rgba(255,255,255,.07)',
                          color: 'rgba(255,255,255,.44)',
                          border: '1px solid rgba(255,255,255,.12)',
                        }
                  }
                >
                  {pill.icon}&nbsp;{pill.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* PERSONAJES (solo desktop) ────────────────────────────────────── */}
        <div
          className="hidden lg:flex items-end justify-center flex-shrink-0"
          style={{ width: '460px', minHeight: `${BANNER_H}px` }}
        >
          <CharacterTrio
            left  ={theme.images.left}
            center={theme.images.center}
            right ={theme.images.right}
            glow  ={`rgba(${theme.rgb},0.55)`}
            fadeTo={theme.bgBase}
            height={BANNER_H}
            width ={460}
          />
        </div>

      </div>
    </section>
  )
}
