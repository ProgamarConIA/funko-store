import { create } from 'zustand'

interface WishlistState {
  /** Product IDs currently in the wishlist */
  ids:     string[]
  /** True while the initial load from Supabase is in progress */
  loading: boolean

  /** Load wishlist for the signed-in user (call on auth SIGNED_IN) */
  init:   () => Promise<void>
  /** Clear local state (call on auth SIGNED_OUT) */
  clear:  () => void
  /**
   * Optimistically toggle a product.
   * Returns 'auth_required' if the server returns 401.
   */
  toggle: (productId: string) => Promise<'added' | 'removed' | 'auth_required'>

  has:   (productId: string) => boolean
  count: () => number
}

export const useWishlistStore = create<WishlistState>()((set, get) => ({
  ids:     [],
  loading: false,

  init: async () => {
    set({ loading: true })
    try {
      const res = await fetch('/api/wishlist')
      if (res.ok) {
        const { data } = (await res.json()) as { data: string[] }
        set({ ids: data ?? [], loading: false })
      } else {
        set({ loading: false })
      }
    } catch {
      set({ loading: false })
    }
  },

  clear: () => set({ ids: [], loading: false }),

  toggle: async (productId: string) => {
    const inList = get().ids.includes(productId)

    // ── Optimistic update ──────────────────────────────────────────────────
    set((s) =>
      inList
        ? { ids: s.ids.filter((id) => id !== productId) }
        : { ids: [...s.ids, productId] }
    )

    try {
      const res = await fetch('/api/wishlist', {
        method:  inList ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ product_id: productId }),
      })

      if (res.status === 401) {
        // Revert — user not authenticated
        set((s) =>
          inList
            ? { ids: [...s.ids, productId] }
            : { ids: s.ids.filter((id) => id !== productId) }
        )
        return 'auth_required'
      }

      if (!res.ok) {
        // Revert on any other server error
        set((s) =>
          inList
            ? { ids: [...s.ids, productId] }
            : { ids: s.ids.filter((id) => id !== productId) }
        )
      }
    } catch {
      // Revert on network error
      set((s) =>
        inList
          ? { ids: [...s.ids, productId] }
          : { ids: s.ids.filter((id) => id !== productId) }
      )
    }

    return inList ? 'removed' : 'added'
  },

  has:   (productId) => get().ids.includes(productId),
  count: () => get().ids.length,
}))
