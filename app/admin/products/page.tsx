import { supabaseAdmin } from '@/lib/supabase/admin'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import DeleteProductButton from './DeleteProductButton'

export const metadata: Metadata = { title: 'Admin — Productos' }

export default async function AdminProductsPage() {
  const { data: products } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#f1f0ff]">Productos</h1>
          <p className="text-[#64607a] text-sm mt-1">{products?.length ?? 0} productos en total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#a855f7] hover:bg-[#9333ea] text-white font-bold rounded-xl shadow-[0_0_12px_rgba(168,85,247,0.35)] transition-all text-sm"
        >
          <Plus className="w-4 h-4" /> Nuevo producto
        </Link>
      </div>

      <div className="bg-[#12121f] border border-[#1e1e35] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e1e35]">
              {['Producto', 'Franquicia', 'Categoría', 'Precio', 'Stock', 'Acciones'].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#64607a] uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e35]">
            {products?.map((p) => (
              <tr key={p.id} className="hover:bg-[#1a1a2e] transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 bg-[#1a1a2e] rounded-lg overflow-hidden flex-shrink-0">
                      {p.image_url && (
                        <Image src={p.image_url} alt={p.name} fill className="object-contain p-1" sizes="40px" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-[#f1f0ff] line-clamp-1 max-w-[180px]">{p.name}</p>
                      <p className="text-xs text-[#64607a]">{p.character}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-[#a09dbd]">{p.franchise}</td>
                <td className="px-5 py-4">
                  <span className="px-2 py-0.5 bg-[#22d3ee]/10 border border-[#22d3ee]/20 text-[#22d3ee] text-xs rounded-full">
                    {p.category}
                  </span>
                </td>
                <td className="px-5 py-4 font-bold text-[#a855f7]">{formatPrice(p.price)}</td>
                <td className="px-5 py-4">
                  <span className={`font-semibold ${p.stock === 0 ? 'text-red-400' : p.stock <= 5 ? 'text-[#facc15]' : 'text-[#4ade80]'}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="p-1.5 text-[#64607a] hover:text-[#a855f7] hover:bg-[#a855f7]/10 rounded-lg transition-all"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <DeleteProductButton id={p.id} name={p.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!products || products.length === 0) && (
          <div className="text-center py-12 text-[#64607a]">
            <p>No hay productos. <Link href="/admin/products/new" className="text-[#a855f7]">Crear el primero →</Link></p>
          </div>
        )}
      </div>
    </div>
  )
}
