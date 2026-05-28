import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Combina clases de Tailwind evitando conflictos */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatea un monto ya convertido en la moneda indicada.
 * El segundo parámetro es opcional — por defecto EUR, compatible con todo
 * el código existente que llama a formatPrice(amount) sin segundo arg.
 *
 * Ejemplos:
 *   formatPrice(59.99)          → "59,99 €"
 *   formatPrice(97860, 'ARS')   → "$ 97.860"
 *   formatPrice(69.58, 'USD')   → "$69.58"
 */
export function formatPrice(amount: number, currency = 'EUR'): string {
  // Monedas sin decimales
  const noDecimals = ['ARS', 'CLP', 'COP', 'JPY'].includes(currency)
  const decimals   = noDecimals ? 0 : 2

  // Locale por moneda para separadores correctos
  const LOCALE_MAP: Record<string, string> = {
    EUR: 'es-ES',
    USD: 'en-US',
    ARS: 'es-AR',
    MXN: 'es-MX',
    COP: 'es-CO',
    CLP: 'es-CL',
    BRL: 'pt-BR',
    JPY: 'ja-JP',
  }
  const locale = LOCALE_MAP[currency] ?? 'es-ES'

  try {
    return new Intl.NumberFormat(locale, {
      style:                 'currency',
      currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount)
  } catch {
    // Fallback si el entorno no conoce la moneda
    return `${amount.toFixed(decimals)} ${currency}`
  }
}

/** Formatea fecha */
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

/** Formatea fecha + hora HH:MM — ej. "28 de mayo de 2026, 14:32" */
export function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    day:    '2-digit',
    month:  'long',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(date))
}

/** Crea slug desde nombre */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** Trunca texto largo */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}

/** Color de estado de orden */
export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending:   'text-amber-700 bg-amber-50 border-amber-200',
    paid:      'text-blue-700 bg-blue-50 border-blue-200',
    shipped:   'text-indigo-700 bg-indigo-50 border-indigo-200',
    delivered: 'text-green-700 bg-green-50 border-green-200',
    cancelled: 'text-red-600 bg-red-50 border-red-200',
  }
  return colors[status] ?? 'text-[#6E6E73] bg-[#F5F5F7] border-[#E5E5EA]'
}

/** Etiqueta legible de estado de orden */
export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending:   'Pendiente',
    paid:      'Pagado',
    shipped:   'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  }
  return labels[status] ?? status
}

/**
 * Imagen por defecto cuando un producto no tiene imagen o falla al cargar.
 * Usa imagen local para evitar bloqueos de CDN externos.
 */
export const DEFAULT_PRODUCT_IMAGE = '/images/funko-placeholder.png'
