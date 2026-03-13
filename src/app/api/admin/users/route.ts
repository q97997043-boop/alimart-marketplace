import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";

// GET /api/admin/users?page=1&limit=20&search=&role=
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
  const search = searchParams.get("search") || "";
  const role   = searchParams.get("role") || "";

  let query = admin
    .from("users")
    .select("*, seller_profiles(display_name, total_sales, is_verified)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (search) query = query.or(`username.ilike.%${search}%,email.ilike.%${search}%`);
  if (role)   query = query.eq("role", role);

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data, total: count, page, limit });
}

// PATCH /api/admin/users  — ban/unban, change role
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const admin = await createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { userId, updates } = body;

  if (!userId || !updates) return NextResponse.json({ error: "userId and updates required" }, { status: 400 });

  // Prevent demoting yourself
  if (userId === user.id && updates.role) {
    return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });
  }

  const { data, error } = await admin
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
