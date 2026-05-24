export interface User {
  id: number
  name: string
  email: string
  phone?: string
  avatar?: string
  role: 'customer' | 'admin'
  preferred_language: 'en' | 'ar'
}

export interface Category {
  id: number
  parent_id?: number
  name_en: string
  name_ar: string
  slug: string
  image?: string
  children?: Category[]
  products_count?: number
}

export interface Color {
  id: number
  name_en: string
  name_ar: string
  hex_code: string
}

export interface Size {
  id: number
  name: string
  type: 'clothing' | 'shoes' | 'accessories'
}

export interface ProductVariant {
  id: number
  product_id: number
  color?: Color
  size?: Size
  sku: string
  price_override?: number
  stock_quantity: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
}

export interface ProductImage {
  id: number
  image_url: string
  alt_text?: string
  is_primary: boolean
  sort_order: number
}

export interface Product {
  id: number
  category_id: number
  category?: Category
  name_en: string
  name_ar: string
  slug: string
  description_en: string
  description_ar: string
  base_price: number
  sale_price?: number
  is_featured: boolean
  is_active: boolean
  images: ProductImage[]
  variants: ProductVariant[]
  primary_image?: ProductImage
  discount_percentage?: number
  is_on_sale: boolean
  avg_rating?: number
  reviews_count?: number
}

export interface CartItem {
  id: number
  product_variant_id: number
  quantity: number
  variant: ProductVariant & { product: Product }
}

export interface Address {
  id: number
  full_name: string
  phone: string
  address_line1: string
  address_line2?: string
  city: string
  state_province: string
  country: string
  postal_code?: string
  is_default: boolean
}

export interface OrderItem {
  id: number
  product_name: string
  color_name?: string
  size_name?: string
  sku: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface Order {
  id: number
  order_number: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  subtotal: number
  discount_amount: number
  shipping_cost: number
  total: number
  shipping_address: Address
  items: OrderItem[]
  tracking_number?: string
  created_at: string
}

export interface Review {
  id: number
  user: User
  rating: number
  title?: string
  body?: string
  is_approved: boolean
  created_at: string
}

export interface Coupon {
  id: number
  code: string
  type: 'fixed' | 'percentage'
  value: number
  min_order_amount?: number
  max_discount_amount?: number
  is_active: boolean
  usage_count?: number
  usage_limit?: number
  expires_at?: string
}

export interface DashboardStats {
  revenue_month: number
  revenue_change: number
  orders_month: number
  orders_change: number
  customers_total: number
  customers_change: number
  pending_orders: number
}

export interface SalesData {
  date: string
  revenue: number
  orders: number
}

export interface TopProduct {
  id: number
  name_en: string
  name_ar: string
  sales_count: number
  revenue: number
  image?: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta?: {
    current_page: number
    last_page: number
    total: number
    per_page: number
  }
}

export interface ProductFilters {
  category?: string
  min_price?: number
  max_price?: number
  colors?: number[]
  sizes?: number[]
  on_sale?: boolean
  in_stock?: boolean
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular' | 'top_rated'
  search?: string
  page?: number
  per_page?: number
}

export interface WishlistItem {
  id: number
  product: Product
  created_at: string
}
