import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/products/ProductCard'
import ProductFilters from '@/components/products/ProductFilters'
import SearchBar from '@/components/products/SearchBar'
import { PageLoader } from '@/components/ui/Spinner'
import type { Product, ProductFilters as Filters } from '@/lib/types'
import { Package } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

const FRANCHISE_PILLS = [
  { label: 'Todos', href: '/' },
  { label: 'Marvel', href: '/?franchise=Marvel' },
  { label: 'DC', href: '/?franchise=DC' },
  { label: 'Disney', href: '/?franchise=Disney' },
  { label: 'Anime', href: '/?franchise=Anime' },
  { label: 'Star Wars', href: '/?franchise=Star Wars' },
  { label: 'Harry Potter', href: '/?franchise=Harry Potter' },
  { label: 'Juegos', href: '/?franchise=Juegos' },
]

async function getProducts(filters: Filters): Promise<Product[]> {
  const supabase = await createClient()
  let query = supabase
    .from('products')
    .select('*')
    .order(
      filters.sort === 'price_asc'  ? 'price' :
      filters.sort === 'price_desc' ? 'price' :
      filters.sort === 'name_asc'   ? 'name'  : 'created_at',
      { ascending: filters.sort !== 'price_desc' && filters.sort !== 'newest' ? true : false }
    )

  if (filters.search)    query = query.ilike('name', `%${filters.search}%`)
  if (filters.franchise) query = query.eq('franchise', filters.franchise)
  if (filters.character) query = query.eq('character', filters.character)
  if (filters.category)  query = query.eq('category', filters.category)
  if (filters.min_price) query = query.gte('price', Number(filters.min_price))
  if (filters.max_price) query = query.lte('price', Number(filters.max_price))

  const { data, error } = await query
  if (error) { console.error('Error:', error); return [] }
  return data ?? []
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams
  const filters: Filters = {
    search:    params.search,
    franchise: params.franchise,
    category:  params.category,
    min_price: params.min_price ? Number(params.min_price) : undefined,
    max_price: params.max_price ? Number(params.max_price) : undefined,
    sort:      (params.sort as Filters['sort']) ?? 'newest',
  }

  const products = await getProducts(filters)
  const hasFilters = !!(filters.search || filters.franchise || filters.category)
  const activeFranchise = filters.franchise ?? ''

  return (
    <div className="min-h-screen bg-[#FAFAFA]">

      {/* Hero */}
      <section className="gradient-hero border-b border-[#E4E4EC] px-4 pt-14 pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 bg-[#EEEDFF] text-[#5856D6] text-xs font-semibold rounded-full mb-4 tracking-wide uppercase">
              Coleccionables Premium
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#0F0F14] leading-[1.1] mb-3">
              Tu colección de<br />
              <span className="text-[#5856D6]">Funko Pops.</span>
            </h1>
            <p className="text-[#6B6B7B] text-base sm:text-lg">
              {products.length}+ figuras originales de Marvel, DC, Disney, Anime y más.
            </p>
          </div>

          {/* Franquicias rápidas */}
          <div className="flex flex-wrap gap-2 mt-8">
            {FRANCHISE_PILLS.map((pill) => (
              <Link
                key={pill.href}
                href={pill.href}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  activeFranchise === (pill.label === 'Todos' ? '' : pill.label)
                    ? 'bg-[#0F0F14] text-white border-[#0F0F14] shadow-sm'
                    : 'bg-white text-[#6B6B7B] border-[#E4E4EC] hover:border-[#5856D6]/40 hover:text-[#5856D6] hover:bg-[#F5F4FF]'
                }`}
              >
                {pill.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contenido */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Buscador */}
        <div className="mb-6">
          <Suspense fallback={null}>
            <SearchBar />
          </Suspense>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar */}
          <aside className="lg:w-56 flex-shrink-0">
            <Suspense fallback={null}>
              <ProductFilters />
            </Suspense>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm text-[#6B6B7B]">
                {products.length === 0
                  ? 'Sin resultados'
                  : `${products.length} producto${products.length !== 1 ? 's' : ''}`}
              </span>
              {hasFilters && (
                <a href="/" className="text-xs text-[#5856D6] hover:text-[#4644b8] transition-colors font-medium">
                  Limpiar filtros
                </a>
              )}
            </div>

            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 bg-white border border-[#E4E4EC] rounded-2xl flex items-center justify-center mb-4 shadow-card">
                  <Package className="w-7 h-7 text-[#B0B0BE]" />
                </div>
                <h3 className="text-[#0F0F14] font-semibold text-lg mb-2">Sin resultados</h3>
                <p className="text-[#6B6B7B] text-sm max-w-xs">
                  {hasFilters ? 'Ningún producto coincide con los filtros.' : 'Aún no hay productos cargados.'}
                </p>
              </div>
            ) : (
              <Suspense fallback={<PageLoader />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                  {products.map((product, i) => (
                    <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 30}ms` }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </Suspense>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
