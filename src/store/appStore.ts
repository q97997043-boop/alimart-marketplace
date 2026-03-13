import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

interface CartItem {
  product: Product;
  quantity: number;
}

interface RecentlyViewed {
  productId: string;
  title: string;
  price: number;
  viewedAt: number;
}

interface AppStore {
  // Cart
  cartItems: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;

  // Recently viewed (for recommendation engine)
  recentlyViewed: RecentlyViewed[];
  addRecentlyViewed: (product: Product) => void;

  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // ── Cart ────────────────────────────────────────────
      cartItems: [],

      addToCart: (product, qty = 1) =>
        set((state) => {
          const existing = state.cartItems.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              cartItems: state.cartItems.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: Math.min(i.quantity + qty, product.stock_count) }
                  : i
              ),
            };
          }
          return { cartItems: [...state.cartItems, { product, quantity: qty }] };
        }),

      removeFromCart: (productId) =>
        set((state) => ({
          cartItems: state.cartItems.filter((i) => i.product.id !== productId),
        })),

      updateQuantity: (productId, qty) =>
        set((state) => ({
          cartItems: qty <= 0
            ? state.cartItems.filter((i) => i.product.id !== productId)
            : state.cartItems.map((i) =>
                i.product.id === productId ? { ...i, quantity: qty } : i
              ),
        })),

      clearCart: () => set({ cartItems: [] }),

      cartTotal: () =>
        get().cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

      cartCount: () =>
        get().cartItems.reduce((sum, i) => sum + i.quantity, 0),

      // ── Recently Viewed ─────────────────────────────────
      recentlyViewed: [],

      addRecentlyViewed: (product) =>
        set((state) => {
          const filtered = state.recentlyViewed.filter((r) => r.productId !== product.id);
          const entry: RecentlyViewed = {
            productId: product.id,
            title: product.title,
            price: product.price,
            viewedAt: Date.now(),
          };
          // Keep last 20
          return { recentlyViewed: [entry, ...filtered].slice(0, 20) };
        }),

      // ── UI ───────────────────────────────────────────────
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: "alimart-store",
      partialize: (state) => ({
        recentlyViewed: state.recentlyViewed,
        // Don't persist cart items for digital goods (instant delivery)
      }),
    }
  )
);
