import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/types'

interface WishlistState {
  productIds: number[]
  isInWishlist: (productId: number) => boolean
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: number) => void
  toggleWishlist: (product: Product) => void
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],

      isInWishlist: (productId: number) => {
        return get().productIds.includes(productId)
      },

      addToWishlist: (product: Product) => {
        set((state) => ({
          productIds: state.productIds.includes(product.id)
            ? state.productIds
            : [...state.productIds, product.id]
        }))
      },

      removeFromWishlist: (productId: number) => {
        set((state) => ({
          productIds: state.productIds.filter((id) => id !== productId)
        }))
      },

      toggleWishlist: (product: Product) => {
        const { isInWishlist, addToWishlist, removeFromWishlist } = get()
        if (isInWishlist(product.id)) {
          removeFromWishlist(product.id)
        } else {
          addToWishlist(product)
        }
      },

      clearWishlist: () => set({ productIds: [] })
    }),
    {
      name: 'wishlist-storage'
    }
  )
)
