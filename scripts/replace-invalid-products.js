/**
 * replace-invalid-products.js
 *
 * Reemplaza los 4 productos con placeholders (zelda, samus, link-totk, gordon-freeman)
 * por Funko Pops reales y oficiales de videojuegos.
 *
 * Reemplazos:
 *   funko-pop-zelda        → Spyro the Dragon #529
 *   funko-pop-samus-aran   → Crash Bandicoot #532
 *   funko-pop-link-totk    → Mega Man #376
 *   funko-pop-gordon-freeman → Vault Boy #373
 */

const https = require('https')
const fs    = require('fs')
const path  = require('path')

// ─── Config ───────────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://qqpkswgmywaghftklkvw.supabase.co'
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxcGtzd2dteXdhZ2hmdGtsa3Z3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTY0Njc4NywiZXhwIjoyMDk1MjIyNzg3fQ.I-t7b-bsz-Vu6MLdGYgru0o7bQ2lYPZ85dGABjCb1ck'
const FUNKOS_DIR   = path.join(process.cwd(), 'public', 'funkos')

// ─── Reemplazos definidos ─────────────────────────────────────────────────────
const REPLACEMENTS = [
  {
    // Producto actual
    currentSlug: 'funko-pop-zelda',
    currentId:   '14ed2c75-659f-456c-8de4-07f0c91a26ea',
    // Producto nuevo — Funko Pop real y oficial
    newName:     'Funko Pop! Games: Spyro the Dragon #529',
    newSlug:     'funko-pop-spyro',
    imageUrl:    'https://tools.toywiz.com/_images/_webp/_products/lg/funkospyro43346.webp',
  },
  {
    currentSlug: 'funko-pop-samus-aran',
    currentId:   '53f32508-f6cf-4fcb-b226-7f85f95a5815',
    newName:     'Funko Pop! Games: Crash Bandicoot #532',
    newSlug:     'funko-pop-crash-bandicoot',
    imageUrl:    'https://tools.toywiz.com/_images/_webp/_products/lg/funko43343.webp',
  },
  {
    currentSlug: 'funko-pop-link-totk',
    currentId:   '0251ef08-b1aa-4c2e-8657-882da8e8e777',
    newName:     'Funko Pop! Games: Mega Man #376',
    newSlug:     'funko-pop-mega-man',
    imageUrl:    'https://tools.toywiz.com/_images/_webp/_products/lg/funkopopmegamanjumping.webp',
  },
  {
    currentSlug: 'funko-pop-gordon-freeman',
    currentId:   'f378aa1d-b08c-4b14-bc60-c68df970295a',
    newName:     'Funko Pop! Games: Vault Boy #373',
    newSlug:     'funko-pop-vault-boy',
    imageUrl:    'https://tools.toywiz.com/_images/_webp/_products/lg/pop33991.webp',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function download(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath)
    const request = (u) => {
      https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close()
          request(res.headers.location)
          return
        }
        if (res.statusCode !== 200) {
          file.close()
          fs.unlink(destPath, () => {})
          return reject(new Error(`HTTP ${res.statusCode} for ${u}`))
        }
        res.pipe(file)
        file.on('finish', () => file.close(() => resolve()))
        file.on('error', reject)
      }).on('error', reject)
    }
    request(url)
  })
}

function supabasePatch(id, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body)
    const url  = new URL(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`)
    const opts = {
      hostname: url.hostname,
      path:     url.pathname + url.search,
      method:   'PATCH',
      headers: {
        'apikey':         SERVICE_KEY,
        'Authorization':  `Bearer ${SERVICE_KEY}`,
        'Content-Type':   'application/json',
        'Content-Length': Buffer.byteLength(data),
        'Prefer':         'return=minimal',
      },
    }
    const req = https.request(opts, (res) => {
      let body = ''
      res.on('data', (d) => (body += d))
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve(res.statusCode)
        else reject(new Error(`Supabase PATCH ${res.statusCode}: ${body}`))
      })
    })
    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  for (const r of REPLACEMENTS) {
    console.log(`\n──────────────────────────────────────────`)
    console.log(`Procesando: ${r.currentSlug} → ${r.newSlug}`)

    const destFile     = path.join(FUNKOS_DIR, `${r.newSlug}.jpg`)
    const oldFile      = path.join(FUNKOS_DIR, `${r.currentSlug}.jpg`)

    // 1. Descargar imagen nueva
    try {
      await download(r.imageUrl, destFile)
      const size = fs.statSync(destFile).size
      console.log(`  ✅ Imagen descargada: ${r.newSlug}.jpg (${size} bytes)`)
    } catch (err) {
      console.error(`  ❌ Error descargando imagen: ${err.message}`)
      continue
    }

    // 2. Actualizar Supabase
    const patchBody = {
      name:      r.newName,
      slug:      r.newSlug,
      image_url: `/funkos/${r.newSlug}.jpg`,
    }
    try {
      const status = await supabasePatch(r.currentId, patchBody)
      console.log(`  ✅ Supabase actualizado (HTTP ${status}): ${JSON.stringify(patchBody)}`)
    } catch (err) {
      console.error(`  ❌ Error actualizando Supabase: ${err.message}`)
      // Rollback: eliminar imagen descargada
      if (fs.existsSync(destFile)) fs.unlinkSync(destFile)
      continue
    }

    // 3. Eliminar archivo viejo (batman placeholder)
    if (fs.existsSync(oldFile)) {
      fs.unlinkSync(oldFile)
      console.log(`  🗑️  Eliminado archivo viejo: ${r.currentSlug}.jpg`)
    }
  }

  console.log('\n══════════════════════════════════════════')
  console.log('Proceso completado.')
  console.log('Ejecutar: npm run audit-images para verificar.')
}

main().catch((err) => {
  console.error('Error fatal:', err)
  process.exit(1)
})
