'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Save, Check, AlertCircle, Loader2, Pencil } from 'lucide-react'
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/utils'
import EditProductModal, { type AdminProduct } from './EditProductModal'
import ToastNotification from './ToastNotification'
import { getCurrencyInfo, CURRENCY_LS_KEY } from './CurrencySelector'

interface Product {
  id: string
  name: string
  character: string
  franchise: string
  category: string
  price: number
  stock: number
  image_url: string | null
  description: string | null
}

interface Toast {
  message: string
  type: 'success' | 'error'
  key: number
}

export default function EditableProductRow({ product: initialProduct }: { product: Product }) {
  const router = useRouter()

  // ── Estado del producto (actualizable localmente tras editar) ──
  const [product, setProduct] = useState<Product>(initialProduct)

  // ── Estado precio/stock inline ──
  const [price, setPrice]   = useState(product.price.toString())
  const [stock, setStock]   = useState(product.stock.toString())
  const [status, setStatus] = useState<'idle' | 'loading' | 'saved' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [imgError, setImgError] = useState(false)

  // ── Moneda seleccionada en el panel admin ──
  const [currencyCode, setCurrencyCode] = useState('EUR')

  useEffect(() => {
    // Leer valor inicial de localStorage
    setCurrencyCode(localStorage.getItem(CURRENCY_LS_KEY) ?? 'EUR')

    // Escuchar cambios del selector de moneda (CurrencySelector dispara este evento)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === CURRENCY_LS_KEY && e.newValue) {
        setCurrencyCode(e.newValue)
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // ── Estado modal de edición completa ──
  const [showEditModal, setShowEditModal] = useState(false)

  // ── Toast post-guardado ──
  const [toast, setToast] = useState<Toast | null>(null)

  const isDirty = price !== product.price.toString() || stock !== product.stock.toString()

  // ─── Guardar precio/stock inline ──────────────────────────────
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

  // ─── Callback cuando el modal guarda con éxito ────────────────
  const handleModalSaved = useCallback(
    (updated: { name: string; description: string | null; image_url: string | null }) => {
      // Actualizar estado local inmediatamente (sin esperar al router.refresh)
      setProduct((prev) => ({
        ...prev,
        name:        updated.name,
        description: updated.description,
        image_url:   updated.image_url,
      }))
      setImgError(false) // Resetear error de imagen si había uno
      setShowEditModal(false)

      // Mostrar toast de éxito
      setToast({ message: 'Producto actualizado correctamente', type: 'success', key: Date.now() })

      // Refrescar datos del servidor en background
      router.refresh()
    },
    [router],
  )

  const stockNum = parseInt(stock, 10)
  const stockColor =
    stockNum === 0 ? 'text-red-500' :
    stockNum <= 5  ? 'text-amber-500' :
                     'text-green-600'

  const currentImage = imgError ? DEFAULT_PRODUCT_IMAGE : (product.image_url || DEFAULT_PRODUCT_IMAGE)

  return (
    <>
      <tr className="border-b border-[#E4E4EC] hover:bg-[#F9F8FF] transition-colors">

        {/* Producto */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-[#F5F4FF] border border-[#E4E4EC] flex-shrink-0">
              <Image
                src={currentImage}
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
            <span className="text-xs text-[#6B6B7B]">{getCurrencyInfo(currencyCode).symbol}</span>
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

        {/* Acciones: guardar precio/stock + abrir editor completo */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-2 flex-wrap">

            {/* Guardar precio/stock */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleSave}
                disabled={!isDirty || status === 'loading'}
                title="Guardar precio y stock"
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

            {/* Botón editar completo */}
            <button
              onClick={() => setShowEditModal(true)}
              title="Editar nombre, descripción e imagen"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-[#E4E4EC] text-[#6B6B7B] hover:border-[#5856D6] hover:text-[#5856D6] hover:bg-[#F5F4FF] transition-all"
            >
              <Pencil className="w-3 h-3" />
              Editar
            </button>
          </div>
        </td>
      </tr>

      {/* Modal de edición completa */}
      {showEditModal && (
        <EditProductModal
          product={product as AdminProduct}
          onClose={() => setShowEditModal(false)}
          onSaved={handleModalSaved}
        />
      )}

      {/* Toast de notificación */}
      {toast && (
        <ToastNotification
          key={toast.key}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}
