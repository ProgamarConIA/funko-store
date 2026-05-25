#!/usr/bin/env node
/**
 * Auditoría completa: cruza productos activos de Supabase con archivos locales.
 * Detecta: imágenes faltantes, duplicadas entre productos activos, o demasiado pequeñas.
 */
const https  = require('https')
const fs     = require('fs')
const path   = require('path')
const crypto = require('crypto')

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
const PLACEHOLDER  = '/images/funko-placeholder.png'

const C = {
  green:  s => `\x1b[32m${s}\x1b[0m`,
  red:    s => `\x1b[31m${s}\x1b[0m`,
  yellow: s => `\x1b[33m${s}\x1b[0m`,
  gray:   s => `\x1b[90m${s}\x1b[0m`,
}

async function main () {
  const req = https.request(SUPABASE_URL + '/rest/v1/products?select=id,slug,name,category,image_url&limit=300', {
    method: 'GET',
    headers: { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` }
  }, res => {
    const chunks = []
    res.on('data', c => chunks.push(c))
    res.on('end', () => {
      const products = JSON.parse(Buffer.concat(chunks).toString())
      console.log(`\nAuditoría de ${products.length} productos activos\n`)

      const hashToSlugs = {}   // hash → [slug, ...]
      const issues = []

      for (const p of products) {
        if (p.image_url === PLACEHOLDER) {
          console.log(C.gray('PLACEHOLDER  ' + p.slug))
          continue
        }

        const localFile = path.join(FUNKOS_DIR, `${p.slug}.jpg`)

        if (!fs.existsSync(localFile)) {
          issues.push({ type: 'MISSING', slug: p.slug, name: p.name, detail: p.image_url })
          console.log(C.red('MISSING      ' + p.slug))
          continue
        }

        const data = fs.readFileSync(localFile)
        const kb   = Math.round(data.length / 1024)

        if (kb < 8) {
          issues.push({ type: 'TINY', slug: p.slug, name: p.name, detail: `${kb}KB` })
          console.log(C.red('TINY         ' + p.slug + ` (${kb}KB)`))
          continue
        }

        const h = crypto.createHash('md5').update(data).digest('hex')
        if (!hashToSlugs[h]) hashToSlugs[h] = []
        hashToSlugs[h].push(p.slug)
      }

      // Detectar duplicados entre productos activos
      console.log('\n── Duplicados entre productos activos ──────────────────')
      let dupCount = 0
      for (const [h, slugs] of Object.entries(hashToSlugs)) {
        if (slugs.length > 1) {
          dupCount++
          console.log(C.yellow('DUPE: ' + slugs.join(' == ')))
        }
      }
      if (dupCount === 0) console.log(C.green('Ninguno ✓'))

      // Resumen de problemas
      console.log('\n── Resumen ─────────────────────────────────────────────')
      if (issues.length === 0 && dupCount === 0) {
        console.log(C.green('✓ Todas las imágenes de productos activos son correctas y únicas.\n'))
      } else {
        for (const i of issues) console.log(C.red(`${i.type.padEnd(12)} ${i.slug} (${i.name}) → ${i.detail}`))
        console.log(`\nTotal problemas: ${issues.length} + ${dupCount} duplicados\n`)
      }
    })
  })
  req.on('error', e => console.error(e))
  req.end()
}

main()
