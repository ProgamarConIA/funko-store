import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/products/ProductCard'
import ProductFilters from '@/components/products/ProductFilters'
import SearchBar from '@/components/products/SearchBar'
import { PageLoader } from '@/components/ui/Spinner'
import type { Product, ProductFilters as Filters } from '@/lib/types'
import { Package } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

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
  if (error) { console.error('Error cargando productos:', error); return [] }
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

  return (
    <div className="min-h-screen bg-[#F5F5F7]">

      {/* Hero */}
      <section className="bg-white border-b border-[#E5E5EA] px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-semibold text-[#6E6E73] uppercase tracking-widest mb-4">
            Coleccionables originales
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F] mb-4 leading-[1.1]">
            Tu colección de<br />Funko Pops.
          </h1>
          <p className="text-[#6E6E73] text-lg">
            Más de {products.length} figuras de Marvel, DC, Disney, Anime y más.
          </p>
        </div>
      </section>

      {/* Contenido */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Buscador */}
        <div className="mb-6">
          <Suspense fallback={null}>
            <SearchBar />
          </Suspense>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar */}
          <aside className="lg:w-60 flex-shrink-0">
            <Suspense fallback={null}>
              <ProductFilters />
            </Suspense>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm text-[#6E6E73]">
                {products.length === 0
                  ? 'Sin resultados'
                  : `${products.length} producto${products.length !== 1 ? 's' : ''}`}
              </span>
              {hasFilters && (
                <a href="/" className="text-xs text-[#6E6E73] hover:text-[#1D1D1F] transition-colors underline underline-offset-2">
                  Ver todos
                </a>
              )}
            </div>

            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 bg-white border border-[#E5E5EA] rounded-full flex items-center justify-center mb-4">
                  <Package className="w-8 h-8 text-[#AEAEB2]" />
                </div>
                <h3 className="text-[#1D1D1F] font-semibold text-lg mb-2">Sin resultados</h3>
                <p className="text-[#6E6E73] text-sm max-w-xs">
                  {hasFilters
                    ? 'Ningún producto coincide con los filtros. Probá con otros.'
                    : 'Aún no hay productos cargados. Volvé pronto.'}
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
