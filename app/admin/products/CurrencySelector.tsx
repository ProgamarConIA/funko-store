'use client'

import { useEffect, useState } from 'react'
import { Coins, Loader2, AlertCircle, RefreshCw } from 'lucide-react'

// ─── Monedas soportadas ───────────────────────────────────────────────────────
export const CURRENCIES = [
  { code: 'EUR', symbol: '€',   label: 'Euro',              locale: 'es-ES', decimals: 2 },
  { code: 'USD', symbol: '$',   label: 'Dólar (USD)',       locale: 'en-US', decimals: 2 },
  { code: 'ARS', symbol: '$',   label: 'Peso Argentino',    locale: 'es-AR', decimals: 0 },
  { code: 'MXN', symbol: '$',   label: 'Peso Mexicano',     locale: 'es-MX', decimals: 2 },
  { code: 'COP', symbol: '$',   label: 'Peso Colombiano',   locale: 'es-CO', decimals: 0 },
  { code: 'CLP', symbol: '$',   label: 'Peso Chileno',      locale: 'es-CL', decimals: 0 },
  { code: 'BRL', symbol: 'R$',  label: 'Real Brasileño',    locale: 'pt-BR', decimals: 2 },
  { code: 'JPY', symbol: '¥',   label: 'Yen Japonés',       locale: 'ja-JP', decimals: 0 },
] as const

export type CurrencyCode = typeof CURRENCIES[number]['code']

// ─── Claves localStorage ──────────────────────────────────────────────────────
export const CURRENCY_LS_KEY = 'admin-currency'
export const RATES_LS_KEY    = 'admin-currency-rates'

/**
 * TTL del caché: 24 horas.
 * La API (fawazahmed0/exchange-api) actualiza diariamente, alineada con el BCRA.
 * Garantiza que las tasas nunca superen 1 día de antigüedad.
 */
const RATES_TTL_MS = 24 * 60 * 60 * 1000

/** CustomEvent emitido al cambiar moneda — recibido por cada EditableProductRow */
export const CURRENCY_CHANGE_EVENT = 'admin:currency-change'

// ─── Tasas de respaldo (BCRA-alineadas, 25/05/2026) ─────────────────────────
/**
 * Se usan SOLO si la API externa no está disponible.
 * Base: 1 EUR. Consistentes con cotizaciones BCRA del 25/05/2026.
 * Fuente cruzada: fawazahmed0/currency-api + BCRA (https://www.bcra.gob.ar/)
 */
const FALLBACK_RATES: Record<string, number> = {
  USD: 1.1637,
  ARS: 1631.03,
  MXN: 20.10,
  COP: 4290.08,
  CLP: 1045.96,
  BRL: 5.85,
  JPY: 184.93,
}

const FALLBACK_DATE = '2026-05-25'

// ─── Tipos ────────────────────────────────────────────────────────────────────
export interface RatesCache {
  rates:     Record<string, number>
  fetchedAt: number
  rateDate:  string   // fecha ISO que reporta la API — SIEMPRE presente en caché nuevo
}

export interface CurrencyChangePayload {
  code:     string
  rate:     number
  decimals: number
}

// ─── Helpers exportados ───────────────────────────────────────────────────────
export function getCurrencyInfo(code: string) {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0]
}

/**
 * Lee el caché de tasas.
 * Devuelve null si no existe, si expiró, o si tiene formato antiguo (sin rateDate).
 * El formato antiguo se descarta intencionalmente para forzar un re-fetch
 * que asegura que el usuario siempre vea una fecha válida.
 */
export function getCachedRates(): RatesCache | null {
  try {
    const raw = localStorage.getItem(RATES_LS_KEY)
    if (!raw) return null
    const cache = JSON.parse(raw) as Partial<RatesCache>
    // Descartar caché sin rateDate (formato viejo) o expirado
    if (!cache.rateDate || !cache.rates || !cache.fetchedAt) return null
    if (Date.now() - cache.fetchedAt > RATES_TTL_MS) return null
    return cache as RatesCache
  } catch {
    return null
  }
}

