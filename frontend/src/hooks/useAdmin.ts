import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import type {
  Product,
  Category,
  Order,
  User,
  Coupon,
  Review,
  DashboardStats,
  SalesData,
  TopProduct,
  ApiResponse
} from '@/types'

// Dashboard
export function useDashboardStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<DashboardStats>>(
        '/admin/stats'
      )
      return data.data
    }
  })
}

export function useSalesData(period: 'daily' | 'weekly' | 'monthly' = 'daily') {
  return useQuery({
    queryKey: ['admin', 'sales', period],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<SalesData[]>>(
        `/admin/sales?period=${period}`
      )
      return data.data
    }
  })
}

export function useTopProducts() {
  return useQuery({
    queryKey: ['admin', 'top-products'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<TopProduct[]>>(
        '/admin/top-products'
      )
      return data.data
    }
  })
}

// Admin Products
export function useAdminProducts(page = 1, search = '') {
  return useQuery({
    queryKey: ['admin', 'products', page, search],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Product[]>>(
        `/admin/products?page=${page}&search=${search}`
      )
      return data
    }
  })
}

export function useAdminProduct(id: number) {
  return useQuery({
    queryKey: ['admin', 'products', id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Product>>(
        `/admin/products/${id}`
      )
      return data.data
    },
    enabled: !!id
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (product: Partial<Product>) => {
      const { data } = await api.post<ApiResponse<Product>>(
        '/admin/products',
        product
      )
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
    }
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      ...product
    }: Partial<Product> & { id: number }) => {
      const { data } = await api.put<ApiResponse<Product>>(
        `/admin/products/${id}`,
        product
      )
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
    }
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/products/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
    }
  })
}

export function useUploadProductImage() {
  return useMutation({
    mutationFn: async ({
      productId,
      formData
    }: {
      productId: number
      formData: FormData
    }) => {
      const { data } = await api.post(
        `/admin/products/${productId}/images`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      )
      return data.data
    }
  })
}

// Admin Categories
export function useAdminCategories() {
  return useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Category[]>>(
        '/admin/categories'
      )
      return data.data
    }
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (category: Partial<Category>) => {
      const { data } = await api.post<ApiResponse<Category>>(
        '/admin/categories',
        category
      )
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    }
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      ...category
    }: Partial<Category> & { id: number }) => {
      const { data } = await api.put<ApiResponse<Category>>(
        `/admin/categories/${id}`,
        category
      )
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    }
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/categories/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] })
    }
  })
}

// Admin Orders
export function useAdminOrders(
  page = 1,
  status = '',
  search = ''
) {
  return useQuery({
    queryKey: ['admin', 'orders', page, status, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page)
      })
      if (status) params.append('status', status)
      if (search) params.append('search', search)
      const { data } = await api.get<ApiResponse<Order[]>>(
        `/admin/orders?${params}`
      )
      return data
    }
  })
}

export function useAdminOrder(id: number | string) {
  return useQuery({
    queryKey: ['admin', 'orders', id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Order>>(
        `/admin/orders/${id}`
      )
      return data.data
    },
    enabled: !!id
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      status,
      tracking_number
    }: {
      id: number
      status: string
      tracking_number?: string
    }) => {
      const { data } = await api.put<ApiResponse<Order>>(
        `/admin/orders/${id}/status`,
        { status, tracking_number }
      )
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] })
    }
  })
}

// Admin Customers
export function useAdminCustomers(page = 1, search = '') {
  return useQuery({
    queryKey: ['admin', 'customers', page, search],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<User[]>>(
        `/admin/customers?page=${page}&search=${search}`
      )
      return data
    }
  })
}

// Admin Coupons
export function useAdminCoupons() {
  return useQuery({
    queryKey: ['admin', 'coupons'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Coupon[]>>('/admin/coupons')
      return data.data
    }
  })
}

export function useCreateCoupon() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (coupon: Omit<Coupon, 'id'>) => {
      const { data } = await api.post<ApiResponse<Coupon>>(
        '/admin/coupons',
        coupon
      )
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] })
    }
  })
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      ...coupon
    }: Partial<Coupon> & { id: number }) => {
      const { data } = await api.put<ApiResponse<Coupon>>(
        `/admin/coupons/${id}`,
        coupon
      )
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] })
    }
  })
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/coupons/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] })
    }
  })
}

// Admin Reviews
export function useAdminReviews(page = 1) {
  return useQuery({
    queryKey: ['admin', 'reviews', page],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Review[]>>(
        `/admin/reviews?page=${page}`
      )
      return data
    }
  })
}

export function useUpdateReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      is_approved
    }: {
      id: number
      is_approved: boolean
    }) => {
      const { data } = await api.put<ApiResponse<Review>>(
        `/admin/reviews/${id}`,
        { is_approved }
      )
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] })
    }
  })
}
