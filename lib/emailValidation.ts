/**
 * lib/emailValidation.ts
 *
 * Validación de emails en el registro:
 *   1. Formato básico (regex)
 *   2. Blocklist de dominios descartables / temporales
 *   3. Verificación de registros MX via Cloudflare DNS-over-HTTPS
 *      (sin API key — gratis, funciona desde el navegador)
 *
 * Si la verificación MX falla por timeout o error de red, se asume válido
 * para no bloquear registros legítimos. La confirmación de email de Supabase
 * es la capa definitiva de validación real.
 */

// ─── Blocklist de dominios temporales / descartables ─────────────────────────
// Lista curada de los servicios más usados. No necesita ser exhaustiva:
// el MX check actúa como segundo filtro para dominios inexistentes.
const DISPOSABLE_DOMAINS = new Set([
  // Mailinator & familia
  'mailinator.com', 'mailinator.net', 'notmailinator.com',
  // Guerrilla Mail
  'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org',
  'guerrillamail.de', 'guerrillamail.biz', 'guerrillamail.info',
  'guerrillamailblock.com', 'sharklasers.com', 'grr.la',
  // 10 Minute Mail
  '10minutemail.com', '10minutemail.net', '10minutemail.org',
  '10minutemail.co.uk', 'my10minutemail.com',
  // TempMail / Temp-Mail
  'tempmail.com', 'temp-mail.org', 'temp-mail.io',
  'tempmail.it', 'tempmail.us', 'tempemail.com',
  'tempemail.net', 'tempemail.biz', 'tempemail.co',
  'tempemail.org', 'tempinbox.com', 'tempinbox.co.uk',
  'tempr.email', 'mytemp.email', 'mytempemail.com',
  'mailtemp.net', 'mailtemp.info',
  // YOPmail
  'yopmail.com', 'yopmail.fr', 'yopmail.pp.ua',
  // TrashMail
  'trashmail.com', 'trashmail.at', 'trashmail.me',
  'trashmail.net', 'trashmail.io', 'trashmail.org',
  'trashmail.de', 'trashmailer.com', 'trashymail.com',
  // Throw-away
  'throwaway.email', 'throwam.com',
  // MailDrop / Discard
  'maildrop.cc', 'discard.email', 'dispostable.com', 'deadaddress.com',
  // Spam-oriented
  'spam4.me', 'spambox.us', 'spamgourmet.com', 'spamgourmet.net',
  'spamgourmet.org', 'spamfree.eu', 'spamtroll.net',
  'spaml.com', 'spaml.de', 'spamspot.com',
  // FakeInbox / FakeMail
  'fakeinbox.com', 'fakeinbox.info', 'email-fake.com',
  // MailNesia / MailNull
  'mailnesia.com', 'mailnesia.net', 'mailnull.com',
  // Mohmal
  'mohmal.com', 'mohmal.im', 'mohmal.in',
  // GetAirMail / OnDeck
  'getairmail.com', 'emailondeck.com',
  // MinteEmail
  'mintemail.com',
  // Harakiri
  'harakirimail.com',
  // German disposable
  'wegwerfadresse.de', 'wegwerfemail.de', 'wegwerfmail.de',
  'nurfuerspam.de', 'einrot.com', 'kurzepost.de',
  // Other well-known
  'objectmail.com', 'mailscrap.com', 'mailexpire.com',
  'bouncr.com', 'binkmail.com', 'superrito.com', 'zetmail.com',
  'trbvm.com', 'recursor.net', 'inboxclean.com',
  'temporaryemail.net', 'temporaryemail.us',
  'selfdestructingmail.com', 'safetymail.info',
  'nomail.pw', 'spamfree24.org',
])

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface EmailValidationResult {
  valid: boolean
  error?: string
}

// ─── MX record check via Cloudflare DoH ──────────────────────────────────────

/**
 * Verifica que el dominio tenga al menos un registro MX (puede recibir email).
 * Usa Cloudflare DNS-over-HTTPS — sin API key, gratuito, seguro en el browser.
 *
 * En caso de error de red o timeout devuelve `true` (asume válido)
 * para no bloquear usuarios legítimos por problemas de conectividad.
 */
async function hasMXRecord(domain: string): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 5_000)

    const res = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=MX`,
      {
        headers: { Accept: 'application/dns-json' },
        signal: controller.signal,
      }
    )
    clearTimeout(timer)

    if (!res.ok) return true  // API no disponible → asumir válido

    const data = await res.json()
    // Status 0 = NOERROR
    // Answer debe tener al menos una entrada para que el dominio pueda recibir email
    return data.Status === 0 && Array.isArray(data.Answer) && data.Answer.length > 0
  } catch {
    // Timeout o error de red → asumir válido (no bloquear al usuario)
    return true
  }
}

// ─── Punto de entrada público ─────────────────────────────────────────────────

/**
 * Valida un email en tres capas:
 *   1. Formato (regex básico)
 *   2. Dominio no está en la blocklist de emails descartables
 *   3. El dominio tiene registros MX (puede recibir emails reales)
 *
 * Es async porque el paso 3 hace una llamada DNS.
 * Retorna `{ valid: true }` si pasa todos los filtros.
 */
export async function validateEmail(email: string): Promise<EmailValidationResult> {
  const trimmed = email.trim().toLowerCase()

  // 1. Formato
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'El formato del email no es válido.' }
  }

  const domain = trimmed.split('@')[1]

  // 2. Blocklist de dominios temporales
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      valid: false,
      error: 'No se permiten emails temporales o descartables. Por favor usá tu email real.',
    }
  }

  // 3. Verificación MX (el dominio puede recibir emails)
  const mx = await hasMXRecord(domain)
  if (!mx) {
    return {
      valid: false,
      error: `El dominio "${domain}" no puede recibir emails. Verificá que el email sea correcto.`,
    }
  }

  return { valid: true }
}
