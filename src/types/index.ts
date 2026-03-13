// ── User & Auth ────────────────────────────────────────────────
export type UserRole = "buyer" | "seller" | "admin";

export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  role: UserRole;
  balance: number;
  created_at: string;
  locale?: string;
  country?: string;
  is_verified: boolean;
  is_banned: boolean;
}

export interface SellerProfile {
  id: string;
  user_id: string;
  display_name: string;
  bio?: string;
  logo_url?: string;
  rating: number;
  total_sales: number;
  total_revenue: number;
  is_verified: boolean;
  commission_rate: number; // 0–1
  created_at: string;
}

// ── Products ───────────────────────────────────────────────────
export type ProductType = "key" | "account" | "subscription" | "file" | "other";
export type ProductStatus = "active" | "draft" | "sold_out" | "banned";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  parent_id?: string;
  sort_order: number;
}

export interface Product {
  id: string;
  seller_id: string;
  category_id: string;
  title: string;
  description: string;
  price: number;
  original_price?: number;
  currency: string;
  type: ProductType;
  status: ProductStatus;
  stock_count: number;
  sold_count: number;
  rating: number;
  review_count: number;
  images: string[];
  tags: string[];
  is_featured: boolean;
  is_trending: boolean;
  region?: string; // geo-targeting
  created_at: string;
  updated_at: string;
  // relations
  seller?: SellerProfile;
  category?: Category;
}

export interface DigitalKey {
  id: string;
  product_id: string;
  key_value: string;
  is_used: boolean;
  used_by?: string;
  used_at?: string;
  created_at: string;
}

// ── Orders ─────────────────────────────────────────────────────
export type OrderStatus = "pending" | "paid" | "delivered" | "refunded" | "disputed";

export interface Order {
  id: string;
  buyer_id: string;
  seller_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  commission: number;
  seller_payout: number;
  status: OrderStatus;
  stripe_payment_intent_id?: string;
  delivered_keys?: string[];
  created_at: string;
  updated_at: string;
  // relations
  product?: Product;
  buyer?: User;
}

// ── Reviews ────────────────────────────────────────────────────
export interface Review {
  id: string;
  product_id: string;
  order_id: string;
  buyer_id: string;
  rating: number; // 1–5
  comment?: string;
  is_verified: boolean;
  created_at: string;
  buyer?: User;
}

// ── Payments ───────────────────────────────────────────────────
export interface PaymentSession {
  session_id: string;
  url: string;
  amount: number;
  currency: string;
  product_id: string;
  quantity: number;
}

// ── Stats ──────────────────────────────────────────────────────
export interface SellerStats {
  total_revenue: number;
  total_orders: number;
  total_products: number;
  pending_balance: number;
  available_balance: number;
  monthly_revenue: MonthlyData[];
  top_products: Product[];
}

export interface AdminStats {
  total_users: number;
  total_sellers: number;
  total_products: number;
  total_orders: number;
  total_revenue: number;
  platform_commission: number;
  monthly_revenue: MonthlyData[];
  new_users_today: number;
  orders_today: number;
}

export interface MonthlyData {
  month: string;
  revenue: number;
  orders: number;
}

// ── Filters & Search ───────────────────────────────────────────
export interface ProductFilters {
  query?: string;
  category?: string;
  type?: ProductType;
  min_price?: number;
  max_price?: number;
  rating?: number;
  sort?: "newest" | "popular" | "price_asc" | "price_desc" | "rating";
  region?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// ── i18n ───────────────────────────────────────────────────────
export type Locale = "en" | "ru" | "uz" | "tr";

export interface LocaleConfig {
  locale: Locale;
  label: string;
  flag: string;
  rtl?: boolean;
}
