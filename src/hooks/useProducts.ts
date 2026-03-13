import { useQuery } from "@tanstack/react-query";
import type { Product, ProductFilters, PaginatedResponse } from "@/types";

async function fetchProducts(filters: ProductFilters): Promise<PaginatedResponse<Product>> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
  });
  const res = await fetch(`/api/products?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => fetchProducts(filters),
    staleTime: 30_000,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => fetchProducts({ is_featured: true, limit: 8, sort: "popular" } as any),
    staleTime: 60_000,
  });
}

export function useTrendingProducts(region?: string) {
  return useQuery({
    queryKey: ["products", "trending", region],
    queryFn: () => fetchProducts({ is_trending: true, limit: 4, region, sort: "popular" } as any),
    staleTime: 60_000,
  });
}
