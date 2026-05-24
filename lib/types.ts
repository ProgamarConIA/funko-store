// ─── Producto ────────────────────────────────────────────────
export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  image_url: string | null
  franchise: string        // ej: "Marvel", "DC", "Disney"
  character: string        // ej: "Spider-Man", "Batman"
  category: string         // ej: "Standard", "Deluxe", "Chase"
  stock: number
  is_featured: boolean
  created_at: string
  updated_at: string
}

// ─── Perfil de usuario ───────────────────────────────────────
export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: 'user' | 'admin'
  created_at: string
}

// ─── Carrito ─────────────────────────────────────────────────
export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  product?: Product
}

// Carrito en memoria (Zustand)
export interface LocalCartItem {
  product: Product
  quantity: number
}

// ─── Órdenes ─────────────────────────────────────────────────
export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'

export interface Order {
  id: string
  user_id: string
  status: OrderStatus
  total: number
  shipping_address: ShippingAddress
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  product?: Product
}

export interface ShippingAddress {
  full_name: string
  address: string
  city: string
  state: string
  zip_code: string
  country: string
  phone: string
}

// ─── Filtros ─────────────────────────────────────────────────
export interface ProductFilters {
  search?: string
  franchise?: string
  character?: string
  category?: string
  min_price?: number
  max_price?: number
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'name_asc'
}

// ─── Respuestas API ──────────────────────────────────────────
export interface ApiResponse<T> {
  data?: T
  error?: string
}
