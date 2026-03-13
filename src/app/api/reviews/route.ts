import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/reviews?product_id=xxx&page=1&limit=10
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const productId = searchParams.get("product_id");
  const page      = Number(searchParams.get("page") || 1);
  const limit     = Number(searchParams.get("limit") || 10);

  if (!productId) return NextResponse.json({ error: "product_id required" }, { status: 400 });

  const { data, count, error } = await supabase
    .from("reviews")
    .select("*, users(username, avatar_url)", { count: "exact" })
    .eq("product_id", productId)
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data, total: count, page, limit });
}

// POST /api/reviews
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { product_id, order_id, rating, comment } = body;

  if (!product_id || !order_id || !rating) {
    return NextResponse.json({ error: "product_id, order_id and rating required" }, { status: 400 });
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
  }

  // Verify user owns the order and it's delivered
  const { data: order } = await supabase
    .from("orders")
    .select("id, status")
    .eq("id", order_id)
    .eq("buyer_id", user.id)
    .eq("product_id", product_id)
    .single();

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (order.status !== "delivered") return NextResponse.json({ error: "Can only review delivered orders" }, { status: 400 });

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      product_id,
      order_id,
      buyer_id: user.id,
      rating,
      comment: comment?.slice(0, 1000) || null,
      is_verified: true,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "You already reviewed this order" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
