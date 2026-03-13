import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { locales, defaultLocale, countryLocaleMap } from "@/lib/i18n/config";
import type { Locale } from "@/types";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
});

function detectLocaleFromRequest(request: NextRequest): Locale {
  // 1. Check cookie preference
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value as Locale;
  if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale;

  // 2. GeoIP via Vercel/Cloudflare headers
  const country =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry");
  if (country && countryLocaleMap[country]) return countryLocaleMap[country];

  // 3. Accept-Language header
  const acceptLang = request.headers.get("accept-language") || "";
  for (const locale of locales) {
    if (acceptLang.toLowerCase().includes(locale)) return locale;
  }

  return defaultLocale;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Auth protection
  const supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protected routes
  const protectedPatterns = ["/seller", "/admin", "/profile", "/checkout"];
  const isProtected = protectedPatterns.some((p) =>
    pathname.includes(p)
  );

  if (isProtected && !user) {
    const locale = detectLocaleFromRequest(request);
    return NextResponse.redirect(
      new URL(`/${locale}/auth/login?redirect=${pathname}`, request.url)
    );
  }

  // Admin routes
  if (pathname.includes("/admin") && user) {
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userData?.role !== "admin") {
      const locale = detectLocaleFromRequest(request);
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
