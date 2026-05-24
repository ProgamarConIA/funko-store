'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Save, Check, AlertCircle, Loader2 } from 'lucide-react'
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/utils'

interface Product {
  id: string
  name: string
  character: string
  franchise: string
  category: string
  price: number
  stock: number
  image_url: string | null
}

export default function EditableProductRow({ product }: { product: Product }) {
  const [price, setPrice]   = useState(product.price.toString())
  const [stock, setStock]   = useState(product.stock.toString())
  const [status, setStatus] = useState<'idle' | 'loading' | 'saved' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [imgError, setImgError] = useState(false)

  const isDirty = price !== product.price.toString() || stock !== product.stock.toString()

  const handleSave = async () => {
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: parseFloat(price),
          stock: parseInt(stock, 10),
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Error al guardar')

      setStatus('saved')
      setTimeout(() => setStatus('idle'), 2000)
    } catch (e: unknown) {
      setStatus('error')
      setErrorMsg(e instanceof Error ? e.message : 'Error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const stockNum = parseInt(stock, 10)
  const stockColor =
    stockNum === 0 ? 'text-red-500' :
    stockNum <= 5  ? 'text-amber-500' :
                     'text-green-600'

  return (
    <tr className="border-b border-[#E4E4EC] hover:bg-[#F9F8FF] transition-colors">

      {/* Producto */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-[#F5F4FF] border border-[#E4E4EC] flex-shrink-0">
            <Image
              src={imgError ? DEFAULT_PRODUCT_IMAGE : (product.image_url || DEFAULT_PRODUCT_IMAGE)}
              alt={product.name}
              fill
              className="object-contain p-1"
              sizes="40px"
              onError={() => setImgError(true)}
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#0F0F14] truncate max-w-[160px]">{product.name}</p>
            <p className="text-xs text-[#B0B0BE]">{product.character}</p>
          </div>
        </div>
      </td>

      {/* Franquicia */}
      <td className="px-4 py-3">
        <span className="text-xs px-2.5 py-1 bg-[#EEEDFF] text-[#5856D6] rounded-full font-medium">
          {product.franchise}
        </span>
      </td>

      {/* Categoría */}
      <td className="px-4 py-3 text-xs text-[#6B6B7B]">{product.category}</td>

      {/* Precio editable */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="text-xs text-[#6B6B7B]">€</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            step="0.01"
            min="0"
            className="w-20 text-sm font-bold text-[#0F0F14] bg-white border border-[#E4E4EC] rounded-lg px-2 py-1 focus:outline-none focus:border-[#5856D6] focus:ring-1 focus:ring-[#5856D6]/20 transition-all"
          />
        </div>
      </td>

      {/* Stock editable */}
      <td className="px-4 py-3">
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          min="0"
          className={`w-16 text-sm font-bold bg-white border border-[#E4E4EC] rounded-lg px-2 py-1 focus:outline-none focus:border-[#5856D6] focus:ring-1 focus:ring-[#5856D6]/20 transition-all ${stockColor}`}
        />
      </td>

      {/* Estado stock */}
      <td className="px-4 py-3">
        {stockNum === 0 ? (
          <span className="text-xs px-2 py-0.5 bg-red-50 text-red-500 border border-red-200 rounded-full font-medium">Sin stock</span>
        ) : stockNum <= 5 ? (
          <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-full font-medium">⚠ Bajo</span>
        ) : (
          <span className="text-xs px-2 py-0.5 bg-green-50 text-green-600 border border-green-200 rounded-full font-medium">OK</span>
        )}
      </td>

      {/* Guardar */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={!isDirty || status === 'loading'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              status === 'saved'
                ? 'bg-green-50 text-green-600 border border-green-200'
                : status === 'error'
                ? 'bg-red-50 text-red-500 border border-red-200'
                : !isDirty
                ? 'bg-[#F5F4FF] text-[#B0B0BE] cursor-not-allowed border border-[#E4E4EC]'
                : 'bg-[#5856D6] hover:bg-[#4644b8] text-white shadow-sm'
            }`}
          >
            {status === 'loading' && <Loader2 className="w-3 h-3 animate-spin" />}
            {status === 'saved'   && <Check className="w-3 h-3" />}
            {status === 'error'   && <AlertCircle className="w-3 h-3" />}
            {status === 'idle'    && <Save className="w-3 h-3" />}
            {status === 'loading' ? 'Guardando…' :
             status === 'saved'   ? '¡Guardado!' :
             status === 'error'   ? 'Error'      : 'Guardar'}
          </button>
          {status === 'error' && errorMsg && (
            <span className="text-[10px] text-red-500 max-w-[80px] truncate" title={errorMsg}>{errorMsg}</span>
          )}
        </div>
      </td>
    </tr>
  )
}
