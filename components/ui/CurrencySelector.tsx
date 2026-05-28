'use client'

import { useState, useEffect, useRef } from 'react'
import { useCurrencyStore } from '@/store/currencyStore'
import { CURRENCIES } from '@/lib/currency'

/**
 * Selector de moneda compacto para el Navbar público.
 * Muestra el código activo y despliega un dropdown con las monedas disponibles.
 * Se hidrata desde localStorage (Zustand persist) tras el primer render.
 */
export default function CurrencySelector() {
  const [open,         setOpen]         = useState(false)
  const [hydrated,     setHydrated]     = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const code        = useCurrencyStore((s) => s.code)
  const loading     = useCurrencyStore((s) => s.loading)
  const setCurrency = useCurrencyStore((s) => s.setCurrency)
  const refreshRateIfStale = useCurrencyStore((s) => s.refreshRateIfStale)

  // Hidratación: esperar a que Zustand cargue desde localStorage
  useEffect(() => {
    setHydrated(true)
    refreshRateIfStale()
  }, [refreshRateIfStale])

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  const handleSelect = async (newCode: string) => {
    setOpen(false)
    if (newCode !== code) await setCurrency(newCode)
  }

  // Mostrar EUR durante SSR para evitar hydration mismatch
  const displayCode = hydrated ? code : 'EUR'

  return (
    <div ref={dropdownRef} className="relative">
      {/* Botón trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={loading}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="
          flex items-center gap-1.5 rounded-lg border border-gray-300
          bg-white px-2.5 py-1.5 text-sm font-medium text-[#0F0F14]
          transition hover:border-gray-800 hover:text-[#0F0F14]
          disabled:opacity-60 select-none
        "
      >
        {loading ? (
          <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#5856D6] border-t-transparent" />
        ) : (
          <span className="text-xs">💱</span>
        )}
        <span>{displayCode}</span>
        <svg
          className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          aria-label="Seleccionar moneda"
          className="
            absolute right-0 z-50 mt-1 w-52 rounded-xl border border-gray-200
            bg-white py-1 shadow-lg
          "
        >
          {CURRENCIES.map((c) => {
            const isActive = c.code === displayCode
            return (
              <button
                key={c.code}
                role="option"
                aria-selected={isActive}
                onClick={() => handleSelect(c.code)}
                className={`
                  flex w-full items-center gap-2 px-3 py-2 text-sm
                  transition hover:bg-[#F5F4FF]
                  ${isActive ? 'font-semibold text-[#5856D6]' : 'text-gray-700'}
                `}
              >
                <span className="w-7 text-center text-xs font-mono text-gray-500">
                  {c.symbol}
                </span>
                <span className="flex-1 text-left">{c.label}</span>
                <span className="text-xs font-mono text-gray-400">{c.code}</span>
                {isActive && (
                  <span className="text-[#5856D6]">✓</span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
