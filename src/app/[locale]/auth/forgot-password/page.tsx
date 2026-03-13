"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Mail, Zap, ArrowLeft, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const locale   = useLocale();
  const supabase = createClient();

  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/${locale}/auth/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-brand-600/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br bg-brand-600 flex items-center justify-center glow-brand">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-display text-2xl font-bold text-white">AliMart</span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-white">Reset Password</h1>
          <p className="text-slate-500 mt-2">Enter your email to receive a reset link</p>
        </div>

        <div className="glass rounded-2xl border border-dark-700 p-8">
          {sent ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={24} className="text-emerald-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Check your email</h3>
              <p className="text-sm text-slate-400 mb-6">
                We sent a password reset link to <strong className="text-white">{email}</strong>
              </p>
              <Link href={`/${locale}/auth/login`} className="btn-secondary w-full justify-center">
                Back to Sign In
              </Link>
            </motion.div>
          ) : (
            <>
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-400 mb-4">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Email Address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 glow-brand disabled:opacity-60">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : "Send Reset Link"}
                </button>
              </form>
            </>
          )}
        </div>

        <div className="text-center mt-6">
          <Link href={`/${locale}/auth/login`} className="flex items-center justify-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors">
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
