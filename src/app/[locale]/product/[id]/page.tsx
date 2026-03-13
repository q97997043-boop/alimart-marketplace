"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Star, Shield, Zap, ArrowLeft, ShoppingBag, TrendingUp,
  CheckCircle, Clock, Users, MessageSquare, ChevronDown, ChevronUp, Copy
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import toast from "react-hot-toast";
import type { Product, Review } from "@/types";

// Demo product (replace with Supabase fetch in production)
const DEMO_PRODUCT: Product = {
  id: "prod-1",
  seller_id: "s1",
  category_id: "1",
  title: "Counter-Strike 2 Prime Status Upgrade",
  description: `## What you get
- Prime Status upgrade for your CS2 account
- Access to Prime-only matchmaking
- Exclusive drops and item rewards
- Reduced hacker probability

## How it works
1. Purchase the product
2. Receive the key instantly after payment
3. Redeem on Steam
4. Enjoy Prime matchmaking!

## Requirements
- Existing Steam account
- Counter-Strike 2 installed (free to play)`,
  price: 4.99,
  original_price: 7.99,
  currency: "USD",
  type: "key",
  status: "active",
  stock_count: 47,
  sold_count: 1204,
  rating: 4.9,
  review_count: 234,
  images: [],
  tags: ["steam", "cs2", "prime", "fps"],
  is_featured: true,
  is_trending: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  seller: {
    id: "s1", user_id: "u1",
    display_name: "GameZone Store",
    rating: 4.9, total_sales: 12456, total_revenue: 89000,
    is_verified: true, commission_rate: 0.1,
    created_at: new Date().toISOString(),
  },
};

const DEMO_REVIEWS: Review[] = Array.from({ length: 5 }, (_, i) => ({
  id: `r${i}`, product_id: "prod-1", order_id: `o${i}`,
  buyer_id: `u${i}`,
  rating: [5, 5, 4, 5, 4][i],
  comment: [
    "Instant delivery, worked perfectly! Highly recommended.",
    "Great seller, fast delivery. The key worked first try.",
    "Good product, key was valid. Minor delay but resolved quickly.",
    "Excellent! Exactly as described. Will buy again.",
    "Fast and reliable. Good price too.",
  ][i],
  is_verified: true,
  created_at: new Date(Date.now() - i * 86400000).toISOString(),
  buyer: { id: `u${i}`, email: "", username: ["Alex_99","Maria_K","John_D","Priya_S","Timur_U"][i], role: "buyer", balance: 0, is_verified: true, is_banned: false, created_at: "" },
}));

