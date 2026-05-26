'use client'

import { useEffect, useState } from 'react'
import { useCurrencyStore } from '@/store/currencyStore'

interface PriceDisplayProps {
  /** Precio en EUR (tal como está en la base de datos). */
  priceEUR: number
  /** Clases CSS adicionales para el span externo. */
  className?: string
}

/**
 * Muestra un precio en EUR convertido a la moneda activa del usuario.
 *
 * - En SSR renderiza el precio en EUR para evitar hydration mismatch.
 * - En el cliente, tras la hidratación de Zustand, muestra la moneda elegida.
 * - Usa el store `useCurrencyStore` — no necesita props de moneda.
 */
export default function PriceDisplay({ priceEUR, className }: PriceDisplayProps) {
  const formatPrice = useCurrencyStore((s) => s.formatPrice)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  // Antes de hidratar mostrar EUR (igual que SSR)
  const display = hydrated
    ? formatPrice(priceEUR)
    : new Intl.NumberFormat('es-ES', {
        style:                 'currency',
        currency:              'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(priceEUR)

  return <span className={className}>{display}</span>
}
