import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingBag, Users, Zap } from 'lucide-react'

const NAV = [
  { href: '/admin',          label: 'Dashboard',  icon: <LayoutDashboard className="w-4 h-4" /> },
  { href: '/admin/products', label: 'Productos',  icon: <Package className="w-4 h-4" /> },
  { href: '/admin/orders',   label: 'Pedidos',    icon: <ShoppingBag className="w-4 h-4" /> },
  { href: '/admin/users',    label: 'Usuarios',   icon: <Users className="w-4 h-4" /> },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-[#0f0f1a] border-r border-[#1e1e35] flex flex-col">
        <div className="px-5 py-6 border-b border-[#1e1e35]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#a855f7] rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.4)]">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-[#f1f0ff] text-sm">FunkoStore</p>
              <p className="text-xs text-[#facc15]">👑 Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#a09dbd] hover:text-[#f1f0ff] hover:bg-[#1a1a2e] transition-all group"
            >
              <span className="text-[#64607a] group-hover:text-[#a855f7] transition-colors">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-[#1e1e35]">
          <Link href="/" className="text-xs text-[#64607a] hover:text-[#a09dbd] transition-colors">
            ← Ver tienda
          </Link>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 overflow-auto bg-[#08080f]">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
