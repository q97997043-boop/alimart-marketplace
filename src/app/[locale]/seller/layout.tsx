import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const locale   = await getLocale();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login?redirect=/${locale}/seller/dashboard`);

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  // Buyers trying to access seller routes get redirected to become-seller
  if (profile?.role === "buyer") {
    redirect(`/${locale}/seller/become`);
  }

  return <>{children}</>;
}
