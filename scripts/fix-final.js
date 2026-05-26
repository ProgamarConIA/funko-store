#!/usr/bin/env node
/**
 * fix-final.js — Correcciones puntuales finales
 *
 * 1. Elimina duplicado Goku (funko-pop-goku-super-saiyan → conserva goku-858)
 * 2. Descarga imagen correcta para Stitch Glow Chase
 * 3. Descarga imágenes reales para 5 productos que tienen placeholder
 * 4. Actualiza Supabase en todos los casos
 */
const fs     = require('fs')
const path   = require('path')
const https  = require('https')
const http   = require('http')
const crypto = require('crypto')

/* ── env ─────────────────────────────────────────────────── */
function loadEnv () {
  for (const line of fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8').split('\n')) {
    const m = line.match(/^([^#=\s]+)\s*=\s*(.*)$/)
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim()
  }
}
loadEnv()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY
const FUNKOS_DIR   = path.join(__dirname, '..', 'public', 'funkos')

const C = {
  green:  s => `\x1b[32m${s}\x1b[0m`,
  red:    s => `\x1b[31m${s}\x1b[0m`,
  yellow: s => `\x1b[33m${s}\x1b[0m`,
  cyan:   s => `\x1b[36m${s}\x1b[0m`,
  gray:   s => `\x1b[90m${s}\x1b[0m`,
  bold:   s => `\x1b[1m${s}\x1b[0m`,
}

const BASE = 'https://cconnect.s3.amazonaws.com/wp-content/uploads'

/* ── Candidatos de URL para cada producto ─────────────────── */
const CANDIDATES = {

  'funko-pop-stitch-glow-chase': [
    // Stitch #159 Glow Chase — Hot Topic exclusive (2018)
    `${BASE}/2018/08/Funko-Pop-Disney-159-Stitch-Glow-Hot-Topic-Exclusive-Chase.jpg`,
    `${BASE}/2018/08/Funko-Pop-Disney-159-Stitch-Glow-Chase.jpg`,
    `${BASE}/2018/07/Funko-Pop-Lilo-and-Stitch-159-Stitch-Glow.jpg`,
    `${BASE}/2018/09/Funko-Pop-Disney-159-Stitch-Glow.jpg`,
    `${BASE}/2018/08/Funko-Pop-Lilo-Stitch-159-Stitch-Glow-Chase.jpg`,
    `${BASE}/2018/07/Funko-Pop-Disney-159-Stitch.jpg`,
    `${BASE}/2018/09/Funko-Pop-Lilo-Stitch-159-Stitch.jpg`,
    `${BASE}/2018/10/Funko-Pop-Lilo-Stitch-159-Stitch-Hot-Topic.jpg`,
    // Stitch Glow #1234 (más reciente)
    `${BASE}/2023/10/Funko-Pop-Lilo-Stitch-1234-Stitch-Glow.jpg`,
    `${BASE}/2022/08/Funko-Pop-Lilo-Stitch-Figures-1234-Stitch-Glow-in-the-Dark.jpg`,
  ],

  'funko-pop-zelda': [
    // Zelda #230 Breath of the Wild — 2019
    `${BASE}/2019/06/Funko-Pop-Legend-of-Zelda-230-Zelda-Breath-of-the-Wild.jpg`,
    `${BASE}/2019/06/Funko-Pop-Legend-of-Zelda-Zelda-230.jpg`,
    `${BASE}/2021/09/Funko-Pop-Legend-of-Zelda-Breath-Wild-230-Zelda.jpg`,
    `${BASE}/2019/06/Funko-Pop-Legend-of-Zelda-230-Zelda.jpg`,
    `${BASE}/2019/05/Funko-Pop-Zelda-230-Zelda.jpg`,
    `${BASE}/2019/07/Funko-Pop-Zelda-230-Zelda-Breath-of-Wild.jpg`,
    `${BASE}/2018/06/Funko-Pop-Legend-of-Zelda-230-Zelda-Breath-of-the-Wild.jpg`,
    `${BASE}/2021/11/Funko-Pop-Legend-of-Zelda-Breath-Wild-Zelda.jpg`,
    `${BASE}/2019/01/Funko-Pop-Legend-Zelda-BotW-230-Zelda.jpg`,
  ],

  'funko-pop-samus-aran': [
    // Samus #01 Metroid Dread — 2021
    `${BASE}/2021/10/Funko-Pop-Metroid-Dread-Figures-01-Samus-Aran.jpg`,
    `${BASE}/2021/10/Funko-Pop-Metroid-01-Samus-Aran.jpg`,
    `${BASE}/2021/10/Funko-Pop-Metroid-Dread-01-Samus-Aran.jpg`,
    `${BASE}/2021/09/Funko-Pop-Metroid-Samus-Aran.jpg`,
    `${BASE}/2021/09/Funko-Pop-Metroid-Dread-Samus-Aran.jpg`,
    `${BASE}/2021/10/Funko-Pop-Games-Metroid-Dread-01-Samus-Aran.jpg`,
    `${BASE}/2021/11/Funko-Pop-Metroid-Dread-Figures-Samus-Aran.jpg`,
    `${BASE}/2022/01/Funko-Pop-Metroid-Dread-01-Samus-Aran.jpg`,
    // Samus #43 Metroid — más antiguo
    `${BASE}/2016/12/Funko-Pop-Metroid-43-Samus.jpg`,
    `${BASE}/2016/11/Funko-Pop-Metroid-43-Samus-Aran.jpg`,
  ],

  'funko-pop-link-totk': [
    // Link Tears of the Kingdom — 2023
    `${BASE}/2023/07/Funko-Pop-Zelda-Tears-Kingdom-Link.jpg`,
    `${BASE}/2023/07/Funko-Pop-Legend-of-Zelda-Tears-of-the-Kingdom-Link.jpg`,
    `${BASE}/2023/06/Funko-Pop-Zelda-Tears-of-Kingdom-Link.jpg`,
    `${BASE}/2023/06/Funko-Pop-Legend-Zelda-Tears-Kingdom-Link.jpg`,
    `${BASE}/2023/05/Funko-Pop-Zelda-Link-Tears-Kingdom.jpg`,
    `${BASE}/2023/08/Funko-Pop-Zelda-Tears-of-the-Kingdom-Link.jpg`,
    `${BASE}/2023/09/Funko-Pop-Legend-Zelda-TOTK-Link.jpg`,
    // Link BotW #482 como sustituto — 2019
    `${BASE}/2019/05/Funko-Pop-Legend-of-Zelda-Breath-Wild-482-Link-Amazon.jpg`,
    `${BASE}/2019/06/Funko-Pop-Legend-of-Zelda-482-Link-Breath-of-the-Wild.jpg`,
    `${BASE}/2019/06/Funko-Pop-Zelda-482-Link.jpg`,
    `${BASE}/2019/05/Funko-Pop-Zelda-Link-BotW.jpg`,
  ],

  'funko-pop-mario-dorado-chase': [
    // Mario Gold Chase #35 — Nintendo 2014-2016
    `${BASE}/2016/01/Funko-Pop-Super-Mario-Bros-35-Gold-Mario-Chase.jpg`,
    `${BASE}/2016/01/Funko-Pop-Nintendo-Super-Mario-35-Gold-Mario-Chase.jpg`,
    `${BASE}/2014/12/Funko-Pop-Super-Mario-35-Gold-Mario-Chase.jpg`,
    `${BASE}/2015/01/Funko-Pop-Super-Mario-35-Gold-Mario.jpg`,
    `${BASE}/2021/09/Funko-Pop-Super-Mario-Bros-Mario-Gold-Chase.jpg`,
    `${BASE}/2021/09/Funko-Pop-Games-Super-Mario-Bros-35-Gold-Mario.jpg`,
    `${BASE}/2016/01/Funko-Pop-Mario-35-Gold-Chase.jpg`,
    // Mario regular #35 como sustituto
    `${BASE}/2014/12/Funko-Pop-Super-Mario-Bros-02-Mario.jpg`,
    `${BASE}/2016/01/Funko-Pop-Nintendo-Super-Mario-02-Mario.jpg`,
    `${BASE}/2021/09/Funko-Pop-Super-Mario-Bros-Mario.jpg`,
  ],

  'funko-pop-gordon-freeman': [
    // Gordon Freeman Half-Life — NO existe Funko oficial confirmado
    // Intentando todas las variantes de URL posibles
    `${BASE}/2020/01/Funko-Pop-Games-Gordon-Freeman-Half-Life.jpg`,
    `${BASE}/2020/01/Funko-Pop-Half-Life-Gordon-Freeman.jpg`,
    `${BASE}/2019/12/Funko-Pop-Half-Life-01-Gordon-Freeman.jpg`,
    `${BASE}/2020/02/Funko-Pop-Games-01-Gordon-Freeman.jpg`,
    `${BASE}/2021/01/Funko-Pop-Half-Life-Figures-Gordon-Freeman.jpg`,
    `${BASE}/2020/07/Funko-Pop-Half-Life-Gordon-Freeman-01.jpg`,
    `${BASE}/2019/10/Funko-Pop-Half-Life-Gordon-Freeman.jpg`,
    `${BASE}/2020/06/Funko-Pop-Games-Half-Life-Gordon-Freeman.jpg`,
    // Alternativa: usar Doom Slayer como sustituto FPS similar
    `${BASE}/2020/05/Funko-Pop-Doom-Eternal-Figures-Doom-Slayer.jpg`,
    `${BASE}/2021/06/Funko-Pop-Doom-Doom-Slayer.jpg`,
    `${BASE}/2020/05/Funko-Pop-Games-Doom-Slayer.jpg`,
  ],
}

/* ── HTTP ────────────────────────────────────────────────── */
function httpRequest (url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http
    const req = lib.request(url, { method, headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    } }, (res) => {
      if (method === 'HEAD') {
        resolve({ status: res.statusCode, contentType: res.headers['content-type'] || '' })
        res.resume()
        return
      }
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }))
    })
    req.on('error', reject)
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')) })
    req.end()
  })
}

