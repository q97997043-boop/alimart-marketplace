import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, keys }: { productId: string; keys: string[] } = await request.json();

  if (!productId || !keys?.length) {
    return NextResponse.json({ error: "productId and keys[] required" }, { status: 400 });
  }

  // Verify seller owns product
  const { data: seller } = await supabase
    .from("seller_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!seller) return NextResponse.json({ error: "Not a seller" }, { status: 403 });

  const { data: product } = await supabase
    .from("products")
    .select("id")
    .eq("id", productId)
    .eq("seller_id", seller.id)
    .single();

  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  // Deduplicate & clean keys
  const cleanKeys = [...new Set(keys.map((k) => k.trim()).filter(Boolean))];

  // Get existing keys to skip duplicates
  const { data: existing } = await supabase
    .from("digital_keys")
    .select("key_value")
    .eq("product_id", productId)
    .in("key_value", cleanKeys);

  const existingSet = new Set(existing?.map((k) => k.key_value));
  const newKeys = cleanKeys.filter((k) => !existingSet.has(k));

  if (!newKeys.length) {
    return NextResponse.json({ message: "All keys already exist", inserted: 0 });
  }

  // Insert new keys
  const { error: insertError } = await supabase.from("digital_keys").insert(
    newKeys.map((key) => ({ product_id: productId, key_value: key }))
  );

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // Update product stock count
  await supabase
    .from("products")
    .update({ stock_count: supabase.rpc("stock_count_for_product", { p_product_id: productId }) })
    .eq("id", productId);

  return NextResponse.json({
    inserted: newKeys.length,
    skipped: cleanKeys.length - newKeys.length,
    total: cleanKeys.length,
  });
}
