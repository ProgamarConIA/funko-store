import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { formatPrice, DEFAULT_PRODUCT_IMAGE } from '@/lib/utils'
import type { Product } from '@/lib/types'
import Badge from '@/components/ui/Badge'
import AddToCartButton from './AddToCartButton'
import { Package, Star, ArrowLeft, Zap } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getProduct(id: string): Promise<Product | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('products').select('*').eq('id', id).single()
  return data
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) return { title: 'Producto no encontrado' }
  return {
    title: product.name,
    description: product.description ?? `Funko Pop de ${product.character} — ${product.franchise}`,
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) notFound()

  const supabase = await createClient()
  const { data: related } = await supabase
    .from('products')
    .select('*')
    .eq('franchise', product.franchise)
    .neq('id', product.id)
    .limit(4)

  const outOfStock = product.stock === 0

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#64607a] mb-8">
          <Link href="/" className="hover:text-[#a855f7] flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Catálogo
          </Link>
          <span>/</span>
          <span className="text-[#a09dbd]">{product.franchise}</span>
          <span>/</span>
          <span className="text-[#f1f0ff] truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Imagen */}
          <div className="relative">
            <div className="sticky top-24">
              <div className="relative aspect-square bg-gradient-to-b from-[#1a1a2e] to-[#12121f] rounded-2xl border border-[#1e1e35] overflow-hidden">
                <Image
                  src={product.image_url || DEFAULT_PRODUCT_IMAGE}
                  alt={product.name}
                  fill
                  className="object-contain p-8"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                {product.is_featured && (
                  <div className="absolute top-4 left-4">
                    <span className="flex items-center gap-1 px-3 py-1 bg-[#facc15]/15 border border-[#facc15]/40 text-[#facc15] text-xs font-bold rounded-full">
                      <Star className="w-3 h-3 fill-current" /> Destacado
                    </span>
                  </div>
                )}
                {/* Glow decorativo */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#a855f7]/5 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            {/* Franquicia y badges */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="purple">{product.franchise}</Badge>
                <Badge variant="cyan">{product.category}</Badge>
                {outOfStock && <Badge variant="red">Sin stock</Badge>}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#f1f0ff] leading-tight mb-2">
                {product.name}
              </h1>
              <p className="text-[#64607a] text-sm">Personaje: <span className="text-[#a09dbd]">{product.character}</span></p>
            </div>

            {/* Precio */}
            <div className="flex items-end gap-3">
              <span className="text-4xl font-extrabold text-[#f1f0ff]">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              {outOfStock ? (
                <span className="flex items-center gap-1.5 text-red-400 text-sm">
                  <span className="w-2 h-2 bg-red-400 rounded-full" /> Sin stock disponible
                </span>
              ) : product.stock <= 5 ? (
                <span className="flex items-center gap-1.5 text-[#facc15] text-sm">
                  <Package className="w-4 h-4" /> ¡Solo {product.stock} unidades restantes!
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-[#4ade80] text-sm">
                  <span className="w-2 h-2 bg-[#4ade80] rounded-full" /> En stock ({product.stock} disponibles)
                </span>
              )}
            </div>

            {/* Descripción */}
            {product.description && (
              <div className="bg-[#12121f] border border-[#1e1e35] rounded-xl p-4">
                <p className="text-[#a09dbd] text-sm leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Características */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Franquicia', value: product.franchise },
                { label: 'Personaje', value: product.character },
                { label: 'Categoría', value: product.category },
                { label: 'SKU', value: product.id.slice(0, 8).toUpperCase() },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#12121f] border border-[#1e1e35] rounded-xl p-3">
                  <p className="text-xs text-[#64607a] mb-1">{label}</p>
                  <p className="text-sm font-semibold text-[#f1f0ff]">{value}</p>
                </div>
              ))}
            </div>

            {/* Botón agregar al carrito */}
            <AddToCartButton product={product} />

            {/* Garantías */}
            <div className="flex flex-wrap gap-4 pt-2">
              {[
                { icon: '🚚', text: 'Envío a todo el país' },
                { icon: '🔒', text: 'Pago seguro' },
                { icon: '↩️', text: 'Devolución en 30 días' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs text-[#64607a]">
                  <span>{icon}</span> {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Productos relacionados */}
        {related && related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-[#a855f7]" />
              <h2 className="text-xl font-bold text-[#f1f0ff]">
                Más de <span className="text-neon">{product.franchise}</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((p: Product) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="group bg-[#12121f] border border-[#1e1e35] rounded-xl p-3 hover:border-[#a855f7]/40 transition-all"
                >
                  <div className="relative h-32 mb-3">
                    <Image
                      src={p.image_url || DEFAULT_PRODUCT_IMAGE}
                      alt={p.name}
                      fill
                      className="object-contain"
                      sizes="200px"
                    />
                  </div>
                  <p className="text-xs font-semibold text-[#f1f0ff] line-clamp-2 group-hover:text-[#c084fc] transition-colors">
                    {p.name}
                  </p>
                  <p className="text-sm font-bold text-[#a855f7] mt-1">{formatPrice(p.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
