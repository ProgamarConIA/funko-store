import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  page:       number
  totalPages: number
  buildHref:  (page: number) => string
}

export default function Pagination({ page, totalPages, buildHref }: Props) {
  if (totalPages <= 1) return null

  const range = buildRange(page, totalPages)

  return (
    <nav className="flex items-center justify-center gap-1.5 py-8" aria-label="Paginación">

      {/* ← Anterior */}
      {page > 1 ? (
        <Link href={buildHref(page - 1)} aria-label="Página anterior"
          className="w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium
            bg-white dark:bg-[#12121f] border border-[#E4E4EC] dark:border-[#1e1e35]
            text-[#0F0F14] dark:text-[#f1f0ff]
            hover:border-[#5856D6]/60 hover:text-[#5856D6] hover:bg-[#F5F4FF] dark:hover:bg-[#1e1e35]
            transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      ) : (
        <span className="w-9 h-9 flex items-center justify-center rounded-xl text-sm
          border border-[#E4E4EC] dark:border-[#1e1e35]
          text-[#B0B0BE] dark:text-[#4a4a6a] cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </span>
      )}

      {/* Números */}
      {range.map((item, i) =>
        item === '…' ? (
          <span key={`ellipsis-${i}`}
            className="w-9 h-9 flex items-center justify-center text-sm text-[#B0B0BE] dark:text-[#4a4a6a]"
          >
            …
          </span>
        ) : item === page ? (
          <span key={item}
            aria-current="page"
            className="w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium
              bg-[#5856D6] text-white shadow-sm cursor-default"
          >
            {item}
          </span>
        ) : (
          <Link key={item} href={buildHref(item)}
            aria-label={`Página ${item}`}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium
              bg-white dark:bg-[#12121f] border border-[#E4E4EC] dark:border-[#1e1e35]
              text-[#0F0F14] dark:text-[#f1f0ff]
              hover:border-[#5856D6]/60 hover:text-[#5856D6] hover:bg-[#F5F4FF] dark:hover:bg-[#1e1e35]
              transition-all"
          >
            {item}
          </Link>
        )
      )}

      {/* Siguiente → */}
      {page < totalPages ? (
        <Link href={buildHref(page + 1)} aria-label="Página siguiente"
          className="w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium
            bg-white dark:bg-[#12121f] border border-[#E4E4EC] dark:border-[#1e1e35]
            text-[#0F0F14] dark:text-[#f1f0ff]
            hover:border-[#5856D6]/60 hover:text-[#5856D6] hover:bg-[#F5F4FF] dark:hover:bg-[#1e1e35]
            transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className="w-9 h-9 flex items-center justify-center rounded-xl text-sm
          border border-[#E4E4EC] dark:border-[#1e1e35]
          text-[#B0B0BE] dark:text-[#4a4a6a] cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </span>
      )}

    </nav>
  )
}

/* ── Rango de páginas con ellipsis ────────────────────────── */
function buildRange(current: number, total: number): (number | '…')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const result: (number | '…')[] = []
  result.push(1)
  if (current > 3) result.push('…')

  const start = Math.max(2, current - 1)
  const end   = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) result.push(i)

  if (current < total - 2) result.push('…')
  result.push(total)

  return result
}
