'use client'

import { Search, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState, useEffect } from 'react'

export default function SearchBar() {
  const router = useRouter()
  const params = useSearchParams()
  const [value, setValue] = useState(params.get('search') ?? '')

  useEffect(() => {
    setValue(params.get('search') ?? '')
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

  // Debounce de 400ms
  useEffect(() => {
    const timer = setTimeout(() => handleSearch(value), 400)
    return () => clearTimeout(timer)
  }, [value])

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64607a]" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar Funko Pop (personaje, franquicia…)"
        className="w-full bg-[#12121f] border border-[#1e1e35] text-[#f1f0ff] placeholder-[#64607a] rounded-xl pl-11 pr-10 py-3 text-sm focus:outline-none focus:border-[#a855f7] focus:ring-2 focus:ring-[#a855f7]/20 transition-all"
      />
      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64607a] hover:text-[#f1f0ff] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
