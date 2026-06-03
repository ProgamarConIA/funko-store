'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import HeroSlide, { type SlideData } from './HeroSlide'

const SLIDES: SlideData[] = [
  {
    id:           1,
    badge:        '🦸 Marvel Universe',
    badgeBg:      'rgba(232,41,60,.15)',
    badgeColor:   '#FF8090',
    badgeBorder:  'rgba(232,41,60,.40)',
    title:        'Colección Marvel',
    subtitle:     'Iron Man, Spider-Man, Thor y los héroes más icónicos del universo Marvel.',
    cta:          'Ver colección',
    href:         '/?franchise=Marvel',
    accent:       '#E8293C',
    accentRgb:    '232,41,60',
    bg:           'linear-gradient(135deg,#060000 0%,#1a0408 45%,#2a060f 75%,#0d0102 100%)',
    patternImage: 'radial-gradient(circle,rgba(232,41,60,.18) 1.5px,transparent 1.5px)',
    patternSize:  '28px 28px',
    character:    '/characters/marvel/spider-man.png',
    characterAlt: 'Spider-Man Funko Pop',
    glowColor:    'rgba(232,41,60,.45)',
  },
  {
    id:           2,
    badge:        '🦇 Universo DC',
    badgeBg:      'rgba(30,144,255,.14)',
    badgeColor:   '#72B8FF',
    badgeBorder:  'rgba(30,144,255,.35)',
    title:        'DC Universe',
    subtitle:     'Batman, Superman y la Liga de la Justicia. Guardianes de Gotham y Metrópolis.',
    cta:          'Explorar DC',
    href:         '/?franchise=DC',
    accent:       '#1E90FF',
    accentRgb:    '30,144,255',
    bg:           'linear-gradient(135deg,#000207 0%,#03091e 45%,#060f2b 75%,#010313 100%)',
    patternImage: 'linear-gradient(rgba(30,144,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(30,144,255,.08) 1px,transparent 1px)',
    patternSize:  '44px 44px',
    character:    '/characters/dc/batman.png',
    characterAlt: 'Batman Funko Pop',
    glowColor:    'rgba(30,144,255,.45)',
  },
  {
    id:           3,
    badge:        '⚡ Anime Collection',
    badgeBg:      'rgba(255,107,107,.18)',
    badgeColor:   '#FF9999',
    badgeBorder:  'rgba(255,107,107,.40)',
    title:        'Anime Collection',
    subtitle:     'Dragon Ball, Naruto, One Piece y los guerreros más épicos del anime.',
    cta:          'Ver Anime',
    href:         '/?franchise=Anime',
    accent:       '#FF6B6B',
    accentRgb:    '255,107,107',
    bg:           'linear-gradient(135deg,#080012 0%,#150325 45%,#220540 75%,#0c0218 100%)',
    patternImage: 'repeating-linear-gradient(-45deg,rgba(255,107,107,.07),rgba(255,107,107,.07) 1px,transparent 1px,transparent 18px)',
    patternSize:  'auto',
    character:    '/characters/anime/goku.png',
    characterAlt: 'Goku Funko Pop',
    glowColor:    'rgba(255,107,107,.45)',
  },
  {
    id:           4,
    badge:        '🌌 Galaxia Muy Lejana',
    badgeBg:      'rgba(65,105,225,.15)',
    badgeColor:   '#88AAFF',
    badgeBorder:  'rgba(65,105,225,.35)',
    title:        'Star Wars',
    subtitle:     'Que la Fuerza te acompañe. Jedi, Sith y toda la galaxia en tu colección.',
    cta:          'Explorar',
    href:         '/?franchise=Star Wars',
    accent:       '#4169E1',
    accentRgb:    '65,105,225',
    bg:           'linear-gradient(135deg,#000103 0%,#020816 45%,#040e22 75%,#010206 100%)',
    patternImage: 'radial-gradient(circle,rgba(255,255,255,.25) 1px,transparent 1px),radial-gradient(circle,rgba(65,105,225,.20) 1.5px,transparent 1.5px)',
    patternSize:  '64px 64px',
    character:    '/characters/star-wars/darth-vader.png',
    characterAlt: 'Darth Vader Funko Pop',
    glowColor:    'rgba(65,105,225,.45)',
  },
  {
    id:           5,
    badge:        '🪄 Mundo Mágico',
    badgeBg:      'rgba(197,160,40,.14)',
    badgeColor:   '#DDBB55',
    badgeBorder:  'rgba(197,160,40,.35)',
    title:        'Harry Potter',
    subtitle:     'Hogwarts siempre será tu hogar. Coleccioná la magia de la saga más legendaria.',
    cta:          'Ver Harry Potter',
    href:         '/?franchise=Harry Potter',
    accent:       '#C5A028',
    accentRgb:    '197,160,40',
    bg:           'linear-gradient(135deg,#030210 0%,#0b0520 45%,#160a30 75%,#07030e 100%)',
    patternImage: 'radial-gradient(ellipse,rgba(197,160,40,.18) 1.5px,transparent 1.5px)',
    patternSize:  '38px 38px',
    character:    '/characters/hp/harry-potter.png',
    characterAlt: 'Harry Potter Funko Pop',
    glowColor:    'rgba(197,160,40,.45)',
  },
  {
    id:           6,
    badge:        '🎮 Ediciones Especiales',
    badgeBg:      'rgba(0,230,118,.12)',
    badgeColor:   '#66FFB3',
    badgeBorder:  'rgba(0,230,118,.28)',
    title:        'Ediciones Deluxe',
    subtitle:     'Figuras premium para coleccionistas exigentes. Kratos, Master Chief y más.',
    cta:          'Ver Deluxe',
    href:         '/?category=Deluxe',
    accent:       '#00E676',
    accentRgb:    '0,230,118',
    bg:           'linear-gradient(135deg,#010101 0%,#03040f 45%,#050618 75%,#020208 100%)',
    patternImage: 'linear-gradient(rgba(0,230,118,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(0,230,118,.08) 1px,transparent 1px)',
    patternSize:  '22px 22px',
    character:    '/characters/games/kratos.png',
    characterAlt: 'Kratos Funko Pop',
    glowColor:    'rgba(0,230,118,.40)',
  },
]

