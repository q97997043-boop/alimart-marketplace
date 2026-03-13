"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Search, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard, ProductCardSkeleton } from "@/components/marketplace/ProductCard";
import type { Product } from "@/types";

function SearchResults() {
  const locale       = useLocale();
  const searchParams = useSearchParams();
  const query        = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [total,    setTotal]    = useState(0);

  useEffect(() => {
    if (!query.trim()) return;
    setLoading(true);

    // In production: fetch(`/api/products?query=${encodeURIComponent(query)}`)
    const timer = setTimeout(() => {
      const mock: Product[] = Array.from({ length: query.length > 2 ? 6 : 0 }, (_, i) => ({
        id: `s${i}`,
        seller_id: "s1",
        category_id: "1",
        title: `${query} Product ${i + 1}`,
        description: "Search result.",
        price: 4.99 + i * 2,
        currency: "USD",
        type: "key" as const,
        status: "active" as const,
        stock_count: 10,
        sold_count: 50 * (i + 1),
        rating: 4.5,
        review_count: 30,
        images: [],
        tags: [],
        is_featured: false,
        is_trending: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        seller: { id: "s1", user_id: "u1", display_name: "GameZone", rating: 4.9, total_sales: 1000, total_revenue: 5000, is_verified: true, commission_rate: 0.1, created_at: "" },
      }));
      setProducts(mock);
      setTotal(mock.length);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <>
      <div className="bg-dark-900/50 border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-4">
            <Link href={`/${locale}/marketplace`} className="flex items-center gap-1 text-sm text-slate-500 hover:text-white transition-colors">
              <ArrowLeft size={14} /> Marketplace
            </Link>
            <span className="text-slate-700">/</span>
            <span className="text-sm text-slate-400">Search</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-white">
            {query ? (
              <>Results for "<span className="text-gradient">{query}</span>"</>
            ) : (
              "Search Products"
            )}
          </h1>
          {!loading && query && (
            <p className="text-sm text-slate-500 mt-1">{total} product{total !== 1 ? "s" : ""} found</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!query ? (
          <div className="text-center py-20">
            <Search size={48} className="text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">Enter a search term to find products</p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
            <p className="text-slate-500 mb-6">Try different keywords or browse categories</p>
            <Link href={`/${locale}/marketplace`} className="btn-primary">
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <Suspense fallback={<div className="h-48 flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" /></div>}>
          <SearchResults />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
