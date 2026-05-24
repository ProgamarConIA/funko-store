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

  useEffect(() => {
    const timer = setTimeout(() => handleSearch(value), 400)
    return () => clearTimeout(timer)
  }, [value])

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AEAEB2]" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar Funko Pop…"
        className="w-full bg-white border border-[#E5E5EA] text-[#1D1D1F] placeholder-[#AEAEB2] rounded-xl pl-11 pr-10 py-3 text-sm focus:outline-none focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/10 transition-all"
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
