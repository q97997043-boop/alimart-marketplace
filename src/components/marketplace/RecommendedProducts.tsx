"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import { ProductCard, ProductCardSkeleton } from "@/components/marketplace/ProductCard";
import { useGeoLocale } from "@/hooks/useGeoLocale";
import { useAppStore } from "@/store/appStore";
import type { Product } from "@/types";

interface RecommendedProductsProps {
  locale: string;
}

export function RecommendedProducts({ locale }: RecommendedProductsProps) {
  const t = useTranslations("home");
  const { geo } = useGeoLocale();
  const recentlyViewed = useAppStore((s) => s.recentlyViewed);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!geo) return;

    const viewedIds = recentlyViewed.map((r) => r.productId).join(",");
    const params = new URLSearchParams({ region: geo.region, limit: "8" });
    if (viewedIds) params.set("viewed", viewedIds);

    fetch(`/api/recommendations?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => setProducts(data.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [geo, recentlyViewed]);

  if (!loading && products.length === 0) return null;

  return (
    <section className="section">
      <div className="flex items-center gap-3 mb-8">
        <Sparkles size={20} className="text-brand-400" />
        <h2 className="font-display text-2xl font-bold text-white">{t("recommended_title")}</h2>
        {geo && (
          <span className="badge bg-brand-600/10 text-brand-400 border border-brand-600/20 text-xs ml-auto">
            Based on your region {geo.country}
          </span>
        )}
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
