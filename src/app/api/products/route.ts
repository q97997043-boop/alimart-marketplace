import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ProductFilters } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const supabase = await createClient();

  const filters: ProductFilters = {
    query:     searchParams.get("query") || undefined,
    category:  searchParams.get("category") || undefined,
    type:      searchParams.get("type") as any || undefined,
    min_price: Number(searchParams.get("min_price")) || 0,
    max_price: Number(searchParams.get("max_price")) || 99999,
    rating:    Number(searchParams.get("rating")) || undefined,
    sort:      (searchParams.get("sort") as any) || "newest",
    region:    searchParams.get("region") || undefined,
    page:      Number(searchParams.get("page")) || 1,
    limit:     Number(searchParams.get("limit")) || 24,
  };

  let query = supabase
    .from("products")
    .select("*, seller_profiles(display_name, is_verified, rating), categories(name, slug, icon)", { count: "exact" })
    .eq("status", "active")
    .gte("price", filters.min_price!)
    .lte("price", filters.max_price!);

  // Full-text search
  if (filters.query) {
    query = query.textSearch("search_vector", filters.query, { type: "websearch" });
  }

  // Category filter
  if (filters.category && filters.category !== "all") {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", filters.category)
      .single();
    if (cat) query = query.eq("category_id", cat.id);
  }

  // Type filter
  if (filters.type) query = query.eq("type", filters.type);

  // Rating filter
  if (filters.rating) query = query.gte("rating", filters.rating);

  // Region filter (show global + matching region)
  if (filters.region) {
    query = query.or(`region.is.null,region.eq.${filters.region}`);
  }

  // Sort
  switch (filters.sort) {
    case "newest":    query = query.order("created_at", { ascending: false }); break;
    case "popular":   query = query.order("sold_count", { ascending: false }); break;
    case "price_asc": query = query.order("price", { ascending: true }); break;
    case "price_desc":query = query.order("price", { ascending: false }); break;
    case "rating":    query = query.order("rating", { ascending: false }); break;
    default:          query = query.order("created_at", { ascending: false });
  }

  // Pagination
  const offset = (filters.page! - 1) * filters.limit!;
  query = query.range(offset, offset + filters.limit! - 1);

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data,
    total: count || 0,
    page: filters.page,
    limit: filters.limit,
    has_more: (count || 0) > (filters.page! * filters.limit!),
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  // Get seller profile
  const { data: seller } = await supabase
    .from("seller_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!seller) return NextResponse.json({ error: "Not a seller" }, { status: 403 });

  const { data, error } = await supabase
    .from("products")
    .insert({ ...body, seller_id: seller.id, status: "draft" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, { status: 201 });
}
