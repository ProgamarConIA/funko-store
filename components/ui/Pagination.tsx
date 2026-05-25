'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  page:       number
  totalPages: number
  /** Función que recibe el número de página y devuelve la URL correspondiente */
  buildHref:  (page: number) => string
}

export default function Pagination({ page, totalPages, buildHref }: Props) {
  if (totalPages <= 1) return null

  /* Genera el rango de páginas visibles (máx 5 números) */
  const range = buildRange(page, totalPages)

  return (
    <nav
      className="flex items-center justify-center gap-1.5 py-8"
      aria-label="Paginación"
    >
      {/* Anterior */}
      <PaginationLink
        href={page > 1 ? buildHref(page - 1) : undefined}
        disabled={page <= 1}
        aria-label="Página anterior"
      >
        <ChevronLeft className="w-4 h-4" />
      </PaginationLink>

      {/* Números */}
      {range.map((item, i) =>
        item === '…' ? (
          <span
            key={`ellipsis-${i}`}
            className="w-9 h-9 flex items-center justify-center text-sm text-[#B0B0BE] dark:text-[#4a4a6a]"
          >
            …
          </span>
        ) : (
          <PaginationLink
            key={item}
            href={item === page ? undefined : buildHref(item as number)}
            active={item === page}
            aria-label={`Página ${item}`}
            aria-current={item === page ? 'page' : undefined}
          >
            {item}
          </PaginationLink>
        )
      )}

      {/* Siguiente */}
      <PaginationLink
        href={page < totalPages ? buildHref(page + 1) : undefined}
        disabled={page >= totalPages}
        aria-label="Página siguiente"
      >
        <ChevronRight className="w-4 h-4" />
      </PaginationLink>
    </nav>
  )
}

/* ── Botón / link individual ───────────────────────────────── */
function PaginationLink({
  href,
  children,
  active   = false,
  disabled = false,
  ...rest
}: {
  href?:     string
  children:  React.ReactNode
  active?:   boolean
  disabled?: boolean
  [k: string]: unknown
}) {
  const base =
    'w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all select-none'

  const activeClass =
    'bg-[#5856D6] text-white shadow-sm shadow-[#5856D6]/40 cursor-default'

  const defaultClass =
    'bg-white dark:bg-[#12121f] border border-[#E4E4EC] dark:border-[#1e1e35] ' +
    'text-[#0F0F14] dark:text-[#f1f0ff] ' +
    'hover:border-[#5856D6]/60 hover:text-[#5856D6] hover:bg-[#F5F4FF] dark:hover:bg-[#1e1e35]'

  const disabledClass =
    'bg-transparent border border-[#E4E4EC] dark:border-[#1e1e35] ' +
    'text-[#B0B0BE] dark:text-[#4a4a6a] cursor-not-allowed'

  const cls = `${base} ${active ? activeClass : disabled ? disabledClass : defaultClass}`

  if (!href || active || disabled) {
    return (
      <span className={cls} {...rest}>
        {children}
      </span>
    )
  }

  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  )
}

/* ── Genera rango de páginas con ellipsis ─────────────────── */
function buildRange(current: number, total: number): (number | '…')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const result: (number | '…')[] = []

  // Siempre primera
  result.push(1)

  if (current > 3) result.push('…')

  // Ventana alrededor de la página actual
  const start = Math.max(2, current - 1)
  const end   = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) result.push(i)

  if (current < total - 2) result.push('…')

  // Siempre última
  result.push(total)

  return result
}
