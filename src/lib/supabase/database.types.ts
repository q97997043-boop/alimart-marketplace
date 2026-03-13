export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string;
          avatar_url: string | null;
          role: "buyer" | "seller" | "admin";
          balance: number;
          locale: string | null;
          country: string | null;
          is_verified: boolean;
          is_banned: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["users"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      seller_profiles: {
        Row: {
          id: string;
          user_id: string;
          display_name: string;
          bio: string | null;
          logo_url: string | null;
          rating: number;
          total_sales: number;
          total_revenue: number;
          is_verified: boolean;
          commission_rate: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["seller_profiles"]["Row"], "created_at" | "rating" | "total_sales" | "total_revenue">;
        Update: Partial<Database["public"]["Tables"]["seller_profiles"]["Insert"]>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string;
          description: string | null;
          parent_id: string | null;
          sort_order: number;
        };
        Insert: Omit<Database["public"]["Tables"]["categories"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
      };
      products: {
        Row: {
          id: string;
          seller_id: string;
          category_id: string;
          title: string;
          description: string;
          price: number;
          original_price: number | null;
          currency: string;
          type: "key" | "account" | "subscription" | "file" | "other";
          status: "active" | "draft" | "sold_out" | "banned";
          stock_count: number;
          sold_count: number;
          rating: number;
          review_count: number;
          images: string[];
          tags: string[];
          is_featured: boolean;
          is_trending: boolean;
          region: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["products"]["Row"], "created_at" | "updated_at" | "rating" | "review_count" | "sold_count">;
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      digital_keys: {
        Row: {
          id: string;
          product_id: string;
          key_value: string;
          is_used: boolean;
          used_by: string | null;
          used_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["digital_keys"]["Row"], "created_at" | "is_used">;
        Update: Partial<Database["public"]["Tables"]["digital_keys"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          buyer_id: string;
          seller_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          commission: number;
          seller_payout: number;
          status: "pending" | "paid" | "delivered" | "refunded" | "disputed";
          stripe_payment_intent_id: string | null;
          delivered_keys: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["orders"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          order_id: string;
          buyer_id: string;
          rating: number;
          comment: string | null;
          is_verified: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reviews"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
    };
    Functions: {
      deliver_keys: {
        Args: { p_order_id: string; p_quantity: number };
        Returns: string[];
      };
      get_seller_stats: {
        Args: { p_seller_id: string };
        Returns: Json;
      };
      get_admin_stats: {
        Args: Record<string, never>;
        Returns: Json;
      };
    };
  };
}
