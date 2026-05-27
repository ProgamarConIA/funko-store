import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LocalCartItem, Product } from '@/lib/types'

interface CartState {
  items: LocalCartItem[]
  isOpen: boolean

  // Acciones
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  /** Actualiza el precio EUR de un producto en el carrito cuando el admin lo cambia. */
  updateProductPrice: (productId: string, newPriceEUR: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void

  // Computed
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
                  : i
              ),
            }
          }
          return { items: [...state.items, { product, quantity }] }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }))
      },

      updateProductPrice: (productId, newPriceEUR) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId
              ? { ...i, product: { ...i.product, price: newPriceEUR } }
              : i
          ),
        }))
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      openCart:   () => set({ isOpen: true }),
      closeCart:  () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((acc, i) => acc + i.product.price * i.quantity, 0),
    }),
    {
      name: 'funko-cart',
    }
  )
)
