import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "react-hot-toast";
import { locales } from "@/lib/i18n/config";
import { QueryProvider } from "@/components/shared/QueryProvider";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: { template: "%s | AliMart", default: "AliMart — Digital Marketplace" },
  description:
    "Buy and sell digital products instantly. Game keys, accounts, subscriptions and more.",
  keywords: ["digital marketplace", "game keys", "accounts", "subscriptions"],
  openGraph: {
    type: "website",
    siteName: "AliMart",
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-dark-950 text-white antialiased min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#1e293b",
                  color: "#f1f5f9",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                },
              }}
            />
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
