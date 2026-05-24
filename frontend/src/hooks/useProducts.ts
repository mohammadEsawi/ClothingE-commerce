import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import type { Product, ApiResponse, ProductFilters } from '@/types'

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters.category) params.append('category', filters.category)
      if (filters.min_price !== undefined)
        params.append('min_price', String(filters.min_price))
      if (filters.max_price !== undefined)
        params.append('max_price', String(filters.max_price))
      if (filters.colors?.length)
        params.append('colors', filters.colors.join(','))
      if (filters.sizes?.length) params.append('sizes', filters.sizes.join(','))
      if (filters.on_sale) params.append('on_sale', '1')
      if (filters.in_stock) params.append('in_stock', '1')
      if (filters.sort) params.append('sort', filters.sort)
      if (filters.search) params.append('search', filters.search)
      if (filters.page) params.append('page', String(filters.page))
      if (filters.per_page) params.append('per_page', String(filters.per_page))

      const { data } = await api.get<ApiResponse<Product[]>>(
        `/products?${params}`
      )
      return data
    }
  })
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Product>>(
        `/products/${slug}`
      )
      return data.data
    },
    enabled: !!slug
  })
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Product[]>>(
        '/products?featured=1&per_page=8'
      )
      return data.data
    }
  })
}

export function useRelatedProducts(productId: number, categoryId: number) {
  return useQuery({
    queryKey: ['products', 'related', productId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Product[]>>(
        `/products?category_id=${categoryId}&exclude=${productId}&per_page=4`
      )
      return data.data
    },
    enabled: !!productId && !!categoryId
  })
}
