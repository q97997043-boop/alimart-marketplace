"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Shield, Zap, Lock, CheckCircle, CreditCard, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");
  const qty = Number(searchParams.get("qty") || "1");

  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [deliveredKey, setDeliveredKey] = useState<string | null>(null);

  // Demo product info
  const product = {
    title: "Counter-Strike 2 Prime Status Upgrade",
    price: 4.99,
    type: "key",
    seller: "GameZone Store",
  };

  const total = product.price * qty;
  const fee = 0; // buyers don't pay fee
  const finalTotal = total + fee;

  const handleCheckout = async () => {
    setLoading(true);
    // In production: call /api/checkout/create-session → Stripe
    await new Promise((r) => setTimeout(r, 2000));
    // Simulate successful payment + key delivery
    setDeliveredKey("XXXXX-YYYYY-ZZZZZ-AAAAA-BBBBB");
    setPaid(true);
    setLoading(false);
  };

  if (paid && deliveredKey) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-16 flex items-center justify-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center"
          >
            <div className="glass rounded-3xl border border-dark-700 p-10">
              <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={36} className="text-emerald-400" />
              </div>
              <h1 className="font-display text-3xl font-bold text-white mb-2">Payment Successful!</h1>
              <p className="text-slate-400 mb-8">Your product has been delivered instantly</p>

              <div className="bg-dark-800 rounded-2xl border border-dark-700 p-5 mb-6">
                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Your Activation Key</p>
                <div className="flex items-center gap-3">
                  <code className="flex-1 font-mono text-lg font-bold text-white tracking-widest text-center">
                    {deliveredKey}
                  </code>
                  <button
                    onClick={() => { navigator.clipboard.writeText(deliveredKey); }}
                    className="p-2 rounded-lg bg-brand-600/10 text-brand-400 hover:bg-brand-600/20 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                    </svg>
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 mb-6">
                This key has also been sent to your email and saved in your order history
              </p>

              <div className="flex gap-3">
                <Link href={`/${locale}/profile`} className="flex-1 btn-secondary text-sm py-2.5 justify-center">
                  View Orders
                </Link>
                <Link href={`/${locale}/marketplace`} className="flex-1 btn-primary text-sm py-2.5 justify-center">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <button onClick={() => router.back()} className="flex items-center gap-1 hover:text-white transition-colors">
              <ArrowLeft size={14} /> Back
            </button>
            <span>/</span>
            <span className="text-slate-300">Checkout</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2 space-y-4">
              <div className="glass rounded-2xl border border-dark-700 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <CreditCard size={18} className="text-brand-400" />
                  <h2 className="font-semibold text-white">Payment Details</h2>
                  <div className="ml-auto flex items-center gap-1 text-xs text-slate-500">
                    <Lock size={11} />
                    SSL Secured
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="input-field font-mono tracking-wider"
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">Expiry Date</label>
                      <input type="text" placeholder="MM / YY" className="input-field" maxLength={7} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">CVV</label>
                      <input type="text" placeholder="•••" className="input-field font-mono" maxLength={4} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Cardholder Name</label>
                    <input type="text" placeholder="John Doe" className="input-field" />
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-dark-800 border border-dark-700 text-xs text-slate-500 flex items-center gap-2">
                  <Shield size={12} className="text-emerald-400 flex-shrink-0" />
                  Your payment is processed securely by Stripe. We never store your card details.
                </div>
              </div>

              {/* Alternative payment */}
              <div className="glass rounded-2xl border border-dark-700 p-5">
                <p className="text-sm text-slate-400 mb-3">Or pay with</p>
                <div className="flex gap-3">
                  {["PayPal", "Google Pay", "Apple Pay"].map((method) => (
                    <button
                      key={method}
                      className="flex-1 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-xs font-medium text-slate-400 hover:border-brand-600/40 hover:text-white transition-all"
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <div className="glass rounded-2xl border border-dark-700 p-6 sticky top-20">
                <h3 className="font-semibold text-white mb-4">Order Summary</h3>

                <div className="flex items-start gap-3 pb-4 border-b border-dark-800 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600/30 to-accent-cyan/20 flex items-center justify-center flex-shrink-0 text-2xl">
                    🎮
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white leading-tight">{product.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">by {product.seller}</p>
                    <p className="text-xs text-slate-500">Qty: {qty}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal ({qty}x)</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Platform fee</span>
                    <span className="text-emerald-400">Free</span>
                  </div>
                  <div className="flex justify-between font-semibold text-white text-base pt-2 border-t border-dark-800">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full btn-primary py-4 glow-brand disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Lock size={15} />
                      Pay ${finalTotal.toFixed(2)}
                    </span>
                  )}
                </button>

                {/* Trust */}
                <div className="mt-4 space-y-2">
                  {[
                    { icon: Zap, text: "Key delivered instantly after payment" },
                    { icon: Shield, text: "Buyer protection guarantee" },
                    { icon: CheckCircle, text: "Verified seller product" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 text-xs text-slate-500">
                      <Icon size={12} className="text-brand-400 flex-shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
