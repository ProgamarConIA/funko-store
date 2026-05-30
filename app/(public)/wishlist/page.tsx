import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import WishlistGrid from './WishlistGrid'
import type { Metadata } from 'next'
import type { Product } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Mis favoritos' }

export default async function WishlistPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirect=/wishlist')

  // ── Fase 1: IDs en wishlist ───────────────────────────────────────────────
  const { data: wishlistRows } = await supabase
    .from('wishlist')
    .select('product_id, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const productIds = (wishlistRows ?? []).map((r) => r.product_id)

  // ── Fase 2: Productos (query separada — FK directa, safe) ─────────────────
  const { data: rawProducts } = productIds.length > 0
    ? await supabase.from('products').select('*').in('id', productIds)
    : { data: [] }

  // Preserve wishlist order (newest first)
  const productMap = Object.fromEntries((rawProducts ?? []).map((p) => [p.id, p]))
  const products   = productIds.map((id) => productMap[id]).filter(Boolean) as Product[]

  return (
    <div className="min-h-screen bg-[#FAFAFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-[#0F0F14]">Mis favoritos</h1>
              <p className="text-sm text-[#6B6B7B] mt-0.5">
                {products.length === 0
                  ? 'Sin productos guardados'
                  : `${products.length} producto${products.length !== 1 ? 's' : ''} guardado${products.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
          {products.length > 0 && (
            <Link
              href="/"
              className="text-sm font-medium text-[#5856D6] hover:text-[#4644b8] transition-colors"
            >
              + Agregar más
            </Link>
          )}
        </div>

        {/* Grid reactivo — se actualiza al agregar/quitar sin reload */}
        <WishlistGrid initialProducts={products} />

      </div>
    </div>
  )
}
