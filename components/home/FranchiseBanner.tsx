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
  emoji:   string
  /** Factor de escala (1 = base) */
  scale?:  number
  /** z-index relativo */
  z?:      number
}

interface Theme {
  label:     string
  tagline:   string
  emoji:     string
  bg:        string                // gradiente de fondo
  accent:    string                // color acento hex
  rgb:       string                // acento en rgb
  pattern:   CSSProperties
  chars:     CharInfo[]
  chipBg:    string
  chipColor: string
  chipBorder:string
}

type FKey = 'Marvel' | 'DC' | 'Disney' | 'Anime' | 'Star Wars' | 'Harry Potter' | 'Juegos'

/* ─────────────────────────────────────────────────────────────────
   Temas — fondo + personajes
───────────────────────────────────────────────────────────────── */
const THEMES: Record<FKey, Theme> = {

  Marvel: {
    label:'Universo Marvel', tagline:'Los héroes más poderosos del cosmos.',
    emoji:'🦸',
    bg:'linear-gradient(120deg,#0a0102 0%,#2c0607 45%,#160203 100%)',
    accent:'#E8293C', rgb:'232,41,60',
    pattern:{
      backgroundImage:'radial-gradient(circle,rgba(232,41,60,.18) 1.5px,transparent 1.5px)',
      backgroundSize:'28px 28px',
    },
    chars:[
      { name:'Iron Man',   emoji:'⚙', scale:1.0, z:1,
        url:'https://pngimg.com/uploads/iron_man/iron_man_PNG28.png' },
      { name:'Spider-Man', emoji:'🕷', scale:1.15, z:3,
        url:'https://pngimg.com/uploads/spiderman/spiderman_PNG30.png' },
      { name:'Thor',       emoji:'⚡', scale:0.95, z:2,
        url:'https://pngimg.com/uploads/thor/thor_PNG7.png' },
    ],
    chipBg:'rgba(232,41,60,.18)', chipColor:'#FF8090', chipBorder:'rgba(232,41,60,.35)',
  },

  DC: {
    label:'Universo DC', tagline:'Los guardianes de Gotham y Metrópolis.',
    emoji:'🦇',
    bg:'linear-gradient(120deg,#01030d 0%,#060e22 45%,#020610 100%)',
    accent:'#1E90FF', rgb:'30,144,255',
    pattern:{
      backgroundImage:
        'linear-gradient(rgba(30,144,255,.07) 1px,transparent 1px),' +
        'linear-gradient(90deg,rgba(30,144,255,.07) 1px,transparent 1px)',
      backgroundSize:'40px 40px',
    },
    chars:[
      { name:'Superman',     emoji:'🔵', scale:0.95, z:1,
        url:'https://pngimg.com/uploads/superman/superman_PNG13.png' },
      { name:'Batman',       emoji:'🦇', scale:1.15, z:3,
        url:'https://pngimg.com/uploads/batman/batman_PNG14.png' },
      { name:'Wonder Woman', emoji:'⭐', scale:1.0,  z:2,
        url:'https://pngimg.com/uploads/wonder_woman/wonder_woman_PNG33.png' },
    ],
    chipBg:'rgba(30,144,255,.14)', chipColor:'#72B8FF', chipBorder:'rgba(30,144,255,.3)',
  },

  Disney: {
    label:'Magia Disney', tagline:'Donde los sueños se hacen realidad.',
    emoji:'✨',
    bg:'linear-gradient(120deg,#02041a 0%,#0c0430 45%,#060220 100%)',
    accent:'#FFD700', rgb:'255,215,0',
    pattern:{
      backgroundImage:
        'radial-gradient(circle,rgba(255,215,0,.22) 1.5px,transparent 1.5px),' +
        'radial-gradient(circle,rgba(255,215,0,.10) 1px,transparent 1px)',
      backgroundSize:'50px 50px,25px 25px',
      backgroundPosition:'0 0,25px 25px',
    },
    chars:[
      { name:'Mickey',  emoji:'🐭', scale:0.90, z:1,
        url:'https://pngimg.com/uploads/mickey_mouse/mickey_mouse_PNG3.png' },
      { name:'Stitch',  emoji:'💙', scale:1.0,  z:3,
        url:'https://pngimg.com/uploads/stitch/stitch_PNG4.png' },
      { name:'Elsa',    emoji:'❄',  scale:1.05, z:2,
        url:'https://pngimg.com/uploads/elsa/elsa_PNG9.png' },
    ],
    chipBg:'rgba(255,215,0,.14)', chipColor:'#FFE57A', chipBorder:'rgba(255,215,0,.3)',
  },

  Anime: {
    label:'Mundo Anime', tagline:'Los guerreros más épicos del manga.',
    emoji:'⚡',
    bg:'linear-gradient(120deg,#0a0215 0%,#1c052d 45%,#0d0318 100%)',
    accent:'#FF6B6B', rgb:'255,107,107',
    pattern:{
      backgroundImage:
        'repeating-linear-gradient(-45deg,rgba(255,107,107,.06),rgba(255,107,107,.06) 1px,transparent 1px,transparent 16px)',
    },
    chars:[
      { name:'Vegeta',  emoji:'🔥', scale:0.95, z:1,
        url:'https://pngimg.com/uploads/goku/goku_PNG8.png' },
      { name:'Naruto',  emoji:'🍥', scale:1.15, z:3,
        url:'https://pngimg.com/uploads/naruto/naruto_PNG42.png' },
      { name:'Pikachu', emoji:'⚡', scale:0.85, z:2,
        url:'https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png' },
    ],
    chipBg:'rgba(255,107,107,.18)', chipColor:'#FF9999', chipBorder:'rgba(255,107,107,.35)',
  },

  'Star Wars': {
    label:'Galaxia Muy Lejana', tagline:'Que la Fuerza te acompañe.',
    emoji:'🌌',
    bg:'linear-gradient(120deg,#000204 0%,#030b18 45%,#010408 100%)',
    accent:'#4169E1', rgb:'65,105,225',
    pattern:{
      backgroundImage:
        'radial-gradient(circle,rgba(255,255,255,.28) 1px,transparent 1px),' +
        'radial-gradient(circle,rgba(65,105,225,.20) 1.5px,transparent 1.5px)',
      backgroundSize:'60px 60px,96px 96px',
      backgroundPosition:'15px 20px,50px 70px',
    },
    chars:[
      { name:'Yoda',        emoji:'🟢', scale:0.80, z:1,
        url:'https://pngimg.com/uploads/yoda/yoda_PNG19.png' },
      { name:'Darth Vader', emoji:'🌑', scale:1.15, z:3,
        url:'https://pngimg.com/uploads/darth_vader/darth_vader_PNG3.png' },
      { name:'Stormtrooper',emoji:'⬜', scale:0.95, z:2,
        url:'https://pngimg.com/uploads/stormtrooper/stormtrooper_PNG18.png' },
    ],
    chipBg:'rgba(65,105,225,.15)', chipColor:'#88AAFF', chipBorder:'rgba(65,105,225,.3)',
  },

  'Harry Potter': {
    label:'Mundo Mágico', tagline:'Hogwarts siempre será tu hogar.',
    emoji:'🪄',
    bg:'linear-gradient(120deg,#050310 0%,#0e0620 45%,#07030e 100%)',
    accent:'#C5A028', rgb:'197,160,40',
    pattern:{
      backgroundImage:'radial-gradient(ellipse,rgba(197,160,40,.16) 1.5px,transparent 1.5px)',
      backgroundSize:'36px 36px',
    },
    chars:[
      { name:'Dumbledore', emoji:'🪄', scale:0.95, z:1,
        url:'https://pngimg.com/uploads/harry_potter/harry_potter_PNG66.png' },
      { name:'Harry',      emoji:'⚡', scale:1.1,  z:3,
        url:'https://pngimg.com/uploads/harry_potter/harry_potter_PNG49.png' },
      { name:'Hermione',   emoji:'📚', scale:1.0,  z:2,
        url:'https://pngimg.com/uploads/harry_potter/harry_potter_PNG80.png' },
    ],
    chipBg:'rgba(197,160,40,.14)', chipColor:'#DDBB55', chipBorder:'rgba(197,160,40,.3)',
  },

  Juegos: {
    label:'Mundo Gaming', tagline:'Los íconos más legendarios del gaming.',
    emoji:'🎮',
    bg:'linear-gradient(120deg,#010101 0%,#040412 45%,#020208 100%)',
    accent:'#00E676', rgb:'0,230,118',
    pattern:{
      backgroundImage:
        'linear-gradient(rgba(0,230,118,.07) 1px,transparent 1px),' +
        'linear-gradient(90deg,rgba(0,230,118,.07) 1px,transparent 1px)',
      backgroundSize:'20px 20px',
    },
    chars:[
      { name:'Mario',  emoji:'🍄', scale:0.90, z:1,
        url:'https://pngimg.com/uploads/mario/mario_PNG72.png' },
      { name:'Kratos', emoji:'🪓', scale:1.15, z:3,
        url:'https://pngimg.com/uploads/kratos/kratos_PNG5.png' },
      { name:'Link',   emoji:'🗡', scale:1.0,  z:2,
        url:'https://pngimg.com/uploads/link/link_PNG39.png' },
    ],
    chipBg:'rgba(0,230,118,.12)', chipColor:'#66FFB3', chipBorder:'rgba(0,230,118,.25)',
  },
}

