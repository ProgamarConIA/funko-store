'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useWishlistStore } from '@/store/wishlistStore'

/**
 * Null component — keeps the wishlist Zustand store in sync with auth state.
 *
 * Uses ONLY onAuthStateChange (not getSession + onAuthStateChange) to avoid
 * the double-init race condition where both fire simultaneously on mount.
 * Supabase fires INITIAL_SESSION immediately on subscription with the current
 * session — no need for a separate getSession() call.
 */
export default function WishlistSync() {
  const init  = useWishlistStore((s) => s.init)
  const clear = useWishlistStore((s) => s.clear)

  useEffect(() => {
    const supabase = createClient()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // INITIAL_SESSION fires immediately on subscribe with the current session.
      // SIGNED_IN fires when the user actually logs in.
      // Both mean "we have a user" — load the wishlist.
      if ((event === 'INITIAL_SESSION' || event === 'SIGNED_IN') && session?.user) {
        console.log('[wishlist:sync] auth event:', event, '— loading wishlist')
        init()
      } else if (event === 'SIGNED_OUT') {
        console.log('[wishlist:sync] signed out — clearing wishlist')
        clear()
      }
    })

    return () => subscription.unsubscribe()
  }, [init, clear])

  return null
}
