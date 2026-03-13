"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Users, Package, ShoppingCart, TrendingUp } from "lucide-react";
import { ProductCard, ProductCardSkeleton } from "./ProductCard";
import type { Product, Category } from "@/types";

// ── Stats Bar ────────────────────────────────────────────────────
export function StatsBar() {
  const t = useTranslations("home");
  const stats = [
    { icon: Users, value: "12,400+", label: t("stats_sellers"), color: "text-brand-400" },
    { icon: Package, value: "89,000+", label: t("stats_products"), color: "text-accent-cyan" },
    { icon: ShoppingCart, value: "1.2M+", label: t("stats_orders"), color: "text-accent-emerald" },
    { icon: TrendingUp, value: "99.8%", label: "Delivery rate", color: "text-amber-400" },
  ];

  return (
    <section className="py-8 px-4 border-y border-dark-800 bg-dark-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, value, label, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-dark-800 border border-dark-700 flex items-center justify-center flex-shrink-0">
                <Icon size={18} className={color} />
              </div>
              <div>
                <p className={`text-xl font-bold font-display ${color}`}>{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Category Grid ─────────────────────────────────────────────────
interface CategoryGridProps {
  locale: string;
}

const DEMO_CATEGORIES: Category[] = [
  { id: "1", name: "Games",         slug: "games",         icon: "🎮", sort_order: 1 },
  { id: "2", name: "Software",      slug: "software",      icon: "💻", sort_order: 2 },
  { id: "3", name: "Subscriptions", slug: "subscriptions", icon: "📺", sort_order: 3 },
  { id: "4", name: "Gift Cards",    slug: "gift-cards",    icon: "🎁", sort_order: 4 },
  { id: "5", name: "Accounts",      slug: "accounts",      icon: "👤", sort_order: 5 },
  { id: "6", name: "VPN & Security",slug: "vpn-security",  icon: "🔒", sort_order: 6 },
  { id: "7", name: "Education",     slug: "education",     icon: "📚", sort_order: 7 },
  { id: "8", name: "Social Media",  slug: "social-media",  icon: "📱", sort_order: 8 },
];

export function CategoryGrid({ locale }: CategoryGridProps) {
  const t = useTranslations("home");

  return (
    <section className="section">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl font-bold text-white">{t("categories_title")}</h2>
        <Link href={`/${locale}/marketplace`} className="text-sm text-brand-400 hover:text-brand-300 transition-colors">
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {DEMO_CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              href={`/${locale}/marketplace?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-dark-900 border border-dark-800 hover:border-brand-600/40 hover:bg-dark-800 transition-all group text-center"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                {cat.icon}
              </span>
              <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200 transition-colors leading-tight">
                {cat.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ── Product Grid Section ──────────────────────────────────────────
interface ProductSectionProps {
  title: string;
  products: Product[];
  loading?: boolean;
  locale: string;
  viewAllHref: string;
  icon?: React.ReactNode;
}

function ProductSection({ title, products, loading, locale, viewAllHref, icon }: ProductSectionProps) {
  return (
    <section className="section">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="font-display text-2xl font-bold text-white">{title}</h2>
        </div>
        <Link href={viewAllHref} className="text-sm text-brand-400 hover:text-brand-300 transition-colors">
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
      </div>
    </section>
  );
}

// ── Featured Products ─────────────────────────────────────────────
interface FeaturedProductsProps {
  locale: string;
}

// Demo products for server render; in production, fetch from Supabase
const DEMO_FEATURED: Product[] = Array.from({ length: 8 }, (_, i) => ({
  id: `featured-${i}`,
  seller_id: "s1",
  category_id: ["1","2","3","4"][i % 4],
  title: [
    "Steam Deck Keys Bundle", "Adobe Creative Cloud", "Netflix Premium 3 months",
    "Minecraft Java Edition", "VPN Pro Annual", "Spotify Family Plan",
    "Windows 11 Pro Key", "Office 365 License",
  ][i],
  description: "Digital product delivered instantly after payment.",
  price: [4.99, 29.99, 34.99, 19.99, 39.99, 14.99, 24.99, 49.99][i],
  original_price: [7.99, 39.99, 44.99, 26.99, 59.99, 19.99, 34.99, 69.99][i],
  currency: "USD",
  type: (["key","subscription","subscription","key","subscription","subscription","key","subscription"] as const)[i],
  status: "active" as const,
  stock_count: [45, 12, 8, 100, 5, 20, 33, 7][i],
  sold_count: [1204, 567, 892, 2341, 89, 456, 789, 234][i],
  rating: [4.9, 4.7, 4.8, 4.9, 4.5, 4.8, 4.6, 4.7][i],
  review_count: [234, 89, 156, 567, 34, 123, 89, 56][i],
  images: [],
  tags: [],
  is_featured: true,
  is_trending: i < 3,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  seller: {
    id: "s1", user_id: "u1",
    display_name: ["GameZone", "SoftStore", "SubHub", "KeyMaster"][i % 4],
    rating: 4.8, total_sales: 1000, total_revenue: 10000,
    is_verified: true, commission_rate: 0.1,
    created_at: new Date().toISOString(),
  },
}));

export function FeaturedProducts({ locale }: FeaturedProductsProps) {
  const t = useTranslations("home");
  return (
    <ProductSection
      title={t("featured_title")}
      products={DEMO_FEATURED}
      locale={locale}
      viewAllHref={`/${locale}/marketplace?featured=true`}
      icon={<span className="text-2xl">⭐</span>}
    />
  );
}

// ── Trending Products ─────────────────────────────────────────────
interface TrendingProductsProps {
  locale: string;
}

const DEMO_TRENDING: Product[] = Array.from({ length: 4 }, (_, i) => ({
  ...DEMO_FEATURED[i],
  id: `trending-${i}`,
  is_trending: true,
  sold_count: [5420, 3210, 2890, 4100][i],
}));

export function TrendingProducts({ locale }: TrendingProductsProps) {
  const t = useTranslations("home");
  return (
    <ProductSection
      title={t("trending_title")}
      products={DEMO_TRENDING}
      locale={locale}
      viewAllHref={`/${locale}/marketplace?trending=true`}
      icon={<TrendingUp size={22} className="text-rose-400" />}
    />
  );
}
