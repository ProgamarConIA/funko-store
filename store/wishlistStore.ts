import { create } from 'zustand'

interface WishlistState {
  ids:     string[]
  loading: boolean

  init:   () => Promise<void>
  clear:  () => void
  toggle: (productId: string) => Promise<'added' | 'removed' | 'auth_required' | 'error'>

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
        const body = await res.text()
        console.error('[wishlist] init failed', res.status, body)
        set({ loading: false })
      }
    } catch (err) {
      console.error('[wishlist] init error', err)
      set({ loading: false })
    }
  },

  clear: () => set({ ids: [], loading: false }),

  toggle: async (productId: string) => {
    const inList = get().ids.includes(productId)

    // Optimistic update
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
        // Revert — not authenticated
        set((s) =>
          inList
            ? { ids: [...s.ids, productId] }
            : { ids: s.ids.filter((id) => id !== productId) }
        )
        return 'auth_required'
      }

      if (!res.ok) {
        const body = await res.text()
        console.error('[wishlist] toggle failed', res.status, body)
        // Revert
        set((s) =>
          inList
            ? { ids: [...s.ids, productId] }
            : { ids: s.ids.filter((id) => id !== productId) }
        )
        return 'error'
      }
    } catch (err) {
      console.error('[wishlist] toggle error', err)
      // Revert
      set((s) =>
        inList
          ? { ids: [...s.ids, productId] }
          : { ids: s.ids.filter((id) => id !== productId) }
      )
      return 'error'
    }

    return inList ? 'removed' : 'added'
  },

  has:   (productId) => get().ids.includes(productId),
  count: () => get().ids.length,
}))
