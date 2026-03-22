import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import type { Locale } from "@/types";

export const locales: Locale[] = ["en", "ru", "uz", "tr"];
export const defaultLocale: Locale = "en";

// Map country codes → locales
export const countryLocaleMap: Record<string, Locale> = {
  US: "en", GB: "en", AU: "en", CA: "en",
  RU: "ru", BY: "ru", KZ: "ru",
  UZ: "uz", TJ: "uz",
  TR: "tr",
};

export const localeConfig = {
  en: { label: "English", flag: "🇺🇸", rtl: false },
  ru: { label: "Русский", flag: "🇷🇺", rtl: false },
  uz: { label: "O'zbek", flag: "🇺🇿", rtl: false },
  tr: { label: "Türkçe", flag: "🇹🇷", rtl: false },
};

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`../../../public/locales/${locale}/common.json`)).default,
  };
});
