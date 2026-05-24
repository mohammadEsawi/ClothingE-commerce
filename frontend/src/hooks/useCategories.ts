import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import type { Category, ApiResponse } from '@/types'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Category[]>>('/categories')
      return data.data
    },
    staleTime: 10 * 60 * 1000 // 10 minutes
  })
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Category>>(
        `/categories/${slug}`
      )
      return data.data
    },
    enabled: !!slug
  })
}

export function useFlatCategories() {
  return useQuery({
    queryKey: ['categories', 'flat'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Category[]>>(
        '/categories?flat=1'
      )
      return data.data
    }
  })
}
