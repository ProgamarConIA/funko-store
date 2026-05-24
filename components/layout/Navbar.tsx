'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ShoppingCart, User, Menu, X, LogOut } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

const NAV_LINKS = [
  { href: '/', label: 'Todos' },
  { href: '/?franchise=Marvel', label: 'Marvel' },
  { href: '/?franchise=DC', label: 'DC Comics' },
  { href: '/?franchise=Disney', label: 'Disney' },
  { href: '/?franchise=Anime', label: 'Anime' },
]

export default function Navbar() {
  const { totalItems, toggleCart } = useCartStore()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const count = totalItems()

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/90 backdrop-blur-xl border-b border-[#E4E4EC] shadow-[0_1px_12px_rgba(15,15,20,0.06)]'
        : 'bg-white/70 backdrop-blur-md'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="group flex items-center gap-1">
            <span className="font-bold text-xl tracking-tight text-[#0F0F14]">
              Funko
            </span>
            <span className="font-light text-xl tracking-tight text-[#5856D6]">
              Store
            </span>
          </Link>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 text-sm text-[#6B6B7B] hover:text-[#0F0F14] hover:bg-[#F5F4FF] rounded-lg font-medium transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-1">

            {/* Carrito */}
            <button
              onClick={toggleCart}
              className="relative p-2.5 rounded-xl text-[#6B6B7B] hover:text-[#0F0F14] hover:bg-[#F5F4FF] transition-all"
              aria-label="Abrir carrito"
            >
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#5856D6] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>

            {/* Usuario desktop */}
            {user ? (
              <div className="hidden md:flex items-center">
                <Link href="/profile" className="p-2.5 rounded-xl text-[#6B6B7B] hover:text-[#0F0F14] hover:bg-[#F5F4FF] transition-all">
                  <User className="w-5 h-5" />
                </Link>
                <button onClick={handleLogout} className="p-2.5 rounded-xl text-[#6B6B7B] hover:text-red-500 hover:bg-red-50 transition-all" title="Cerrar sesión">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 ml-1">
                <Link href="/auth/login" className="px-4 py-2 text-sm text-[#6B6B7B] hover:text-[#0F0F14] font-medium transition-colors">
                  Ingresar
                </Link>
                <Link href="/auth/register" className="px-4 py-2 text-sm bg-[#0F0F14] hover:bg-[#2A2A35] text-white font-medium rounded-xl transition-colors shadow-sm">
                  Registrarse
                </Link>
              </div>
            )}

            {/* Menú móvil */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2.5 rounded-xl text-[#6B6B7B] hover:text-[#0F0F14] hover:bg-[#F5F4FF] transition-all">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#E4E4EC] py-3 space-y-0.5 animate-fade-in-up bg-white/95">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 text-sm text-[#6B6B7B] hover:text-[#0F0F14] hover:bg-[#F5F4FF] rounded-xl font-medium">
                {link.label}
              </Link>
            ))}
            <div className="border-t border-[#E4E4EC] pt-2 mt-2">
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-[#6B6B7B] hover:text-[#0F0F14] hover:bg-[#F5F4FF] rounded-xl font-medium">Mi perfil</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl font-medium">Cerrar sesión</button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-[#6B6B7B] hover:text-[#0F0F14] hover:bg-[#F5F4FF] rounded-xl font-medium">Ingresar</Link>
                  <Link href="/auth/register" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-[#0F0F14] font-semibold hover:bg-[#F5F4FF] rounded-xl">Registrarse</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
