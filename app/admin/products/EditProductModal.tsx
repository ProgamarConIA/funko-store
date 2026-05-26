'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  X, Upload, ImageIcon, Loader2, Save, AlertCircle
} from 'lucide-react'
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/utils'

export interface AdminProduct {
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

interface EditProductModalProps {
  product: AdminProduct
  onClose: () => void
  onSaved: (updated: { name: string; description: string | null; image_url: string | null }) => void
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export default function EditProductModal({
  product,
  onClose,
  onSaved,
}: EditProductModalProps) {
  const [name, setName]               = useState(product.name)
  const [description, setDescription] = useState(product.description ?? '')
  const [imageFile, setImageFile]     = useState<File | null>(null)
  const [previewUrl, setPreviewUrl]   = useState<string | null>(null)
  const [saving, setSaving]           = useState(false)
  const [error, setError]             = useState<string | null>(null)
  const [fieldErr, setFieldErr]       = useState<string | null>(null)
  const [mounted, setMounted]         = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  // Animar entrada
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10)
    return () => clearTimeout(t)
  }, [])

  // Focus en primer input al abrir
  useEffect(() => {
    if (mounted) firstInputRef.current?.focus()
  }, [mounted])

  // Limpiar object URL al desmontar
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  // Cerrar con Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !saving) handleClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [saving]) // eslint-disable-line react-hooks/exhaustive-deps

  // Bloquear scroll del body mientras el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleClose = () => {
    if (saving) return
    setMounted(false)
    setTimeout(onClose, 200)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Tipo no permitido. Usa JPG, PNG, WebP o GIF.')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('El archivo supera los 5 MB.')
      return
    }

    // Liberar URL anterior
    if (previewUrl) URL.revokeObjectURL(previewUrl)

    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    // Simular cambio en el input
    const dt = new DataTransfer()
    dt.items.add(file)
    if (fileInputRef.current) {
      fileInputRef.current.files = dt.files
      fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErr(null)

    // Validación
    if (!name.trim()) {
      setFieldErr('El nombre no puede estar vacío.')
      firstInputRef.current?.focus()
      return
    }

    setSaving(true)

    try {
      let finalImageUrl = product.image_url

      // 1. Subir imagen si hay archivo nuevo
      if (imageFile) {
        const fd = new FormData()
        fd.append('file', imageFile)
        fd.append('oldUrl', product.image_url ?? '')

        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: fd,
        })
        const uploadJson = await uploadRes.json()
        if (!uploadRes.ok) {
          throw new Error(uploadJson.error ?? 'Error al subir la imagen')
        }
        finalImageUrl = uploadJson.url
      }

      // 2. Actualizar producto
      const putRes = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id:          product.id,
          name:        name.trim(),
          description: description.trim() || null,
          image_url:   finalImageUrl,
        }),
      })
      const putJson = await putRes.json()
      if (!putRes.ok) {
        throw new Error(putJson.error ?? 'Error al guardar el producto')
      }

      // 3. Éxito
      onSaved({
        name:        name.trim(),
        description: description.trim() || null,
        image_url:   finalImageUrl,
      })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setSaving(false)
    }
  }

  const currentImage = previewUrl ?? product.image_url ?? DEFAULT_PRODUCT_IMAGE

  return (
    <>
      {/* Backdrop */}
      <div
        className={[
          'fixed inset-0 z-50 flex items-center justify-center p-4',
          'bg-black/40 backdrop-blur-sm',
          'transition-opacity duration-200',
          mounted ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        onClick={handleClose}
        aria-label="Cerrar modal"
      >
        {/* Panel del modal — stopPropagation para no cerrar al hacer clic dentro */}
        <div
          className={[
            'relative w-full max-w-lg bg-white rounded-2xl shadow-2xl',
            'border border-[#E4E4EC] overflow-hidden',
            'transition-all duration-200',
            mounted ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4',
          ].join(' ')}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E4E4EC]">
            <div>
              <h2 id="modal-title" className="text-base font-bold text-[#0F0F14]">
                ✏️ Editar producto
              </h2>
              <p className="text-xs text-[#B0B0BE] mt-0.5 truncate max-w-[320px]">
                {product.franchise} · {product.character}
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={saving}
              className="p-1.5 rounded-xl text-[#B0B0BE] hover:text-[#6B6B7B] hover:bg-[#F5F4FF] transition-all disabled:opacity-40"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── Body ── */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">

              {/* Imagen */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-[#0F0F14]">
                  Imagen del producto
                </label>

                <div className="flex items-start gap-4">
                  {/* Preview */}
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-[#E4E4EC] bg-[#F5F4FF] flex-shrink-0">
                    <Image
                      src={currentImage}
                      alt={name || product.name}
                      fill
                      className="object-contain p-2"
                      sizes="96px"
                      unoptimized={!!previewUrl} // Object URLs no pasan por next/image optimizer
                    />
                    {previewUrl && (
                      <div className="absolute bottom-1 right-1">
                        <span className="text-[9px] font-bold bg-[#5856D6] text-white px-1.5 py-0.5 rounded-full">
                          Nueva
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Drop zone + botón */}
                  <div className="flex-1">
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      className="border-2 border-dashed border-[#E4E4EC] rounded-xl p-3 text-center hover:border-[#5856D6] hover:bg-[#F5F4FF]/50 transition-all cursor-pointer group"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-5 h-5 text-[#B0B0BE] group-hover:text-[#5856D6] mx-auto mb-1.5 transition-colors" />
                      <p className="text-xs text-[#6B6B7B] group-hover:text-[#5856D6] transition-colors leading-snug">
                        {imageFile ? (
                          <span className="font-medium text-[#0F0F14]">{imageFile.name}</span>
                        ) : (
                          <>
                            <span className="font-semibold">Clic o arrastra</span> una imagen
                          </>
                        )}
                      </p>
                      <p className="text-[10px] text-[#B0B0BE] mt-1">JPG, PNG, WebP · máx 5 MB</p>
                    </div>

                    {imageFile && (
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null)
                          if (previewUrl) {
                            URL.revokeObjectURL(previewUrl)
                            setPreviewUrl(null)
                          }
                          if (fileInputRef.current) fileInputRef.current.value = ''
                        }}
                        className="mt-2 text-xs text-[#B0B0BE] hover:text-red-500 transition-colors flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        Quitar imagen seleccionada
                      </button>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>

              {/* Separador */}
              <div className="border-t border-[#E4E4EC]" />

              {/* Nombre */}
              <div className="space-y-1.5">
                <label htmlFor="edit-name" className="text-sm font-semibold text-[#0F0F14]">
                  Nombre <span className="text-red-400">*</span>
                </label>
                <input
                  id="edit-name"
                  ref={firstInputRef}
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setFieldErr(null) }}
                  placeholder="Funko Pop! Spider-Man #39"
                  maxLength={200}
                  className={[
                    'w-full rounded-xl border px-4 py-2.5 text-sm text-[#0F0F14] placeholder-[#B0B0BE]',
                    'bg-white focus:outline-none focus:ring-2 transition-all',
                    fieldErr
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-400/15'
                      : 'border-[#E5E5EA] focus:border-[#5856D6] focus:ring-[#5856D6]/15',
                  ].join(' ')}
                />
                {fieldErr && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {fieldErr}
                  </p>
                )}
              </div>

              {/* Descripción */}
              <div className="space-y-1.5">
                <label htmlFor="edit-desc" className="text-sm font-semibold text-[#0F0F14]">
                  Descripción
                  <span className="ml-1.5 text-xs font-normal text-[#B0B0BE]">(opcional)</span>
                </label>
                <textarea
                  id="edit-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  maxLength={1000}
                  placeholder="Descripción del Funko Pop, edición especial, características…"
                  className="w-full rounded-xl border border-[#E5E5EA] px-4 py-2.5 text-sm text-[#0F0F14] placeholder-[#B0B0BE] bg-white focus:outline-none focus:border-[#5856D6] focus:ring-2 focus:ring-[#5856D6]/15 transition-all resize-none"
                />
                <p className="text-right text-[10px] text-[#B0B0BE]">
                  {description.length}/1000
                </p>
              </div>

              {/* Error general */}
              {error && (
                <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* ── Footer ── */}
            <div className="flex items-center gap-3 px-6 py-4 border-t border-[#E4E4EC] bg-[#FAFAFA]">
              <button
                type="button"
                onClick={handleClose}
                disabled={saving}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#E4E4EC] text-sm font-semibold text-[#6B6B7B] hover:bg-[#F5F4FF] hover:text-[#0F0F14] transition-all disabled:opacity-40"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={saving || !name.trim()}
                className={[
                  'flex-1 flex items-center justify-center gap-2',
                  'px-4 py-2.5 rounded-xl text-sm font-semibold transition-all',
                  'focus:outline-none focus:ring-2 focus:ring-[#5856D6]/30',
                  saving || !name.trim()
                    ? 'bg-[#F5F4FF] text-[#B0B0BE] cursor-not-allowed border border-[#E4E4EC]'
                    : 'bg-[#5856D6] hover:bg-[#4644b8] text-white shadow-sm',
                ].join(' ')}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Guardando…
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Guardar cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
