import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-[#E5E5EA] bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="font-bold text-xl tracking-tight text-[#1D1D1F]">
                Funko<span className="font-light">Store</span>
              </span>
            </Link>
            <p className="text-[#6E6E73] text-sm max-w-xs leading-relaxed">
              La tienda de Funko Pops más completa de Argentina. Encontrá tus personajes favoritos.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h4 className="text-[#1D1D1F] font-semibold text-sm mb-4">Tienda</h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Todos los productos' },
                { href: '/?franchise=Marvel', label: 'Marvel' },
                { href: '/?franchise=DC', label: 'DC Comics' },
                { href: '/?franchise=Disney', label: 'Disney' },
                { href: '/?franchise=Anime', label: 'Anime' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cuenta */}
          <div>
            <h4 className="text-[#1D1D1F] font-semibold text-sm mb-4">Mi cuenta</h4>
            <ul className="space-y-3">
              {[
                { href: '/auth/login', label: 'Ingresar' },
                { href: '/auth/register', label: 'Registrarse' },
                { href: '/profile', label: 'Mi perfil' },
                { href: '/profile/orders', label: 'Mis pedidos' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#E5E5EA] mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#AEAEB2]">
            © {new Date().getFullYear()} FunkoStore. Todos los derechos reservados.
          </p>
          <p className="text-xs text-[#AEAEB2]">
            Hecho para los coleccionistas 🖤
          </p>
        </div>
      </div>
    </footer>
  )
}
