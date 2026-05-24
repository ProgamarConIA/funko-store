import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-[#E4E4EC] bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="font-bold text-xl tracking-tight text-[#0F0F14]">
                Funko<span className="text-[#5856D6] font-light">Store</span>
              </span>
            </Link>
            <p className="text-[#6B6B7B] text-sm max-w-xs leading-relaxed">
              La tienda de Funko Pops más completa de Argentina. Coleccionables originales de Marvel, DC, Disney y más.
            </p>
            <div className="flex gap-3 mt-5">
              {['🦸 Marvel', '🦇 DC', '🏰 Disney', '⚡ Anime'].map((t) => {
                const [, label] = t.split(' ')
                return (
                  <Link
                    key={label}
                    href={`/?franchise=${label}`}
                    className="text-xs px-2.5 py-1 bg-[#F5F4FF] text-[#5856D6] rounded-full hover:bg-[#EEEDFF] transition-colors font-medium"
                  >
                    {t}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Tienda */}
          <div>
            <h4 className="text-[#0F0F14] font-semibold text-sm mb-4">Tienda</h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Todos los productos' },
                { href: '/?franchise=Marvel', label: 'Marvel' },
                { href: '/?franchise=DC', label: 'DC Comics' },
                { href: '/?franchise=Disney', label: 'Disney' },
                { href: '/?franchise=Star Wars', label: 'Star Wars' },
                { href: '/?franchise=Anime', label: 'Anime' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#6B6B7B] hover:text-[#5856D6] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cuenta */}
          <div>
            <h4 className="text-[#0F0F14] font-semibold text-sm mb-4">Mi cuenta</h4>
            <ul className="space-y-3">
              {[
                { href: '/auth/login', label: 'Ingresar' },
                { href: '/auth/register', label: 'Registrarse' },
                { href: '/profile', label: 'Mi perfil' },
                { href: '/profile/orders', label: 'Mis pedidos' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#6B6B7B] hover:text-[#5856D6] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#E4E4EC] mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#B0B0BE]">
            © {new Date().getFullYear()} FunkoStore · Todos los derechos reservados.
          </p>
          <p className="text-xs text-[#B0B0BE]">Hecho con 🖤 para los coleccionistas</p>
        </div>
      </div>
    </footer>
  )
}
