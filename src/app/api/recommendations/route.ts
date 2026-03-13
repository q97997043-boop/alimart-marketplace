import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/recommendations?region=US&viewed=id1,id2&limit=8
 *
 * Returns products recommended based on:
 *  1. Region popularity (products selling well in user's region)
 *  2. Recently viewed product categories
 *  3. Overall trending products as fallback
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region") || "US";
  const viewedIds = searchParams.get("viewed")?.split(",").filter(Boolean) ?? [];
  const limit = Math.min(Number(searchParams.get("limit") || "8"), 24);

  const supabase = await createClient();

  // Get categories from recently viewed
  let categoryIds: string[] = [];
  if (viewedIds.length > 0) {
    const { data: viewedProducts } = await supabase
      .from("products")
      .select("category_id")
      .in("id", viewedIds.slice(0, 10));
    categoryIds = [...new Set(viewedProducts?.map((p) => p.category_id) ?? [])];
  }

  // Build recommendation query
  let query = supabase
    .from("products")
    .select("*, seller_profiles(display_name, is_verified, rating)")
    .eq("status", "active")
    .not("id", "in", viewedIds.length > 0 ? `(${viewedIds.join(",")})` : "(null)");

  // Prefer products for the user's region or global
  query = query.or(`region.is.null,region.eq.${region}`);

  // If we have category preferences, weight them
  if (categoryIds.length > 0) {
    query = query.in("category_id", categoryIds);
  }

  // Sort by trending + sold count
  query = query
    .order("is_trending", { ascending: false })
    .order("sold_count", { ascending: false })
    .order("rating", { ascending: false })
    .limit(limit);

  const { data: recommended, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // If not enough results, fill with overall trending
  let products = recommended ?? [];
  if (products.length < limit) {
    const needed = limit - products.length;
    const existingIds = [...viewedIds, ...products.map((p) => p.id)];

    const { data: fallback } = await supabase
      .from("products")
      .select("*, seller_profiles(display_name, is_verified, rating)")
      .eq("status", "active")
      .not("id", "in", existingIds.length > 0 ? `(${existingIds.join(",")})` : "(null)")
      .order("sold_count", { ascending: false })
      .limit(needed);

    products = [...products, ...(fallback ?? [])];
  }

  return NextResponse.json({ data: products, region });
}
