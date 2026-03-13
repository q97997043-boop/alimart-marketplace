"use client";

import { useEffect, useState } from "react";
import { countryLocaleMap } from "@/lib/i18n/config";
import type { Locale } from "@/types";

interface GeoInfo {
  country: string;
  locale: Locale;
  region: string;
}

// Cache in memory to avoid repeated requests
let geoCache: GeoInfo | null = null;

export function useGeoLocale() {
  const [geo, setGeo] = useState<GeoInfo | null>(geoCache);
  const [loading, setLoading] = useState(!geoCache);

  useEffect(() => {
    if (geoCache) { setGeo(geoCache); setLoading(false); return; }

    // Try to detect from a lightweight service
    fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) })
      .then((r) => r.json())
      .then((data) => {
        const country: string = data.country_code || "US";
        const locale: Locale = countryLocaleMap[country] || "en";
        const region = country;
        const result = { country, locale, region };
        geoCache = result;
        setGeo(result);
      })
      .catch(() => {
        // Fall back gracefully — use browser language
        const browserLang = navigator.language.split("-")[0] as Locale;
        const locale: Locale = ["en", "ru", "uz", "tr"].includes(browserLang)
          ? browserLang
          : "en";
        const result = { country: "US", locale, region: "US" };
        geoCache = result;
        setGeo(result);
      })
      .finally(() => setLoading(false));
  }, []);

  return { geo, loading };
}
