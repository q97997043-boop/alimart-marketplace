"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Menu, X, ChevronDown, Globe, Bell,
  User, LayoutDashboard, LogOut, ShieldCheck, Wallet,
  Search
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { localeConfig } from "@/lib/i18n/config";
import type { User as UserType } from "@/types";

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const supabase = createClient();

  const [user, setUser] = useState<UserType | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .single();
        setUser(data);
      }
    };
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) setUser(null);
      else fetchUser();
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserMenuOpen(false);
  };

  const switchLocale = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    window.location.href = newPath;
  };

  const navLinks = [
    { href: `/${locale}/marketplace`, label: t("marketplace") },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-dark-800/50" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center glow-brand">
              <span className="font-display font-bold text-white text-base leading-none">A</span>
            </div>
            <span className="font-display font-bold text-xl text-white group-hover:text-gradient transition-all">
              Ali<span className="text-brand-400">Mart</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname.includes("/marketplace")
                    ? "bg-brand-600/20 text-brand-400"
                    : "text-slate-400 hover:text-white hover:bg-dark-800"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {!user && (
              <Link
                href={`/${locale}/auth/register?seller=true`}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-dark-800 transition-all"
              >
                {t("sell")}
              </Link>
            )}
          </nav>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-2">
            {/* Search */}
            <Link
              href={`/${locale}/marketplace`}
              className="p-2 text-slate-400 hover:text-white hover:bg-dark-800 rounded-lg transition-all"
            >
              <Search size={18} />
            </Link>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-slate-400 hover:text-white hover:bg-dark-800 rounded-lg transition-all text-sm"
              >
                <Globe size={16} />
                <span>{localeConfig[locale as keyof typeof localeConfig]?.flag}</span>
                <ChevronDown size={12} />
              </button>

              <AnimatePresence>
                {langMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-44 glass rounded-xl border border-dark-700 overflow-hidden shadow-2xl"
                  >
                    {Object.entries(localeConfig).map(([code, config]) => (
                      <button
                        key={code}
                        onClick={() => { switchLocale(code); setLangMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                          locale === code
                            ? "bg-brand-600/20 text-brand-400"
                            : "text-slate-300 hover:bg-dark-800 hover:text-white"
                        }`}
                      >
                        <span className="text-lg">{config.flag}</span>
                        <span>{config.label}</span>
                        {locale === code && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {user ? (
              <>
                {/* Balance */}
                <div className="flex items-center gap-1.5 px-3 py-2 bg-dark-800 rounded-lg border border-dark-700">
                  <Wallet size={14} className="text-accent-emerald" />
                  <span className="text-sm font-mono font-medium text-white">
                    ${user.balance.toFixed(2)}
                  </span>
                </div>

                {/* Notifications */}
                <button className="relative p-2 text-slate-400 hover:text-white hover:bg-dark-800 rounded-lg transition-all">
                  <Bell size={18} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-accent-rose rounded-full" />
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 glass-light rounded-xl border border-dark-700 hover:border-brand-600/50 transition-all"
                  >
                    <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-xs font-bold text-white">
                      {user.username[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-slate-200">{user.username}</span>
                    <ChevronDown size={12} className="text-slate-400" />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 glass rounded-xl border border-dark-700 overflow-hidden shadow-2xl"
                      >
                        <div className="px-4 py-3 border-b border-dark-700">
                          <p className="text-sm font-semibold text-white">{user.username}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>

                        <div className="py-1">
                          <Link
                            href={`/${locale}/profile`}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-dark-800 hover:text-white transition-colors"
                          >
                            <User size={15} /> {t("profile")}
                          </Link>

                          {(user.role === "seller" || user.role === "admin") && (
                            <Link
                              href={`/${locale}/seller/dashboard`}
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-dark-800 hover:text-white transition-colors"
                            >
                              <LayoutDashboard size={15} /> {t("dashboard")}
                            </Link>
                          )}

                          {user.role === "admin" && (
                            <Link
                              href={`/${locale}/admin/dashboard`}
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-dark-800 hover:text-white transition-colors"
                            >
                              <ShieldCheck size={15} /> {t("admin")}
                            </Link>
                          )}
                        </div>

                        <div className="border-t border-dark-700 py-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-accent-rose hover:bg-dark-800 transition-colors"
                          >
                            <LogOut size={15} /> {t("logout")}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href={`/${locale}/auth/login`} className="btn-ghost text-sm">
                  {t("login")}
                </Link>
                <Link href={`/${locale}/auth/register`} className="btn-primary text-sm py-2 px-4">
                  {t("register")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-dark-800 rounded-lg transition-all"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-dark-800"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-dark-800 transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {!user ? (
                <div className="flex gap-2 pt-2">
                  <Link
                    href={`/${locale}/auth/login`}
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 btn-secondary text-sm py-2"
                  >
                    {t("login")}
                  </Link>
                  <Link
                    href={`/${locale}/auth/register`}
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 btn-primary text-sm py-2"
                  >
                    {t("register")}
                  </Link>
                </div>
              ) : (
                <div className="pt-2 border-t border-dark-800">
                  <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-dark-800 rounded-xl">
                    <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center font-bold text-white">
                      {user.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{user.username}</p>
                      <p className="text-xs text-slate-400">${user.balance.toFixed(2)}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-accent-rose hover:bg-dark-800 rounded-lg transition-colors"
                  >
                    <LogOut size={15} /> {t("logout")}
                  </button>
                </div>
              )}

              {/* Language switcher mobile */}
              <div className="pt-2 border-t border-dark-800">
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(localeConfig).map(([code, config]) => (
                    <button
                      key={code}
                      onClick={() => switchLocale(code)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        locale === code
                          ? "bg-brand-600/20 text-brand-400 border border-brand-600/30"
                          : "text-slate-400 hover:bg-dark-800 hover:text-white"
                      }`}
                    >
                      <span>{config.flag}</span>
                      <span>{config.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
