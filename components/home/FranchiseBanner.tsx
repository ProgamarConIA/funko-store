'use client'

import Link from 'next/link'
import { useState } from 'react'

/* ─────────────────────────────────────────────────────────────────
   Tipos
───────────────────────────────────────────────────────────────── */
interface CharCard {
  name:   string
  role:   string
  icon:   string          // emoji icono principal
  badge?: string          // texto extra (ej: "No. 1")
  size:   'sm' | 'lg'
}

interface Theme {
  label:      string
  tagline:    string
  icon:       string
  bg:         string
  accent:     string
  rgb:        string
  pattern:    React.CSSProperties
  chars:      CharCard[]
  chipBg:     string
  chipColor:  string
  chipBorder: string
  accentDark: string      // version oscura del acento para gradientes
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
    chars: [
      { name: 'Spider-Man',      role: 'El Hombre Araña',   icon: '🕷️', badge: '#39',  size: 'sm' },
      { name: 'Iron Man',        role: 'Tony Stark',        icon: '⚙️', badge: '#285', size: 'lg' },
      { name: 'Capitán América', role: 'Steve Rogers',      icon: '🛡️', badge: '#10',  size: 'sm' },
    ],
    chipBg: 'rgba(232,41,60,.18)', chipColor: '#FF8090', chipBorder: 'rgba(232,41,60,.40)',
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
    chars: [
      { name: 'The Flash',  role: 'El Velocista Escarlata', icon: '⚡', badge: '#713', size: 'sm' },
      { name: 'Batman',     role: 'El Caballero Oscuro',    icon: '🦇', badge: '#01',  size: 'lg' },
      { name: 'Superman',   role: 'El Hombre de Acero',     icon: '🔵', badge: '#01',  size: 'sm' },
    ],
    chipBg: 'rgba(30,144,255,.14)', chipColor: '#72B8FF', chipBorder: 'rgba(30,144,255,.35)',
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
    chars: [
      { name: 'Mickey Mouse',   role: 'El Ratón Más Famoso', icon: '🐭', badge: '#01',  size: 'sm' },
      { name: 'Stitch',         role: 'Experimento 626',     icon: '💙', badge: '#159', size: 'lg' },
      { name: 'Buzz Lightyear', role: 'Al Infinito y Más',   icon: '🚀', badge: '#168', size: 'sm' },
    ],
    chipBg: 'rgba(255,215,0,.14)', chipColor: '#FFE57A', chipBorder: 'rgba(255,215,0,.35)',
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
    chars: [
      { name: 'Naruto',  role: 'Hokage de Konoha',    icon: '🍥', badge: '#727', size: 'sm' },
      { name: 'Goku',    role: 'Super Saiyan',         icon: '🔥', badge: '#858', size: 'lg' },
      { name: 'Luffy',   role: 'Rey de los Piratas',   icon: '⚓', badge: '#924', size: 'sm' },
    ],
    chipBg: 'rgba(255,107,107,.18)', chipColor: '#FF9999', chipBorder: 'rgba(255,107,107,.40)',
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
    chars: [
      { name: 'Luke Skywalker', role: 'Caballero Jedi',  icon: '⚔️', badge: '#01',  size: 'sm' },
      { name: 'Darth Vader',    role: 'Señor Sith',      icon: '🔴', badge: '#01',  size: 'lg' },
      { name: 'Mandalorian',    role: 'Din Djarin',       icon: '🪖', badge: '#326', size: 'sm' },
    ],
    chipBg: 'rgba(65,105,225,.15)', chipColor: '#88AAFF', chipBorder: 'rgba(65,105,225,.35)',
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
    chars: [
      { name: 'Voldemort',    role: 'El Señor Tenebroso', icon: '💀', badge: '#5',  size: 'sm' },
      { name: 'Harry Potter', role: 'El Elegido',          icon: '⚡', badge: '#01', size: 'lg' },
      { name: 'Hermione',     role: 'La Más Inteligente',  icon: '📚', badge: '#03', size: 'sm' },
    ],
    chipBg: 'rgba(197,160,40,.14)', chipColor: '#DDBB55', chipBorder: 'rgba(197,160,40,.35)',
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
    chars: [
      { name: 'Kratos',       role: 'Dios de la Guerra',  icon: '🪓', badge: '#269', size: 'sm' },
      { name: 'Master Chief', role: 'SPARTAN-117',         icon: '🪖', badge: '#06',  size: 'lg' },
      { name: 'Mario',        role: 'Super Mario Bros',    icon: '⭐', badge: 'Chase', size: 'sm' },
    ],
    chipBg: 'rgba(0,230,118,.12)', chipColor: '#66FFB3', chipBorder: 'rgba(0,230,118,.28)',
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
   Tarjeta de personaje — diseño CSS cinematografico
───────────────────────────────────────────────────────────────── */
function CharacterCard({
  char,
  theme,
  index,
}: {
  char:  CharCard
  theme: Theme
  index: number
}) {
  const [hovered, setHovered] = useState(false)
  const isHero = char.size === 'lg'

  const cardW = isHero ? 148 : 110
  const cardH = isHero ? 220 : 168
  const sinkPx = isHero ? 0 : 38

  return (
    <div
      style={{
        flexShrink:    0,
        width:         `${cardW}px`,
        alignSelf:     'flex-end',
        marginBottom:  `${sinkPx}px`,
        zIndex:        isHero ? 3 : 1,
        marginLeft:    index === 0 ? 0 : '-12px',
        position:      'relative',
        cursor:        'default',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glow detrás */}
      <div style={{
        position:   'absolute',
        bottom:     '0',
        left:       '50%',
        transform:  'translateX(-50%)',
        width:      `${cardW * 1.4}px`,
        height:     `${cardH * 0.6}px`,
        background: `radial-gradient(ellipse at 50% 90%, rgba(${theme.rgb},.${hovered ? '65' : '40'}) 0%, transparent 65%)`,
        filter:     'blur(24px)',
        zIndex:     0,
        pointerEvents: 'none',
        transition:    'all .4s ease',
      }} />

      {/* Tarjeta principal */}
      <div style={{
        width:        `${cardW}px`,
        height:       `${cardH}px`,
        position:     'relative',
        zIndex:       1,
        borderRadius: isHero ? '16px' : '12px',
        background:   `linear-gradient(145deg, rgba(${theme.rgb},.${isHero ? '18' : '12'}) 0%, rgba(0,0,0,.${isHero ? '70' : '60'}) 100%)`,
        border:       `1px solid rgba(${theme.rgb},.${hovered ? '60' : '28'})`,
        boxShadow:    `0 0 ${hovered ? '28' : '16'}px rgba(${theme.rgb},.${hovered ? '35' : '18'}), inset 0 1px 0 rgba(255,255,255,.08)`,
        display:      'flex',
        flexDirection:'column',
        alignItems:   'center',
        justifyContent: 'space-between',
        padding:      isHero ? '20px 12px 16px' : '14px 10px 12px',
        overflow:     'hidden',
        transition:   'border-color .3s, box-shadow .3s',
        transform:    hovered ? `translateY(-${isHero ? 8 : 5}px)` : 'translateY(0)',
      }}>

        {/* Fondo decorativo — lineas angulares */}
        <div style={{
          position:    'absolute',
          inset:       0,
          opacity:     0.06,
          background:  `repeating-linear-gradient(-55deg, transparent, transparent 8px, rgba(${theme.rgb},1) 8px, rgba(${theme.rgb},1) 9px)`,
          borderRadius: 'inherit',
          pointerEvents: 'none',
        }} />

        {/* Badge # del Funko */}
        {char.badge && (
          <div style={{
            position:     'absolute',
            top:          '8px',
            right:        '8px',
            fontSize:     '9px',
            fontWeight:   800,
            fontFamily:   'monospace',
            color:        `rgba(${theme.rgb},.85)`,
            background:   `rgba(${theme.rgb},.12)`,
            border:       `1px solid rgba(${theme.rgb},.30)`,
            borderRadius: '6px',
            padding:      '2px 5px',
            letterSpacing: '0.04em',
          }}>
            {char.badge}
          </div>
        )}

        {/* Icono principal */}
        <div style={{
          fontSize:   isHero ? '64px' : '48px',
          lineHeight: 1,
          filter:     `drop-shadow(0 0 ${isHero ? '20' : '12'}px rgba(${theme.rgb},.70))`,
          marginTop:  isHero ? '8px' : '4px',
          zIndex:     1,
          transition: 'filter .3s, transform .3s',
          transform:  hovered ? 'scale(1.12)' : 'scale(1)',
        }}>
          {char.icon}
        </div>

        {/* Separador */}
        <div style={{
          width:     '40%',
          height:    '1px',
          background:`linear-gradient(90deg, transparent, rgba(${theme.rgb},.50), transparent)`,
          margin:    '4px 0',
        }} />

        {/* Nombre + rol */}
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <div style={{
            fontSize:      isHero ? '11.5px' : '9.5px',
            fontWeight:    800,
            color:         '#ffffff',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            lineHeight:    1.2,
            marginBottom:  '3px',
          }}>
            {char.name}
          </div>
          <div style={{
            fontSize:      isHero ? '9px' : '8px',
            fontWeight:    500,
            color:         `rgba(${theme.rgb},.80)`,
            letterSpacing: '0.01em',
            lineHeight:    1.3,
          }}>
            {char.role}
          </div>
        </div>

        {/* Barra de acento inferior */}
        <div style={{
          position:     'absolute',
          bottom:       0,
          left:         '20%',
          right:        '20%',
          height:       isHero ? '3px' : '2px',
          background:   `linear-gradient(90deg, transparent, rgba(${theme.rgb},.9), transparent)`,
          borderRadius: '2px 2px 0 0',
        }} />
      </div>

      {/* Sombra de piso */}
      <div style={{
        width:        `${cardW * 0.65}px`,
        height:       '10px',
        margin:       '0 auto',
        marginTop:    '-4px',
        background:   `radial-gradient(ellipse, rgba(${theme.rgb},.45) 0%, transparent 70%)`,
        filter:       'blur(8px)',
        borderRadius: '50%',
      }} />
    </div>
  )
}

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

        {/* TEXTO */}
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

          {/* Pills de navegacion */}
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

        {/* 3 TARJETAS DE PERSONAJE (solo desktop) */}
        <div
          className="hidden lg:flex items-end flex-shrink-0"
          style={{
            width:          '420px',
            minHeight:      `${BANNER_H}px`,
            paddingBottom:  '32px',
            paddingLeft:    '16px',
            paddingRight:   '16px',
            alignItems:     'flex-end',
            justifyContent: 'center',
            gap:            '4px',
          }}
        >
          {theme.chars.map((char, i) => (
            <CharacterCard
              key={char.name}
              char={char}
              theme={theme}
              index={i}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
