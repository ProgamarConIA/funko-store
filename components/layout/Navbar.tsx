'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ShoppingCart, User, Menu, X, LogOut } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { User as SupabaseUser } from '@supabase/supabase-js'

const NAV_LINKS = [
  { href: '/', label: 'Todos' },
  { href: '/?franchise=Marvel', label: 'Marvel' },
  { href: '/?franchise=DC', label: 'DC Comics' },
  { href: '/?franchise=Disney', label: 'Disney' },
  { href: '/?franchise=Anime', label: 'Anime' },
]

export default function Navbar() {
  // Selectores específicos: el Navbar solo re-renderiza cuando cambia
  // el count del carrito o se llama toggleCart — no cuando isOpen cambia.
  const toggleCart = useCartStore((state) => state.toggleCart)
  const count = useCartStore(
    (state) => state.items.reduce((sum, i) => sum + i.quantity, 0)
  )

  const [user, setUser]       = useState<SupabaseUser | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Ref para evitar setState innecesarios en cada frame de scroll
  const scrolledRef = useRef(false)

  // Supabase client estable: lazy initializer garantiza que se cree solo una vez
  const [supabase] = useState<SupabaseClient>(() => createClient())

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [supabase])

  useEffect(() => {
    const onScroll = () => {
      const isNowScrolled = window.scrollY > 8
      // Solo setState si el valor realmente cambió → evita re-renders continuos
      if (isNowScrolled !== scrolledRef.current) {
        scrolledRef.current = isNowScrolled
        setScrolled(isNowScrolled)
      }
    }
    // passive: true → el browser scrollea sin esperar al handler (no bloquea)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
      scrolled
        ? 'bg-white/92 dark:bg-[#0e0e16]/92 backdrop-blur-xl border-b border-[#E4E4EC] dark:border-[#1e1e35] shadow-[0_1px_12px_rgba(15,15,20,0.06)] dark:shadow-[0_1px_12px_rgba(0,0,0,.3)]'
        : 'bg-white/70 dark:bg-[#0e0e16]/70 backdrop-blur-md'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
            <span className="font-bold text-xl tracking-tight text-[#0F0F14] dark:text-[#f1f0ff]">Funko</span>
            <span className="font-light text-xl tracking-tight text-[#5856D6] dark:text-[#a88dff]">Store</span>
          </Link>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 text-sm text-[#6B6B7B] dark:text-[#9090aa] hover:text-[#0F0F14] dark:hover:text-[#f1f0ff] hover:bg-[#F5F4FF] dark:hover:bg-[#1e1e35] rounded-lg font-medium"
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
              className="relative p-2.5 rounded-xl text-[#6B6B7B] dark:text-[#9090aa] hover:text-[#0F0F14] dark:hover:text-[#f1f0ff] hover:bg-[#F5F4FF] dark:hover:bg-[#1e1e35]"
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
                <Link href="/profile" className="p-2.5 rounded-xl text-[#6B6B7B] dark:text-[#9090aa] hover:text-[#0F0F14] dark:hover:text-[#f1f0ff] hover:bg-[#F5F4FF] dark:hover:bg-[#1e1e35]">
                  <User className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl text-[#6B6B7B] dark:text-[#9090aa] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 ml-1">
                <Link href="/auth/login" className="px-4 py-2 text-sm text-[#6B6B7B] dark:text-[#9090aa] hover:text-[#0F0F14] dark:hover:text-[#f1f0ff] font-medium">
                  Ingresar
                </Link>
                <Link href="/auth/register" className="px-4 py-2 text-sm bg-[#0F0F14] dark:bg-[#5856D6] hover:bg-[#2A2A35] dark:hover:bg-[#4644b8] text-white font-medium rounded-xl shadow-sm">
                  Registrarse
                </Link>
              </div>
            )}

            {/* Botón menú móvil */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2.5 rounded-xl text-[#6B6B7B] dark:text-[#9090aa] hover:text-[#0F0F14] dark:hover:text-[#f1f0ff] hover:bg-[#F5F4FF] dark:hover:bg-[#1e1e35]"
              aria-label="Menú"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#E4E4EC] dark:border-[#1e1e35] py-3 space-y-0.5 animate-fade-in-up bg-white/97 dark:bg-[#0e0e16]/97">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 text-sm text-[#6B6B7B] dark:text-[#9090aa] hover:text-[#0F0F14] dark:hover:text-[#f1f0ff] hover:bg-[#F5F4FF] dark:hover:bg-[#1e1e35] rounded-xl font-medium"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-[#E4E4EC] dark:border-[#1e1e35] pt-2 mt-2">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-[#6B6B7B] dark:text-[#9090aa] hover:text-[#0F0F14] dark:hover:text-[#f1f0ff] hover:bg-[#F5F4FF] dark:hover:bg-[#1e1e35] rounded-xl font-medium"
                  >
                    Mi perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-medium"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-[#6B6B7B] dark:text-[#9090aa] hover:text-[#0F0F14] dark:hover:text-[#f1f0ff] hover:bg-[#F5F4FF] dark:hover:bg-[#1e1e35] rounded-xl font-medium"
                  >
                    Ingresar
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-[#0F0F14] dark:text-[#f1f0ff] font-semibold hover:bg-[#F5F4FF] dark:hover:bg-[#1e1e35] rounded-xl"
                  >
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
