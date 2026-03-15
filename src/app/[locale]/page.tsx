import  { useTranslations from } "next-intl";
import  { getLocale } from "next-intl/server";
import Link from "next/link";
import { ArrowRight, Zap, TrendingUp, ShieldCheck, Star, Users, Package, CheckCircle } from "lucide-react";
import  Navbar  from "@/components/layout/Navbar";
import  Footer  from "@/components/layout/Footer";
import  HeroSection  from "@/components/marketplace/HeroSection";
import  FeaturedProducts  from "@/components/marketplace/FeaturedProducts";
import  CategoryGrid  from "@/components/marketplace/CategoryGrid";
import  TrendingProducts  from "@/components/marketplace/TrendingProducts";
import  StatsBar  from "@/components/marketplace/StatsBar";
import SellerCTA from "@/components/marketplace/SellerCTA";
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
        <SellerCTA locale={locale} />
      </main>
      <Footer />
    </div>
  );
}

function SellerCTA({ locale }: { locale: string }) {
  return (
    <section className="section">
      <div className="relative rounded-3xl overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 via-dark-900 to-accent-cyan/10 grid-bg" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />

        {/* Glow orbs */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-brand-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent-cyan/10 rounded-full blur-3xl" />

        <div className="relative px-8 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-600/20 border border-brand-600/30 text-brand-300 text-sm font-medium mb-6">
            <Zap size={14} />
            Start earning today
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Sell your digital products{" "}
            <span className="text-gradient">on AliMart</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
            Join thousands of sellers. Upload game keys, accounts, and digital goods. Get paid instantly with low commission rates.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            {[
              { icon: CheckCircle, text: "Low 10% commission" },
              { icon: CheckCircle, text: "Instant payouts" },
              { icon: CheckCircle, text: "Seller protection" },
              { icon: CheckCircle, text: "Global reach" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-slate-300">
                <Icon size={15} className="text-accent-emerald" />
                {text}
              </div>
            ))}
          </div>

          <Link
            href={`/${locale}/auth/register?seller=true`}
            className="btn-primary text-base px-8 py-4 glow-brand"
          >
            Start Selling Free <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
