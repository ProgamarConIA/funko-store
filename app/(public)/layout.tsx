import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/cart/CartDrawer'
import RealtimeProductSync from '@/components/providers/RealtimeProductSync'
import WishlistSync from '@/components/providers/WishlistSync'

/**
 * PublicLayout — aplica a TODAS las rutas del frontend público:
 *   /  /cart  /checkout  /product/[id]  /auth/*  /profile/*
 *
 * Completamente aislado del panel admin (/admin/*).
 * El panel admin tiene su propio layout en app/admin/layout.tsx.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#0F0F14]">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <RealtimeProductSync />
      <WishlistSync />
    </div>
  )
}
