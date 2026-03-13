import { useQuery } from "@tanstack/react-query";
import type { SellerStats } from "@/types";

async function fetchSellerStats(): Promise<SellerStats> {
  const res = await fetch("/api/seller/stats");
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export function useSellerStats() {
  return useQuery({
    queryKey: ["seller-stats"],
    queryFn: fetchSellerStats,
    staleTime: 60_000,
  });
}
