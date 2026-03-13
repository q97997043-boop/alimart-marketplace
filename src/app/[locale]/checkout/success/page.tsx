"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { CheckCircle, Key, Copy, ArrowRight, Package } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!sessionId) { router.push(`/${locale}`); return; }

    // Poll for order fulfillment
    const poll = async () => {
      const res = await fetch(`/api/orders/by-session?session_id=${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.status === "delivered") {
          setOrder(data);
          setLoading(false);
          return;
        }
      }
      setTimeout(poll, 1500);
    };

    poll();
  }, [sessionId, locale, router]);

  const copyKeys = () => {
    if (order?.delivered_keys) {
      navigator.clipboard.writeText(order.delivered_keys.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark-950">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-lg"
      >
        {loading ? (
          <div className="glass rounded-3xl border border-dark-700 p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-600/10 border border-brand-600/20 flex items-center justify-center mx-auto mb-6">
              <Package size={28} className="text-brand-400 animate-pulse" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-2">Delivering your product...</h2>
            <p className="text-slate-400 mb-6">Payment confirmed. Preparing your keys.</p>
            <div className="flex justify-center">
              <div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
            </div>
          </div>
        ) : (
          <div className="glass rounded-3xl border border-dark-700 p-10 text-center">
            {/* Success icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
              className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle size={36} className="text-emerald-400" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h1 className="font-display text-3xl font-bold text-white mb-2">
                Payment Successful!
              </h1>
              <p className="text-slate-400 mb-8">
                Your {order?.quantity > 1 ? `${order.quantity} keys have` : "key has"} been delivered instantly.
              </p>
            </motion.div>

            {/* Keys */}
            {order?.delivered_keys?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-dark-800 rounded-2xl border border-dark-700 p-5 mb-6 text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                    <Key size={14} className="text-brand-400" />
                    {order.delivered_keys.length === 1 ? "Activation Key" : `${order.delivered_keys.length} Keys`}
                  </div>
                  <button
                    onClick={copyKeys}
                    className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors"
                  >
                    <Copy size={12} />
                    {copied ? "Copied!" : "Copy all"}
                  </button>
                </div>
                <div className="space-y-2">
                  {order.delivered_keys.map((key: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 p-3 bg-dark-900 rounded-xl border border-dark-700">
                      <code className="flex-1 font-mono text-sm text-white tracking-wider">{key}</code>
                      <button
                        onClick={() => navigator.clipboard.writeText(key)}
                        className="text-slate-500 hover:text-brand-400 transition-colors"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xs text-slate-600 mb-6"
            >
              Keys saved in your order history · Confirmation sent to your email
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-3"
            >
              <Link href={`/${locale}/profile`} className="flex-1 btn-secondary text-sm py-3 justify-center">
                My Orders
              </Link>
              <Link href={`/${locale}/marketplace`} className="flex-1 btn-primary text-sm py-3 justify-center">
                Keep Shopping <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
