'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ShoppingCart, User, Menu, X, LogOut } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

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
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const count = totalItems()

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-[#E5E5EA]'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 group">
            <span className="font-bold text-xl tracking-tight text-[#1D1D1F]">
              Funko<span className="font-light">Store</span>
            </span>
          </Link>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { href: '/', label: 'Catálogo' },
              { href: '/?franchise=Marvel', label: 'Marvel' },
              { href: '/?franchise=DC', label: 'DC Comics' },
              { href: '/?franchise=Anime', label: 'Anime' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#6E6E73] hover:text-[#1D1D1F] transition-colors font-medium"
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
              className="relative p-2.5 rounded-full text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-all"
              aria-label="Abrir carrito"
            >
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[18px] min-h-[18px] bg-[#1D1D1F] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>

            {/* Usuario */}
            {user ? (
              <div className="hidden md:flex items-center">
                <Link
                  href="/profile"
                  className="p-2.5 rounded-full text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-all"
                >
                  <User className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-full text-[#6E6E73] hover:text-red-500 hover:bg-red-50 transition-all"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 ml-1">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm text-[#6E6E73] hover:text-[#1D1D1F] font-medium transition-colors"
                >
                  Ingresar
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 text-sm bg-[#1D1D1F] hover:bg-[#3D3D3F] text-white font-medium rounded-full transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}

            {/* Menú móvil */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2.5 rounded-full text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-all"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#E5E5EA] py-3 space-y-1 animate-fade-in-up bg-white">
            {[
              { href: '/', label: 'Catálogo' },
              { href: '/?franchise=Marvel', label: 'Marvel' },
              { href: '/?franchise=DC', label: 'DC Comics' },
              { href: '/?franchise=Anime', label: 'Anime' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 text-sm text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-xl transition-all font-medium"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-[#E5E5EA] pt-2 mt-2">
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-xl transition-all font-medium">
                    Mi perfil
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium">
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-xl transition-all font-medium">
                    Ingresar
                  </Link>
                  <Link href="/auth/register" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-[#1D1D1F] font-semibold hover:bg-[#F5F5F7] rounded-xl transition-all">
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
