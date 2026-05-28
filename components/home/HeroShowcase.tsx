import CharacterTrio, { type CharacterSlot } from './CharacterTrio'

interface Trio {
  left:   CharacterSlot
  center: CharacterSlot
  right:  CharacterSlot
  glow:   string
}

const TRIOS: Record<string, Trio> = {
  '': {
    left:   { src: '/characters/games/mario.png',       alt: 'Mario',      emoji: '⭐' },
    center: { src: '/characters/marvel/spider-man.png', alt: 'Spider-Man', emoji: '🕷️' },
    right:  { src: '/characters/disney/stitch.png',     alt: 'Stitch',     emoji: '💙' },
    glow: 'rgba(88,86,214,0.50)',
  },
  Marvel: {
    left:   { src: '/characters/marvel/iron-man.png',   alt: 'Iron Man',   emoji: '⚙️' },
    center: { src: '/characters/marvel/spider-man.png', alt: 'Spider-Man', emoji: '🕷️' },
    right:  { src: '/characters/marvel/wolverine.png',  alt: 'Wolverine',  emoji: '🦁' },
    glow: 'rgba(232,41,60,0.55)',
  },
  DC: {
    left:   { src: '/characters/dc/batman.png',   alt: 'Batman',    emoji: '🦇' },
    center: { src: '/characters/dc/superman.png', alt: 'Superman',  emoji: '🔵' },
    right:  { src: '/characters/dc/flash.png',    alt: 'The Flash', emoji: '⚡' },
    glow: 'rgba(30,144,255,0.55)',
  },
  Disney: {
    left:   { src: '/characters/disney/mickey.png',         alt: 'Mickey Mouse',   emoji: '🐭' },
    center: { src: '/characters/disney/stitch.png',         alt: 'Stitch',         emoji: '💙' },
    right:  { src: '/characters/disney/buzz-lightyear.png', alt: 'Buzz Lightyear', emoji: '🚀' },
    glow: 'rgba(255,215,0,0.55)',
  },
  Anime: {
    left:   { src: '/characters/anime/naruto.png', alt: 'Naruto', emoji: '🍥' },
    center: { src: '/characters/anime/goku.png',   alt: 'Goku',   emoji: '🔥' },
    right:  { src: '/characters/anime/luffy.png',  alt: 'Luffy',  emoji: '⚓' },
    glow: 'rgba(255,107,107,0.55)',
  },
  'Star Wars': {
    left:   { src: '/characters/star-wars/luke.png',        alt: 'Luke Skywalker', emoji: '⚔️' },
    center: { src: '/characters/star-wars/darth-vader.png', alt: 'Darth Vader',    emoji: '🔴' },
    right:  { src: '/characters/star-wars/mandalorian.png', alt: 'Mandalorian',    emoji: '🪖' },
    glow: 'rgba(65,105,225,0.55)',
  },
  'Harry Potter': {
    left:   { src: '/characters/hp/voldemort.png',    alt: 'Voldemort',    emoji: '💀' },
    center: { src: '/characters/hp/harry-potter.png', alt: 'Harry Potter', emoji: '⚡' },
    right:  { src: '/characters/hp/hermione.png',     alt: 'Hermione',     emoji: '📚' },
    glow: 'rgba(197,160,40,0.55)',
  },
  Juegos: {
    left:   { src: '/characters/games/kratos.png',       alt: 'Kratos',       emoji: '🪓' },
    center: { src: '/characters/games/master-chief.png', alt: 'Master Chief', emoji: '🪖' },
    right:  { src: '/characters/games/mario.png',        alt: 'Mario',        emoji: '⭐' },
    glow: 'rgba(0,230,118,0.55)',
  },
}

interface Props {
  franchise?: string
}

export default function HeroShowcase({ franchise = '' }: Props) {
  const trio = TRIOS[franchise] ?? TRIOS['']
  return (
    <CharacterTrio
      left  ={trio.left}
      center={trio.center}
      right ={trio.right}
      glow  ={trio.glow}
      height={360}
      width ={440}
    />
  )
}
