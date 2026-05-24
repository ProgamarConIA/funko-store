'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'

const FRANCHISES = [
  { label: 'Marvel',       emoji: '🦸' },
  { label: 'DC',           emoji: '🦇' },
  { label: 'Disney',       emoji: '🏰' },
  { label: 'Anime',        emoji: '⚡' },
  { label: 'Star Wars',    emoji: '🌌' },
  { label: 'Harry Potter', emoji: '🪄' },
  { label: 'Juegos',       emoji: '🎮' },
  { label: 'Películas',    emoji: '🎬' },
]

const CATEGORIES = ['Standard', 'Deluxe', 'Chase', 'Exclusive', 'Super Sized']

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Más nuevos' },
  { value: 'price_asc',  label: 'Menor precio' },
  { value: 'price_desc', label: 'Mayor precio' },
  { value: 'name_asc',   label: 'Nombre A–Z' },
]

export default function ProductFilters() {
  const router = useRouter()
  const params = useSearchParams()
  const [open, setOpen] = useState(false)

  const current = {
    franchise: params.get('franchise') ?? '',
    category:  params.get('category')  ?? '',
    min_price: params.get('min_price') ?? '',
    max_price: params.get('max_price') ?? '',
    sort:      params.get('sort')      ?? 'newest',
  }

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page')
    router.push(`/?${next.toString()}`)
  }

  const clearAll = () => router.push('/')
  const hasFilters = current.franchise || current.category || current.min_price || current.max_price

  return (
    <div className="bg-white border border-[#E4E4EC] rounded-2xl overflow-hidden shadow-card">

      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#F5F4FF] transition-colors"
      >
        <div className="flex items-center gap-2 text-[#0F0F14] font-semibold text-sm">
          <SlidersHorizontal className="w-4 h-4 text-[#5856D6]" />
          Filtros
          {hasFilters && <span className="w-1.5 h-1.5 bg-[#5856D6] rounded-full" />}
        </div>
        <span className="text-[#B0B0BE] text-xs">{open ? '▲' : '▼'}</span>
      </button>

      <div className={`${open ? 'block' : 'hidden'} lg:block`}>
        <div className="px-5 pb-5 space-y-5 border-t border-[#E4E4EC] pt-4">

          {/* Ordenar */}
          <div>
            <p className="text-[10px] font-bold text-[#B0B0BE] uppercase tracking-widest mb-2.5">Ordenar</p>
            <select
              value={current.sort}
              onChange={(e) => update('sort', e.target.value)}
              className="w-full bg-[#F5F4FF] border border-[#E4E4EC] text-[#0F0F14] text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#5856D6] focus:ring-2 focus:ring-[#5856D6]/10 transition-all"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Franquicia */}
          <div>
            <p className="text-[10px] font-bold text-[#B0B0BE] uppercase tracking-widest mb-2.5">Franquicia</p>
            <div className="flex flex-col gap-1">
              {FRANCHISES.map(({ label, emoji }) => (
                <button
                  key={label}
                  onClick={() => update('franchise', current.franchise === label ? '' : label)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-left transition-all ${
                    current.franchise === label
                      ? 'bg-[#5856D6] text-white shadow-sm'
                      : 'text-[#6B6B7B] hover:bg-[#F5F4FF] hover:text-[#0F0F14]'
                  }`}
                >
                  <span className="text-base">{emoji}</span> {label}
                </button>
              ))}
            </div>
          </div>

          {/* Categoría */}
          <div>
            <p className="text-[10px] font-bold text-[#B0B0BE] uppercase tracking-widest mb-2.5">Categoría</p>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => update('category', current.category === c ? '' : c)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    current.category === c
                      ? 'bg-[#0F0F14] text-white border-[#0F0F14]'
                      : 'border-[#E4E4EC] text-[#6B6B7B] hover:border-[#5856D6]/50 hover:text-[#5856D6] bg-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Precio */}
          <div>
            <p className="text-[10px] font-bold text-[#B0B0BE] uppercase tracking-widest mb-2.5">Precio (ARS)</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Mín"
                value={current.min_price}
                onChange={(e) => update('min_price', e.target.value)}
                className="w-full bg-[#F5F4FF] border border-[#E4E4EC] text-[#0F0F14] text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-[#5856D6] placeholder-[#B0B0BE] transition-all"
              />
              <span className="text-[#B0B0BE] text-xs shrink-0">–</span>
              <input
                type="number"
                placeholder="Máx"
                value={current.max_price}
                onChange={(e) => update('max_price', e.target.value)}
                className="w-full bg-[#F5F4FF] border border-[#E4E4EC] text-[#0F0F14] text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-[#5856D6] placeholder-[#B0B0BE] transition-all"
              />
            </div>
          </div>

          {/* Limpiar */}
          {hasFilters && (
            <button
              onClick={clearAll}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-sm text-[#6B6B7B] hover:text-red-500 rounded-xl border border-[#E4E4EC] hover:border-red-200 hover:bg-red-50 transition-all"
            >
              <X className="w-3 h-3" /> Limpiar filtros
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