const PILLS = [
  { label:'Todos',        href:'/',                        emoji:'✨' },
  { label:'Marvel',       href:'/?franchise=Marvel',       emoji:'🦸' },
  { label:'DC',           href:'/?franchise=DC',           emoji:'🦇' },
  { label:'Disney',       href:'/?franchise=Disney',       emoji:'🏰' },
  { label:'Anime',        href:'/?franchise=Anime',        emoji:'⚡' },
  { label:'Star Wars',    href:'/?franchise=Star Wars',    emoji:'🌌' },
  { label:'Harry Potter', href:'/?franchise=Harry Potter', emoji:'🪄' },
  { label:'Juegos',       href:'/?franchise=Juegos',       emoji:'🎮' },
]

/* ─────────────────────────────────────────────────────────────────
   Un personaje — PNG transparente flotando sobre el fondo.
   Sin tarjeta, sin borde. Si falla la imagen → orbe con emoji.
───────────────────────────────────────────────────────────────── */
function Character({
  char, theme, bannerH,
}: {
  char: CharInfo; theme: Theme; bannerH: number
}) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  const scale = char.scale ?? 1
  const w     = Math.round(190 * scale)

  return (
    <div
      className="relative flex-shrink-0 select-none"
      style={{
        width:     `${w}px`,
        height:    `${bannerH}px`,
        zIndex:    char.z ?? 2,
        /* superposición para efecto de profundidad */
        marginLeft: '-20px',
      }}
    >

      {/* ── Fallback: orbe + emoji ──────────────────────────── */}
      {(failed || !loaded) && (
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-10">
          {/* Orbe de color */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full blur-2xl opacity-40"
            style={{
              width:`${w * 1.3}px`, height:`${w * 1.3}px`,
              background:`radial-gradient(circle,rgba(${theme.rgb},0.8) 0%,transparent 70%)`,
            }}
          />
          <span
            className="relative z-10"
            style={{
              fontSize: `${Math.round(90 * scale)}px`,
              lineHeight: 1,
              filter: `drop-shadow(0 0 24px rgba(${theme.rgb},0.7))`,
              opacity: failed ? 1 : 0.25,
              transition: 'opacity .3s',
            }}
          >
            {char.emoji}
          </span>
          {failed && (
            <span
              className="relative z-10 mt-2 text-[11px] font-bold tracking-widest uppercase text-center px-2"
              style={{ color: theme.chipColor }}
            >
              {char.name}
            </span>
          )}
        </div>
      )}

      {/* ── Imagen PNG transparente ─────────────────────────── */}
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={char.url}
          alt={char.name}
          onLoad={()  => setLoaded(true)}
          onError={() => { setFailed(true); setLoaded(false) }}
          style={{
            position:       'absolute',
            bottom:         0,
            left:           '50%',
            transform:      'translateX(-50%)',
            width:          '100%',
            height:         '95%',
            objectFit:      'contain',
            objectPosition: 'bottom center',
            opacity:        loaded ? 1 : 0,
            transition:     'opacity .55s ease',
            filter:
              `drop-shadow(0 24px 48px rgba(0,0,0,.90)) ` +
              `drop-shadow(0 0 32px rgba(${theme.rgb},.50))`,
          }}
        />
      )}
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

