import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/products/ProductCard'
import SearchBar from '@/components/products/SearchBar'
import FranchiseBanner from '@/components/home/FranchiseBanner'
import Pagination from '@/components/ui/Pagination'
import { PageLoader } from '@/components/ui/Spinner'
import type { Product, ProductFilters as Filters } from '@/lib/types'
import { Package } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

const FRANCHISE_PILLS = [
  { label: 'Todos',        href: '/',                        emoji: '✨' },
  { label: 'Marvel',       href: '/?franchise=Marvel',       emoji: '🦸' },
  { label: 'DC',           href: '/?franchise=DC',           emoji: '🦇' },
  { label: 'Disney',       href: '/?franchise=Disney',       emoji: '🏰' },
  { label: 'Anime',        href: '/?franchise=Anime',        emoji: '⚡' },
  { label: 'Star Wars',    href: '/?franchise=Star Wars',    emoji: '🌌' },
  { label: 'Harry Potter', href: '/?franchise=Harry Potter', emoji: '🪄' },
  { label: 'Juegos',       href: '/?franchise=Juegos',       emoji: '🎮' },
]

const PAGE_SIZE = 10

interface PageResult {
  items:      Product[]
  total:      number
  page:       number
  totalPages: number
}

/* ─────────────────────────────────────────────────────────────────
   getProducts — construye filtros primero, luego aplica range
───────────────────────────────────────────────────────────────── */
async function getProducts(filters: Filters): Promise<PageResult> {
  const supabase = await createClient()

  const page = Math.max(1, filters.page ?? 1)
  const from = (page - 1) * PAGE_SIZE
  const to   = from + PAGE_SIZE - 1

  const orderCol =
    filters.sort === 'price_asc'  ? 'price'      :
    filters.sort === 'price_desc' ? 'price'      :
    filters.sort === 'name_asc'   ? 'name'       : 'created_at'

  const ascending =
    filters.sort === 'price_asc' ? true  :
    filters.sort === 'name_asc'  ? true  : false

  // 1. Construir query con todos los filtros WHERE primero
  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .order(orderCol, { ascending })

  if (filters.search)    query = query.ilike('name', `%${filters.search}%`)
  if (filters.franchise) query = query.eq('franchise', filters.franchise)
  if (filters.category)  query = query.eq('category', filters.category)
  if (filters.min_price) query = query.gte('price', Number(filters.min_price))
  if (filters.max_price) query = query.lte('price', Number(filters.max_price))

  // 2. Aplicar rango al final
  const { data, error, count } = await query.range(from, to)

  if (error) console.error('getProducts error:', error)

  const total      = count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return {
    items: (data ?? []) as Product[],
    total,
    page,
    totalPages,
  }
}

/* ─────────────────────────────────────────────────────────────────
   buildHref — preserva filtros actuales al cambiar de página
───────────────────────────────────────────────────────────────── */
function buildHref(
  params: Record<string, string | undefined>,
  targetPage: number,
): string {
  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v && k !== 'page') qs.set(k, v)
  }
  if (targetPage > 1) qs.set('page', String(targetPage))
  const str = qs.toString()
  return str ? `/?${str}` : '/'
}

