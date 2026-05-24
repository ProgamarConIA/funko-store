'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'

const FRANCHISES = ['Marvel', 'DC', 'Disney', 'Anime', 'Star Wars', 'Harry Potter', 'Juegos', 'Películas']
const CATEGORIES = ['Standard', 'Deluxe', 'Chase', 'Exclusive', 'Super Sized']
const SORT_OPTIONS = [
  { value: 'newest',     label: 'Más nuevos' },
  { value: 'price_asc',  label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
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
    <div className="bg-[#12121f] border border-[#1e1e35] rounded-2xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#1a1a2e] transition-colors"
      >
        <div className="flex items-center gap-2 text-[#f1f0ff] font-semibold">
          <SlidersHorizontal className="w-4 h-4 text-[#a855f7]" />
          Filtros
          {hasFilters && (
            <span className="w-2 h-2 bg-[#a855f7] rounded-full shadow-[0_0_6px_rgba(168,85,247,0.6)]" />
          )}
        </div>
        <span className="text-[#64607a] text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {/* Filtros */}
      <div className={`${open ? 'block' : 'hidden'} lg:block`}>
        <div className="px-5 pb-5 space-y-5 border-t border-[#1e1e35] pt-4">

          {/* Ordenar */}
          <div>
            <p className="text-xs font-semibold text-[#a09dbd] uppercase tracking-wider mb-2">Ordenar por</p>
            <select
              value={current.sort}
              onChange={(e) => update('sort', e.target.value)}
              className="w-full bg-[#1a1a2e] border border-[#1e1e35] text-[#f1f0ff] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#a855f7]"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Franquicia */}
          <div>
            <p className="text-xs font-semibold text-[#a09dbd] uppercase tracking-wider mb-2">Franquicia</p>
            <div className="flex flex-wrap gap-2">
              {FRANCHISES.map((f) => (
                <button
                  key={f}
                  onClick={() => update('franchise', current.franchise === f ? '' : f)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    current.franchise === f
                      ? 'bg-[#a855f7]/20 border-[#a855f7] text-[#c084fc]'
                      : 'border-[#1e1e35] text-[#64607a] hover:border-[#a855f7]/40 hover:text-[#a09dbd]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Categoría */}
          <div>
            <p className="text-xs font-semibold text-[#a09dbd] uppercase tracking-wider mb-2">Categoría</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => update('category', current.category === c ? '' : c)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    current.category === c
                      ? 'bg-[#22d3ee]/20 border-[#22d3ee] text-[#22d3ee]'
                      : 'border-[#1e1e35] text-[#64607a] hover:border-[#22d3ee]/40 hover:text-[#a09dbd]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Precio */}
          <div>
            <p className="text-xs font-semibold text-[#a09dbd] uppercase tracking-wider mb-2">Precio (USD)</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={current.min_price}
                onChange={(e) => update('min_price', e.target.value)}
                className="w-full bg-[#1a1a2e] border border-[#1e1e35] text-[#f1f0ff] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#a855f7] placeholder-[#64607a]"
              />
              <span className="text-[#64607a]">–</span>
              <input
                type="number"
                placeholder="Max"
                value={current.max_price}
                onChange={(e) => update('max_price', e.target.value)}
                className="w-full bg-[#1a1a2e] border border-[#1e1e35] text-[#f1f0ff] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#a855f7] placeholder-[#64607a]"
              />
            </div>
          </div>

          {/* Limpiar */}
          {hasFilters && (
            <button
              onClick={clearAll}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-all border border-red-500/20"
            >
              <X className="w-3 h-3" /> Limpiar filtros
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
