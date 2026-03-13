"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, ChevronDown, Grid, List } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard, ProductCardSkeleton } from "@/components/marketplace/ProductCard";
import type { Product, ProductFilters } from "@/types";

const CATEGORIES = [
  { id: "all",          name: "All Categories", icon: "🌐" },
  { id: "games",        name: "Games",           icon: "🎮" },
  { id: "software",     name: "Software",        icon: "💻" },
  { id: "subscriptions",name: "Subscriptions",   icon: "📺" },
  { id: "gift-cards",   name: "Gift Cards",      icon: "🎁" },
  { id: "accounts",     name: "Accounts",        icon: "👤" },
  { id: "vpn-security", name: "VPN & Security",  icon: "🔒" },
  { id: "education",    name: "Education",       icon: "📚" },
  { id: "social-media", name: "Social Media",    icon: "📱" },
];

const SORT_OPTIONS = [
  { value: "newest",     label: "Newest" },
  { value: "popular",    label: "Most Popular" },
  { value: "price_asc",  label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating",     label: "Highest Rated" },
];

const PRODUCT_TYPES = [
  { value: "all",          label: "All Types" },
  { value: "key",          label: "Keys" },
  { value: "account",      label: "Accounts" },
  { value: "subscription", label: "Subscriptions" },
  { value: "file",         label: "Files" },
];

// Demo products (replace with Supabase fetch)
const generateDemoProducts = (count: number): Product[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `prod-${i}`,
    seller_id: "s1",
    category_id: String((i % 8) + 1),
    title: [
      "Counter-Strike 2 Prime Status", "Adobe Photoshop 2024", "Netflix Premium 4K",
      "Steam Wallet $20", "NordVPN 2-Year Plan", "Microsoft Office 365",
      "Spotify Premium 1 Month", "Discord Nitro 1 Month", "Minecraft Java + Bedrock",
      "Duolingo Super Annual", "YouTube Premium Family", "Epic Games Gift Card $10",
    ][i % 12],
    description: "Instant delivery. Works worldwide.",
    price: [2.49, 19.99, 11.99, 18.99, 29.99, 39.99, 9.99, 4.99, 24.99, 6.99, 15.99, 9.99][i % 12],
    original_price: [3.99, 29.99, 15.99, 20, 49.99, 59.99, 13.99, 9.99, 34.99, 9.99, 19.99, 10][i % 12],
    currency: "USD",
    type: (["key","subscription","subscription","key","subscription","key","subscription","subscription","key","subscription","subscription","key"] as const)[i % 12],
    status: "active" as const,
    stock_count: Math.floor(Math.random() * 100) + 1,
    sold_count: Math.floor(Math.random() * 5000),
    rating: 3.5 + Math.random() * 1.5,
    review_count: Math.floor(Math.random() * 500),
    images: [],
    tags: [],
    is_featured: i % 7 === 0,
    is_trending: i % 5 === 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    seller: {
      id: "s1", user_id: "u1",
      display_name: ["GameZone", "SoftStore", "SubHub", "KeyMaster", "DigitalDeals"][i % 5],
      rating: 4.5 + Math.random() * 0.5,
      total_sales: 1000, total_revenue: 10000,
      is_verified: i % 3 !== 0, commission_rate: 0.1,
      created_at: new Date().toISOString(),
    },
  }));

export default function MarketplacePage() {
  const t = useTranslations("marketplace");
  const locale = useLocale();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<ProductFilters>({
    query: "",
    category: "all",
    sort: "newest",
    min_price: 0,
    max_price: 500,
    page: 1,
    limit: 24,
  });

  const loadProducts = useCallback(async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 600));
    setProducts(generateDemoProducts(24));
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const updateFilter = <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        {/* Header */}
        <div className="bg-dark-900/50 border-b border-dark-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <h1 className="font-display text-2xl font-bold text-white">{t("title")}</h1>
                <p className="text-sm text-slate-500 mt-1">
                  Browse thousands of digital products
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder={t("search_placeholder")}
                  value={filters.query}
                  onChange={(e) => updateFilter("query", e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
                {filters.query && (
                  <button
                    onClick={() => updateFilter("query", "")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateFilter("category", cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  filters.category === cat.id
                    ? "bg-brand-600 text-white"
                    : "bg-dark-800 border border-dark-700 text-slate-400 hover:border-brand-600/40 hover:text-white"
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  filtersOpen
                    ? "bg-brand-600/20 border-brand-600/40 text-brand-300"
                    : "bg-dark-800 border-dark-700 text-slate-400 hover:text-white"
                }`}
              >
                <SlidersHorizontal size={15} />
                Filters
              </button>

              {/* Sort */}
              <div className="relative">
                <select
                  value={filters.sort}
                  onChange={(e) => updateFilter("sort", e.target.value as ProductFilters["sort"])}
                  className="appearance-none pl-4 pr-8 py-2 bg-dark-800 border border-dark-700 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-brand-500 cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 hidden sm:block">
                {loading ? "Loading..." : `${products.length} products`}
              </span>
              <div className="flex border border-dark-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${viewMode === "grid" ? "bg-brand-600 text-white" : "bg-dark-800 text-slate-400 hover:text-white"}`}
                >
                  <Grid size={15} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors ${viewMode === "list" ? "bg-brand-600 text-white" : "bg-dark-800 text-slate-400 hover:text-white"}`}
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className="glass rounded-2xl border border-dark-700 p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Product Type */}
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-3 block">
                      {t("filter_type")}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {PRODUCT_TYPES.map((type) => (
                        <button
                          key={type.value}
                          onClick={() => updateFilter("type", type.value === "all" ? undefined : type.value as any)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            (filters.type || "all") === type.value
                              ? "bg-brand-600 text-white"
                              : "bg-dark-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-3 block">
                      {t("filter_price")}: ${filters.min_price} – ${filters.max_price}
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min={0}
                        max={500}
                        value={filters.max_price}
                        onChange={(e) => updateFilter("max_price", Number(e.target.value))}
                        className="w-full accent-brand-500"
                      />
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={filters.min_price}
                          onChange={(e) => updateFilter("min_price", Number(e.target.value))}
                          className="w-full px-3 py-1.5 bg-dark-800 border border-dark-700 rounded-lg text-xs text-white focus:outline-none focus:border-brand-500"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={filters.max_price}
                          onChange={(e) => updateFilter("max_price", Number(e.target.value))}
                          className="w-full px-3 py-1.5 bg-dark-800 border border-dark-700 rounded-lg text-xs text-white focus:outline-none focus:border-brand-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-3 block">
                      {t("filter_rating")}
                    </label>
                    <div className="flex gap-2">
                      {[0, 3, 4, 4.5].map((r) => (
                        <button
                          key={r}
                          onClick={() => updateFilter("rating", r || undefined)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            (filters.rating || 0) === r
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : "bg-dark-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          ★ {r === 0 ? "Any" : r + "+"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">{t("no_results")}</h3>
              <p className="text-slate-500">Try adjusting your filters</p>
            </div>
          ) : (
            <div className={`grid gap-4 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                : "grid-cols-1"
            }`}>
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && products.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button className="btn-secondary px-4 py-2 text-sm">← Prev</button>
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                    page === 1
                      ? "bg-brand-600 text-white"
                      : "bg-dark-800 border border-dark-700 text-slate-400 hover:text-white"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="btn-secondary px-4 py-2 text-sm">Next →</button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
