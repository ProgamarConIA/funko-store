'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useWishlistStore } from '@/store/wishlistStore'

/**
 * Null component — watches Supabase auth state and keeps the wishlist
 * Zustand store in sync (load on sign-in, clear on sign-out).
 * Place it once in the public layout.
 */
export default function WishlistSync() {
  const init  = useWishlistStore((s) => s.init)
  const clear = useWishlistStore((s) => s.clear)

  useEffect(() => {
    const supabase = createClient()

    // Load immediately if already signed in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) init()
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN')  init()
      if (event === 'SIGNED_OUT') clear()
    })

    return () => subscription.unsubscribe()
  }, [init, clear])

  return null
}
