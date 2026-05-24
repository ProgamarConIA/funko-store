'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'

const FRANCHISES = ['Marvel', 'DC', 'Disney', 'Anime', 'Star Wars', 'Harry Potter', 'Juegos', 'Películas']
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
    <div className="bg-white border border-[#E5E5EA] rounded-2xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#F5F5F7] transition-colors"
      >
        <div className="flex items-center gap-2 text-[#1D1D1F] font-semibold text-sm">
          <SlidersHorizontal className="w-4 h-4 text-[#6E6E73]" />
          Filtros
          {hasFilters && (
            <span className="w-1.5 h-1.5 bg-[#1D1D1F] rounded-full" />
          )}
        </div>
        <span className="text-[#AEAEB2] text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {/* Filtros */}
      <div className={`${open ? 'block' : 'hidden'} lg:block`}>
        <div className="px-5 pb-5 space-y-5 border-t border-[#E5E5EA] pt-4">

          {/* Ordenar */}
          <div>
            <p className="text-xs font-semibold text-[#AEAEB2] uppercase tracking-wider mb-2.5">Ordenar</p>
            <select
              value={current.sort}
              onChange={(e) => update('sort', e.target.value)}
              className="w-full bg-[#F5F5F7] border border-[#E5E5EA] text-[#1D1D1F] text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#1D1D1F] transition-colors"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Franquicia */}
          <div>
            <p className="text-xs font-semibold text-[#AEAEB2] uppercase tracking-wider mb-2.5">Franquicia</p>
            <div className="flex flex-wrap gap-1.5">
              {FRANCHISES.map((f) => (
                <button
                  key={f}
                  onClick={() => update('franchise', current.franchise === f ? '' : f)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    current.franchise === f
                      ? 'bg-[#1D1D1F] border-[#1D1D1F] text-white'
                      : 'border-[#E5E5EA] text-[#6E6E73] hover:border-[#1D1D1F] hover:text-[#1D1D1F] bg-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Categoría */}
          <div>
            <p className="text-xs font-semibold text-[#AEAEB2] uppercase tracking-wider mb-2.5">Categoría</p>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => update('category', current.category === c ? '' : c)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    current.category === c
                      ? 'bg-[#1D1D1F] border-[#1D1D1F] text-white'
                      : 'border-[#E5E5EA] text-[#6E6E73] hover:border-[#1D1D1F] hover:text-[#1D1D1F] bg-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Precio */}
          <div>
            <p className="text-xs font-semibold text-[#AEAEB2] uppercase tracking-wider mb-2.5">Precio (ARS)</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Mín"
                value={current.min_price}
                onChange={(e) => update('min_price', e.target.value)}
                className="w-full bg-[#F5F5F7] border border-[#E5E5EA] text-[#1D1D1F] text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-[#1D1D1F] placeholder-[#AEAEB2] transition-colors"
              />
              <span className="text-[#AEAEB2] text-xs shrink-0">–</span>
              <input
                type="number"
                placeholder="Máx"
                value={current.max_price}
                onChange={(e) => update('max_price', e.target.value)}
                className="w-full bg-[#F5F5F7] border border-[#E5E5EA] text-[#1D1D1F] text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-[#1D1D1F] placeholder-[#AEAEB2] transition-colors"
              />
            </div>
          </div>

          {/* Limpiar */}
          {hasFilters && (
            <button
              onClick={clearAll}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm text-[#6E6E73] hover:text-[#1D1D1F] rounded-xl transition-all border border-[#E5E5EA] hover:border-[#1D1D1F]"
            >
              <X className="w-3 h-3" /> Limpiar filtros
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
