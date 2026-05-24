import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Combina clases de Tailwind evitando conflictos */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formatea precio a moneda */
export function formatPrice(price: number, currency = 'USD'): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(price)
}

/** Formatea fecha */
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
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
    pending:   'text-neon-yellow bg-yellow-500/10 border-yellow-500/30',
    paid:      'text-neon-cyan bg-cyan-500/10 border-cyan-500/30',
    shipped:   'text-blue-400 bg-blue-500/10 border-blue-500/30',
    delivered: 'text-neon-green bg-green-500/10 border-green-500/30',
    cancelled: 'text-red-400 bg-red-500/10 border-red-500/30',
  }
  return colors[status] ?? 'text-text-secondary bg-bg-card border-bg-border'
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

/** Imagen por defecto si no hay imagen */
export const DEFAULT_PRODUCT_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/800px-Placeholder_view_vector.svg.png'
