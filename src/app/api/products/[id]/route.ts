import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/products/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      seller_profiles(id, display_name, bio, logo_url, rating, total_sales, is_verified),
      categories(name, slug, icon)
    `)
    .eq("id", params.id)
    .single();

  if (error || !data) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  return NextResponse.json(data);
}

// PATCH /api/products/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify ownership
  const { data: seller } = await supabase
    .from("seller_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!seller) return NextResponse.json({ error: "Not a seller" }, { status: 403 });

  const body = await request.json();

  const { data, error } = await supabase
    .from("products")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", params.id)
    .eq("seller_id", seller.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

// DELETE /api/products/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: seller } = await supabase
    .from("seller_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  // Soft-delete by setting status to "banned" (preserves order history)
  const { error } = await supabase
    .from("products")
    .update({ status: "banned" })
    .eq("id", params.id)
    .eq("seller_id", seller?.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
