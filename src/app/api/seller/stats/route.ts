import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: seller } = await supabase
    .from("seller_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!seller) return NextResponse.json({ error: "Not a seller" }, { status: 403 });

  // Orders summary
  const { data: orders } = await supabase
    .from("orders")
    .select("total_price, seller_payout, status, created_at")
    .eq("seller_id", seller.id);

  const totalRevenue = orders?.filter((o) => o.status !== "refunded")
    .reduce((sum, o) => sum + o.seller_payout, 0) ?? 0;

  const totalOrders = orders?.filter((o) => o.status !== "refunded").length ?? 0;

  const pendingBalance = orders?.filter((o) => o.status === "paid")
    .reduce((sum, o) => sum + o.seller_payout, 0) ?? 0;

  // Active products count
  const { count: activeProducts } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("seller_id", seller.id)
    .eq("status", "active");

  // Monthly revenue (last 7 months)
  const now = new Date();
  const monthlyRevenue = await Promise.all(
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (6 - i), 1);
      const start = d.toISOString();
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString();
      const monthOrders = orders?.filter(
        (o) => o.created_at >= start && o.created_at <= end && o.status !== "refunded"
      ) ?? [];
      return {
        month: d.toLocaleString("en-US", { month: "short" }),
        revenue: monthOrders.reduce((s, o) => s + o.seller_payout, 0),
        orders: monthOrders.length,
      };
    })
  );

  // Top products
  const { data: topProducts } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", seller.id)
    .order("sold_count", { ascending: false })
    .limit(5);

  return NextResponse.json({
    total_revenue: totalRevenue,
    total_orders: totalOrders,
    active_products: activeProducts ?? 0,
    pending_balance: pendingBalance,
    available_balance: totalRevenue - pendingBalance,
    monthly_revenue: monthlyRevenue,
    top_products: topProducts ?? [],
  });
}