/* ─────────────────────────────────────────────────────────────────
   Página principal
───────────────────────────────────────────────────────────────── */
export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams

  const filters: Filters = {
    search:    params.search,
    franchise: params.franchise,
    category:  params.category,
    min_price: params.min_price ? Number(params.min_price) : undefined,
    max_price: params.max_price ? Number(params.max_price) : undefined,
    sort:      (params.sort as Filters['sort']) ?? 'newest',
    page:      params.page ? Number(params.page) : 1,
  }

  const { items: products, total, page, totalPages } = await getProducts(filters)

  const hasFilters      = !!(filters.search || filters.franchise || filters.category)
  const activeFranchise = filters.franchise ?? ''

  return (
    <div className="min-h-screen bg-[#FAFAFF] dark:bg-[#0e0e16]">

      {/* ── HERO ─────────────────────────────────────────────────
          Franquicia activa → banner temático
          Sin franquicia   → hero genérico
      ──────────────────────────────────────────────────────────── */}
      {activeFranchise ? (
        <FranchiseBanner
          franchise={activeFranchise}
          activeFranchise={activeFranchise}
          count={total}
        />
      ) : (
        <section
          className="relative overflow-hidden border-b border-white/5"
          style={{
            background: 'linear-gradient(135deg,#030010 0%,#0a0520 45%,#100830 75%,#05020f 100%)',
            minHeight: '470px',
          }}
        >
          {/* Patrón de puntos */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'radial-gradient(circle,rgba(88,86,214,.20) 1.5px,transparent 1.5px)',
            backgroundSize: '32px 32px',
          }} />

          {/* Vignette vertical */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(to bottom,rgba(0,0,0,.60) 0%,transparent 16%,transparent 64%,rgba(0,0,0,.75) 100%)',
          }} />

          {/* Degradado lateral izquierdo */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(90deg,rgba(0,0,0,.88) 0%,rgba(0,0,0,.55) 32%,rgba(0,0,0,.15) 52%,transparent 65%)',
          }} />

          {/* Resplandor de acento derecho */}
          <div className="absolute right-0 top-0 bottom-0 w-2/3 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at 78% 55%, rgba(88,86,214,.40) 0%, transparent 55%)',
          }} />
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at 60% 50%, rgba(88,86,214,.18) 0%, transparent 60%)',
          }} />

          <div
            className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-stretch"
            style={{ minHeight: '470px' }}
          >
            <div className="flex-1 flex flex-col justify-center py-14 z-10 max-w-2xl">

              <span
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold rounded-full mb-5 tracking-widest uppercase w-fit"
                style={{
                  background: 'rgba(88,86,214,.18)',
                  color: '#A8A5FF',
                  border: '1px solid rgba(88,86,214,.40)',
                }}
              >
                🎯 Coleccionables Originales
              </span>

              <h1
                className="font-extrabold tracking-tight text-white leading-[1.03] mb-2"
                style={{ fontSize: 'clamp(2.4rem,5vw,3.8rem)' }}
              >
                Tu colección de<br />
                <span style={{ color: '#A8A5FF' }}>Funko Pops.</span>
              </h1>

              <p
                className="font-light mb-4 tracking-wide"
                style={{ fontSize: 'clamp(1.2rem,2.5vw,1.8rem)', color: 'rgba(255,255,255,.28)' }}
              >
                Funko Pops
              </p>

              <p
                className="max-w-sm mb-6 leading-relaxed"
                style={{ fontSize: 'clamp(.85rem,1.5vw,1rem)', color: 'rgba(255,255,255,.50)' }}
              >
                Más de{' '}
                <strong style={{ color: 'rgba(255,255,255,.85)' }}>{total} figuras</strong>{' '}
                originales de Marvel, DC, Disney, Anime y mucho más.
              </p>

              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 w-fit"
                style={{
                  background: 'rgba(88,86,214,.18)',
                  color: '#A8A5FF',
                  border: '1px solid rgba(88,86,214,.40)',
                }}
              >
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#5856D6' }} />
                {total} figura{total !== 1 ? 's' : ''} disponible{total !== 1 ? 's' : ''}
              </div>

              {/* Pills de franquicia */}
              <div className="flex flex-wrap gap-2">
                {FRANCHISE_PILLS.map((pill) => {
                  const isActive = activeFranchise === (pill.label === 'Todos' ? '' : pill.label)
                  return (
                    <Link
                      key={pill.href}
                      href={pill.href}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                      style={isActive
                        ? { background: '#5856D6', color: '#fff', boxShadow: '0 0 18px rgba(88,86,214,.55)' }
                        : { background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.44)', border: '1px solid rgba(255,255,255,.12)' }
                      }
                    >
                      <span>{pill.emoji}</span>{' '}{pill.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CATÁLOGO ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-10">

        {/* Buscador */}
        <div className="mb-6 max-w-xl mx-auto">
          <Suspense fallback={null}>
            <SearchBar />
          </Suspense>
        </div>

        {/* Conteo */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-sm text-[#6B6B7B] dark:text-[#9090aa]">
            {total === 0
              ? 'Sin resultados'
              : `${total} producto${total !== 1 ? 's' : ''}`}
            {totalPages > 1 && (
              <span className="ml-2 text-[#B0B0BE] dark:text-[#4a4a6a]">
                — página {page} de {totalPages}
              </span>
            )}
          </span>
          {hasFilters && (
            <Link href="/" className="text-xs text-[#5856D6] hover:text-[#4644b8] font-medium underline underline-offset-2">
              Ver todos
            </Link>
          )}
        </div>

        {/* Grid */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-white dark:bg-[#12121f] border border-[#E4E4EC] dark:border-[#1e1e35] rounded-2xl flex items-center justify-center mb-4 shadow-card">
              <Package className="w-7 h-7 text-[#B0B0BE] dark:text-[#4a4a6a]" />
            </div>
            <h3 className="text-[#0F0F14] dark:text-[#f1f0ff] font-semibold text-lg mb-2">Sin resultados</h3>
            <p className="text-[#6B6B7B] dark:text-[#9090aa] text-sm max-w-xs">
              {hasFilters ? 'Ningún producto coincide con los filtros.' : 'Aún no hay productos cargados.'}
            </p>
          </div>
        ) : (
          <>
            <Suspense fallback={<PageLoader />}>
              <div className="grid grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map((product, i) => (
                  <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 25}ms` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </Suspense>

            {/* Paginación */}
            <Pagination
              page={page}
              totalPages={totalPages}
              buildHref={(p) => buildHref(params, p)}
            />
          </>
        )}
      </section>
    </div>
  )
}
