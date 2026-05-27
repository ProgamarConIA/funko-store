'use client'

import { useState, useMemo } from 'react'
import { Search, X, ChevronLeft, ChevronRight, Package } from 'lucide-react'
import EditableProductRow from './EditableProductRow'

interface Product {
  id: string
  name: string
  character: string
  franchise: string
  category: string
  price: number
  stock: number
  image_url: string | null
  description: string | null
}

const PAGE_SIZES = [10, 20, 50] as const

const TABLE_HEADERS = ['Producto', 'Franquicia', 'Categoría', 'Precio', 'Stock', 'Estado', 'Acciones']

interface Props {
  products: Product[]
}

export default function ProductCatalogClient({ products }: Props) {
  const [search,   setSearch]   = useState('')
  const [page,     setPage]     = useState(1)
  const [pageSize, setPageSize] = useState<20 | 10 | 50>(20)

  // ── Filtrado en memoria — instantáneo ────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.character.toLowerCase().includes(q) ||
      p.franchise.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q),
    )
  }, [products, search])

  // ── Paginación ───────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  // Si el filtro reduce las páginas, ajustar automáticamente
  const currentPage = Math.min(page, totalPages)
  const start       = (currentPage - 1) * pageSize
  const paginated   = filtered.slice(start, start + pageSize)

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)                 // volver a página 1 al buscar
  }

  const handlePageSize = (value: number) => {
    setPageSize(value as 10 | 20 | 50)
    setPage(1)
  }

  const goTo     = (n: number) => setPage(Math.max(1, Math.min(n, totalPages)))
  const goPrev   = () => goTo(currentPage - 1)
  const goNext   = () => goTo(currentPage + 1)

  const hasPrev  = currentPage > 1
  const hasNext  = currentPage < totalPages

  return (
    <div className="bg-white border border-[#E4E4EC] rounded-2xl overflow-hidden shadow-card">

      {/* ── Cabecera de la tarjeta ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-[#E4E4EC]">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Package className="w-4 h-4 text-[#5856D6] shrink-0" />
          <span className="text-sm font-semibold text-[#0F0F14] whitespace-nowrap">Catálogo de productos</span>
          <span className="hidden lg:inline text-xs text-[#B0B0BE] ml-2">
            Edita precio, stock, nombre, descripción e imagen directamente
          </span>
        </div>

        {/* Barra de búsqueda */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#B0B0BE] pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar por nombre, personaje…"
            className="
              w-full pl-8 pr-8 py-2 text-xs rounded-xl
              border border-[#E4E4EC] bg-[#FAFAFA]
              text-[#0F0F14] placeholder:text-[#B0B0BE]
              focus:outline-none focus:border-[#5856D6] focus:ring-1 focus:ring-[#5856D6]/20
              transition-all
            "
          />
          {search && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#B0B0BE] hover:text-[#6B6B7B] transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Tabla ────────────────────────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr className="bg-[#FAFAFA] border-b border-[#E4E4EC]">
              {TABLE_HEADERS.map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-[10px] font-semibold text-[#B0B0BE] uppercase tracking-widest"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((product) => (
              <EditableProductRow key={product.id} product={product} />
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Estado vacío ─────────────────────────────────────────────────────── */}
      {filtered.length === 0 && (
        <div className="text-center py-14 space-y-2">
          <p className="text-[#B0B0BE] text-sm">
            {search
              ? <>No hay resultados para <span className="font-semibold text-[#6B6B7B]">"{search}"</span></>
              : 'No hay productos en la base de datos'
            }
          </p>
          {search && (
            <button
              onClick={() => handleSearch('')}
              className="text-xs text-[#5856D6] hover:underline"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      )}

      {/* ── Pie: info + paginación ───────────────────────────────────────────── */}
      {filtered.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 border-t border-[#E4E4EC] bg-[#FAFAFA]">

          {/* Info */}
          <p className="text-xs text-[#6B6B7B] shrink-0">
            {search
              ? <><span className="font-semibold text-[#0F0F14]">{filtered.length}</span> resultados · mostrando {start + 1}–{Math.min(start + pageSize, filtered.length)}</>
              : <>Mostrando <span className="font-semibold text-[#0F0F14]">{start + 1}–{Math.min(start + pageSize, filtered.length)}</span> de {products.length} productos</>
            }
          </p>

          {/* Controles de paginación */}
          <div className="flex items-center gap-2">

            {/* Por página */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[#B0B0BE]">Por página:</span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSize(Number(e.target.value))}
                className="text-xs border border-[#E4E4EC] rounded-lg px-2 py-1 bg-white text-[#0F0F14] focus:outline-none focus:border-[#5856D6] cursor-pointer"
              >
                {PAGE_SIZES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="w-px h-4 bg-[#E4E4EC]" />

            {/* Anterior */}
            <button
              onClick={goPrev}
              disabled={!hasPrev}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border border-[#E4E4EC] text-[#6B6B7B] hover:border-[#5856D6] hover:text-[#5856D6] disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Anterior
            </button>

            {/* Indicador de página */}
            <span className="text-xs font-semibold text-[#0F0F14] px-1 tabular-nums">
              {currentPage} / {totalPages}
            </span>

            {/* Siguiente */}
            <button
              onClick={goNext}
              disabled={!hasNext}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border border-[#E4E4EC] text-[#6B6B7B] hover:border-[#5856D6] hover:text-[#5856D6] disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              Siguiente
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
