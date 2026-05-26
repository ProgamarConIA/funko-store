/**
 * Módulo centralizado de conversión de monedas.
 *
 * Regla fundamental: la base de datos SIEMPRE guarda precios en EUR.
 * La conversión ocurre SOLO aquí, en el frontend (presentación).
 * Nunca se almacenan múltiples precios por moneda.
 *
 * Fuente de tasas: fawazahmed0/currency-api (jsDelivr CDN)
 *   — gratuita, sin API key, ~160 monedas, actualización diaria.
 *   — tasas consistentes con cotizaciones BCRA al 25/05/2026.
 */

// ─── Monedas soportadas ───────────────────────────────────────────────────────
export const CURRENCIES = [
  { code: 'EUR', symbol: '€',  label: 'Euro',            locale: 'es-ES', decimals: 2 },
  { code: 'USD', symbol: '$',  label: 'Dólar (USD)',      locale: 'en-US', decimals: 2 },
  { code: 'ARS', symbol: '$',  label: 'Peso Argentino',   locale: 'es-AR', decimals: 0 },
  { code: 'MXN', symbol: '$',  label: 'Peso Mexicano',    locale: 'es-MX', decimals: 2 },
  { code: 'COP', symbol: '$',  label: 'Peso Colombiano',  locale: 'es-CO', decimals: 0 },
  { code: 'CLP', symbol: '$',  label: 'Peso Chileno',     locale: 'es-CL', decimals: 0 },
  { code: 'BRL', symbol: 'R$', label: 'Real Brasileño',   locale: 'pt-BR', decimals: 2 },
  { code: 'JPY', symbol: '¥',  label: 'Yen Japonés',      locale: 'ja-JP', decimals: 0 },
] as const

export type CurrencyCode = typeof CURRENCIES[number]['code']

// ─── Tasas de respaldo (BCRA-alineadas, 25/05/2026) ──────────────────────────
/**
 * Usadas SOLO si la API externa no está disponible.
 * Base: 1 EUR. Verificadas contra cotizaciones oficiales BCRA.
 */
export const FALLBACK_RATES: Record<string, number> = {
  USD: 1.1637,
  ARS: 1631.03,
  MXN: 20.10,
  COP: 4290.08,
  CLP: 1045.96,
  BRL: 5.85,
  JPY: 184.93,
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
/** Devuelve la info de una moneda por código. Fallback: EUR. */
export function getCurrencyInfo(code: string) {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0]
}

/**
 * Convierte un precio en EUR a la moneda destino y lo formatea.
 *
 * @param priceEUR  Precio original en euros (tal como está en la BD)
 * @param code      Código ISO 4217 de la moneda destino (ej. 'ARS')
 * @param rate      Tasa de conversión: 1 EUR = `rate` unidades de `code`
 * @param decimals  Decimales a mostrar (0 para ARS/CLP/COP/JPY)
 */
export function formatCurrencyPrice(
  priceEUR: number,
  code: string,
  rate: number,
  decimals: number,
): string {
  const info    = getCurrencyInfo(code)
  const converted = priceEUR * rate
  try {
    return new Intl.NumberFormat(info.locale, {
      style:                 'currency',
      currency:              code,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(converted)
  } catch {
    // Fallback si el entorno no soporta la moneda/locale
    return `${info.symbol}${converted.toFixed(decimals)}`
  }
}

// ─── API de tasas ─────────────────────────────────────────────────────────────
/**
 * Descarga tasas en vivo desde fawazahmed0/exchange-api (base EUR).
 * Lanza Error si la petición falla — el caller debe manejar el fallback.
 */
export async function fetchExchangeRates(): Promise<Record<string, number>> {
  const res = await fetch(
    'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json',
    { cache: 'no-store' },
  )
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json() as { eur: Record<string, number> }
  // Convertir claves a UPPERCASE para coincidir con nuestros códigos
  return Object.fromEntries(
    Object.entries(data.eur).map(([k, v]) => [k.toUpperCase(), v]),
  )
}
