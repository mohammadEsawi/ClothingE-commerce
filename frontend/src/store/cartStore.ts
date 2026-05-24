import { create } from 'zustand'
import type { CartItem } from '@/types'

interface CartState {
  items: CartItem[]
  isOpen: boolean
  setItems: (items: CartItem[]) => void
  addItem: (item: CartItem) => void
  updateQuantity: (id: number, quantity: number) => void
  removeItem: (id: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,

  setItems: (items: CartItem[]) => set({ items }),

  addItem: (item: CartItem) => {
    set((state) => {
      const existing = state.items.find(
        (i) => i.product_variant_id === item.product_variant_id
      )
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product_variant_id === item.product_variant_id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          )
        }
      }
      return { items: [...state.items, item] }
    })
  },

  updateQuantity: (id: number, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(id)
      return
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    }))
  },

  removeItem: (id: number) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id)
    }))
  },

  clearCart: () => set({ items: [] }),

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  openCart: () => set({ isOpen: true }),

  closeCart: () => set({ isOpen: false })
}))
