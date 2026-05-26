import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  getCurrencyInfo,
  fetchExchangeRates,
  FALLBACK_RATES,
  formatCurrencyPrice,
} from '@/lib/currency'

const RATE_TTL_MS = 24 * 60 * 60 * 1000 // 24 horas

interface CurrencyState {
  code:      string
  rate:      number
  decimals:  number
  symbol:    string
  cachedAt:  number
  loading:   boolean

  /** Cambia la moneda activa y descarga la tasa correspondiente. */
  setCurrency:         (code: string) => Promise<void>
  /** Refresca la tasa si el caché tiene más de 24 h (llamar al montar la app). */
  refreshRateIfStale:  () => Promise<void>
  /** Formatea un precio en EUR a la moneda activa. */
  formatPrice:         (priceEUR: number) => string
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      // ── Estado inicial (EUR — coincide con SSR para evitar hydration mismatch) ──
      code:     'EUR',
      rate:     1,
      decimals: 2,
      symbol:   '€',
      cachedAt: 0,
      loading:  false,

      // ── formatPrice ────────────────────────────────────────────────────────────
      formatPrice: (priceEUR) => {
        const { code, rate, decimals } = get()
        return formatCurrencyPrice(priceEUR, code, rate, decimals)
      },

      // ── setCurrency ────────────────────────────────────────────────────────────
      setCurrency: async (newCode) => {
        const info = getCurrencyInfo(newCode)
        set({
          code:     newCode,
          decimals: info.decimals as number,
          symbol:   info.symbol,
        })

        if (newCode === 'EUR') {
          set({ rate: 1, cachedAt: Date.now() })
          return
        }

        set({ loading: true })
        try {
          const rates = await fetchExchangeRates()
          const rate  = rates[newCode] ?? FALLBACK_RATES[newCode] ?? 1
          set({ rate, cachedAt: Date.now(), loading: false })
        } catch {
          // API falló — usar tasa de respaldo BCRA-alineada
          const rate = FALLBACK_RATES[newCode] ?? 1
          set({ rate, cachedAt: Date.now(), loading: false })
        }
      },

      // ── refreshRateIfStale ─────────────────────────────────────────────────────
      refreshRateIfStale: async () => {
        const { code, cachedAt, loading } = get()
        if (code === 'EUR' || loading) return
        if (Date.now() - cachedAt < RATE_TTL_MS) return

        set({ loading: true })
        try {
          const rates = await fetchExchangeRates()
          const rate  = rates[code] ?? FALLBACK_RATES[code] ?? 1
          set({ rate, cachedAt: Date.now(), loading: false })
        } catch {
          // Mantener tasa actual, solo marcar como no-loading
          set({ loading: false })
        }
      },
    }),
    {
      name: 'funko-currency',
      // Solo persistir los datos necesarios, no funciones ni loading
      partialize: (state) => ({
        code:     state.code,
        rate:     state.rate,
        decimals: state.decimals,
        symbol:   state.symbol,
        cachedAt: state.cachedAt,
      }),
    },
  ),
)
