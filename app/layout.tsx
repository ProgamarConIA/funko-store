import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/cart/CartDrawer'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'FunkoStore', template: '%s | FunkoStore' },
  description: 'La tienda de Funko Pops más completa. Marvel, DC, Disney, Anime y más.',
  keywords: ['funko pop', 'coleccionables', 'marvel', 'dc', 'disney', 'anime'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#08080f] text-[#f1f0ff]">
        <Navbar />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  )
}
