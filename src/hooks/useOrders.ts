import { useQuery } from "@tanstack/react-query";
import type { Order } from "@/types";

interface OrdersResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
}

async function fetchOrders(role: "buyer" | "seller", page = 1): Promise<OrdersResponse> {
  const res = await fetch(`/api/orders?role=${role}&page=${page}&limit=20`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export function useOrders(role: "buyer" | "seller" = "buyer", page = 1) {
  return useQuery({
    queryKey: ["orders", role, page],
    queryFn: () => fetchOrders(role, page),
    staleTime: 30_000,
  });
}

async function fetchOrderBySession(sessionId: string) {
  const res = await fetch(`/api/orders/by-session?session_id=${sessionId}`);
  if (!res.ok) throw new Error("Order not found");
  return res.json();
}

export function useOrderBySession(sessionId: string | null) {
  return useQuery({
    queryKey: ["order-session", sessionId],
    queryFn: () => fetchOrderBySession(sessionId!),
    enabled: !!sessionId,
    refetchInterval: (data: any) => (data?.status === "delivered" ? false : 1500),
    staleTime: 0,
  });
}
