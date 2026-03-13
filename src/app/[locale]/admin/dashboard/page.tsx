"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Package, ShoppingCart, DollarSign, ShieldCheck,
  TrendingUp, AlertTriangle, CheckCircle, XCircle,
  BarChart2, Settings, Ban, Eye, Search
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line
} from "recharts";

const MONTHLY_DATA = [
  { month: "Jan", revenue: 12400, commission: 1240, orders: 380 },
  { month: "Feb", revenue: 18600, commission: 1860, orders: 520 },
  { month: "Mar", revenue: 15200, commission: 1520, orders: 410 },
  { month: "Apr", revenue: 24800, commission: 2480, orders: 690 },
  { month: "May", revenue: 31200, commission: 3120, orders: 890 },
  { month: "Jun", revenue: 28900, commission: 2890, orders: 780 },
  { month: "Jul", revenue: 38600, commission: 3860, orders: 1040 },
];

const DEMO_USERS = [
  { id: "u1", username: "alex_99",   email: "alex@example.com",  role: "buyer",  joined: "2024-01-15", orders: 12,  status: "active" },
  { id: "u2", username: "maria_k",   email: "maria@example.com", role: "seller", joined: "2024-02-20", orders: 89,  status: "active" },
  { id: "u3", username: "timur_u",   email: "timur@example.com", role: "seller", joined: "2024-01-05", orders: 234, status: "active" },
  { id: "u4", username: "priya_s",   email: "priya@example.com", role: "buyer",  joined: "2024-03-10", orders: 4,   status: "banned" },
  { id: "u5", username: "john_d",    email: "john@example.com",  role: "buyer",  joined: "2024-04-01", orders: 7,   status: "active" },
];

const DEMO_PRODUCTS = [
  { id: "p1", title: "CS2 Prime Key",    seller: "GameZone", price: 4.99,  status: "active",  sales: 204,  flagged: false },
  { id: "p2", title: "Netflix Account",  seller: "SubHub",   price: 11.99, status: "active",  sales: 156,  flagged: false },
  { id: "p3", title: "Hacked Account",   seller: "BadActor", price: 0.99,  status: "pending", sales: 2,    flagged: true },
  { id: "p4", title: "Spotify Premium",  seller: "DigStore", price: 9.99,  status: "active",  sales: 98,   flagged: false },
];

