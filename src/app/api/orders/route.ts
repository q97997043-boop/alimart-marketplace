import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/orders — buyer's or seller's orders
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page   = Number(searchParams.get("page") || 1);
  const limit  = Number(searchParams.get("limit") || 20);
  const status = searchParams.get("status") || "";
  const role   = searchParams.get("role") || "buyer"; // buyer | seller

  let query = supabase
    .from("orders")
    .select("*, products(title, type, images), users!orders_buyer_id_fkey(username)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (role === "seller") {
    // Get seller profile id first
    const { data: seller } = await supabase
      .from("seller_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!seller) return NextResponse.json({ error: "Not a seller" }, { status: 403 });
    query = query.eq("seller_id", seller.id);
  } else {
    query = query.eq("buyer_id", user.id);
  }

  if (status) query = query.eq("status", status);

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data, total: count, page, limit });
}
