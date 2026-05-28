/**
 * Descarga imágenes placeholder para CharacterTrio desde placehold.co.
 * Cada imagen es un PNG 400×600 con el color temático de la franquicia
 * y el nombre del personaje centrado.
 *
 * Para reemplazar con imágenes reales:
 *   1. Descargá el press kit oficial de cada franquicia (ver URLs en FranchiseBanner.tsx)
 *   2. Redimensioná a 400×600 px, guardá como PNG con fondo transparente
 *   3. Reemplazá el archivo en public/characters/{universe}/{character}.png
 *
 * Uso: node scripts/download-character-placeholders.mjs
 */

import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const ROOT  = join(__dir, '..', 'public', 'characters')

// ── Datos de cada personaje ────────────────────────────────────────────────
// bg/fg: colores hex sin '#' para la URL de placehold.co
const CHARACTERS = [
  // Marvel — rojo oscuro / rojo brillante
  { dir: 'marvel',    file: 'iron-man.png',      label: 'Iron+Man',        bg: '1a0003', fg: 'ff5566' },
  { dir: 'marvel',    file: 'spider-man.png',     label: 'Spider-Man',      bg: '1a0003', fg: 'ff2233' },
  { dir: 'marvel',    file: 'wolverine.png',       label: 'Wolverine',       bg: '1a0003', fg: 'ffcc00' },

  // DC — azul oscuro / azul brillante
  { dir: 'dc',        file: 'batman.png',          label: 'Batman',          bg: '00040f', fg: '4488ff' },
  { dir: 'dc',        file: 'superman.png',         label: 'Superman',        bg: '00040f', fg: '5599ff' },
  { dir: 'dc',        file: 'flash.png',            label: 'The+Flash',       bg: '00040f', fg: 'ff4400' },

  // Disney — azul noche / dorado
  { dir: 'disney',    file: 'mickey.png',           label: 'Mickey+Mouse',    bg: '010520', fg: 'ffd700' },
  { dir: 'disney',    file: 'stitch.png',            label: 'Stitch',          bg: '010520', fg: '66aaff' },
  { dir: 'disney',    file: 'buzz-lightyear.png',    label: 'Buzz+Lightyear',  bg: '010520', fg: 'ffffff' },

  // Anime — violeta oscuro / rosa/naranja
  { dir: 'anime',     file: 'naruto.png',            label: 'Naruto',          bg: '120010', fg: 'ff9900' },
  { dir: 'anime',     file: 'goku.png',              label: 'Goku',            bg: '120010', fg: 'ffdd00' },
  { dir: 'anime',     file: 'luffy.png',             label: 'Luffy',           bg: '120010', fg: 'ff4444' },

  // Star Wars — negro espacio / azul/rojo sable
  { dir: 'star-wars', file: 'luke.png',              label: 'Luke+Skywalker',  bg: '000208', fg: '4488ff' },
  { dir: 'star-wars', file: 'darth-vader.png',       label: 'Darth+Vader',     bg: '000208', fg: 'ff2222' },
  { dir: 'star-wars', file: 'mandalorian.png',        label: 'Mandalorian',     bg: '000208', fg: 'aabbcc' },

  // Harry Potter — índigo / dorado
  { dir: 'hp',        file: 'voldemort.png',          label: 'Voldemort',       bg: '050018', fg: '8888ff' },
  { dir: 'hp',        file: 'harry-potter.png',       label: 'Harry+Potter',    bg: '050018', fg: 'c5a028' },
  { dir: 'hp',        file: 'hermione.png',            label: 'Hermione',        bg: '050018', fg: 'ddbb55' },

  // Juegos — negro / verde neón
  { dir: 'games',     file: 'kratos.png',             label: 'Kratos',          bg: '010101', fg: 'cc2200' },
  { dir: 'games',     file: 'master-chief.png',        label: 'Master+Chief',    bg: '010101', fg: '00cc55' },
  { dir: 'games',     file: 'mario.png',               label: 'Mario',           bg: '010101', fg: 'ff4400' },
]

// ── Descarga ───────────────────────────────────────────────────────────────
let ok = 0, fail = 0

for (const { dir, file, label, bg, fg } of CHARACTERS) {
  const folder = join(ROOT, dir)
  mkdirSync(folder, { recursive: true })

  const url  = `https://placehold.co/400x600/${bg}/${fg}/png?text=${label}`
  const dest = join(folder, file)

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(10_000),
      headers: { 'User-Agent': 'funko-store-dev/1.0' },
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const buf = Buffer.from(await res.arrayBuffer())
    writeFileSync(dest, buf)
    console.log(`✓  ${dir}/${file}  (${(buf.length / 1024).toFixed(1)} KB)`)
    ok++
  } catch (err) {
    console.error(`✗  ${dir}/${file}  → ${err.message}`)
    fail++
  }
}

console.log(`\n${ok} descargadas, ${fail} fallidas.`)
if (fail > 0) console.log('Revisá la conexión a internet o el servicio placehold.co')
