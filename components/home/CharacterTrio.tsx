'use client'

/**
 * CharacterTrio — grupo de 3 personajes en capas con profundidad 3D.
 *
 * Composición:
 *   - Personaje izquierdo  : z=10, 84% de altura, alineado al fondo
 *   - Personaje central    : z=20, 100% de altura (más alto/al frente)
 *   - Personaje derecho    : z=10, 84% de altura, alineado al fondo
 *
 * Efectos visuales:
 *   - Glow difuso detrás del grupo (color temático)
 *   - drop-shadow individual por personaje
 *   - Resplandor de suelo ("ground glow") bajo los pies
 *   - Máscara de degradado inferior opcional (para integrar con el fondo de la sección)
 *
 * Imágenes recomendadas:
 *   - Formato : PNG con fondo transparente
 *   - Tamaño  : 400 × 600 px mínimo (ratio 2:3)
 *   - Ruta    : /public/characters/{universe}/{character}.png
 *
 * Mientras no existan las imágenes reales, el componente muestra los emojis
 * de fallback automáticamente gracias al handler onError de Next/Image.
 */

import Image from 'next/image'
import { useState } from 'react'

export interface CharacterSlot {
  /** Ruta local /public/... o URL externa. PNG transparente recomendado. */
  src:    string
  alt:    string
  /** Emoji que se muestra si la imagen falla (404, error de red, etc.) */
  emoji?: string
}

interface CharacterTrioProps {
  left:    CharacterSlot
  center:  CharacterSlot
  right:   CharacterSlot
  /**
   * Color rgba del glow temático, e.g. 'rgba(220,38,38,0.55)'
   * Se aplica al glow de fondo, drop-shadow individual y ground glow.
   */
  glow:    string
  /**
   * Si se pasa, renderiza un degradado inferior que funde los personajes en
   * ese color. Debe coincidir exactamente con el color de fondo de la sección
   * padre (ej: '#F8F7FF' para el hero genérico, '#060000' para Marvel).
   */
  fadeTo?: string
  height?: number
  width?:  number
}

export default function CharacterTrio({
  left,
  center,
  right,
  glow,
  fadeTo,
  height = 380,
  width  = 460,
}: CharacterTrioProps) {
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  return (
    <div
      className="relative select-none"
      style={{ width: `${width}px`, maxWidth: '100%', height: `${height}px` }}
    >
      {/* ── Ambient glow pool ──────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 55% at 50% 92%, ${glow} 0%, transparent 65%)`,
          filter:     'blur(44px)',
          zIndex:     0,
        }}
      />

      {/* ── LEFT character ─────────────────────────────────────────────────── */}
      <div
        style={{ position: 'absolute', bottom: 0, left: 0, width: '42%', height: '84%', zIndex: 10 }}
      >
        {!errors.left ? (
          <Image
            src={left.src}
            alt={left.alt}
            fill
            className="object-contain object-bottom"
            sizes="180px"
            style={{ filter: `drop-shadow(0 0 18px ${glow})` }}
            onError={() => setErrors(p => ({ ...p, left: true }))}
          />
        ) : (
          <div className="absolute inset-0 flex items-end justify-center pb-2">
            <span
              style={{
                fontSize:   '72px',
                lineHeight: 1,
                filter:     `drop-shadow(0 0 16px ${glow})`,
              }}
            >
              {left.emoji ?? '🦸'}
            </span>
          </div>
        )}
      </div>

      {/* ── CENTER character — al frente, más alto ─────────────────────────── */}
      <div
        style={{
          position:  'absolute',
          bottom:    0,
          left:      '50%',
          transform: 'translateX(-50%)',
          width:     '46%',
          height:    '100%',
          zIndex:    20,
        }}
      >
        {!errors.center ? (
          <Image
            src={center.src}
            alt={center.alt}
            fill
            className="object-contain object-bottom"
            sizes="220px"
            style={{ filter: `drop-shadow(0 4px 28px ${glow})` }}
            onError={() => setErrors(p => ({ ...p, center: true }))}
          />
        ) : (
          <div className="absolute inset-0 flex items-end justify-center pb-4">
            <span
              style={{
                fontSize:   '96px',
                lineHeight: 1,
                filter:     `drop-shadow(0 0 24px ${glow})`,
              }}
            >
              {center.emoji ?? '🦸'}
            </span>
          </div>
        )}
      </div>

      {/* ── RIGHT character ────────────────────────────────────────────────── */}
      <div
        style={{ position: 'absolute', bottom: 0, right: 0, width: '42%', height: '84%', zIndex: 10 }}
      >
        {!errors.right ? (
          <Image
            src={right.src}
            alt={right.alt}
            fill
            className="object-contain object-bottom"
            sizes="180px"
            style={{ filter: `drop-shadow(0 0 18px ${glow})` }}
            onError={() => setErrors(p => ({ ...p, right: true }))}
          />
        ) : (
          <div className="absolute inset-0 flex items-end justify-center pb-2">
            <span
              style={{
                fontSize:   '72px',
                lineHeight: 1,
                filter:     `drop-shadow(0 0 16px ${glow})`,
              }}
            >
              {right.emoji ?? '🦸'}
            </span>
          </div>
        )}
      </div>

      {/* ── Ground glow bajo los pies ──────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height:     '52px',
          background: `radial-gradient(ellipse at 50% 100%, ${glow} 0%, transparent 70%)`,
          filter:     'blur(14px)',
          zIndex:     5,
          opacity:    0.65,
        }}
      />

      {/* ── Bottom fade (opcional) — funde los pies en el fondo de la sección ─ */}
      {fadeTo && (
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height:     '40%',
            background: `linear-gradient(to bottom, transparent 0%, ${fadeTo} 100%)`,
            zIndex:     28,
          }}
        />
      )}
    </div>
  )
}
