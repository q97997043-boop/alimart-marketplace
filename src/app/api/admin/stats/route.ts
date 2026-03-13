import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_request: NextRequest) {
  const supabase = await createClient();
  const adminClient = await createAdminClient();

  // Auth check — admin only
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [
    { count: totalUsers },
    { count: totalSellers },
    { count: totalProducts },
    { count: totalOrders },
    { data: revenueData },
  ] = await Promise.all([
    adminClient.from("users").select("id", { count: "exact", head: true }),
    adminClient.from("seller_profiles").select("id", { count: "exact", head: true }),
    adminClient.from("products").select("id", { count: "exact", head: true }).eq("status", "active"),
    adminClient.from("orders").select("id", { count: "exact", head: true }).neq("status", "pending"),
    adminClient.from("orders").select("total_price, commission, status, created_at").neq("status", "pending"),
  ]);

  const totalRevenue = revenueData?.filter((o) => o.status !== "refunded")
    .reduce((s, o) => s + o.total_price, 0) ?? 0;
  const platformCommission = revenueData?.filter((o) => o.status !== "refunded")
    .reduce((s, o) => s + o.commission, 0) ?? 0;

  // Today's stats
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayISO = todayStart.toISOString();

  const [{ count: newUsersToday }, { count: ordersToday }] = await Promise.all([
    adminClient.from("users").select("id", { count: "exact", head: true }).gte("created_at", todayISO),
    adminClient.from("orders").select("id", { count: "exact", head: true }).gte("created_at", todayISO).neq("status", "pending"),
  ]);

  // Monthly revenue (last 7 months)
  const now = new Date();
  const monthlyRevenue = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (6 - i), 1);
    const start = d.toISOString();
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString();
    const monthOrders = revenueData?.filter(
      (o) => o.created_at >= start && o.created_at <= end && o.status !== "refunded"
    ) ?? [];
    return {
      month: d.toLocaleString("en-US", { month: "short" }),
      revenue: monthOrders.reduce((s, o) => s + o.total_price, 0),
      commission: monthOrders.reduce((s, o) => s + o.commission, 0),
      orders: monthOrders.length,
    };
  });

  return NextResponse.json({
    total_users: totalUsers ?? 0,
    total_sellers: totalSellers ?? 0,
    total_products: totalProducts ?? 0,
    total_orders: totalOrders ?? 0,
    total_revenue: totalRevenue,
    platform_commission: platformCommission,
    monthly_revenue: monthlyRevenue,
    new_users_today: newUsersToday ?? 0,
    orders_today: ordersToday ?? 0,
  });
}
