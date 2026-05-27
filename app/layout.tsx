import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'FunkoStore', template: '%s | FunkoStore' },
  description: 'La tienda de Funko Pops más completa. Marvel, DC, Disney, Anime y más.',
  keywords: ['funko pop', 'coleccionables', 'marvel', 'dc', 'disney', 'anime'],
}

/**
 * Shell mínimo: solo html/body + fuentes + globals.css
 *
 * La Navbar, Footer, CartDrawer y demás elementos del frontend público
 * viven en app/(public)/layout.tsx  →  aplican únicamente a rutas públicas.
 *
 * El panel admin tiene su propio layout en app/admin/layout.tsx,
 * completamente aislado del frontend público.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#FAFAFA] text-[#0F0F14]">
        {children}
      </body>
    </html>
  )
}
