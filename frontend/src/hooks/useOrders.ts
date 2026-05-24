import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import type { Order, Address, ApiResponse } from '@/types'

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Order[]>>('/orders')
      return data.data
    }
  })
}

export function useOrder(id: number | string) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Order>>(`/orders/${id}`)
      return data.data
    },
    enabled: !!id
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      address_id: number
      coupon_code?: string
    }) => {
      const { data } = await api.post<ApiResponse<Order>>('/orders', payload)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    }
  })
}

export function useCancelOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post<ApiResponse<Order>>(
        `/orders/${id}/cancel`
      )
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    }
  })
}

export function useAddresses() {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Address[]>>('/addresses')
      return data.data
    }
  })
}

export function useCreateAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (address: Omit<Address, 'id'>) => {
      const { data } = await api.post<ApiResponse<Address>>(
        '/addresses',
        address
      )
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    }
  })
}

export function useUpdateAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      ...address
    }: Partial<Address> & { id: number }) => {
      const { data } = await api.put<ApiResponse<Address>>(
        `/addresses/${id}`,
        address
      )
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    }
  })
}

export function useDeleteAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/addresses/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    }
  })
}
