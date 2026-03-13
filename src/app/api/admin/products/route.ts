import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";

// GET /api/admin/products?status=pending&page=1
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const admin = await createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const page   = Number(searchParams.get("page") || 1);
  const limit  = Number(searchParams.get("limit") || 20);
  const status = searchParams.get("status") || "";

  let query = admin
    .from("products")
    .select("*, seller_profiles(display_name, user_id), categories(name, icon)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (status) query = query.eq("status", status);

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data, total: count, page, limit });
}

// PATCH /api/admin/products — approve, ban, feature, set trending
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const admin = await createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { productId, updates } = await request.json();

  if (!productId || !updates) return NextResponse.json({ error: "productId and updates required" }, { status: 400 });

  const { data, error } = await admin
    .from("products")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", productId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
