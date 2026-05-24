import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { formatPrice, DEFAULT_PRODUCT_IMAGE } from '@/lib/utils'
import type { Product } from '@/lib/types'
import AddToCartButton from './AddToCartButton'
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
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#6E6E73] mb-8">
          <Link href="/" className="hover:text-[#1D1D1F] flex items-center gap-1.5 transition-colors font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Catálogo
          </Link>
          <span className="text-[#AEAEB2]">/</span>
          <span className="text-[#6E6E73]">{product.franchise}</span>
          <span className="text-[#AEAEB2]">/</span>
          <span className="text-[#1D1D1F] font-medium truncate max-w-[180px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Imagen */}
          <div className="sticky top-24">
            <div className="relative aspect-square bg-white rounded-3xl border border-[#E5E5EA] overflow-hidden">
              <Image
                src={product.image_url || DEFAULT_PRODUCT_IMAGE}
                alt={product.name}
                fill
                className="object-contain p-10"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {product.is_featured && (
                <div className="absolute top-4 left-4">
                  <span className="flex items-center gap-1 px-3 py-1 bg-[#1D1D1F] text-white text-[10px] font-semibold rounded-full tracking-wide">
                    <Star className="w-2.5 h-2.5 fill-current" /> DESTACADO
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-7">

            {/* Franquicia y nombre */}
            <div>
              <p className="text-xs font-semibold text-[#6E6E73] uppercase tracking-widest mb-2">{product.franchise}</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#1D1D1F] leading-tight mb-2">
                {product.name}
              </h1>
              <p className="text-sm text-[#6E6E73]">Personaje: <span className="text-[#1D1D1F] font-medium">{product.character}</span></p>
            </div>

            {/* Precio */}
            <div className="py-5 border-y border-[#E5E5EA]">
              <p className="text-xs text-[#6E6E73] mb-1">Precio</p>
              <span className="text-4xl font-bold text-[#1D1D1F]">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Stock */}
            <div>
              {outOfStock ? (
                <span className="flex items-center gap-2 text-red-500 text-sm font-medium">
                  <span className="w-2 h-2 bg-red-400 rounded-full" /> Sin stock disponible
                </span>
              ) : product.stock <= 5 ? (
                <span className="flex items-center gap-2 text-amber-600 text-sm font-medium">
                  <Package className="w-4 h-4" /> ¡Solo {product.stock} unidades restantes!
                </span>
              ) : (
                <span className="flex items-center gap-2 text-green-600 text-sm font-medium">
                  <span className="w-2 h-2 bg-green-500 rounded-full" /> En stock
                </span>
              )}
            </div>

            {/* Descripción */}
            {product.description && (
              <p className="text-[#6E6E73] text-sm leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Características */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Franquicia', value: product.franchise },
                { label: 'Personaje', value: product.character },
                { label: 'Categoría', value: product.category },
                { label: 'SKU', value: product.id.slice(0, 8).toUpperCase() },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white border border-[#E5E5EA] rounded-2xl p-4">
                  <p className="text-xs text-[#AEAEB2] mb-1 font-medium">{label}</p>
                  <p className="text-sm font-semibold text-[#1D1D1F]">{value}</p>
                </div>
              ))}
            </div>

            {/* Botón */}
            <AddToCartButton product={product} />

            {/* Garantías */}
            <div className="flex flex-wrap gap-5 pt-1">
              {[
                { icon: '🚚', text: 'Envío a todo el país' },
                { icon: '🔒', text: 'Pago seguro' },
                { icon: '↩️', text: 'Devolución en 30 días' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-xs text-[#6E6E73]">
                  <span>{icon}</span> {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Productos relacionados */}
        {related && related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-xl font-bold text-[#1D1D1F] mb-6">
              Más de {product.franchise}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((p: Product) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="group bg-white border border-[#E5E5EA] rounded-2xl p-4 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all"
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
                  <p className="text-xs font-semibold text-[#1D1D1F] line-clamp-2 group-hover:text-[#3D3D3F] transition-colors">
                    {p.name}
                  </p>
                  <p className="text-sm font-bold text-[#1D1D1F] mt-1.5">{formatPrice(p.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
