'use client'

/**
 * Sincronización en tiempo real de precios de productos.
 *
 * ┌─ Cómo funciona ─────────────────────────────────────────────────────────┐
 * │  1. Abre un canal WebSocket con Supabase Realtime.                      │
 * │  2. Se suscribe a eventos UPDATE en la tabla `products`.                │
 * │  3. Cuando el admin cambia un precio:                                   │
 * │     a) router.refresh() → re-renderiza los Server Components del        │
 * │        route actual (listing /, producto /product/[id]).                │
 * │     b) cartStore.updateProductPrice() → actualiza el precio en los      │
 * │        ítems del carrito/checkout que ya tenían ese producto.           │
 * │                                                                         │
 * │  Prerequisito (una sola vez en Supabase Dashboard):                     │
 * │    Database → Replication → supabase_realtime → habilitar tabla         │
 * │    `products`. O bien ejecutar en SQL Editor:                           │
 * │      alter publication supabase_realtime add table products;            │
 * │                                                                         │
 * │  Si Realtime no está habilitado el componente se monta sin errores       │
 * │  y simplemente no recibe eventos (degradación silenciosa).              │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Renderiza null — solo lógica de efecto, sin UI.
 * Montado una sola vez en el layout raíz.
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useCartStore } from '@/store/cartStore'

export default function RealtimeProductSync() {
  const router             = useRouter()
  const updateProductPrice = useCartStore((s) => s.updateProductPrice)

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('products-price-sync')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'products' },
        (payload) => {
          const updated = payload.new as { id: string; price: number }

          // ① Precio nuevo → cart/checkout reactivos de inmediato (Zustand)
          updateProductPrice(updated.id, updated.price)

          // ② Re-renderiza Server Components del route actual sin perder estado client
          router.refresh()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [router, updateProductPrice])

  return null
}
