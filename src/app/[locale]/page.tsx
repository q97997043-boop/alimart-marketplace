import { getLocale } from "next-intl/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/marketplace/HeroSection";
import { FeaturedProducts } from "@/components/marketplace/FeaturedProducts";
import { CategoryGrid } from "@/components/marketplace/CategoryGrid";
import { TrendingProducts } from "@/components/marketplace/TrendingProducts";
import { StatsBar } from "@/components/marketplace/StatsBar";

export default async function HomePage() {
  const locale = await getLocale();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection locale={locale} />
        <StatsBar />
        <CategoryGrid locale={locale} />
        <FeaturedProducts locale={locale} />
        <TrendingProducts locale={locale} />
      </main>
      <Footer />
    </div>
  );
}
