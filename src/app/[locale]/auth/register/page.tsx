"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Zap, ArrowRight, AlertCircle, CheckCircle, Store } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const isSeller = searchParams.get("seller") === "true";

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: isSeller ? "seller" : "buyer",
    sellerName: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const update = (key: string, val: string) => setFormData((p) => ({ ...p, [key]: val }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: { username: formData.username, role: formData.role },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // Insert user profile
      await supabase.from("users").insert({
        id: data.user.id,
        email: formData.email,
        username: formData.username,
        role: formData.role as "buyer" | "seller",
        is_verified: false,
        is_banned: false,
        balance: 0,
      });

      // If seller, create seller profile
      if (formData.role === "seller") {
        const { data: userRow } = await supabase.from("users").select("id").eq("id", data.user.id).single();
        if (userRow) {
          await supabase.from("seller_profiles").insert({
            user_id: data.user.id,
            display_name: formData.sellerName || formData.username,
            commission_rate: 0.10,
            is_verified: false,
          });
        }
      }
    }

    setSuccess(true);
    setLoading(false);
  };

  const passwordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = passwordStrength(formData.password);
  const strengthColors = ["", "bg-rose-500", "bg-amber-500", "bg-yellow-400", "bg-emerald-500"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl border border-dark-700 p-10 text-center max-w-md w-full"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-emerald-400" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-2">Account Created!</h2>
          <p className="text-slate-400 mb-6">
            Check your email to verify your account, then sign in to start shopping.
          </p>
          <Link href={`/${locale}/auth/login`} className="btn-primary w-full justify-center">
            Go to Sign In <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-1/4 right-1/3 w-72 h-72 bg-brand-600/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br brand-600 flex items-center justify-center glow-brand">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-display text-2xl font-bold text-white">AliMart</span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-white">{t("register_title")}</h1>
          <p className="text-slate-500 mt-2">{t("register_subtitle")}</p>
        </div>

        <div className="glass rounded-2xl border border-dark-700 p-8">
          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-dark-800 rounded-xl">
            {[
              { value: "buyer",  label: "Buyer",  icon: User },
              { value: "seller", label: "Seller", icon: Store },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => update("role", value)}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  formData.role === value
                    ? "bg-brand-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-400 mb-4">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">{t("email")}</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="email" value={formData.email} onChange={(e) => update("email", e.target.value)} placeholder="your@email.com" required className="input-field pl-10" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">{t("username")}</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="text" value={formData.username} onChange={(e) => update("username", e.target.value)} placeholder="cooluser99" required className="input-field pl-10" />
              </div>
            </div>

            {formData.role === "seller" && (
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Store Name</label>
                <div className="relative">
                  <Store size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="text" value={formData.sellerName} onChange={(e) => update("sellerName", e.target.value)} placeholder="Your Store Name" className="input-field pl-10" />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">{t("password")}</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  className="input-field pl-10 pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < strength ? strengthColors[strength] : "bg-dark-700"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">{strengthLabels[strength]}</p>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Confirm Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                  placeholder="Repeat password"
                  required
                  className={`input-field pl-10 ${formData.confirmPassword && formData.password !== formData.confirmPassword ? "border-rose-500" : ""}`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 mt-2 glow-brand disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {t("register_btn")} <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          {t("have_account")}{" "}
          <Link href={`/${locale}/auth/login`} className="text-brand-400 hover:text-brand-300 font-medium">
            {t("login_btn")}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
