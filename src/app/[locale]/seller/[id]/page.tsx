"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Star, Shield, ShoppingBag, Package, Users } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard, ProductCardSkeleton } from "@/components/marketplace/ProductCard";
import type { SellerProfile, Product } from "@/types";

// Demo data — replace with Supabase fetch
const DEMO_SELLER: SellerProfile = {
  id: "s1",
  user_id: "u1",
  display_name: "GameZone Store",
  bio: "Your #1 source for game keys, subscriptions and digital goods. 5 years on the market. 12,000+ satisfied customers.",
  rating: 4.9,
  total_sales: 12456,
  total_revenue: 89000,
  is_verified: true,
  commission_rate: 0.10,
  created_at: "2020-01-15T00:00:00Z",
};

export default function SellerStorePage() {
  const { id } = useParams<{ id: string }>();
  const locale  = useLocale();

  const [seller]   = useState<SellerProfile>(DEMO_SELLER);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [activeTab, setActiveTab] = useState<"products" | "reviews">("products");

  useEffect(() => {
    // In production: fetch(`/api/products?seller_id=${id}`)
    setTimeout(() => {
      setProducts(
        Array.from({ length: 8 }, (_, i) => ({
          id: `p${i}`,
          seller_id: id,
          category_id: String((i % 4) + 1),
          title: ["CS2 Prime Key", "Netflix Premium", "Spotify 1mo", "Steam $20", "NordVPN", "Discord Nitro", "Office 365", "Xbox Pass"][i],
          description: "Instant delivery.",
          price: [4.99, 11.99, 9.99, 18.99, 29.99, 4.99, 39.99, 14.99][i],
          original_price: [7.99, 15.99, 13.99, 20, 49.99, 9.99, 59.99, 19.99][i],
          currency: "USD",
          type: (["key","subscription","subscription","key","subscription","subscription","key","subscription"] as const)[i],
          status: "active" as const,
          stock_count: [45, 12, 32, 100, 5, 20, 7, 15][i],
          sold_count: [1204, 567, 234, 789, 89, 456, 123, 345][i],
          rating: [4.9, 4.8, 4.7, 4.6, 4.5, 4.8, 4.7, 4.9][i],
          review_count: [234, 89, 56, 145, 34, 123, 45, 78][i],
          images: [],
          tags: [],
          is_featured: i === 0,
          is_trending: i < 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          seller: DEMO_SELLER,
        }))
      );
      setLoading(false);
    }, 600);
  }, [id]);

  const memberSince = new Date(seller.created_at).getFullYear();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        {/* Seller Header Banner */}
        <div className="relative bg-gradient-to-br from-dark-900 to-dark-950 border-b border-dark-800 overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/5 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br brand-600 flex items-center justify-center text-3xl font-bold text-white glow-brand">
                  {seller.display_name[0]}
                </div>
                {seller.is_verified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-dark-900 border-2 border-dark-900 flex items-center justify-center">
                    <Shield size={12} className="text-brand-400" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h1 className="font-display text-2xl font-bold text-white">{seller.display_name}</h1>
                  {seller.is_verified && (
                    <span className="badge bg-brand-600/20 text-brand-300 border border-brand-600/30 text-xs">
                      <Shield size={10} /> Verified Seller
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-sm mb-3 max-w-xl">{seller.bio}</p>
                <div className="flex flex-wrap items-center gap-5 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-white">{seller.rating.toFixed(1)}</span>
                    <span className="text-slate-500">rating</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShoppingBag size={14} className="text-brand-400" />
                    <span className="font-semibold text-white">{seller.total_sales.toLocaleString()}</span>
                    <span className="text-slate-500">sales</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={14} className="text-cyan-400" />
                    <span className="text-slate-500">Member since {memberSince}</span>
                  </div>
                </div>
              </div>

              {/* Stats cards */}
              <div className="flex gap-3 flex-shrink-0">
                {[
                  { label: "Positive", value: "98.5%", color: "text-emerald-400" },
                  { label: "Products", value: products.length.toString(), color: "text-brand-400" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="glass rounded-xl border border-dark-700 px-5 py-3 text-center">
                    <p className={`text-xl font-bold font-display ${color}`}>{value}</p>
                    <p className="text-xs text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-dark-800 bg-dark-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1">
              {(["products", "reviews"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3.5 text-sm font-medium capitalize border-b-2 transition-all ${
                    activeTab === tab
                      ? "border-brand-500 text-white"
                      : "border-transparent text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {tab === "products" ? `Products (${products.length})` : "Reviews"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === "products" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
                : products.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
            </motion.div>
          )}

          {activeTab === "reviews" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-2xl space-y-4"
            >
              {Array.from({ length: 5 }, (_, i) => ({
                user: ["alex_99", "maria_k", "john_d", "priya_s", "timur_u"][i],
                rating: [5, 5, 4, 5, 4][i],
                comment: [
                  "Best seller on the platform! Keys always work instantly.",
                  "Very reliable. Have bought 10+ times. Never had an issue.",
                  "Fast delivery, good prices. Highly recommended.",
                  "Excellent communication, product works perfectly.",
                  "Trusted seller. Will definitely buy again.",
                ][i],
                date: `${i + 1} day${i > 0 ? "s" : ""} ago`,
              })).map((review, i) => (
                <div key={i} className="glass rounded-2xl border border-dark-700 p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br brand-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                      {review.user[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm font-semibold text-white">{review.user}</span>
                        <span className="badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">Verified</span>
                        <div className="ml-auto flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, s) => (
                            <Star key={s} size={11} className={s < review.rating ? "text-amber-400 fill-amber-400" : "text-dark-600"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-400">{review.comment}</p>
                      <p className="text-xs text-slate-600 mt-1.5">{review.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
