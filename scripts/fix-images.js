#!/usr/bin/env node
/**
 * FunkoStore — Automatización de imágenes
 * ─────────────────────────────────────────────────────────────
 * • Detecta productos con imágenes incorrectas o rotas
 * • Busca la URL correcta en cconnect.s3.amazonaws.com
 * • Valida 200 OK + Content-Type: image/*
 * • Descarga localmente en /public/funkos/
 * • Actualiza Supabase automáticamente via REST API
 *
 * Uso:
 *   npm run fix-images              → productos con imagen mal
 *   npm run fix-images -- --force   → re-descarga todos
 *   npm run fix-images -- --dry-run → muestra sin guardar
 *   npm run fix-images -- --slug funko-pop-saitama  → producto específico
 */

const fs   = require('fs')
const path = require('path')
const http  = require('http')
const https = require('https')
const crypto = require('crypto')

/* ── Colores ANSI ─────────────────────────────────────────── */
const C = {
  green:  (s) => `\x1b[32m${s}\x1b[0m`,
  red:    (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan:   (s) => `\x1b[36m${s}\x1b[0m`,
  gray:   (s) => `\x1b[90m${s}\x1b[0m`,
  bold:   (s) => `\x1b[1m${s}\x1b[0m`,
}

/* ── Cargar .env.local ────────────────────────────────────── */
function loadEnv () {
  const envPath = path.join(__dirname, '..', '.env.local')
  if (!fs.existsSync(envPath)) {
    console.error(C.red('[ERROR] .env.local no encontrado'))
    process.exit(1)
  }
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([^#=\s]+)\s*=\s*(.*)$/)
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim()
  }
}

loadEnv()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY
const FUNKOS_DIR   = path.join(__dirname, '..', 'public', 'funkos')
const FORCE        = process.argv.includes('--force')
const DRY_RUN      = process.argv.includes('--dry-run')
const TARGET_SLUG  = process.argv.includes('--slug')
  ? process.argv[process.argv.indexOf('--slug') + 1]
  : null

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(C.red('[ERROR] Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local'))
  process.exit(1)
}

/* ── MD5 de los fallbacks incorrectos usados ──────────────── */
// Calculamos el hash de las imágenes-fallback para detectar duplicados
let WRONG_HASHES = new Set()
function loadWrongHashes () {
  const fallbacks = [
    'funko-pop-goku-super-saiyan',  // usado para Anime
    'funko-pop-grogu',               // usado para Star Wars
    'batman-01',                     // usado para Gaming/DC
    'funko-pop-wolverine',           // usado para Marvel
    'funko-pop-loki',                // usado para Marvel/Strange
    'funko-pop-woody',               // usado para Disney
    'stitch-159',                    // usado para Disney
    'funko-pop-jack-skellington',    // usado para Disney
    'superman-01',                   // usado para DC
    'funko-pop-hulk',                // usado para groot-264-chase
    'harry-potter-01',               // usado para funko-pop-harry-potter-capa-chase
    'iron-man-285',                  // usado para funko-pop-iron-man-mark85-chase
  ]
  for (const slug of fallbacks) {
    const f = path.join(FUNKOS_DIR, `${slug}.jpg`)
    if (fs.existsSync(f)) {
      const hash = crypto.createHash('md5').update(fs.readFileSync(f)).digest('hex')
      WRONG_HASHES.add(hash)
    }
  }
  console.log(C.gray(`[INFO] ${WRONG_HASHES.size} hashes de fallbacks incorrectos cargados`))
}

function isWrongImage (filePath) {
  if (!fs.existsSync(filePath)) return true
  const stat = fs.statSync(filePath)
  if (stat.size < 8000) return true  // menos de 8KB = probable placeholder
  const hash = crypto.createHash('md5').update(fs.readFileSync(filePath)).digest('hex')
  return WRONG_HASHES.has(hash)
}

/* ── Productos sin imagen accesible → placeholder ────────── */
// Se asigna el placeholder local cuando:
//   - No existe Funko Pop oficial del personaje, o
//   - El Funko existe pero ningún CDN público expone la imagen
const PLACEHOLDER_URL = '/images/funko-placeholder.png'
const USE_PLACEHOLDER = new Set([
  'funko-pop-zelda',          // Sin Funko Pop oficial de la princesa Zelda
  'funko-pop-samus-aran',     // Sin Funko Pop oficial de Samus Aran
  'funko-pop-link-totk',      // Sin Funko Pop oficial de Link TOTK (solo fan-made)
  'funko-pop-gordon-freeman', // Sin Funko Pop oficial de Gordon Freeman
  'funko-pop-mario-dorado-chase', // Existe (#35 Chase) pero URL inaccesible en todos los CDN
])

/* ── URL candidates ──────────────────────────────────────── */
const BASE = 'https://cconnect.s3.amazonaws.com/wp-content/uploads'

/**
 * Mapa de candidatos: slug → [ url1, url2, ... ] (probados en orden)
 * URLs verificadas directamente en cardboardconnection.com
 */
const CANDIDATES = {

  /* ═══════════════ ANIME ═══════════════════════════════════ */
  'funko-pop-saitama': [
    `${BASE}/2017/06/Funko-Pop-One-Punch-Man-257-Saitama.jpg`,           // ✓ confirmado
    `${BASE}/2019/10/Funko-Pop-One-Punch-Man-Figures-554-Saitama-at-Martial-Arts-Tournament-Hot-Topic-Exclusive-new.jpg`,
    `${BASE}/2020/02/Funko-Pop-One-Punch-Man-Figures-719-Saitama-Casual.jpg`,
  ],
  'funko-pop-tanjiro-kamado': [
    `${BASE}/2021/05/Funko-Pop-Demon-Slayer-Figures-867-Tanjiro-Kamado.jpg`,  // ✓ confirmado
    `${BASE}/2021/05/Funko-Pop-Demon-Slayer-Figures-873-Tanjiro-Kamado-Glow-in-the-Dark-BoxLunch-exclusive.jpg`,
  ],
  'funko-pop-nezuko': [
    `${BASE}/2021/05/Funko-Pop-Demon-Slayer-Figures-868-Nezuko-Kamado.jpg`,   // ✓ confirmado
  ],
  'funko-pop-zoro': [
    `${BASE}/2017/11/Funko-Pop-One-Piece-327-Roronoa-Zoro.jpg`,               // ✓ confirmado
    `${BASE}/2023/01/Funko-Pop-One-Piece-Figures-923-Roronoa-Zoro.jpg`,
  ],
  'funko-pop-sasuke-uchiha': [
    `${BASE}/2016/12/Funko-Pop-Naruto-Shippuden-72-Sasuke.jpg`,               // ✓ confirmado
    `${BASE}/2022/01/Funko-Pop-Naruto-Shippuden-Figures-1023-Sasuke-Rinnegan-AAA-Anime-exclusive-new.jpg`,
  ],
  'funko-pop-itadori-yuji': [
    `${BASE}/2022/07/Funko-Pop-Jujutsu-Kaisen-Figures-1111-Yuji-Itadori-.jpg`, // ✓ confirmado
    `${BASE}/2022/07/Funko-Pop-Jujutsu-Kaisen-Figures-1152-Yuji-Itadori-with-Sakuna-Mouth-Hot-Topic-exclusive.jpg`,
  ],
  'funko-pop-luffy-gear5': [
    // URL confirmada desde popfigures.com CDN (Shopify)
    'https://www.popfigures.com/cdn/shop/files/Luffy_Gear_Five_1607_Funko_Pop_-_One_Piece_-_Figure.jpg?v=1734096849&width=1512',
    `${BASE}/2023/07/Funko-Pop-One-Piece-Figures-1607-Luffy-Gear-Five.jpg`,
    `${BASE}/2023/08/Funko-Pop-One-Piece-1607-Luffy-Gear-Five.jpg`,
  ],
  'funko-pop-pikachu-surfero-chase': [
    // Pikachu Surfing (Let's Go! 2018) - substitute con Pikachu Waving #553
    `${BASE}/2019/09/Funko-Pop-Pokemon-Figures-553-Pikachu-Waving.jpg`,      // ✓ confirmado (sustituto)
    `${BASE}/2020/04/Funko-Pop-Pokemon-Figures-598-Pikachu-Grumpy.jpg`,      // alternativa
    `${BASE}/2019/11/Funko-Pop-Pokemon-Pikachu-Surfing.jpg`,
    `${BASE}/2020/01/Funko-Pop-Pokemon-Figures-Pikachu-Surfing.jpg`,
  ],
  'naruto-727': [
    `${BASE}/2020/02/Funko-Pop-Naruto-Shippuden-Figures-727-Naruto-Uzumaki-Running.jpg`, // ✓ confirmado
    `${BASE}/2016/12/Funko-Pop-Naruto-Shippuden-71-Naruto.jpg`,
  ],
  'pikachu-353': [
    `${BASE}/2018/07/Funko-Pop-Pokemon-353-Pikachu-Target-Exclusive.jpg`,     // ✓ confirmado
    `${BASE}/2020/12/Funko-Pop-Pokemon-Figures-353-Pikachu-Metallic.jpg`,
    `${BASE}/2019/09/Funko-Pop-Pokemon-Figures-553-Pikachu-Waving.jpg`,
  ],
  'luffy-924': [
    `${BASE}/2021/05/Funko-Pop-One-Piece-Figures-924-Bonekichi-1.jpg`,        // ✓ confirmado
    `${BASE}/2021/05/Funko-Pop-One-Piece-Figures-926-Luffy-Gear-Four-Chalice-Collectibles-Exclusive.jpg`,
    `${BASE}/2016/02/2016-Funko-Pop-One-Piece-Vinyl-Figures-98-Monkey-D.-Luffy.jpg`,
  ],

  /* ═══════════════ STAR WARS ════════════════════════════════ */
  'funko-pop-luke-skywalker': [
    `${BASE}/2014/12/Funko-Pop-Star-Wars-11-Luke-Skywalker-Jedi.jpg`,         // ✓ confirmado
    `${BASE}/2014/12/Funko-Pop-Star-Wars-03-Han-Solo.jpg`,
  ],
  'funko-pop-princess-leia': [
    `${BASE}/2014/12/Funko-Pop-Star-Wars-04-Princess-Leia.jpg`,               // ✓ confirmado
  ],
  'funko-pop-han-solo': [
    `${BASE}/2014/12/Funko-Pop-Star-Wars-03-Han-Solo.jpg`,                    // ✓ confirmado
  ],
  'funko-pop-chewbacca': [
    `${BASE}/2014/12/Funko-Pop-Star-Wars-06-Chewbacca.jpg`,                   // ✓ confirmado
  ],
  'funko-pop-r2d2': [
    `${BASE}/2014/12/Funko-Pop-Star-Wars-31-R2-D2.jpg`,                       // ✓ confirmado
  ],
  'funko-pop-obi-wan-kenobi': [
    `${BASE}/2014/12/Funko-Pop-Star-Wars-10-Obi-Wan-Kenobi.jpg`,              // ✓ confirmado
  ],
  'funko-pop-mandalorian': [
    `${BASE}/2019/10/Funko-Pop-Star-Wars-The-Mandalorian-Figures-326-The-Mandalorian-.jpg`, // ✓ confirmado
    `${BASE}/2019/09/Funko-Pop-Star-Wars-Figures-326-The-Mandalorian-Pre-Release-2019-D23-Expo-Exclusive.jpg`,
  ],
  'mandalorian-326': [
    `${BASE}/2019/10/Funko-Pop-Star-Wars-The-Mandalorian-Figures-326-The-Mandalorian-.jpg`, // ✓ confirmado
    `${BASE}/2019/09/Funko-Pop-Star-Wars-Figures-326-The-Mandalorian-Pre-Release-2019-D23-Expo-Exclusive.jpg`,
  ],

  /* ═══════════════ GAMING ═══════════════════════════════════ */
  'funko-pop-master-chief': [
    `${BASE}/2017/04/Funko-Pop-Halo-01-Master-Chief.jpg`,                     // ✓ confirmado
    `${BASE}/2017/04/Funko-Pop-Halo-03-Master-Chief.jpg`,
    `${BASE}/2020/09/Funko-Pop-Halo-Infinite-Figures-13-Master-Chief-with-MA40-Assault-Rifle.jpg`,
  ],
  'master-chief-06': [
    `${BASE}/2017/04/Funko-Pop-Halo-01-Master-Chief.jpg`,                     // ✓ confirmado (usando #01)
    `${BASE}/2017/04/Funko-Pop-Halo-03-Master-Chief.jpg`,
  ],
  'funko-pop-kratos-ragnarok': [
    `${BASE}/2017/11/Funko-Pop-God-of-War-269-Kratos.jpg`,                    // ✓ confirmado (GoW4)
    `${BASE}/2017/09/Funko-Pop-God-of-War-25-Kratos.jpg`,
    `${BASE}/2022/11/Funko-Pop-God-of-War-Ragnarok-Figures-Kratos.jpg`,
    `${BASE}/2022/10/Funko-Pop-God-of-War-Ragnarok-Kratos.jpg`,
  ],
  'funko-pop-sonic': [
    `${BASE}/2017/09/Funko-Pop-Sonic-the-Hedgehog-06-Sonic.jpg`,              // ✓ confirmado
    `${BASE}/2017/11/Funko-Pop-Sonic-283-Sonic-with-Ring.jpg`,
  ],
  'funko-pop-joel': [
    `${BASE}/2020/08/Funko-Pop-The-Last-of-Us-Figures-620-Joel-GameStop-Exclusive.jpg`, // ✓ confirmado
  ],
  'funko-pop-ellie': [
    `${BASE}/2020/06/Funko-Pop-The-Last-of-Us-Part-II-Figures-601-Ellie.jpg`, // ✓ confirmado
  ],
  'funko-pop-geralt-de-rivia': [
    `${BASE}/2016/11/2017-Funko-Pop-The-Witcher-149-Geralt.jpg`,              // ✓ confirmado
    `${BASE}/2021/11/Funko-Pop-The-Witcher-Figures-1192-Geralt.jpg`,
  ],
  'funko-pop-pac-man': [
    `${BASE}/2016/01/2016-Funko-Pop-Pac-Man-Vinyl-Figures-81.jpg`,            // ✓ confirmado
  ],
  'funko-pop-zelda': [
    `${BASE}/2021/09/Funko-Pop-Legend-of-Zelda-Breath-Wild-230-Zelda.jpg`,
    `${BASE}/2019/06/Funko-Pop-Legend-of-Zelda-230-Zelda-Breath-of-the-Wild.jpg`,
    `${BASE}/2019/06/Funko-Pop-Legend-of-Zelda-Zelda.jpg`,
    `${BASE}/2021/11/Funko-Pop-Legend-of-Zelda-Breath-Wild-Zelda.jpg`,
  ],
  'funko-pop-samus-aran': [
    `${BASE}/2021/10/Funko-Pop-Metroid-Dread-Figures-01-Samus-Aran.jpg`,
    `${BASE}/2021/10/Funko-Pop-Metroid-Dread-01-Samus-Aran.jpg`,
    `${BASE}/2021/09/Funko-Pop-Metroid-Samus-Aran.jpg`,
    `${BASE}/2021/10/Funko-Pop-Metroid-Samus-Aran.jpg`,
  ],
  'funko-pop-link-totk': [
    `${BASE}/2023/07/Funko-Pop-Legend-of-Zelda-Tears-of-the-Kingdom-Link.jpg`,
    `${BASE}/2023/06/Funko-Pop-Zelda-Tears-Kingdom-Link.jpg`,
    `${BASE}/2023/05/Funko-Pop-Zelda-Tears-of-Kingdom-Link.jpg`,
    `${BASE}/2023/07/Funko-Pop-Zelda-Link-Tears-Kingdom.jpg`,
  ],
  'funko-pop-mario-dorado-chase': [
    `${BASE}/2016/01/Funko-Pop-Super-Mario-Bros-35-Gold-Mario-Chase.jpg`,
    `${BASE}/2016/01/Funko-Pop-Nintendo-Super-Mario-35-Gold-Mario-Chase.jpg`,
    `${BASE}/2014/12/Funko-Pop-Super-Mario-35-Gold-Mario-Chase.jpg`,
    `${BASE}/2021/09/Funko-Pop-Super-Mario-Bros-Mario-Gold-Chase.jpg`,
  ],
  'funko-pop-gordon-freeman': [
    // No hay Funko Pop oficial de Gordon Freeman; intentar URL esperada
    `${BASE}/2020/01/Funko-Pop-Games-Gordon-Freeman-Half-Life.jpg`,
    `${BASE}/2020/01/Funko-Pop-Half-Life-Gordon-Freeman.jpg`,
  ],

  /* ═══════════════ DISNEY ═══════════════════════════════════ */
  'funko-pop-winnie-the-pooh': [
    `${BASE}/2015/06/Funko-Pop-Disney-32-Winnie-the-Pooh.jpg`,               // ✓ confirmado
    `${BASE}/2016/11/Funko-Pop-Winnie-the-Pooh-252-Winnie-the-Pooh.jpg`,
  ],
  'funko-pop-maleficent': [
    `${BASE}/2015/06/Funko-Pop-Disney-77-Maleficent.jpg`,                     // ✓ confirmado
    `${BASE}/2017/06/Funko-Pop-Sleeping-Beauty-Maleficent-09-Maleficent.jpg`,
  ],
  'funko-pop-moana': [
    `${BASE}/2022/02/Funko-Pop-Moana-Figures-1016-Moana.jpg`,                 // ✓ confirmado
    `${BASE}/2016/10/2016-Funko-Pop-Moana-213-Moana-and-Pua.jpg`,
  ],
  'funko-pop-mulan': [
    `${BASE}/2016/09/Funko-Pop-Disney-166-Mulan.jpg`,                         // ✓ confirmado
    `${BASE}/2017/08/Funko-Pop-Disney-323-Mulan.jpg`,
  ],
  'elsa-593': [
    `${BASE}/2019/10/Funko-Pop-Frozen-II-2-Figures-581-Elsa.jpg`,             // ✓ confirmado (#581)
    `${BASE}/2019/10/Funko-Pop-Frozen-II-2-Figures-597-Elsa-Dark-Sea-Walmart-Exclusive.jpg`,
    `${BASE}/2019/10/Funko-Pop-Frozen-II-2-Figures-590-Elsa-Purple-Dress-Hot-Topic-Exclusive.jpg`,
  ],
  'simba-301': [
    `${BASE}/2019/04/Funko-Pop-Lion-King-Lion-Action-Movie-547-Simba.jpg`,    // ✓ confirmado (2019 movie)
    `${BASE}/2017/06/Funko-Pop-Disney-Lion-King-302-Simba.jpg`,
    `${BASE}/2014/06/2014-Funko-Pop-Lion-King-Simba.jpg`,
  ],

  /* ═══════════════ DC ════════════════════════════════════════ */
  'funko-pop-cyborg': [
    `${BASE}/2017/05/2017-Funko-Pop-Justice-League-209-Cyborg.jpg`,           // ✓ confirmado
    `${BASE}/2017/08/Funko-Pop-Justice-League-212-Cyborg-Motherbox-Walmart.jpg`,
  ],
  'funko-pop-shazam': [
    `${BASE}/2019/02/Funko-Pop-Shazam-260-Shazam.jpg`,                        // ✓ confirmado
    `${BASE}/2019/02/Funko-Pop-Shazam-14-Shazam.jpg`,
  ],
  'funko-pop-bane': [
    `${BASE}/2017/08/Funko-Pop-Dark-Knight-20-Bane.jpg`,                      // ✓ confirmado
  ],

  /* ═══════════════ MARVEL ════════════════════════════════════ */
  'funko-pop-doctor-strange': [
    `${BASE}/2016/08/2016-Funko-Pop-Doctor-Strange-169.jpg`,                  // ✓ confirmado
    `${BASE}/2020/06/Funko-Pop-Doctor-Strange-Figures-149-Doctor-Strange.jpg`,
  ],
  'doctor-strange-414': [
    `${BASE}/2016/08/2016-Funko-Pop-Doctor-Strange-169.jpg`,                  // ✓ confirmado (mismo personaje)
    `${BASE}/2016/10/Funko-Pop-Doctor-Strange-173-Doctor-Strange-Levitation-Collector-Corps-.jpg`,
    `${BASE}/2022/03/Funko-Pop-Doctor-Strange-in-the-Multiverse-of-Madness-Figures-1000-Doctor-Strange.jpg`,
  ],
  'funko-pop-scarlet-witch': [
    `${BASE}/2022/03/Funko-Pop-Doctor-Strange-in-the-Multiverse-of-Madness-Figures-1007-Scarlet-Witch.jpg`, // ✓ confirmado
    `${BASE}/2022/05/Funko-Pop-Doctor-Strange-in-the-Multiverse-of-Madness-Figures-1034-Scarlet-Witch-Walmart-exclusive.jpg`,
  ],
  'funko-pop-hawkeye': [
    `${BASE}/2021/12/Funko-Pop-Hawkeye-TV-Figures-1211-Hawkeye.jpg`,          // ✓ confirmado
  ],
  'venom-363': [
    `${BASE}/2018/07/Funko-Pop-Venom-363-Venom-Eddie-Brock.jpg`,              // ✓ confirmado
  ],
  'funko-pop-deadpool': [
    `${BASE}/2015/12/Funko-Pop-Deadpool-Vinyl-Figures-20.jpg`,                // ✓ confirmado
    `${BASE}/2018/04/Funko-Pop-Deadpool-319-Deadpool-as-Bob-Ross.jpg`,
  ],

  /* ═══════════════ CHASE / VARIANTES ADICIONALES ════════════ */
  // Groot #264 con candy — Hot Topic exclusive (Chase variant)
  'groot-264-chase': [
    `${BASE}/2017/11/Funko-Pop-Guardians-of-the-Galaxy-Vol-2-264-Grot-with-Candy-Hot-Topic-Exclusive.jpg`, // ✓ confirmado
    `${BASE}/2017/08/Funko-Pop-Guardians-of-the-Galaxy-263-Groot-Holding-Bomb-Toys-R-Us-Exclusive.jpg`,
  ],
  // Harry Potter con capa de invisibilidad #112 — Chase variant
  'funko-pop-harry-potter-capa-chase': [
    `${BASE}/2020/05/Funko-Pop-Harry-Potter-Figures-112-Harry-Potter-with-Invisibility-Cloak.jpg`, // ✓ confirmado
    `${BASE}/2018/04/Funko-Pop-Harry-Potter-01-Harry-Potter-with-Invisibility-Cloak.jpg`,
  ],
  // Iron Man Mark 85 (Avengers Endgame) — Chase variant
  'funko-pop-iron-man-mark85-chase': [
    `${BASE}/2019/04/Funko-Pop-Avengers-Endgame-467-Iron-Man-BoxLunch-Exclusive.jpg`, // ✓ confirmado (#467 Endgame suit)
    `${BASE}/2019/10/2019-Funko-New-York-Comic-Con-Exclusives-Funko-Pop-Avengers-Endgame-529-Iron-Man-NYCC-Exclusive-Figure.jpg`, // ✓ confirmado (#529)
    `${BASE}/2020/02/Funko-Pop-Avengers-Endgame-Figures-Funko-Pop-Iron-Man-580-Iron-Man-I-Am-Iron-Man-Deluxe-GITD-Glows-PX-Previews-Exclusive.jpg`,
  ],
  // Kratos God of War #269
  'kratos-269': [
    `${BASE}/2017/11/Funko-Pop-God-of-War-269-Kratos.jpg`, // ✓ confirmado (mismo número que funko-pop-kratos-ragnarok)
    `${BASE}/2017/09/Funko-Pop-God-of-War-25-Kratos.jpg`,
  ],
  // Batman 1966 Adam West #41 — Chase variant (TV Classic Series)
  'funko-pop-batman-1966-chase': [
    `${BASE}/2017/02/Funko-Pop-1966-Batman-41-Batman-Metallic-Alamo-City-Comic-Con.jpg`, // ✓ confirmado (metallic/chase)
    `${BASE}/2017/02/Funko-Pop-1966-Batman-41-Batman.jpg`,                               // ✓ confirmado (base #41)
    `${BASE}/2017/02/Funko-Pop-1966-Batman-133-Surfs-Up-Batman.jpg`,
  ],
  // Tanjiro Kamado #1169 — Demon Slayer (2022)
  'tanjiro-1169': [
    `${BASE}/2022/07/Funko-Pop-Demon-Slayer-Figures-1169-Tanjiro-Kamado.jpg`,           // guess
    `${BASE}/2022/09/Funko-Pop-Demon-Slayer-Figures-1169-Tanjiro-Kamado.jpg`,           // guess
    `${BASE}/2022/10/Funko-Pop-Demon-Slayer-Figures-1169-Tanjiro-Kamado.jpg`,           // guess
    `${BASE}/2023/10/Funko-Pop-Demon-Slayer-Figures-1403-Tanjiro-Kamado.jpg`,           // ✓ confirmado (sustituto)
    `${BASE}/2021/05/Funko-Pop-Demon-Slayer-Figures-867-Tanjiro-Kamado.jpg`,            // ✓ confirmado (sustituto #867)
  ],
  // Charizard #843 — Pokemon
  'charizard-843': [
    `${BASE}/2022/02/Funko-Pop-Pokemon-Figures-843-Charizard.jpg`, // ✓ confirmado
    `${BASE}/2021/09/Funko-Pop-Pokemon-Figures-851-Charizard-Jumbo-Target-exclusive.jpg`,
  ],
}

/* ── HTTP helpers ────────────────────────────────────────── */
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
      res.on('data', (c) => chunks.push(c))
      res.on('end',  () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }))
    })
    req.on('error', reject)
    req.setTimeout(12000, () => { req.destroy(); reject(new Error('timeout')) })
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

