"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import {
  User, Mail, Clock, Package, Star, Shield, Edit2,
  CheckCircle, Copy, Key, ChevronRight, Wallet
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/client";

const DEMO_ORDERS = [
  { id: "ORD-8821", product: "CS2 Prime Key",     price: 4.99,  status: "delivered", date: "2024-07-10", keys: ["AXXXX-BXXXX-CXXXX"] },
  { id: "ORD-8756", product: "Netflix Premium 3m", price: 34.99, status: "delivered", date: "2024-06-28", keys: ["SUB:alex@example.com:Pass123!"] },
  { id: "ORD-8701", product: "Spotify 1 Month",   price: 9.99,  status: "delivered", date: "2024-06-15", keys: ["DXXXX-EXXXX-FXXXX"] },
  { id: "ORD-8650", product: "NordVPN 2yr",        price: 29.99, status: "refunded",  date: "2024-06-01", keys: [] },
];

export default function ProfilePage() {
  const locale = useLocale();
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<"orders" | "settings" | "security">("orders");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [user] = useState({
    username: "alex_99",
    email: "alex@example.com",
    joined: "January 2024",
    balance: 12.50,
    totalOrders: 4,
    is_verified: true,
    country: "US",
    locale: "en",
  });

  const copyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      refunded:  "bg-rose-500/10 text-rose-400 border-rose-500/20",
      pending:   "bg-amber-500/10 text-amber-400 border-amber-500/20",
    };
    return `badge border ${map[status] || map.pending}`;
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Profile Header */}
          <div className="glass rounded-2xl border border-dark-700 p-6 mb-6">
            <div className="flex items-start gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br brand-600 flex items-center justify-center text-3xl font-bold text-white glow-brand">
                  {user.username[0].toUpperCase()}
                </div>
                {user.is_verified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-dark-900 flex items-center justify-center border-2 border-dark-900">
                    <Shield size={12} className="text-brand-400" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="font-display text-2xl font-bold text-white">{user.username}</h1>
                    <p className="text-slate-500 text-sm">{user.email}</p>
                    <p className="text-xs text-slate-600 mt-1">Member since {user.joined}</p>
                  </div>
                  <button className="btn-ghost text-xs py-2">
                    <Edit2 size={13} /> Edit Profile
                  </button>
                </div>

                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Wallet size={14} className="text-emerald-400" />
                    <span className="text-sm font-semibold text-white">${user.balance.toFixed(2)}</span>
                    <span className="text-xs text-slate-500">balance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package size={14} className="text-brand-400" />
                    <span className="text-sm font-semibold text-white">{user.totalOrders}</span>
                    <span className="text-xs text-slate-500">orders</span>
                  </div>
                  {user.is_verified && (
                    <div className="flex items-center gap-1.5">
                      <CheckCircle size={13} className="text-brand-400" />
                      <span className="text-xs text-brand-400 font-medium">Verified account</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 glass rounded-xl border border-dark-700 p-1 w-fit">
            {(["orders", "settings", "security"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  activeTab === tab
                    ? "bg-brand-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab === "orders" ? "Order History" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              {DEMO_ORDERS.map((order) => (
                <div key={order.id} className="glass rounded-2xl border border-dark-700 p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600/20 to-accent-cyan/10 flex items-center justify-center text-xl flex-shrink-0">
                      🎮
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="font-medium text-white">{order.product}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                            <span className="font-mono">{order.id}</span>
                            <span>·</span>
                            <span>{order.date}</span>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1 flex-shrink-0">
                          <span className="font-semibold text-white">${order.price.toFixed(2)}</span>
                          <span className={statusBadge(order.status)}>{order.status}</span>
                        </div>
                      </div>

                      {order.keys.length > 0 && (
                        <div className="mt-3">
                          {order.keys.map((key, i) => (
                            <div key={i} className="flex items-center gap-2 bg-dark-800 rounded-xl px-4 py-2.5 border border-dark-700">
                              <Key size={12} className="text-brand-400 flex-shrink-0" />
                              <code className="flex-1 text-xs font-mono text-slate-300 truncate">{key}</code>
                              <button
                                onClick={() => copyKey(key, `${order.id}-${i}`)}
                                className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-colors flex-shrink-0"
                              >
                                {copiedId === `${order.id}-${i}` ? (
                                  <><CheckCircle size={11} /> Copied</>
                                ) : (
                                  <><Copy size={11} /> Copy</>
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl border border-dark-700 p-6 max-w-lg">
              <h3 className="font-semibold text-white mb-6">Profile Settings</h3>
              <div className="space-y-4">
                {[
                  { label: "Username", value: user.username, type: "text" },
                  { label: "Email",    value: user.email,    type: "email" },
                  { label: "Country",  value: user.country,  type: "text" },
                ].map(({ label, value, type }) => (
                  <div key={label}>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">{label}</label>
                    <input type={type} defaultValue={value} className="input-field" />
                  </div>
                ))}

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Preferred Language</label>
                  <select className="input-field">
                    {[["en","English"],["ru","Russian"],["uz","Uzbek"],["tr","Turkish"]].map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>

                <button className="btn-primary">Save Changes</button>
              </div>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl border border-dark-700 p-6 max-w-lg">
              <h3 className="font-semibold text-white mb-6">Security</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Current Password</label>
                  <input type="password" placeholder="••••••••" className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">New Password</label>
                  <input type="password" placeholder="Min. 8 characters" className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Confirm New Password</label>
                  <input type="password" placeholder="Repeat password" className="input-field" />
                </div>
                <button className="btn-primary">Update Password</button>
              </div>

              <div className="mt-8 pt-6 border-t border-dark-800">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                    <p className="text-xs text-slate-500">Add an extra layer of security</p>
                  </div>
                  <button className="px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-xs text-slate-300 hover:text-white hover:border-brand-600/40 transition-all">
                    Enable
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
