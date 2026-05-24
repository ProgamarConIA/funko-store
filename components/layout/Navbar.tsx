'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ShoppingCart, User, Menu, X, Zap, LogOut } from 'lucide-react'
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
    const onScroll = () => setScrolled(window.scrollY > 20)
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#08080f]/95 backdrop-blur-md border-b border-[#1e1e35] shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[#a855f7] rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.5)] group-hover:shadow-[0_0_20px_rgba(168,85,247,0.7)] transition-all">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-[#f1f0ff]">
              Funko<span className="text-neon">Store</span>
            </span>
          </Link>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-[#a09dbd] hover:text-[#f1f0ff] transition-colors">
              Catálogo
            </Link>
            <Link href="/?franchise=Marvel" className="text-sm text-[#a09dbd] hover:text-[#f1f0ff] transition-colors">
              Marvel
            </Link>
            <Link href="/?franchise=DC" className="text-sm text-[#a09dbd] hover:text-[#f1f0ff] transition-colors">
              DC Comics
            </Link>
            <Link href="/?franchise=Disney" className="text-sm text-[#a09dbd] hover:text-[#f1f0ff] transition-colors">
              Disney
            </Link>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            {/* Carrito */}
            <button
              onClick={toggleCart}
              className="relative p-2 rounded-lg text-[#a09dbd] hover:text-[#f1f0ff] hover:bg-[#1a1a2e] transition-all"
              aria-label="Abrir carrito"
            >
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#a855f7] text-white text-xs font-bold rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(168,85,247,0.6)]">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>

            {/* Usuario */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/profile"
                  className="p-2 rounded-lg text-[#a09dbd] hover:text-[#f1f0ff] hover:bg-[#1a1a2e] transition-all"
                >
                  <User className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-[#a09dbd] hover:text-red-400 hover:bg-red-500/10 transition-all"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm text-[#a09dbd] hover:text-[#f1f0ff] transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 text-sm bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-lg shadow-[0_0_12px_rgba(168,85,247,0.35)] hover:shadow-[0_0_18px_rgba(168,85,247,0.55)] transition-all"
                >
                  Registrarse
                </Link>
              </div>
            )}

            {/* Menú móvil */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-[#a09dbd] hover:text-[#f1f0ff] hover:bg-[#1a1a2e] transition-all"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#1e1e35] py-4 space-y-2 animate-fade-in-up">
            {[
              { href: '/', label: 'Catálogo' },
              { href: '/?franchise=Marvel', label: 'Marvel' },
              { href: '/?franchise=DC', label: 'DC Comics' },
              { href: '/?franchise=Disney', label: 'Disney' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-sm text-[#a09dbd] hover:text-[#f1f0ff] hover:bg-[#1a1a2e] rounded-lg transition-all"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-[#1e1e35] pt-2 mt-2">
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-[#a09dbd] hover:text-[#f1f0ff] hover:bg-[#1a1a2e] rounded-lg transition-all">
                    Mi perfil
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-[#a09dbd] hover:text-[#f1f0ff] hover:bg-[#1a1a2e] rounded-lg transition-all">
                    Iniciar sesión
                  </Link>
                  <Link href="/auth/register" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-[#a855f7] hover:bg-[#a855f7]/10 rounded-lg transition-all">
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
