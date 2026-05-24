import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import type { CartItem, ApiResponse } from '@/types'

export function useCart() {
  const { isAuthenticated } = useAuthStore()
  const { setItems } = useCartStore()

  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<CartItem[]>>('/cart')
      setItems(data.data)
      return data.data
    },
    enabled: isAuthenticated
  })
}

export function useAddToCart() {
  const queryClient = useQueryClient()
  const { addItem } = useCartStore()

  return useMutation({
    mutationFn: async ({
      variantId,
      quantity
    }: {
      variantId: number
      quantity: number
    }) => {
      const { data } = await api.post<ApiResponse<CartItem>>('/cart', {
        product_variant_id: variantId,
        quantity
      })
      return data.data
    },
    onSuccess: (item) => {
      addItem(item)
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    }
  })
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient()
  const { updateQuantity } = useCartStore()

  return useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      const { data } = await api.put<ApiResponse<CartItem>>(`/cart/${id}`, {
        quantity
      })
      return data.data
    },
    onSuccess: (item) => {
      updateQuantity(item.id, item.quantity)
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    }
  })
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient()
  const { removeItem } = useCartStore()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/cart/${id}`)
      return id
    },
    onSuccess: (id) => {
      removeItem(id)
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    }
  })
}

export function useClearCart() {
  const queryClient = useQueryClient()
  const { clearCart } = useCartStore()

  return useMutation({
    mutationFn: async () => {
      await api.delete('/cart')
    },
    onSuccess: () => {
      clearCart()
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    }
  })
}

export function useApplyCoupon() {
  return useMutation({
    mutationFn: async (code: string) => {
      const { data } = await api.post<
        ApiResponse<{ discount: number; message: string }>
      >('/cart/coupon', { code })
      return data.data
    }
  })
}