/* ── Supabase REST ───────────────────────────────────────── */
async function getProducts () {
  const url = `${SUPABASE_URL}/rest/v1/products?select=id,slug,image_url&limit=200`
  const { body } = await httpRequest(url, 'GET')
  // Hacemos GET real para obtener body
  const res = await new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http
    const req = lib.request(url, {
      method: 'GET',
      headers: {
        'apikey':        SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
      }
    }, (res) => {
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end',  () => resolve(JSON.parse(Buffer.concat(chunks).toString())))
    })
    req.on('error', reject)
    req.end()
  })
  return res
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
        'apikey':        SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type':  'application/json',
        'Prefer':        'return=minimal',
        'Content-Length': Buffer.byteLength(body),
      }
    }, (res) => {
      res.resume()
      resolve(res.statusCode)
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

/* ── Main ────────────────────────────────────────────────── */
async function main () {
  console.log(C.bold('\n═══════════════════════════════════════════'))
  console.log(C.bold('  FunkoStore — Fix Images Automation'))
  console.log(C.bold('═══════════════════════════════════════════\n'))

  if (DRY_RUN)   console.log(C.yellow('[DRY-RUN] No se guardarán cambios\n'))
  if (FORCE)     console.log(C.yellow('[FORCE]   Re-descarga forzada activada\n'))
  if (TARGET_SLUG) console.log(C.yellow(`[SLUG]    Solo procesando: ${TARGET_SLUG}\n`))

  // Cargar hashes de fallbacks incorrectos
  loadWrongHashes()
  console.log()

  // Obtener productos
  console.log(C.cyan('[1/3] Obteniendo productos de Supabase...'))
  const products = await getProducts()
  console.log(C.green(`      ${products.length} productos encontrados\n`))

  // Filtrar cuáles necesitan fix
  const toFix = products.filter(p => {
    if (TARGET_SLUG && p.slug !== TARGET_SLUG) return false
    // incluir tanto los que tienen candidatos como los sin Funko oficial
    if (!CANDIDATES[p.slug] && !USE_PLACEHOLDER.has(p.slug)) return false

    const localPath = path.join(FUNKOS_DIR, `${p.slug}.jpg`)
    if (FORCE) return true

    // Para los sin Funko oficial: si ya apuntan al placeholder, no re-procesar
    if (USE_PLACEHOLDER.has(p.slug)) {
      return p.image_url !== PLACEHOLDER_URL
    }

    return isWrongImage(localPath)
  })

  if (toFix.length === 0) {
    console.log(C.green('[OK] Todas las imágenes están correctas.'))
    return
  }

  console.log(C.cyan(`[2/3] Procesando ${toFix.length} productos con imágenes incorrectas...\n`))

  const stats = { ok: 0, fail: 0, skip: 0 }

  for (const product of toFix) {
    const slug      = product.slug
    const localPath = path.join(FUNKOS_DIR, `${slug}.jpg`)

    process.stdout.write(`  ${C.gray(slug.padEnd(45))} `)

    // Caso especial: sin Funko Pop oficial → asignar placeholder
    if (USE_PLACEHOLDER.has(slug)) {
      if (!DRY_RUN) {
        await patchProduct(product.id, PLACEHOLDER_URL)
        console.log(C.yellow('Sin Funko oficial → placeholder'))
      } else {
        console.log(C.yellow(`WOULD SET placeholder`))
      }
      stats.ok++
      continue
    }

    const candidates = CANDIDATES[slug] || []
    let found = false
    for (const url of candidates) {
      const valid = await checkUrl(url)
      if (!valid) continue

      if (!DRY_RUN) {
        try {
          const bytes = await downloadImage(url, localPath)
          const kb = Math.round(bytes / 1024)
          console.log(C.green(`OK (${kb} KB)`))
          // Actualizar Supabase
          const localUrl = `/funkos/${slug}.jpg`
          if (product.image_url !== localUrl) {
            await patchProduct(product.id, localUrl)
          }
          stats.ok++
          found = true
          break
        } catch (e) {
          console.log(C.red(`ERROR: ${e.message}`))
          stats.fail++
          found = true
          break
        }
      } else {
        console.log(C.yellow(`WOULD DOWNLOAD: ${url.split('/').pop()}`))
        stats.skip++
        found = true
        break
      }
    }

    if (!found) {
      console.log(C.red('Sin imagen válida — manteniendo fallback'))
      stats.fail++
    }
  }

  console.log(C.cyan('\n[3/3] Resumen:'))
  console.log(`  ${C.green('OK:   ')} ${stats.ok}`)
  console.log(`  ${C.red('FAIL: ')} ${stats.fail}`)
  console.log(`  ${C.yellow('SKIP: ')} ${stats.skip}`)
  console.log()

  if (stats.ok > 0 && !DRY_RUN) {
    console.log(C.green('[✓] Supabase actualizado. Recargá la página web.\n'))
  }
}

main().catch(e => {
  console.error(C.red(`\n[FATAL] ${e.message}`))
  process.exit(1)
})
