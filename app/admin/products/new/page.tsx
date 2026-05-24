'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', slug: '', description: '', price: '', image_url: '',
    franchise: '', character: '', category: 'Standard', stock: '10', is_featured: false,
  })

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      }),
    })

    const json = await res.json()
    if (!res.ok) { setError(json.error ?? 'Error al crear el producto'); setLoading(false); return }
    router.push('/admin/products')
    router.refresh()
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="text-[#64607a] hover:text-[#a855f7] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-extrabold text-[#f1f0ff]">Nuevo producto</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#12121f] border border-[#1e1e35] rounded-2xl p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input label="Nombre del producto *" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Pop! Spider-Man #39" required />
          </div>
          <div className="sm:col-span-2">
            <Input label="URL de imagen" value={form.image_url} onChange={(e) => set('image_url', e.target.value)} placeholder="https://..." />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-[#a09dbd] block mb-1.5">Descripción</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              placeholder="Descripción del Funko Pop..."
              className="w-full bg-[#1a1a2e] border border-[#1e1e35] text-[#f1f0ff] placeholder-[#64607a] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#a855f7] resize-none"
            />
          </div>
          <Input label="Precio (USD) *" type="number" step="0.01" min="0" value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="14.99" required />
          <Input label="Stock *" type="number" min="0" value={form.stock} onChange={(e) => set('stock', e.target.value)} placeholder="10" required />
          <Input label="Franquicia *" value={form.franchise} onChange={(e) => set('franchise', e.target.value)} placeholder="Marvel" required />
          <Input label="Personaje *" value={form.character} onChange={(e) => set('character', e.target.value)} placeholder="Spider-Man" required />

          <div>
            <label className="text-sm font-medium text-[#a09dbd] block mb-1.5">Categoría</label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className="w-full bg-[#1a1a2e] border border-[#1e1e35] text-[#f1f0ff] text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#a855f7]"
            >
              {['Standard', 'Deluxe', 'Chase', 'Exclusive', 'Super Sized'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="featured"
              checked={form.is_featured}
              onChange={(e) => set('is_featured', e.target.checked)}
              className="w-4 h-4 accent-[#a855f7]"
            />
            <label htmlFor="featured" className="text-sm text-[#a09dbd]">Producto destacado ⭐</label>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={loading} icon={<Save className="w-4 h-4" />} className="flex-1">
            Guardar producto
          </Button>
          <Link href="/admin/products" className="px-5 py-2.5 bg-[#1a1a2e] border border-[#1e1e35] text-[#a09dbd] rounded-lg text-sm font-semibold hover:border-[#a855f7]/40 transition-all">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