const AUTOPLAY_MS = 5000

const arrowStyle: React.CSSProperties = {
  background:    'rgba(0,0,0,.45)',
  backdropFilter:'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  border:        '1px solid rgba(255,255,255,.18)',
}

export default function HeroCarousel() {
  const [current,  setCurrent]  = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const total = SLIDES.length

  /* ── Autoplay ─────────────────────────────────────────────────── */
  useEffect(() => {
    if (isPaused) return
    const id = setInterval(() => setCurrent(c => (c + 1) % total), AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [isPaused, total])

  /* ── Navegación ───────────────────────────────────────────────── */
  const goTo = useCallback((i: number) => setCurrent(((i % total) + total) % total), [total])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])
  const next = useCallback(() => goTo(current + 1), [current, goTo])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); prev() }
    if (e.key === 'ArrowRight') { e.preventDefault(); next() }
    if (e.key === 'Home')       { e.preventDefault(); goTo(0) }
    if (e.key === 'End')        { e.preventDefault(); goTo(total - 1) }
  }, [prev, next, goTo, total])

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Destacados de FunkoStore"
      className="relative overflow-hidden border-b border-white/5 select-none"
      style={{ height: 'clamp(320px,52vw,500px)' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* ── Slides ──────────────────────────────────────────────── */}
      {SLIDES.map((slide, i) => (
        <HeroSlide
          key={slide.id}
          slide={slide}
          isActive={i === current}
          index={i}
        />
      ))}

      {/* ── Flecha izquierda ────────────────────────────────────── */}
      <button
        onClick={prev}
        aria-label="Slide anterior"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        style={arrowStyle}
      >
        <ChevronLeft className="w-5 h-5 text-white" aria-hidden />
      </button>

      {/* ── Flecha derecha ──────────────────────────────────────── */}
      <button
        onClick={next}
        aria-label="Slide siguiente"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        style={arrowStyle}
      >
        <ChevronRight className="w-5 h-5 text-white" aria-hidden />
      </button>

      {/* ── Dots ────────────────────────────────────────────────── */}
      <div
        role="tablist"
        aria-label="Navegación del carousel"
        className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5"
      >
        {SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            role="tab"
            aria-selected={i === current}
            aria-label={`Slide ${i + 1}: ${slide.title}`}
            onClick={() => goTo(i)}
            className="rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            style={{
              width:      i === current ? '22px' : '7px',
              height:     '7px',
              background: i === current ? '#fff' : 'rgba(255,255,255,.35)',
            }}
          />
        ))}
      </div>

      {/* ── Barra de progreso ───────────────────────────────────── */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-px z-20 bg-white/10"
      >
        <div
          key={current}
          className="carousel-progress-bar"
          style={{ animationDuration: `${AUTOPLAY_MS}ms`, animationPlayState: isPaused ? 'paused' : 'running' }}
        />
      </div>
    </section>
  )
}
