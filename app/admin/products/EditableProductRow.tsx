'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Save, Check, AlertCircle, Loader2, Pencil } from 'lucide-react'
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/utils'
import EditProductModal, { type AdminProduct } from './EditProductModal'
import ToastNotification from './ToastNotification'
import {
  getCurrencyInfo,
  getRateFromCache,
  CURRENCY_LS_KEY,
  CURRENCY_CHANGE_EVENT,
  type CurrencyChangePayload,
} from './CurrencySelector'

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

// ─── Normaliza un número al mismo string que devuelve input[type="number"] ───
// .toFixed(2) produce "17.50", pero el browser devuelve "17.5" en e.target.value.
// parseFloat→String replica esa normalización y evita diferencias espurias.
function toDisplayStr(value: number, decimals: number): string {
  return String(parseFloat(value.toFixed(decimals)))
}

export default function EditableProductRow({ product: initialProduct }: { product: Product }) {
  const router = useRouter()

  // ── Estado del producto (actualizable localmente) ──
  const [product, setProduct] = useState<Product>(initialProduct)

  // ── Precio/stock mostrados en los inputs ──
  const [price, setPrice] = useState(() => toDisplayStr(initialProduct.price, 2))
  const [stock, setStock] = useState(() => String(initialProduct.stock))

  // ── Baseline: último valor guardado en la moneda actual (comparación de strings) ──
  // isDirty = price !== baselinePrice || stock !== baselineStock.
  // Puro string → sin punto flotante, sin race conditions.
  const [baselinePrice, setBaselinePrice] = useState(() => toDisplayStr(initialProduct.price, 2))
  const [baselineStock, setBaselineStock] = useState(() => String(initialProduct.stock))

  const isDirty = price !== baselinePrice || stock !== baselineStock

  // ── Estado del botón ──
  const [status,   setStatus]  = useState<'idle' | 'loading' | 'saved' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [imgError, setImgError] = useState(false)

  // ── Moneda y tasa ──
  const [currencyCode,     setCurrencyCode]     = useState('EUR')
  const [exchangeRate,     setExchangeRate]     = useState(1)
  const [currencyDecimals, setCurrencyDecimals] = useState(2)

  // ── Refs para acceder a valores actualizados sin stale closures en effects ──
  const basePriceEurRef     = useRef(initialProduct.price)
  const exchangeRateRef     = useRef(1)
  const currencyDecimalsRef = useRef(2)

  useEffect(() => { basePriceEurRef.current     = product.price       }, [product.price])
  useEffect(() => { exchangeRateRef.current     = exchangeRate        }, [exchangeRate])
  useEffect(() => { currencyDecimalsRef.current = currencyDecimals    }, [currencyDecimals])

  // ── Helper: aplica tasa y sincroniza precio + baseline ──
  const applyRate = useCallback((rate: number, decimals: number) => {
    const display = toDisplayStr(basePriceEurRef.current * rate, decimals)
    setPrice(display)
    setBaselinePrice(display)   // cambiar moneda no es una edición del admin
  }, [])

  // ── Leer moneda guardada al montar + escuchar cambios del selector ──
  useEffect(() => {
    const savedCode = localStorage.getItem(CURRENCY_LS_KEY) ?? 'EUR'
    if (savedCode !== 'EUR') {
      const rate     = getRateFromCache(savedCode)
      const info     = getCurrencyInfo(savedCode)
      const decimals = info.decimals as number
      setCurrencyCode(savedCode)
      setExchangeRate(rate)
      setCurrencyDecimals(decimals)
      if (rate !== 1) applyRate(rate, decimals)
    }

    const handleCurrencyChange = (e: Event) => {
      const payload = (e as CustomEvent<CurrencyChangePayload>).detail
      setCurrencyCode(payload.code)
      setExchangeRate(payload.rate)
      setCurrencyDecimals(payload.decimals)
      applyRate(payload.rate, payload.decimals)
    }
    window.addEventListener(CURRENCY_CHANGE_EVENT, handleCurrencyChange)
    return () => window.removeEventListener(CURRENCY_CHANGE_EVENT, handleCurrencyChange)
  }, [applyRate])

  // ── Sincronizar con datos del servidor cuando initialProduct cambia ──────────
  // Esto ocurre tras router.refresh() (llamado al guardar precio/stock).
  // Garantiza que isDirty = false aunque algún re-render intermedio haya
  // interferido con los setState del handleSave.
  // Usamos prevRef para detectar cambios REALES (no el primer montaje).
  const prevInitialRef = useRef(initialProduct)
  useEffect(() => {
    const prev = prevInitialRef.current
    prevInitialRef.current = initialProduct

    // Saltar si los datos no cambiaron (mismo objeto o mismos valores)
    if (
      prev === initialProduct ||
      (prev.price === initialProduct.price && prev.stock === initialProduct.stock)
    ) return

    // Los datos del servidor cambiaron → re-sincronizar estado local
    basePriceEurRef.current = initialProduct.price
    const rate     = exchangeRateRef.current
    const decimals = currencyDecimalsRef.current
    const displayP = toDisplayStr(initialProduct.price * rate, decimals)
    const displayS = String(initialProduct.stock)

    setProduct(initialProduct)
    setPrice(displayP)
    setBaselinePrice(displayP)
    setStock(displayS)
    setBaselineStock(displayS)
  }, [initialProduct]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Modal y toast ──
  const [showEditModal, setShowEditModal] = useState(false)
  const [toast,         setToast]         = useState<Toast | null>(null)

  // ─── Guardar precio/stock ──────────────────────────────────────────────────
  const handleSave = async () => {
    setStatus('loading')
    setErrorMsg('')

    try {
      // Convertir precio mostrado a EUR (moneda base de la BD)
      const priceEur      = parseFloat(price) / exchangeRate
      const savedEurPrice = Math.round(priceEur * 100) / 100
      const savedStock    = parseInt(stock, 10)

      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: savedEurPrice, stock: savedStock }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Error al guardar')

      // 1. Actualizar estado local inmediatamente
      basePriceEurRef.current = savedEurPrice
      setProduct((prev) => ({ ...prev, price: savedEurPrice, stock: savedStock }))

      // 2. Sincronizar inputs y baseline con el valor canónico guardado
      const displayPrice = toDisplayStr(savedEurPrice * exchangeRate, currencyDecimals)
      const displayStock = String(savedStock)
      setPrice(displayPrice)
      setBaselinePrice(displayPrice)   // isDirty → false
      setStock(displayStock)
      setBaselineStock(displayStock)   // isDirty → false

      setStatus('saved')
      setTimeout(() => setStatus('idle'), 2000)

      // 3. Refrescar datos del servidor como safety net:
      //    si algún re-render intermedio revierte el estado, el useEffect de
      //    initialProduct lo corregirá en cuanto llegue la nueva prop del server.
      router.refresh()
    } catch (e: unknown) {
      setStatus('error')
      setErrorMsg(e instanceof Error ? e.message : 'Error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  // ─── Callback del modal ────────────────────────────────────────────────────
  const handleModalSaved = useCallback(
    (updated: { name: string; description: string | null; image_url: string | null }) => {
      setProduct((prev) => ({
        ...prev,
        name:        updated.name,
        description: updated.description,
        image_url:   updated.image_url,
      }))
      setImgError(false)
      setShowEditModal(false)
      setToast({ message: 'Producto actualizado correctamente', type: 'success', key: Date.now() })
      router.refresh()
    },
    [router],
  )

  const stockNum   = parseInt(stock, 10)
  const stockColor =
    stockNum === 0 ? 'text-red-500' :
    stockNum <= 5  ? 'text-amber-500' :
                     'text-green-600'

  const currentImage = imgError
    ? DEFAULT_PRODUCT_IMAGE
    : (product.image_url || DEFAULT_PRODUCT_IMAGE)

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

        {/* Precio */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            <span className="text-xs text-[#6B6B7B]">{getCurrencyInfo(currencyCode).symbol}</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step={currencyDecimals === 0 ? '1' : '0.01'}
              min="0"
              className="w-20 text-sm font-bold text-[#0F0F14] bg-white border border-[#E4E4EC] rounded-lg px-2 py-1 focus:outline-none focus:border-[#5856D6] focus:ring-1 focus:ring-[#5856D6]/20 transition-all"
            />
          </div>
        </td>

        {/* Stock */}
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

        {/* Acciones */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-2 flex-wrap">

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
                <span className="text-[10px] text-red-500 max-w-[80px] truncate" title={errorMsg}>
                  {errorMsg}
                </span>
              )}
            </div>

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

      {showEditModal && (
        <EditProductModal
          product={product as AdminProduct}
          onClose={() => setShowEditModal(false)}
          onSaved={handleModalSaved}
        />
      )}

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