const BANNER_H = 420

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

      {/* Vignette top + bottom */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background:'linear-gradient(to bottom,rgba(0,0,0,.4) 0%,transparent 22%,transparent 68%,rgba(0,0,0,.55) 100%)' }}
      />

      {/* Oscurecimiento izquierdo para legibilidad del texto */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background:`linear-gradient(90deg,rgba(0,0,0,.65) 0%,rgba(0,0,0,.30) 45%,transparent 70%)` }}
      />

      {/* Glow de acento desde la derecha */}
      <div className="absolute right-0 top-0 bottom-0 w-3/4 pointer-events-none"
        style={{ background:`radial-gradient(ellipse at 90% 55%,rgba(${theme.rgb},.22) 0%,transparent 65%)` }}
      />

      {/* ── LAYOUT ────────────────────────────────────────────── */}
      <div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-stretch"
        style={{ minHeight: `${BANNER_H}px` }}
      >

        {/* TEXTO — izquierda */}
        <div className="flex-1 flex flex-col justify-center py-10 z-10 pr-4 lg:pr-16">

          {/* Chip franquicia */}
          <span
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold rounded-full mb-5 tracking-widest uppercase w-fit"
            style={{ background:theme.chipBg, color:theme.chipColor, border:`1px solid ${theme.chipBorder}` }}
          >
            {theme.emoji} {theme.label}
          </span>

          {/* Título */}
          <h1 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold tracking-tight text-white leading-[1.04] mb-2">
            {franchise}
          </h1>
          <p className="text-2xl sm:text-3xl font-light mb-4 tracking-wide" style={{ color:'rgba(255,255,255,.32)' }}>
            Funko Pops
          </p>

          {/* Tagline */}
          <p className="text-sm sm:text-base max-w-xs mb-6 leading-relaxed" style={{ color:'rgba(255,255,255,.50)' }}>
            {theme.tagline}
          </p>

          {/* Badge de cantidad */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-7 w-fit"
            style={{ background:theme.chipBg, color:theme.chipColor, border:`1px solid ${theme.chipBorder}` }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background:theme.accent }} />
            {count} figura{count!==1?'s':''} disponible{count!==1?'s':''}
          </div>

          {/* Pills de navegación */}
          <div className="flex flex-wrap gap-2">
            {PILLS.map((pill) => {
              const isActive = (pill.label==='Todos' ? '' : pill.label) === activeFranchise
              return (
                <Link
                  key={pill.href}
                  href={pill.href}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={
                    isActive
                      ? { background:theme.accent, color:'#fff', boxShadow:`0 0 14px rgba(${theme.rgb},.45)` }
                      : { background:'rgba(255,255,255,.07)', color:'rgba(255,255,255,.46)', border:'1px solid rgba(255,255,255,.12)' }
                  }
                >
                  {pill.emoji} {pill.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* PERSONAJES — derecha, solo desktop */}
        {/*
          Los personajes están alineados al BOTTOM del contenedor.
          Sobresalen hacia la derecha del contenedor max-w-7xl
          gracias al -marginRight: lo corta overflow:hidden del section.
        */}
        <div
          className="hidden lg:flex items-end justify-end flex-shrink-0 pointer-events-none"
          style={{
            width:       '520px',
            height:      `${BANNER_H}px`,
            marginRight: '-40px',
            paddingLeft: '8px',
          }}
        >
          {theme.chars.map((char) => (
            <Character key={char.name} char={char} theme={theme} bannerH={BANNER_H} />
          ))}
        </div>

      </div>
    </section>
  )
}
