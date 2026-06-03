import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import CharacterTrio, { type CharacterSlot } from './CharacterTrio'

export interface SlideCharacters {
  left:   CharacterSlot
  center: CharacterSlot
  right:  CharacterSlot
}

export interface SlideData {
  id:           number
  badge:        string
  badgeBg:      string
  badgeColor:   string
  badgeBorder:  string
  title:        string
  subtitle:     string
  cta:          string
  href:         string
  accent:       string
  accentRgb:    string
  bg:           string
  patternImage: string
  patternSize:  string
  glowColor:    string
  /** Color dominante del fondo del slide — se usa en CharacterTrio.fadeTo */
  fadeTo:       string
  characters:   SlideCharacters
}

interface Props {
  slide:    SlideData
  isActive: boolean
  index:    number
}

export default function HeroSlide({ slide, isActive }: Props) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={slide.title}
      aria-hidden={!isActive}
      className="absolute inset-0"
      style={{
        opacity:       isActive ? 1 : 0,
        transition:    'opacity 500ms ease-in-out',
        pointerEvents: isActive ? 'auto' : 'none',
      }}
    >
      {/* ── Fondo base ─────────────────────────────────────────── */}
      <div className="absolute inset-0" style={{ background: slide.bg }} />

      {/* ── Patrón de fondo ────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: slide.patternImage, backgroundSize: slide.patternSize }}
      />

      {/* ── Degradado izquierdo (oscurece el área del texto) ───── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg,rgba(0,0,0,.90) 0%,rgba(0,0,0,.60) 38%,rgba(0,0,0,.22) 58%,transparent 72%)',
        }}
      />

      {/* ── Vignette vertical ──────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom,rgba(0,0,0,.55) 0%,transparent 18%,transparent 65%,rgba(0,0,0,.65) 100%)',
        }}
      />

      {/* ── Resplandor de acento (derecha) ─────────────────────── */}
      <div
        className="absolute right-0 top-0 bottom-0 w-3/5 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 75% 50%, ${slide.glowColor} 0%, transparent 55%)`,
        }}
      />

      {/* ── Layout principal ───────────────────────────────────── */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">

        {/* ── Texto (izquierda) ─────────────────────────────────── */}
        <div className="flex flex-col justify-center py-8 sm:py-12 z-10 flex-1 max-w-lg">

          <span
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold rounded-full mb-4 sm:mb-5 tracking-widest uppercase w-fit"
            style={{
              background: slide.badgeBg,
              color:      slide.badgeColor,
              border:     `1px solid ${slide.badgeBorder}`,
            }}
          >
            {slide.badge}
          </span>

          <h2
            className="font-extrabold text-white tracking-tight leading-tight mb-3"
            style={{ fontSize: 'clamp(1.7rem,4vw,3.2rem)' }}
          >
            {slide.title}
          </h2>

          <p
            className="mb-7 sm:mb-8 leading-relaxed"
            style={{
              fontSize: 'clamp(.85rem,1.5vw,1.05rem)',
              color:    'rgba(255,255,255,.62)',
              maxWidth: '380px',
            }}
          >
            {slide.subtitle}
          </p>

          <Link
            href={slide.href}
            tabIndex={isActive ? 0 : -1}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white w-fit transition-all duration-200 hover:scale-105 hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            style={{
              background: slide.accent,
              boxShadow:  `0 4px 24px rgba(${slide.accentRgb},.50)`,
            }}
          >
            {slide.cta}
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
        </div>

        {/* ── CharacterTrio (solo desktop) ─────────────────────── */}
        <div
          className="hidden lg:block relative flex-shrink-0 self-end"
          style={{ width: '480px', height: '94%' }}
          aria-hidden
        >
          {/* Fade superior — oculta el borde alto de las imágenes */}
          <div
            className="absolute top-0 left-0 right-0 z-30 pointer-events-none"
            style={{
              height:     '28%',
              background: `linear-gradient(to bottom, ${slide.fadeTo} 0%, transparent 100%)`,
            }}
          />

          <CharacterTrio
            left   ={slide.characters.left}
            center ={slide.characters.center}
            right  ={slide.characters.right}
            glow   ={slide.glowColor}
            fadeTo ={slide.fadeTo}
            height ={480}
            width  ={480}
          />
        </div>
      </div>
    </div>
  )
}
