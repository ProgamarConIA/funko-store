import { create } from 'zustand'

interface WishlistState {
  /** Product IDs confirmed in the wishlist (source of truth after init) */
  ids:          string[]
  /** True only while the initial GET /api/wishlist is in flight */
  initializing: boolean
  /** Product IDs whose toggle is currently in-flight (per-product lock) */
  toggling:     string[]

  init:   () => Promise<void>
  clear:  () => void
  toggle: (productId: string) => Promise<'added' | 'removed' | 'auth_required' | 'error'>
  has:    (productId: string) => boolean
  count:  () => number
}

export const useWishlistStore = create<WishlistState>()((set, get) => ({
  ids:          [],
  initializing: false,
  toggling:     [],

  // ─────────────────────────────────────────────────────────────────────────
  //  init — load wishlist from server
  //
  //  Smart merge: after fetching, preserve the optimistic state of any
  //  products currently being toggled, so a concurrent toggle() doesn't
  //  get overwritten when init() completes.
  // ─────────────────────────────────────────────────────────────────────────
  init: async () => {
    // Avoid parallel inits (double-init from WishlistSync mount)
    if (get().initializing) {
      console.log('[wishlist:init] already initializing — skipped')
      return
    }

    set({ initializing: true })
    console.log('[wishlist:init] fetching...')

    try {
      const res = await fetch('/api/wishlist')

      if (!res.ok) {
        const body = await res.text()
        console.error('[wishlist:init] GET /api/wishlist failed —', res.status, body)
        set({ initializing: false })
        return
      }

      const { data } = (await res.json()) as { data: string[] }
      const serverIds = data ?? []

      // Merge: keep the optimistic state for any product being toggled right now.
      // This prevents init() from overwriting in-flight toggle() operations.
      set((s) => {
        const merged = new Set(serverIds)

        for (const id of s.toggling) {
          // If the button shows this product as active (optimistic add), keep it active.
          // If the button shows it as inactive (optimistic remove), keep it inactive.
          if (s.ids.includes(id)) merged.add(id)
          else merged.delete(id)
        }

        console.log('[wishlist:init] loaded', merged.size, 'items (server:', serverIds.length, '| in-flight:', s.toggling.length, ')')
        return { ids: [...merged], initializing: false }
      })

    } catch (err) {
      console.error('[wishlist:init] network error:', err)
      set({ initializing: false })
    }
  },

  clear: () => {
    console.log('[wishlist:clear]')
    set({ ids: [], initializing: false, toggling: [] })
  },

  // ─────────────────────────────────────────────────────────────────────────
  //  toggle — optimistic update + API sync
  //
  //  Per-product lock: if this product is already being toggled (e.g. rapid
  //  double-click), the second call is ignored. This prevents the second
  //  request from reverting the first one's result.
  // ─────────────────────────────────────────────────────────────────────────
  toggle: async (productId: string) => {
    if (get().toggling.includes(productId)) {
      console.log('[wishlist:toggle] skip — already toggling', productId.slice(0, 8))
      return 'error'
    }

    const inList = get().ids.includes(productId)
    const method = inList ? 'DELETE' : 'POST'
    console.log('[wishlist:toggle] start', method, productId.slice(0, 8), '| inList:', inList)

    // ── Optimistic update + lock ───────────────────────────────────────────
    set((s) => ({
      ids:      inList ? s.ids.filter((id) => id !== productId) : [...s.ids, productId],
      toggling: [...s.toggling, productId],
    }))

    // Helpers to keep the revert/unlock code DRY
    const unlock = () =>
      set((s) => ({ toggling: s.toggling.filter((id) => id !== productId) }))

    const revert = () =>
      set((s) => ({
        ids:      inList
          ? [...s.ids, productId]
          : s.ids.filter((id) => id !== productId),
        toggling: s.toggling.filter((id) => id !== productId),
      }))

    try {
      const res = await fetch('/api/wishlist', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ product_id: productId }),
      })

      console.log('[wishlist:toggle] response', res.status, 'for', method, productId.slice(0, 8))

      if (res.status === 401) {
        console.warn('[wishlist:toggle] 401 — not authenticated')
        revert()
        return 'auth_required'
      }

      if (!res.ok) {
        const body = await res.text()
        console.error('[wishlist:toggle] error', res.status, body)
        revert()
        return 'error'
      }

      // ✅ Success — keep optimistic state, just remove the lock
      unlock()
      console.log('[wishlist:toggle] success', method, productId.slice(0, 8))
      return inList ? 'removed' : 'added'

    } catch (err) {
      console.error('[wishlist:toggle] network error:', err)
      revert()
      return 'error'
    }
  },

  has:   (productId) => get().ids.includes(productId),
  count: () => get().ids.length,
}))
