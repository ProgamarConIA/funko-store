/**
 * HeroShowcase — sección derecha del hero genérico (sin franquicia activa).
 *
 * Muestra un trío de personajes de Marvel como showcase por defecto.
 * Las imágenes deben colocarse en /public/characters/marvel/
 * (PNG transparente, 400×600 px mínimo).
 * Si no existen, se muestran emojis de fallback automáticamente.
 */

import CharacterTrio from './CharacterTrio'

// Trio por defecto — personajes Marvel icónicos
// Reemplazar src con rutas reales una vez descargadas las imágenes
const LEFT   = { src: '/characters/marvel/iron-man.png',   alt: 'Iron Man',   emoji: '⚙️' }
const CENTER = { src: '/characters/marvel/spider-man.png', alt: 'Spider-Man', emoji: '🕷️' }
const RIGHT  = { src: '/characters/marvel/wolverine.png',  alt: 'Wolverine',  emoji: '🦁' }

// Color del glow — acento de marca (violeta)
const GLOW   = 'rgba(88,86,214,0.50)'

// Debe coincidir con el bg del hero genérico: bg-[#F8F7FF] / bg: '#F8F7FF'
const FADE   = '#F8F7FF'

export default function HeroShowcase() {
  return (
    <CharacterTrio
      left  ={LEFT}
      center={CENTER}
      right ={RIGHT}
      glow  ={GLOW}
      fadeTo={FADE}
      height={360}
      width ={440}
    />
  )
}
