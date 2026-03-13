"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Star, ShoppingBag, Zap, TrendingUp, Shield } from "lucide-react";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const typeColors: Record<string, string> = {
  key:          "bg-brand-600/20 text-brand-400 border-brand-600/30",
  account:      "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  subscription: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  file:         "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  other:        "bg-slate-500/10 text-slate-400 border-slate-600/20",
};

const typeLabels: Record<string, string> = {
  key:          "Key",
  account:      "Account",
  subscription: "Subscription",
  file:         "File",
  other:        "Other",
};

const categoryGradients = [
  "from-brand-600/20 to-accent-cyan/20",
  "from-purple-600/20 to-pink-600/20",
  "from-emerald-600/20 to-teal-600/20",
  "from-orange-600/20 to-amber-600/20",
  "from-rose-600/20 to-red-600/20",
];

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const locale = useLocale();
  const gradientClass = categoryGradients[index % categoryGradients.length];
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link href={`/${locale}/product/${product.id}`}>
        <div className="product-card bg-dark-900 border border-dark-800 hover:border-brand-600/40 group">
          {/* Image / Placeholder */}
          <div className={`relative h-40 bg-gradient-to-br ${gradientClass} overflow-hidden`}>
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag size={32} className="text-white/20" />
              </div>
            )}

            {/* Badges overlay */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
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
              <div className="absolute top-3 right-3 badge bg-accent-rose/90 text-white font-bold text-xs">
                -{discount}%
              </div>
            )}

            {/* Stock indicator */}
            <div className="absolute bottom-3 right-3">
              <span
                className={`badge text-xs ${
                  product.stock_count > 10
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : product.stock_count > 0
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                }`}
              >
                {product.stock_count > 0 ? `${product.stock_count} left` : "Sold out"}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Type badge */}
            <span className={`badge border text-xs mb-2 ${typeColors[product.type] || typeColors.other}`}>
              {typeLabels[product.type] || product.type}
            </span>

            <h3 className="font-semibold text-white text-sm leading-tight mb-1 line-clamp-2 group-hover:text-brand-300 transition-colors">
              {product.title}
            </h3>

            {/* Seller */}
            {product.seller && (
              <div className="flex items-center gap-1.5 mb-3">
                <div className="w-4 h-4 rounded bg-gradient-to-br brand-600 flex items-center justify-center text-[9px] font-bold text-white">
                  {product.seller.display_name[0]}
                </div>
                <span className="text-xs text-slate-500 truncate">{product.seller.display_name}</span>
                {product.seller.is_verified && (
                  <Shield size={10} className="text-brand-400 flex-shrink-0" />
                )}
              </div>
            )}

            {/* Rating & Sales */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-1">
                <Star size={11} className="text-amber-400 fill-amber-400" />
                <span className="text-xs text-slate-400 font-medium">
                  {product.rating > 0 ? product.rating.toFixed(1) : "New"}
                </span>
                {product.review_count > 0 && (
                  <span className="text-xs text-slate-600">({product.review_count})</span>
                )}
              </div>
              {product.sold_count > 0 && (
                <span className="text-xs text-slate-600">{product.sold_count} sold</span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold font-display text-white">
                  ${product.price.toFixed(2)}
                </span>
                {product.original_price && (
                  <span className="text-xs text-slate-600 line-through">
                    ${product.original_price.toFixed(2)}
                  </span>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `/${locale}/product/${product.id}`;
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg transition-all active:scale-95 group-hover:glow-brand"
              >
                <ShoppingBag size={12} />
                Buy
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Skeleton loader
export function ProductCardSkeleton() {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="h-40 bg-dark-800 shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 bg-dark-800 shimmer rounded" />
        <div className="h-4 w-full bg-dark-800 shimmer rounded" />
        <div className="h-3 w-24 bg-dark-800 shimmer rounded" />
        <div className="flex justify-between items-center">
          <div className="h-6 w-16 bg-dark-800 shimmer rounded" />
          <div className="h-7 w-14 bg-dark-800 shimmer rounded-lg" />
        </div>
      </div>
    </div>
  );
}
