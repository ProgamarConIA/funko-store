'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingBag, Users } from 'lucide-react'

const NAV = [
  { href: '/admin',          label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Productos', icon: Package },
  { href: '/admin/orders',   label: 'Pedidos',   icon: ShoppingBag },
  { href: '/admin/users',    label: 'Usuarios',  icon: Users },
]

export default function AdminMobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0F0F14] border-t border-white/10 flex pb-safe">
      {NAV.map(({ href, label, icon: Icon }) => {
        // Active: exact match for dashboard, prefix match for others
        const isActive = href === '/admin'
          ? pathname === '/admin'
          : pathname.startsWith(href)

        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors ${
              isActive ? 'text-[#5856D6]' : 'text-white/40 hover:text-white/70'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[9px] font-semibold tracking-wide">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
