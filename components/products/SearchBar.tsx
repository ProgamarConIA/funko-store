'use client'

import { Search, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState, useEffect, useTransition } from 'react'

export default function SearchBar() {
  const router = useRouter()
  const params = useSearchParams()
  const [value, setValue] = useState(params.get('search') ?? '')
  const [, startTransition] = useTransition()

  /* Sync URL param → input (cuando cambia por navegación externa) */
  useEffect(() => {
    const urlSearch = params.get('search') ?? ''
    startTransition(() => { setValue(urlSearch) })
  }, [params])

  const handleSearch = useCallback(
    (term: string) => {
      const next = new URLSearchParams(params.toString())
      if (term.trim()) next.set('search', term.trim())
      else next.delete('search')
      next.delete('page')
      router.push(`/?${next.toString()}`)
    },
    [params, router]
  )

  /* Debounce typing → navegación */
  useEffect(() => {
    const timer = setTimeout(() => handleSearch(value), 400)
    return () => clearTimeout(timer)
  }, [value, handleSearch])

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AEAEB2]" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar Funko Pop…"
        className={[
          'w-full rounded-xl pl-11 pr-10 py-3 text-sm transition-all',
          'bg-white dark:bg-[#13131f]',
          'border border-[#E0DFFF] dark:border-[#1e1e35]',
          'text-[#1D1D1F] dark:text-[#f1f0ff]',
          'placeholder-[#AEAEB2] dark:placeholder-[#4a4a6a]',
          'focus:outline-none focus:border-[#5856D6] dark:focus:border-[#5856D6]',
          'focus:ring-2 focus:ring-[#5856D6]/15',
        ].join(' ')}
      />
      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#AEAEB2] hover:text-[#6E6E73] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
