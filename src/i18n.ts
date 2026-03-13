import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import type { Locale } from "@/types";

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (
      await import(`../public/locales/${locale}/common.json`)
    ).default,
  };
});