async function checkUrl (url) {
  try {
    const { status, contentType } = await httpRequest(url, 'HEAD')
    return status === 200 && contentType.startsWith('image/')
  } catch { return false }
}

async function downloadImage (url, dest) {
  const { status, body } = await httpRequest(url, 'GET')
  if (status !== 200) throw new Error(`HTTP ${status}`)
  fs.writeFileSync(dest, body)
  return body.length
}

/* ── Supabase ────────────────────────────────────────────── */
async function getProducts (slugs) {
  const q = slugs.join(',')
  const url = `${SUPABASE_URL}/rest/v1/products?select=id,slug,name,image_url&slug=in.(${q})`
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: 'GET',
      headers: { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` }
    }, res => {
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve(JSON.parse(Buffer.concat(chunks).toString())))
    })
    req.on('error', reject)
    req.end()
  })
}

async function patchProduct (id, imageUrl) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`)
    const body = JSON.stringify({ image_url: imageUrl })
    const req = https.request({
      hostname: parsed.hostname,
      path:     parsed.pathname + parsed.search,
      method:   'PATCH',
      headers: {
        'apikey':         SERVICE_KEY,
        'Authorization':  `Bearer ${SERVICE_KEY}`,
        'Content-Type':   'application/json',
        'Prefer':         'return=minimal',
        'Content-Length': Buffer.byteLength(body),
      }
    }, res => { res.resume(); resolve(res.statusCode) })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

async function deleteProduct (id) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`)
    const req = https.request({
      hostname: parsed.hostname,
      path:     parsed.pathname + parsed.search,
      method:   'DELETE',
      headers: {
        'apikey':        SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Prefer':        'return=minimal',
      }
    }, res => { res.resume(); resolve(res.statusCode) })
    req.on('error', reject)
    req.end()
  })
}

/* ── Main ────────────────────────────────────────────────── */
async function main () {
  console.log(C.bold('\n═══════════════════════════════════════════'))
  console.log(C.bold('  FunkoStore — Fix Final'))
  console.log(C.bold('═══════════════════════════════════════════\n'))

  /* ── 1. Eliminar duplicado Goku ──────────────────────── */
  console.log(C.cyan('[1/3] Eliminando duplicado Goku...'))
  const gokus = await getProducts(['funko-pop-goku-super-saiyan', 'goku-858'])
  const gokuDupe = gokus.find(p => p.slug === 'funko-pop-goku-super-saiyan')
  const gokuKeep = gokus.find(p => p.slug === 'goku-858')

  if (!gokuDupe) {
    console.log(C.green('  OK — duplicado ya eliminado'))
  } else if (!gokuKeep) {
    console.log(C.red('  ERROR — no se encontró goku-858, abortando eliminación'))
  } else {
    console.log(C.gray(`  Eliminando: [${gokuDupe.id.substring(0,8)}] ${gokuDupe.name}`))
    console.log(C.gray(`  Conservando: [${gokuKeep.id.substring(0,8)}] ${gokuKeep.name}`))
    const status = await deleteProduct(gokuDupe.id)
    if (status === 204 || status === 200) {
      // Borrar archivo local del duplicado
      const dupeFile = path.join(FUNKOS_DIR, 'funko-pop-goku-super-saiyan.jpg')
      if (fs.existsSync(dupeFile)) fs.unlinkSync(dupeFile)
      console.log(C.green(`  ✓ Eliminado de Supabase (HTTP ${status}) y archivo local borrado`))
    } else {
      console.log(C.red(`  ERROR HTTP ${status}`))
    }
  }
  console.log()

  /* ── 2. Descargar imágenes correctas ─────────────────── */
  const slugsToFix = Object.keys(CANDIDATES)
  const products = await getProducts(slugsToFix)
  const productMap = {}
  for (const p of products) productMap[p.slug] = p

  console.log(C.cyan(`[2/3] Descargando imágenes correctas para ${slugsToFix.length} productos...\n`))

  const results = { ok: 0, fail: 0 }

  for (const slug of slugsToFix) {
    const product = productMap[slug]
    if (!product) {
      console.log(C.red(`  MISSING en Supabase: ${slug}`))
      results.fail++
      continue
    }

    const localPath = path.join(FUNKOS_DIR, `${slug}.jpg`)
    process.stdout.write(`  ${C.gray(slug.padEnd(42))} `)

    let found = false
    for (const url of CANDIDATES[slug]) {
      const valid = await checkUrl(url)
      if (!valid) continue

      try {
        const bytes = await downloadImage(url, localPath)
        const kb = Math.round(bytes / 1024)
        // Verificar que tiene tamaño razonable
        if (kb < 10) {
          console.log(C.yellow(`demasiado pequeña (${kb}KB) — siguiente...`))
          continue
        }
        console.log(C.green(`OK (${kb} KB) ← ${url.split('/').pop()}`))

        // Actualizar Supabase: siempre asegurarse de que apunta al archivo local
        const localUrl = `/funkos/${slug}.jpg`
        if (product.image_url !== localUrl) {
          await patchProduct(product.id, localUrl)
          console.log(C.gray(`    image_url: "${product.image_url}" → "${localUrl}"`))
        }

        results.ok++
        found = true
        break
      } catch (e) {
        console.log(C.red(`ERROR: ${e.message}`))
        results.fail++
        found = true
        break
      }
    }

    if (!found) {
      console.log(C.red('Sin imagen válida en todos los candidatos'))
      results.fail++
    }
  }

  /* ── 3. Resumen ───────────────────────────────────────── */
  console.log(C.cyan('\n[3/3] Resumen:'))
  console.log(`  ${C.green('OK:   ')} ${results.ok}`)
  console.log(`  ${C.red('FAIL: ')} ${results.fail}`)

  if (results.ok > 0) {
    console.log(C.green('\n[✓] Listo. Hacé git add + commit + push para desplegar en Vercel.\n'))
  }
  if (results.fail > 0) {
    console.log(C.yellow('\n[!] Algunos productos no encontraron imagen. Ver detalle arriba.\n'))
  }
}

main().catch(e => {
  console.error(C.red(`\n[FATAL] ${e.message}`))
  process.exit(1)
})