type Tab = "overview" | "users" | "sellers" | "products" | "settings";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [userSearch, setUserSearch] = useState("");

  const stats = [
    { label: "Total Users",    value: "12,400", change: "+340 this week", icon: Users, color: "text-brand-400", bg: "bg-brand-400/10" },
    { label: "Active Sellers", value: "1,248",  change: "+28 this week",  icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Total Products", value: "89,412", change: "+1,204 today",   icon: Package, color: "text-cyan-400", bg: "bg-cyan-400/10" },
    { label: "Platform Revenue", value: "$38,600", change: "↑ +26% MoM", icon: DollarSign, color: "text-amber-400", bg: "bg-amber-400/10" },
  ];

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "overview",  label: "Overview",  icon: BarChart2 },
    { id: "users",     label: "Users",     icon: Users },
    { id: "sellers",   label: "Sellers",   icon: ShieldCheck },
    { id: "products",  label: "Products",  icon: Package },
    { id: "settings",  label: "Settings",  icon: Settings },
  ];

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      active:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      banned:  "bg-rose-500/10 text-rose-400 border-rose-500/20",
      pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    };
    return `badge border ${map[status] || map.pending}`;
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={20} className="text-brand-400" />
                <h1 className="font-display text-3xl font-bold text-white">Admin Dashboard</h1>
              </div>
              <p className="text-slate-500">Platform management & moderation</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <AlertTriangle size={14} className="text-rose-400" />
              <span className="text-sm text-rose-400 font-medium">3 items need review</span>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Sidebar */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <nav className="glass rounded-2xl border border-dark-700 p-2 space-y-1 sticky top-20">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeTab === id
                        ? "bg-brand-600/20 text-brand-300 border border-brand-600/30"
                        : "text-slate-400 hover:text-white hover:bg-dark-800"
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* ── Overview ── */}
              {activeTab === "overview" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map(({ label, value, change, icon: Icon, color, bg }, i) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="stat-card"
                      >
                        <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                          <Icon size={16} className={color} />
                        </div>
                        <p className="font-display text-2xl font-bold text-white">{value}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                        <p className="text-xs text-emerald-400 mt-1">{change}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Revenue & Commission Chart */}
                  <div className="glass rounded-2xl border border-dark-700 p-6">
                    <h3 className="font-semibold text-white mb-6">Revenue & Commission</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={MONTHLY_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, color: "#f1f5f9" }}
                          formatter={(v, n) => [`$${v}`, n === "revenue" ? "Revenue" : "Commission"]}
                        />
                        <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="commission" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Flagged Products */}
                  <div className="glass rounded-2xl border border-dark-700 p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle size={16} className="text-amber-400" />
                      <h3 className="font-semibold text-white">Flagged Products</h3>
                      <span className="badge bg-amber-500/10 text-amber-400 border border-amber-500/20 ml-auto">
                        Needs review
                      </span>
                    </div>
                    {DEMO_PRODUCTS.filter((p) => p.flagged).map((p) => (
                      <div key={p.id} className="flex items-center gap-4 py-3 border-t border-dark-800">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{p.title}</p>
                          <p className="text-xs text-slate-500">Seller: {p.seller} · ${p.price}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="btn-ghost text-xs py-1.5 px-3 text-emerald-400">
                            <CheckCircle size={13} /> Approve
                          </button>
                          <button className="btn-ghost text-xs py-1.5 px-3 text-rose-400">
                            <XCircle size={13} /> Ban
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── Users ── */}
              {activeTab === "users" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div className="glass rounded-2xl border border-dark-700 overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-dark-800">
                          {["User","Email","Role","Joined","Orders","Status","Actions"].map((h) => (
                            <th key={h} className="text-left text-xs font-medium text-slate-500 px-5 py-3">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-800">
                        {DEMO_USERS
                          .filter((u) => !userSearch || u.username.includes(userSearch) || u.email.includes(userSearch))
                          .map((user) => (
                            <tr key={user.id} className="hover:bg-dark-800/50 transition-colors">
                              <td className="px-5 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br brand-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                    {user.username[0].toUpperCase()}
                                  </div>
                                  <span className="text-sm font-medium text-white">{user.username}</span>
                                </div>
                              </td>
                              <td className="px-5 py-3 text-xs text-slate-400">{user.email}</td>
                              <td className="px-5 py-3">
                                <span className={`badge text-xs ${user.role === "seller" ? "bg-brand-600/20 text-brand-400 border border-brand-600/30" : "bg-dark-800 text-slate-400 border border-dark-700"}`}>
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-5 py-3 text-xs text-slate-500">{user.joined}</td>
                              <td className="px-5 py-3 text-sm text-white">{user.orders}</td>
                              <td className="px-5 py-3"><span className={statusBadge(user.status)}>{user.status}</span></td>
                              <td className="px-5 py-3">
                                <div className="flex gap-1">
                                  <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-700 transition-colors">
                                    <Eye size={13} />
                                  </button>
                                  <button className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-dark-700 transition-colors">
                                    <Ban size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* ── Products ── */}
              {activeTab === "products" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="glass rounded-2xl border border-dark-700 overflow-hidden">
                    <div className="p-5 border-b border-dark-800 flex items-center justify-between">
                      <h3 className="font-semibold text-white">All Products</h3>
                      <span className="text-xs text-slate-500">{DEMO_PRODUCTS.length} total</span>
                    </div>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-dark-800">
                          {["Product","Seller","Price","Sales","Status","Actions"].map((h) => (
                            <th key={h} className="text-left text-xs font-medium text-slate-500 px-5 py-3">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-800">
                        {DEMO_PRODUCTS.map((p) => (
                          <tr key={p.id} className={`hover:bg-dark-800/50 transition-colors ${p.flagged ? "bg-amber-500/5" : ""}`}>
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2">
                                {p.flagged && <AlertTriangle size={13} className="text-amber-400 flex-shrink-0" />}
                                <span className="text-sm font-medium text-white">{p.title}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3 text-xs text-slate-400">{p.seller}</td>
                            <td className="px-5 py-3 text-sm text-white">${p.price}</td>
                            <td className="px-5 py-3 text-sm text-slate-400">{p.sales}</td>
                            <td className="px-5 py-3"><span className={statusBadge(p.status)}>{p.status}</span></td>
                            <td className="px-5 py-3">
                              <div className="flex gap-1">
                                <button className="p-1.5 rounded-lg text-emerald-400 hover:bg-dark-700 transition-colors text-xs">
                                  <CheckCircle size={13} />
                                </button>
                                <button className="p-1.5 rounded-lg text-rose-400 hover:bg-dark-700 transition-colors text-xs">
                                  <XCircle size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* ── Settings (commission) ── */}
              {activeTab === "settings" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl border border-dark-700 p-6">
                  <h3 className="font-semibold text-white mb-6">Platform Settings</h3>
                  <div className="space-y-6 max-w-lg">
                    {[
                      { label: "Default Commission Rate", value: "10", suffix: "%", desc: "Platform fee on each sale" },
                      { label: "Minimum Withdrawal", value: "10", prefix: "$", desc: "Minimum amount sellers can withdraw" },
                      { label: "Dispute Window (days)", value: "3", suffix: " days", desc: "How long buyers can open disputes" },
                    ].map(({ label, value, prefix, suffix, desc }) => (
                      <div key={label}>
                        <label className="text-sm font-medium text-slate-300 mb-1 block">{label}</label>
                        <p className="text-xs text-slate-500 mb-2">{desc}</p>
                        <div className="flex items-center">
                          {prefix && <span className="px-3 py-2.5 bg-dark-700 border border-r-0 border-dark-600 rounded-l-xl text-sm text-slate-400">{prefix}</span>}
                          <input
                            type="number"
                            defaultValue={value}
                            className={`flex-1 px-4 py-2.5 bg-dark-800 border border-dark-700 text-white text-sm focus:outline-none focus:border-brand-500 ${prefix ? "rounded-none" : "rounded-xl"} ${suffix ? "rounded-none" : "rounded-xl"}`}
                          />
                          {suffix && <span className="px-3 py-2.5 bg-dark-700 border border-l-0 border-dark-600 rounded-r-xl text-sm text-slate-400">{suffix}</span>}
                        </div>
                      </div>
                    ))}
                    <button className="btn-primary">Save Settings</button>
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
