'use client'

import { useEffect, useState } from 'react'
import { Coins } from 'lucide-react'

export const CURRENCIES = [
  { code: 'EUR', symbol: '€',   label: 'Euro',              locale: 'es-ES' },
  { code: 'USD', symbol: '$',   label: 'Dólar (USD)',       locale: 'en-US' },
  { code: 'ARS', symbol: '$',   label: 'Peso Argentino',    locale: 'es-AR' },
  { code: 'MXN', symbol: '$',   label: 'Peso Mexicano',     locale: 'es-MX' },
  { code: 'COP', symbol: '$',   label: 'Peso Colombiano',   locale: 'es-CO' },
  { code: 'CLP', symbol: '$',   label: 'Peso Chileno',      locale: 'es-CL' },
  { code: 'BRL', symbol: 'R$',  label: 'Real Brasileño',    locale: 'pt-BR' },
  { code: 'GBP', symbol: '£',   label: 'Libra Esterlina',   locale: 'en-GB' },
  { code: 'JPY', symbol: '¥',   label: 'Yen Japonés',       locale: 'ja-JP' },
] as const

export type CurrencyCode = typeof CURRENCIES[number]['code']

export const CURRENCY_LS_KEY = 'admin-currency'

export function getCurrencyInfo(code: string) {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0]
}

export default function CurrencySelector() {
  const [code, setCode] = useState<string>('EUR')

  useEffect(() => {
    setCode(localStorage.getItem(CURRENCY_LS_KEY) ?? 'EUR')
  }, [])

  const handleChange = (newCode: string) => {
    setCode(newCode)
    localStorage.setItem(CURRENCY_LS_KEY, newCode)
    // Notificar a todas las filas de la tabla (EditableProductRow escucha este evento)
    window.dispatchEvent(
      new StorageEvent('storage', { key: CURRENCY_LS_KEY, newValue: newCode }),
    )
  }

  const current = getCurrencyInfo(code)

  return (
    <div className="flex items-center gap-2">
      <Coins className="w-3.5 h-3.5 text-[#B0B0BE] flex-shrink-0" />
      <span className="text-xs text-[#6B6B7B] font-medium whitespace-nowrap">Moneda:</span>
      <select
        value={code}
        onChange={(e) => handleChange(e.target.value)}
        className="text-xs border border-[#E4E4EC] rounded-lg px-2 py-1.5 bg-white text-[#0F0F14] focus:outline-none focus:border-[#5856D6] focus:ring-1 focus:ring-[#5856D6]/20 cursor-pointer transition-all"
        title={`Moneda actual: ${current.label} (${current.symbol})`}
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.symbol}  {c.label}
          </option>
        ))}
      </select>
    </div>
  )
}
