"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, Play, Zap, Star, Shield, TrendingUp } from "lucide-react";

interface HeroSectionProps {
  locale: string;
}

const floatingCards = [
  { title: "Steam Key", price: "$4.99", tag: "🎮 Game", color: "from-brand-600/30 to-brand-900/50", delay: 0 },
  { title: "Netflix 1 Month", price: "$12.99", tag: "📺 Subscription", color: "from-rose-600/30 to-rose-900/50", delay: 0.2 },
  { title: "Spotify Premium", price: "$9.99", tag: "🎵 Subscription", color: "from-emerald-600/30 to-emerald-900/50", delay: 0.4 },
  { title: "Xbox Game Pass", price: "$14.99", tag: "🎯 Game", color: "from-cyan-600/30 to-cyan-900/50", delay: 0.6 },
];

export function HeroSection({ locale }: HeroSectionProps) {
  const t = useTranslations("home");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-accent-cyan/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-purple-600/8 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
      </div>

      {/* Gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-dark-950 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-600/10 border border-brand-600/20 text-brand-300 text-sm font-medium mb-6"
            >
              <Zap size={14} className="animate-pulse" />
              Instant digital delivery
              <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-ping" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            >
              <span className="text-white">{t("hero_title")}</span>
              <br />
              <span className="text-gradient">{t("hero_title_accent")}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-slate-400 leading-relaxed mb-8 max-w-lg"
            >
              {t("hero_subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              <Link
                href={`/${locale}/marketplace`}
                className="btn-primary text-base px-8 py-4 glow-brand"
              >
                {t("hero_cta_buy")} <ArrowRight size={18} />
              </Link>
              <Link
                href={`/${locale}/auth/register?seller=true`}
                className="btn-secondary text-base px-8 py-4"
              >
                {t("hero_cta_sell")}
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center gap-6"
            >
              {[
                { icon: Shield, text: "Secure payments" },
                { icon: Zap, text: "Instant delivery" },
                { icon: Star, text: "4.9/5 rating" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-slate-500">
                  <Icon size={14} className="text-brand-400" />
                  <span>{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Floating product cards */}
          <div className="relative hidden lg:block h-[500px]">
            {mounted && floatingCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, -8, 0],
                }}
                transition={{
                  opacity: { duration: 0.5, delay: card.delay },
                  scale: { duration: 0.5, delay: card.delay },
                  y: {
                    duration: 4 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5,
                  },
                }}
                className={`absolute glass rounded-2xl border border-dark-700 p-4 w-52 shadow-2xl cursor-pointer hover:border-brand-600/40 transition-colors`}
                style={{
                  top: `${10 + i * 22}%`,
                  left: `${i % 2 === 0 ? 5 : 45}%`,
                  zIndex: i + 1,
                }}
              >
                <div className={`h-24 rounded-xl bg-gradient-to-br ${card.color} mb-3 flex items-center justify-center text-3xl`}>
                  {card.tag.split(" ")[0]}
                </div>
                <p className="text-xs text-slate-400 font-medium">{card.tag}</p>
                <p className="text-sm font-semibold text-white mt-0.5">{card.title}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-brand-300 font-bold font-display">{card.price}</span>
                  <div className="flex items-center gap-0.5">
                    <Star size={10} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs text-slate-500">4.9</span>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Decorative elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-600/5 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
