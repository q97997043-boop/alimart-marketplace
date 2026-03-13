"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, Store, Shield, DollarSign, ArrowRight, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

const PERKS = [
  { icon: DollarSign, title: "Low 10% Commission",   desc: "Keep 90% of every sale. No monthly fees." },
  { icon: Zap,        title: "Instant Key Delivery", desc: "Automated delivery system — zero manual work." },
  { icon: Shield,     title: "Seller Protection",    desc: "Dispute resolution and fraud prevention built in." },
  { icon: Store,      title: "Your Own Storefront",  desc: "Custom seller page to showcase your products." },
];

export default function BecomeSellerPage() {
  const locale = useLocale();
  const router = useRouter();

  const [step,       setStep]        = useState<1 | 2>(1);
  const [storeName,  setStoreName]   = useState("");
  const [agreed,     setAgreed]      = useState(false);
  const [loading,    setLoading]     = useState(false);
  const [error,      setError]       = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!storeName.trim() || !agreed) return;
    setLoading(true);
    setError(null);

    const res = await fetch("/api/seller/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ display_name: storeName.trim() }),
    });

    if (!res.ok) {
      const { error: err } = await res.json();
      setError(err || "Something went wrong");
      setLoading(false);
      return;
    }

    router.push(`/${locale}/seller/dashboard`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-600/10 border border-brand-600/20 text-brand-300 text-sm font-medium mb-5"
            >
              <Zap size={14} /> Start earning today
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Become a Seller on{" "}
              <span className="text-gradient">AliMart</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-lg max-w-xl mx-auto"
            >
              Join 12,000+ sellers. Upload digital products and start earning within minutes.
            </motion.p>
          </div>

          {/* Perks grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14"
          >
            {PERKS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass rounded-2xl border border-dark-700 p-5 text-center">
                <div className="w-10 h-10 rounded-xl bg-brand-600/10 border border-brand-600/20 flex items-center justify-center mx-auto mb-3">
                  <Icon size={18} className="text-brand-400" />
                </div>
                <p className="text-sm font-semibold text-white mb-1">{title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </motion.div>

          {/* Steps */}
          <div className="max-w-md mx-auto">
            <div className="glass rounded-2xl border border-dark-700 p-8">
              {/* Step indicators */}
              <div className="flex items-center gap-3 mb-8">
                {[1, 2].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? "bg-brand-600 text-white" : "bg-dark-800 border border-dark-700 text-slate-500"}`}>
                      {step > s ? <CheckCircle size={14} /> : s}
                    </div>
                    <span className={`text-xs font-medium ${step >= s ? "text-white" : "text-slate-600"}`}>
                      {s === 1 ? "Store Setup" : "Confirmation"}
                    </span>
                    {s < 2 && <div className="flex-1 h-px bg-dark-700 mx-1" />}
                  </div>
                ))}
              </div>

              {/* Step 1 */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="font-semibold text-white mb-1">Name your store</h2>
                  <p className="text-sm text-slate-500 mb-5">This will be shown to buyers on your listings.</p>

                  {error && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-400 mb-4">
                      {error}
                    </div>
                  )}

                  <div className="mb-5">
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Store Name</label>
                    <div className="relative">
                      <Store size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="e.g. GameZone Store"
                        className="input-field pl-10"
                        maxLength={50}
                      />
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{storeName.length}/50 characters</p>
                  </div>

                  <button
                    onClick={() => storeName.trim() && setStep(2)}
                    disabled={!storeName.trim()}
                    className="w-full btn-primary disabled:opacity-50"
                  >
                    Continue <ArrowRight size={15} />
                  </button>
                </motion.div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="font-semibold text-white mb-1">Review & Confirm</h2>
                  <p className="text-sm text-slate-500 mb-5">Review the seller terms before creating your account.</p>

                  <div className="bg-dark-800 rounded-xl p-4 mb-5 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Store name</span>
                      <span className="text-white font-medium">{storeName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Commission</span>
                      <span className="text-emerald-400 font-medium">10%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Minimum payout</span>
                      <span className="text-white font-medium">$10.00</span>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 mb-6 cursor-pointer">
                    <div
                      onClick={() => setAgreed(!agreed)}
                      className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border transition-all ${agreed ? "bg-brand-600 border-brand-600" : "bg-dark-800 border-dark-600"}`}
                    >
                      {agreed && <CheckCircle size={12} className="text-white" />}
                    </div>
                    <span className="text-sm text-slate-400 leading-relaxed">
                      I agree to the{" "}
                      <a href="#" className="text-brand-400 hover:underline">Seller Terms of Service</a>
                      {" "}and{" "}
                      <a href="#" className="text-brand-400 hover:underline">Commission Policy</a>
                    </span>
                  </label>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="btn-secondary flex-1">
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!agreed || loading}
                      className="btn-primary flex-1 glow-brand disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Creating...
                        </span>
                      ) : (
                        <>Create Seller Account <ArrowRight size={15} /></>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
