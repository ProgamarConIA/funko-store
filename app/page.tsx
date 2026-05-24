import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/products/ProductCard'
import ProductFilters from '@/components/products/ProductFilters'
import SearchBar from '@/components/products/SearchBar'
import { PageLoader } from '@/components/ui/Spinner'
import type { Product, ProductFilters as Filters } from '@/lib/types'
import { Zap, Package } from 'lucide-react'

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
    <div className="min-h-screen bg-grid">
      {/* Hero */}
      <section className="relative px-4 py-16 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#a855f7]/5 via-transparent to-transparent" />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#a855f7]/10 border border-[#a855f7]/30 rounded-full text-[#c084fc] text-sm font-medium mb-6">
            <Zap className="w-3.5 h-3.5" />
            ¡Nuevos Funko Pops cada semana!
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
            Tu colección de{' '}
            <span className="text-neon">Funko Pops</span>
          </h1>
          <p className="text-[#a09dbd] text-lg max-w-xl mx-auto">
            Más de {products.length}+ figuras de Marvel, DC, Disney, Anime y mucho más.
          </p>
        </div>
      </section>

      {/* Contenido principal */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Buscador */}
        <div className="mb-6">
          <Suspense fallback={null}>
            <SearchBar />
          </Suspense>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar filtros */}
          <aside className="lg:w-64 flex-shrink-0">
            <Suspense fallback={null}>
              <ProductFilters />
            </Suspense>
          </aside>

          {/* Grid de productos */}
          <div className="flex-1">
            {/* Encabezado del grid */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#a855f7]" />
                <span className="text-[#a09dbd] text-sm">
                  {products.length === 0
                    ? 'Sin resultados'
                    : `${products.length} producto${products.length !== 1 ? 's' : ''} encontrado${products.length !== 1 ? 's' : ''}`}
                </span>
              </div>
              {hasFilters && (
                <a href="/" className="text-xs text-[#a855f7] hover:text-[#c084fc] transition-colors">
                  Ver todos →
                </a>
              )}
            </div>

            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-[#12121f] border border-[#1e1e35] rounded-full flex items-center justify-center mb-4">
                  <Package className="w-10 h-10 text-[#64607a]" />
                </div>
                <h3 className="text-[#f1f0ff] font-bold text-xl mb-2">No hay productos</h3>
                <p className="text-[#64607a] text-sm max-w-xs">
                  {hasFilters
                    ? 'Ningún Funko Pop coincide con los filtros actuales. Prueba con otros.'
                    : 'Aún no hay productos cargados. Vuelve pronto.'}
                </p>
              </div>
            ) : (
              <Suspense fallback={<PageLoader />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                  {products.map((product, i) => (
                    <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 40}ms` }}>
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
