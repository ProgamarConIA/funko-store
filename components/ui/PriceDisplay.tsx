'use client'

import { useEffect, useState } from 'react'
import { useCurrencyStore } from '@/store/currencyStore'
import { formatCurrencyPrice } from '@/lib/currency'

interface PriceDisplayProps {
  /** Precio en EUR (tal como está en la base de datos). */
  priceEUR: number
  /** Clases CSS adicionales para el span externo. */
  className?: string
}

/**
 * Muestra un precio en EUR convertido a la moneda activa del usuario.
 *
 * IMPORTANTE — Por qué NO usamos `useCurrencyStore((s) => s.formatPrice)`:
 *   `formatPrice` es una función creada una sola vez al inicializar el store.
 *   Su referencia de objeto NUNCA cambia aunque cambien `code` o `rate`.
 *   Zustand compara `Object.is(prev, next)` → siempre true → no re-renderiza.
 *
 * Solución: suscribirse a los valores PRIMITIVOS que sí cambian
 *   (`code`, `rate`, `decimals`) y calcular el precio localmente.
 *   Así cualquier cambio de moneda dispara el re-render inmediatamente.
 */
export default function PriceDisplay({ priceEUR, className }: PriceDisplayProps) {
  // ✅ Suscripciones a primitivos — Zustand re-renderiza cuando cambian
  const code     = useCurrencyStore((s) => s.code)
  const rate     = useCurrencyStore((s) => s.rate)
  const decimals = useCurrencyStore((s) => s.decimals)

  // Hydration guard: en SSR siempre mostramos EUR para evitar mismatch
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => { setHydrated(true) }, [])

  const display = hydrated
    ? formatCurrencyPrice(priceEUR, code, rate, decimals)
    : new Intl.NumberFormat('es-ES', {
        style:                 'currency',
        currency:              'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(priceEUR)

  return <span className={className}>{display}</span>
}