/**
 * Lee la tasa EUR → código desde el caché.
 * Fallback: tasas BCRA del 25/05/2026 (nunca devuelve 1 para monedas no-EUR).
 */
export function getRateFromCache(code: string): number {
  if (code === 'EUR') return 1
  const cache = getCachedRates()
  return cache?.rates[code] ?? FALLBACK_RATES[code] ?? 1
}

// ─── Fetch de tasas ───────────────────────────────────────────────────────────
/**
 * API: fawazahmed0/exchange-api via jsDelivr CDN.
 * Gratuita, sin key, ~160 monedas, actualización diaria.
 * Tasas alineadas con cotizaciones oficiales BCRA.
 */
async function fetchRates(): Promise<{ rates: Record<string, number>; rateDate: string }> {
  const res = await fetch(
    'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json',
    { cache: 'no-store' },
  )
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json() as { date?: string; eur: Record<string, number> }
  const rates = Object.fromEntries(
    Object.entries(data.eur).map(([k, v]) => [k.toUpperCase(), v]),
  )
  const rateDate = data.date ?? FALLBACK_DATE
  return { rates, rateDate }
}

async function getOrFetchRates(): Promise<{ rates: Record<string, number>; rateDate: string }> {
  const cached = getCachedRates()
  if (cached) return { rates: cached.rates, rateDate: cached.rateDate }

  const { rates, rateDate } = await fetchRates()
  const entry: RatesCache = { rates, fetchedAt: Date.now(), rateDate }
  localStorage.setItem(RATES_LS_KEY, JSON.stringify(entry))
  return { rates, rateDate }
}

// ─── Broadcast ────────────────────────────────────────────────────────────────
function broadcastCurrencyChange(payload: CurrencyChangePayload) {
  window.dispatchEvent(
    new CustomEvent<CurrencyChangePayload>(CURRENCY_CHANGE_EVENT, { detail: payload }),
  )
}

// ─── Helpers UI ───────────────────────────────────────────────────────────────
/** Convierte "2026-05-25" → "25 may. 2026". Nunca lanza excepción. */
function formatRateDate(isoDate: string): string {
  if (!isoDate) return ''
  try {
    const d = new Date(isoDate + 'T12:00:00Z')
    if (isNaN(d.getTime())) return isoDate
    return d.toLocaleDateString('es-AR', {
      day:      '2-digit',
      month:    'short',
      year:     'numeric',
      timeZone: 'UTC',
    })
  } catch {
    return isoDate
  }
}

