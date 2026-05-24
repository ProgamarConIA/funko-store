import Link from 'next/link'
import { Zap, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-[#1e1e35] bg-[#0f0f1a] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#a855f7] rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.4)]">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl text-[#f1f0ff]">
                Funko<span className="text-neon">Store</span>
              </span>
            </Link>
            <p className="text-[#64607a] text-sm max-w-xs leading-relaxed">
              La tienda de Funko Pops más completa. Encuentra tus personajes favoritos de Marvel, DC, Disney y más.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h4 className="text-[#f1f0ff] font-semibold text-sm mb-4">Tienda</h4>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Todos los productos' },
                { href: '/?franchise=Marvel', label: 'Marvel' },
                { href: '/?franchise=DC', label: 'DC Comics' },
                { href: '/?franchise=Disney', label: 'Disney' },
                { href: '/?franchise=Anime', label: 'Anime' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#64607a] hover:text-[#a855f7] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cuenta */}
          <div>
            <h4 className="text-[#f1f0ff] font-semibold text-sm mb-4">Mi cuenta</h4>
            <ul className="space-y-2">
              {[
                { href: '/auth/login', label: 'Iniciar sesión' },
                { href: '/auth/register', label: 'Registrarse' },
                { href: '/profile', label: 'Mi perfil' },
                { href: '/profile/orders', label: 'Mis pedidos' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#64607a] hover:text-[#a855f7] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1e1e35] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#64607a]">
            © {new Date().getFullYear()} FunkoStore. Todos los derechos reservados.
          </p>
          <p className="text-xs text-[#64607a] flex items-center gap-1">
            Hecho con <Heart className="w-3 h-3 text-[#f472b6]" /> para los coleccionistas
          </p>
        </div>
      </div>
    </footer>
  )
}