export default function ProductPage() {
  const locale = useLocale();
  const t = useTranslations("product");
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");
  const [purchasing, setPurchasing] = useState(false);

  const product = DEMO_PRODUCT;
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handlePurchase = async () => {
    setPurchasing(true);
    // In production: call Stripe checkout API
    await new Promise((r) => setTimeout(r, 1500));
    router.push(`/${locale}/checkout?product=${product.id}&qty=${quantity}`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <button onClick={() => router.back()} className="flex items-center gap-1 hover:text-white transition-colors">
              <ArrowLeft size={14} /> Back
            </button>
            <span>/</span>
            <span>Games</span>
            <span>/</span>
            <span className="text-slate-300 truncate">{product.title}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Product Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Header */}
              <div className="glass rounded-2xl border border-dark-700 overflow-hidden">
                {/* Image area */}
                <div className="h-64 bg-gradient-to-br from-brand-600/20 to-accent-cyan/10 flex items-center justify-center relative">
                  <div className="text-8xl">🎮</div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    {product.is_featured && (
                      <span className="badge bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        <Zap size={10} /> Featured
                      </span>
                    )}
                    {product.is_trending && (
                      <span className="badge bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <TrendingUp size={10} /> Trending
                      </span>
                    )}
                  </div>
                  {discount > 0 && (
                    <div className="absolute top-4 right-4 badge bg-rose-500 text-white font-bold text-sm px-3 py-1">
                      -{discount}% OFF
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <span className="badge bg-brand-600/20 text-brand-400 border border-brand-600/30 text-xs mb-2">
                        {product.type.toUpperCase()}
                      </span>
                      <h1 className="font-display text-2xl font-bold text-white leading-tight">
                        {product.title}
                      </h1>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-dark-600"}
                        />
                      ))}
                      <span className="text-sm font-semibold text-white ml-1">{product.rating.toFixed(1)}</span>
                      <span className="text-sm text-slate-500">({product.review_count} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                      <Users size={13} />
                      <span>{product.sold_count.toLocaleString()} sold</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      <span className={`flex items-center gap-1 ${product.stock_count > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        <CheckCircle size={13} />
                        {product.stock_count > 0 ? `${product.stock_count} in stock` : "Out of stock"}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 rounded-lg bg-dark-800 text-xs text-slate-400 border border-dark-700">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="glass rounded-2xl border border-dark-700">
                <div className="flex border-b border-dark-700">
                  {(["description", "reviews"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${
                        activeTab === tab
                          ? "text-white border-b-2 border-brand-500"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {tab === "reviews" ? `Reviews (${product.review_count})` : "Description"}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  {activeTab === "description" ? (
                    <div className="prose prose-invert prose-sm max-w-none">
                      {product.description.split("\n").map((line, i) => {
                        if (line.startsWith("## ")) return <h3 key={i} className="font-semibold text-white text-base mt-4 mb-2">{line.slice(3)}</h3>;
                        if (line.startsWith("- ")) return <li key={i} className="text-slate-300 ml-4">{line.slice(2)}</li>;
                        if (/^\d+\./.test(line)) return <li key={i} className="text-slate-300 ml-4 list-decimal">{line.replace(/^\d+\. /, "")}</li>;
                        return line ? <p key={i} className="text-slate-400">{line}</p> : <br key={i} />;
                      })}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {DEMO_REVIEWS.map((review) => (
                        <div key={review.id} className="border-b border-dark-800 pb-4 last:border-0">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br brand-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                              {review.buyer?.username[0].toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-white">{review.buyer?.username}</span>
                                <span className="badge bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">Verified</span>
                                <div className="flex ml-auto">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} size={11} className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-dark-600"} />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-slate-400">{review.comment}</p>
                              <p className="text-xs text-slate-600 mt-1">
                                {new Date(review.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Purchase Panel */}
            <div className="space-y-4">
              {/* Price card */}
              <div className="glass rounded-2xl border border-dark-700 p-6 sticky top-20">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-display text-4xl font-bold text-white">
                    ${(product.price * quantity).toFixed(2)}
                  </span>
                  {product.original_price && (
                    <span className="text-lg text-slate-600 line-through">
                      ${(product.original_price * quantity).toFixed(2)}
                    </span>
                  )}
                </div>
                {discount > 0 && (
                  <div className="badge bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-4">
                    You save ${((product.original_price! - product.price) * quantity).toFixed(2)} ({discount}% off)
                  </div>
                )}

                {/* Quantity selector */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm text-slate-400">Quantity:</span>
                  <div className="flex items-center border border-dark-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
                    >
                      <ChevronDown size={14} />
                    </button>
                    <span className="px-4 py-2 text-white font-mono font-semibold text-sm bg-dark-800 border-x border-dark-700">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock_count, quantity + 1))}
                      className="px-3 py-2 text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
                    >
                      <ChevronUp size={14} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handlePurchase}
                  disabled={product.stock_count === 0 || purchasing}
                  className="w-full btn-primary py-4 text-base mb-3 glow-brand disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {purchasing ? (
                    <span className="flex items-center gap-2"><span className="animate-spin">⟳</span> Processing...</span>
                  ) : (
                    <><ShoppingBag size={18} /> {t("buy_now")}</>
                  )}
                </button>

                {/* Trust badges */}
                <div className="space-y-2 pt-3 border-t border-dark-800">
                  {[
                    { icon: Zap, text: t("delivery"), color: "text-brand-400" },
                    { icon: Shield, text: t("secure"), color: "text-emerald-400" },
                    { icon: CheckCircle, text: t("guaranteed"), color: "text-amber-400" },
                  ].map(({ icon: Icon, text, color }) => (
                    <div key={text} className="flex items-center gap-2.5 text-sm text-slate-400">
                      <Icon size={14} className={color} />
                      {text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Seller Card */}
              {product.seller && (
                <div className="glass rounded-2xl border border-dark-700 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br brand-600 flex items-center justify-center font-bold text-white">
                      {product.seller.display_name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-white text-sm">{product.seller.display_name}</span>
                        {product.seller.is_verified && (
                          <Shield size={13} className="text-brand-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star size={11} className="text-amber-400 fill-amber-400" />
                        <span className="text-xs text-slate-400">{product.seller.rating.toFixed(1)} rating</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-dark-800 rounded-xl p-3 text-center">
                      <p className="text-sm font-bold text-white">{product.seller.total_sales.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">Total Sales</p>
                    </div>
                    <div className="bg-dark-800 rounded-xl p-3 text-center">
                      <p className="text-sm font-bold text-emerald-400">98.5%</p>
                      <p className="text-xs text-slate-500">Positive</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
