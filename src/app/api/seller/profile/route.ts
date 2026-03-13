import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("seller_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const allowed = ["display_name", "bio", "logo_url"];
  const updates: Record<string, any> = {};
  allowed.forEach((key) => { if (key in body) updates[key] = body[key]; });

  if (!Object.keys(updates).length) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("seller_profiles")
    .update(updates)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

// POST /api/seller/profile — become a seller
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { display_name } = await request.json();
  if (!display_name) return NextResponse.json({ error: "display_name required" }, { status: 400 });

  // Check if already a seller
  const { data: existing } = await supabase
    .from("seller_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (existing) return NextResponse.json({ error: "Already a seller" }, { status: 409 });

  // Upgrade user role
  await supabase.from("users").update({ role: "seller" }).eq("id", user.id);

  // Create seller profile
  const { data, error } = await supabase
    .from("seller_profiles")
    .insert({ user_id: user.id, display_name, commission_rate: 0.10, is_verified: false })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, { status: 201 });
}
