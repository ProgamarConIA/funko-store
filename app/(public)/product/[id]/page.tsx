import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/utils'
import PriceDisplay from '@/components/ui/PriceDisplay'
import type { Product } from '@/lib/types'
import AddToCartButton from './AddToCartButton'
import ProductImage from './ProductImage'
import { Package, Star, ArrowLeft } from 'lucide-react'
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
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#6B6B7B] mb-8">
          <Link href="/" className="hover:text-[#5856D6] flex items-center gap-1.5 transition-colors font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Catálogo
          </Link>
          <span className="text-[#B0B0BE]">/</span>
          <Link href={`/?franchise=${product.franchise}`} className="hover:text-[#5856D6] transition-colors">
            {product.franchise}
          </Link>
          <span className="text-[#B0B0BE]">/</span>
          <span className="text-[#0F0F14] font-medium truncate max-w-[180px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Imagen */}
          <div className="sticky top-24">
            <div className="relative aspect-square gradient-card-img rounded-3xl border border-[#E4E4EC] overflow-hidden shadow-card">
              <ProductImage src={product.image_url} alt={product.name} />
              {product.is_featured && (
                <div className="absolute top-4 left-4">
                  <span className="flex items-center gap-1 px-3 py-1 bg-[#5856D6] text-white text-[10px] font-bold rounded-full shadow-sm">
                    <Star className="w-2.5 h-2.5 fill-current" /> DESTACADO
                  </span>
                </div>
              )}
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#5856D6] text-xs font-semibold rounded-full border border-[#E4E4EC]">
                  {product.franchise}
                </span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">

            <div>
              <p className="text-xs font-semibold text-[#5856D6] uppercase tracking-widest mb-2">{product.category}</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#0F0F14] leading-tight">
                {product.name}
              </h1>
              <p className="text-sm text-[#6B6B7B] mt-2">Personaje: <span className="text-[#0F0F14] font-medium">{product.character}</span></p>
            </div>

            {/* Precio */}
            <div className="py-5 border-y border-[#E4E4EC]">
              <p className="text-xs text-[#B0B0BE] font-medium mb-1 uppercase tracking-wide">Precio</p>
              <PriceDisplay
                priceEUR={product.price}
                className="text-4xl font-bold text-[#0F0F14]"
              />
            </div>

            {/* Stock */}
            <div>
              {outOfStock ? (
                <span className="flex items-center gap-2 text-red-500 text-sm font-medium">
                  <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" /> Sin stock disponible
                </span>
              ) : product.stock <= 5 ? (
                <span className="flex items-center gap-2 text-amber-600 text-sm font-medium">
                  <Package className="w-4 h-4" /> ¡Solo {product.stock} unidades restantes!
                </span>
              ) : (
                <span className="flex items-center gap-2 text-green-600 text-sm font-medium">
                  <span className="w-2 h-2 bg-green-500 rounded-full" /> En stock — {product.stock} disponibles
                </span>
              )}
            </div>

            {/* Descripción */}
            {product.description && (
              <p className="text-[#6B6B7B] text-sm leading-relaxed bg-[#F9F8FF] border border-[#EDEDF5] rounded-xl p-4">
                {product.description}
              </p>
            )}

            {/* Specs */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Franquicia', value: product.franchise },
                { label: 'Personaje', value: product.character },
                { label: 'Categoría', value: product.category },
                { label: 'SKU', value: product.id.slice(0, 8).toUpperCase() },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white border border-[#E4E4EC] rounded-2xl p-4 shadow-card">
                  <p className="text-[10px] text-[#B0B0BE] mb-1 font-semibold uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-semibold text-[#0F0F14]">{value}</p>
                </div>
              ))}
            </div>

            {/* Botón */}
            <AddToCartButton product={product} />

            {/* Garantías */}
            <div className="flex flex-wrap gap-5 pt-1 border-t border-[#E4E4EC]">
              {[
                { icon: '🚚', text: 'Envío a todo el país' },
                { icon: '🔒', text: 'Pago 100% seguro' },
                { icon: '↩️', text: 'Devolución en 30 días' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-xs text-[#6B6B7B] pt-3">
                  <span>{icon}</span> {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Relacionados */}
        {related && related.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#0F0F14]">Más de {product.franchise}</h2>
              <Link href={`/?franchise=${product.franchise}`} className="text-sm text-[#5856D6] hover:text-[#4644b8] font-medium">
                Ver todos →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((p: Product) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="group bg-white border border-[#E4E4EC] rounded-2xl p-4 hover:shadow-card-lg hover:-translate-y-0.5 transition-all shadow-card"
                >
                  <div className="relative h-28 mb-3 gradient-card-img rounded-xl overflow-hidden">
                    <Image
                      src={p.image_url || DEFAULT_PRODUCT_IMAGE}
                      alt={p.name}
                      fill
                      className="object-contain p-2"
                      sizes="200px"
                    />
                  </div>
                  <p className="text-xs font-semibold text-[#0F0F14] line-clamp-2 group-hover:text-[#5856D6] transition-colors">
                    {p.name}
                  </p>
                  <PriceDisplay priceEUR={p.price} className="text-sm font-bold text-[#0F0F14] mt-1.5" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
