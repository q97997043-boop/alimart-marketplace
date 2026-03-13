import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("users")
    .select("*, seller_profiles(*)")
    .eq("id", user.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  // Whitelist updatable fields
  const allowed = ["username", "avatar_url", "locale", "country"];
  const updates: Record<string, any> = {};
  allowed.forEach((key) => {
    if (key in body) updates[key] = body[key];
  });

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  // Validate username uniqueness
  if (updates.username) {
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("username", updates.username)
      .neq("id", user.id)
      .single();

    if (existing) return NextResponse.json({ error: "Username already taken" }, { status: 409 });
  }

  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