// ─── Componente ───────────────────────────────────────────────────────────────
export default function CurrencySelector() {
  const [code,         setCode]         = useState<string>('EUR')
  const [loading,      setLoading]      = useState(false)
  const [rateErr,      setRateErr]      = useState(false)
  const [rateDate,     setRateDate]     = useState('')
  const [usingFallback, setUsingFallback] = useState(false)

  // Al montar: leer moneda guardada y emitir su tasa a todas las filas.
  // setTimeout(0) garantiza que todos los EditableProductRow ya registraron
  // sus listeners (sus useEffects corren después del primer render del padre).
  useEffect(() => {
    const saved = localStorage.getItem(CURRENCY_LS_KEY) ?? 'EUR'
    setCode(saved)

    const cached = getCachedRates()
    if (cached) {
      setRateDate(cached.rateDate)
      setUsingFallback(false)
    } else {
      setRateDate(FALLBACK_DATE)
      setUsingFallback(true)
    }

    if (saved !== 'EUR') {
      const timer = setTimeout(() => {
        const rate = getRateFromCache(saved)   // caché válido o FALLBACK_RATES
        const info = getCurrencyInfo(saved)
        broadcastCurrencyChange({ code: saved, rate, decimals: info.decimals as number })
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [])

  // ── Cambiar moneda ──────────────────────────────────────────────────────────
  const handleChange = async (newCode: string) => {
    setCode(newCode)
    localStorage.setItem(CURRENCY_LS_KEY, newCode)
    setRateErr(false)

    const info = getCurrencyInfo(newCode)

    if (newCode === 'EUR') {
      broadcastCurrencyChange({ code: 'EUR', rate: 1, decimals: 2 })
      return
    }

    setLoading(true)
    try {
      const { rates, rateDate: rd } = await getOrFetchRates()
      const rate = rates[newCode] ?? FALLBACK_RATES[newCode] ?? 1
      setRateDate(rd)
      setUsingFallback(false)       // tenemos tasas reales (API o caché)
      broadcastCurrencyChange({ code: newCode, rate, decimals: info.decimals as number })
    } catch {
      // API no disponible → tasas de respaldo BCRA
      setRateErr(true)
      setRateDate(FALLBACK_DATE)
      setUsingFallback(true)
      const rate = FALLBACK_RATES[newCode] ?? 1
      broadcastCurrencyChange({ code: newCode, rate, decimals: info.decimals as number })
    } finally {
      setLoading(false)
    }
  }

  // ── Refresco manual de tasas ────────────────────────────────────────────────
  // Elimina el caché y re-descarga tasas frescas sin tocar código/localStorage.
  const handleRefresh = async () => {
    if (code === 'EUR' || loading) return
    localStorage.removeItem(RATES_LS_KEY)
    setRateErr(false)
    setLoading(true)

    const info = getCurrencyInfo(code)
    try {
      const { rates, rateDate: rd } = await getOrFetchRates()
      const rate = rates[code] ?? FALLBACK_RATES[code] ?? 1
      setRateDate(rd)
      setUsingFallback(false)
      broadcastCurrencyChange({ code, rate, decimals: info.decimals as number })
    } catch {
      setRateErr(true)
      setRateDate(FALLBACK_DATE)
      setUsingFallback(true)
      const rate = FALLBACK_RATES[code] ?? 1
      broadcastCurrencyChange({ code, rate, decimals: info.decimals as number })
    } finally {
      setLoading(false)
    }
  }

  const current = getCurrencyInfo(code)

  return (
    <div className="flex items-center gap-2 flex-wrap">

      {/* Ícono de estado */}
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 text-[#5856D6] animate-spin flex-shrink-0" />
      ) : rateErr ? (
        <span
          className="flex-shrink-0"
          title="No se pudo obtener la tasa de cambio. Se usan tasas de respaldo BCRA."
        >
          <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
        </span>
      ) : (
        <Coins className="w-3.5 h-3.5 text-[#B0B0BE] flex-shrink-0" />
      )}

      <span className="text-xs text-[#6B6B7B] font-medium whitespace-nowrap">Moneda:</span>

      <select
        value={code}
        onChange={(e) => handleChange(e.target.value)}
        disabled={loading}
        className="text-xs border border-[#E4E4EC] rounded-lg px-2 py-1.5 bg-white text-[#0F0F14] focus:outline-none focus:border-[#5856D6] focus:ring-1 focus:ring-[#5856D6]/20 cursor-pointer transition-all disabled:opacity-50"
        title={`Moneda actual: ${current.label} (${current.symbol})`}
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.symbol}  {c.label}
          </option>
        ))}
      </select>

      {/* Indicador de fecha + fuente de tasas (solo para monedas no-EUR) */}
      {code !== 'EUR' && rateDate && !loading && (
        <span
          className={[
            'text-[10px] whitespace-nowrap flex items-center gap-1',
            usingFallback || rateErr ? 'text-amber-600' : 'text-[#B0B0BE]',
          ].join(' ')}
          title={
            usingFallback || rateErr
              ? `Tasas de respaldo BCRA (${formatRateDate(rateDate)}). Presioná ↺ para actualizar.`
              : `Tasas BCRA actualizadas al ${formatRateDate(rateDate)}`
          }
        >
          {usingFallback || rateErr ? '⚠' : '✓'} BCRA {formatRateDate(rateDate)}

          <button
            onClick={handleRefresh}
            disabled={loading}
            aria-label="Actualizar tasas de cambio"
            className="ml-0.5 hover:text-[#5856D6] transition-colors disabled:opacity-40"
          >
            <RefreshCw className="w-2.5 h-2.5" />
          </button>
        </span>
      )}
    </div>
  )
}
