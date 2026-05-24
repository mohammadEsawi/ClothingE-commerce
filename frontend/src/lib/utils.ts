import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, locale: string = 'en'): string {
  if (locale === 'ar') {
    return `${amount.toFixed(2)} ₪`
  }
  return `₪${amount.toFixed(2)}`
}

export function formatDate(date: string, locale: string = 'en'): string {
  return new Date(date).toLocaleDateString(locale === 'ar' ? 'ar-IL' : 'en-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function getStockStatusColor(status: string): string {
  switch (status) {
    case 'in_stock':
      return 'text-green-600'
    case 'low_stock':
      return 'text-yellow-600'
    case 'out_of_stock':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

export function getOrderStatusColor(status: string): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'confirmed':
      return 'bg-blue-100 text-blue-800'
    case 'processing':
      return 'bg-purple-100 text-purple-800'
    case 'shipped':
      return 'bg-indigo-100 text-indigo-800'
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    case 'refunded':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>
  return function (...args: Parameters<T>) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function getImageUrl(path: string | undefined): string {
  if (!path) return '/placeholder-product.svg'
  if (path.startsWith('http')) return path
  return `/storage/${path}`
}

export function calculateDiscount(basePrice: number, salePrice: number): number {
  return Math.round(((basePrice - salePrice) / basePrice) * 100)
}
