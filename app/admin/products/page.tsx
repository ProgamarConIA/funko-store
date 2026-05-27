import { supabaseAdmin } from '@/lib/supabase/admin'
import type { Metadata } from 'next'
import { Package } from 'lucide-react'
import EditableProductRow from './EditableProductRow'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Admin — Productos' }

export default async function AdminProductsPage() {
  const { data: products } = await supabaseAdmin
    .from('products')
    .select('id, name, character, franchise, category, price, stock, image_url, description')
    .order('franchise', { ascending: true })
    .order('name',      { ascending: true })

  const total     = products?.length ?? 0
  const sinStock  = products?.filter((p) => p.stock === 0).length ?? 0
  const bajStock  = products?.filter((p) => p.stock > 0 && p.stock <= 5).length ?? 0

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F0F14]">Productos</h1>
          <p className="text-[#6B6B7B] text-sm mt-1">{total} productos en total</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-end">
          {sinStock > 0 && (
            <span className="text-xs px-3 py-1.5 bg-red-50 text-red-500 border border-red-200 rounded-full font-semibold">
              {sinStock} sin stock
            </span>
          )}
          {bajStock > 0 && (
            <span className="text-xs px-3 py-1.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-full font-semibold">
              {bajStock} stock bajo
            </span>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white border border-[#E4E4EC] rounded-2xl overflow-hidden shadow-card">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-[#E4E4EC]">
          <Package className="w-4 h-4 text-[#5856D6]" />
          <span className="text-sm font-semibold text-[#0F0F14]">Catálogo de productos</span>
          <span className="ml-auto text-xs text-[#6B6B7B]">Edita precio, stock, nombre, descripción e imagen directamente</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-[#E4E4EC]">
                {['Producto', 'Franquicia', 'Categoría', 'Precio', 'Stock', 'Estado', 'Acciones'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold text-[#B0B0BE] uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products?.map((product) => (
                <EditableProductRow key={product.id} product={product} />
              ))}
            </tbody>
          </table>
        </div>

        {(!products || products.length === 0) && (
          <div className="text-center py-16 text-[#B0B0BE] text-sm">
            No hay productos en la base de datos
          </div>
        )}
      </div>

      <p className="text-xs text-[#B0B0BE] text-center">
        Los cambios se guardan directamente en Supabase y se reflejan en la tienda de inmediato.
      </p>
    </div>
  )
}
