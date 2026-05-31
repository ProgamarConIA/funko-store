import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingBag, Users, ArrowLeft, Shield } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'

// El admin panel requiere autenticación → nunca pre-renderizar estáticamente
export const dynamic = 'force-dynamic'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? ''

const NAV = [
  { href: '/admin',          label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { href: '/admin/products', label: 'Productos', icon: <Package className="w-4 h-4" /> },
  { href: '/admin/orders',   label: 'Pedidos',   icon: <ShoppingBag className="w-4 h-4" /> },
  { href: '/admin/users',    label: 'Usuarios',  icon: <Users className="w-4 h-4" /> },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // ── CAPA 2: Verificación server-side (doble check aunque el middleware ya filtró)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !ADMIN_EMAIL || user.email !== ADMIN_EMAIL) {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen bg-[#F5F4FF]">

      {/* Navbar pública — z-50, fixed top-0, idéntica al frontend */}
      <Navbar />

      {/* Sidebar — arranca en top-16 para no solaparse con la Navbar */}
      <aside className="w-56 flex-shrink-0 bg-[#0F0F14] flex flex-col fixed top-16 left-0 h-[calc(100vh-4rem)] z-40">

        {/* Logo admin */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-7 h-7 bg-[#5856D6] rounded-lg flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white text-sm">Admin Panel</span>
          </div>
          <p className="text-[10px] text-white/40 pl-9">FunkoStore</p>
        </div>

        {/* Email admin */}
        <div className="px-5 py-3 border-b border-white/10">
          <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Sesión</p>
          <p className="text-xs text-white/60 truncate">{user.email}</p>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/10 transition-all group"
            >
              <span className="text-white/30 group-hover:text-[#5856D6] transition-colors">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        {/* Volver a tienda */}
        <div className="px-5 py-4 border-t border-white/10">
          <Link href="/" className="flex items-center gap-2 text-xs text-white/30 hover:text-white/70 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Ver tienda
          </Link>
        </div>
      </aside>

      {/* Contenido principal — ml-56 por el sidebar, pt-16 por la Navbar */}
      <main className="flex-1 ml-56 pt-16 overflow-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
