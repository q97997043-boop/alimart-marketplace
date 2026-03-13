"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingCart, BarChart2, Plus,
  TrendingUp, DollarSign, Eye, Upload, Settings, ChevronRight,
  Star, AlertCircle, CheckCircle, Clock, Zap
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const REVENUE_DATA = [
  { month: "Jan", revenue: 420, orders: 38 },
  { month: "Feb", revenue: 680, orders: 52 },
  { month: "Mar", revenue: 580, orders: 45 },
  { month: "Apr", revenue: 920, orders: 78 },
  { month: "May", revenue: 1240, orders: 102 },
  { month: "Jun", revenue: 1080, orders: 89 },
  { month: "Jul", revenue: 1560, orders: 134 },
];

const RECENT_ORDERS = [
  { id: "ORD-001", product: "CS2 Prime Key", buyer: "alex_99", amount: 4.99, status: "delivered", time: "2 min ago" },
  { id: "ORD-002", product: "Netflix 3mo",   buyer: "maria_k",  amount: 34.99, status: "delivered", time: "14 min ago" },
  { id: "ORD-003", product: "Steam $20",     buyer: "john_d",   amount: 18.99, status: "pending",   time: "1 hr ago" },
  { id: "ORD-004", product: "NordVPN 2yr",   buyer: "priya_s",  amount: 29.99, status: "delivered", time: "3 hr ago" },
  { id: "ORD-005", product: "Spotify 1mo",   buyer: "timur_u",  amount: 9.99,  status: "refunded",  time: "5 hr ago" },
];

const TOP_PRODUCTS = [
  { title: "CS2 Prime Key",    sold: 204, revenue: 1018.0, rating: 4.9, stock: 47 },
  { title: "Netflix Premium",  sold: 156, revenue: 5461.44, rating: 4.8, stock: 12 },
  { title: "Spotify Premium",  sold: 98,  revenue: 979.02, rating: 4.7, stock: 32 },
  { title: "Steam Wallet $20", sold: 77,  revenue: 1462.23, rating: 4.6, stock: 100 },
];

type Tab = "overview" | "products" | "orders" | "upload" | "settings";

export default function SellerDashboard() {
  const t = useTranslations("seller");
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [uploadText, setUploadText] = useState("");
  const [uploadProductId, setUploadProductId] = useState("");

  const stats = [
    { label: t("total_revenue"),    value: "$8,901.69", change: "+18%",  icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: t("total_orders"),     value: "535",        change: "+12%",  icon: ShoppingCart, color: "text-brand-400", bg: "bg-brand-400/10" },
    { label: t("active_products"),  value: "14",         change: "+2",    icon: Package, color: "text-cyan-400", bg: "bg-cyan-400/10" },
    { label: t("pending_balance"),  value: "$240.50",    change: "Payout Friday", icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
  ];

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "overview",  label: "Overview",  icon: LayoutDashboard },
    { id: "products",  label: "Products",  icon: Package },
    { id: "orders",    label: "Orders",    icon: ShoppingCart },
    { id: "upload",    label: "Upload Keys", icon: Upload },
    { id: "settings",  label: "Settings",  icon: Settings },
  ];

  const handleBulkUpload = () => {
    const keys = uploadText.split("\n").filter((k) => k.trim());
    if (!uploadProductId || keys.length === 0) return;
    // In production: POST to /api/seller/keys
    alert(`${keys.length} keys would be uploaded for product ${uploadProductId}`);
    setUploadText("");
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      pending:   "bg-amber-500/10 text-amber-400 border-amber-500/20",
      refunded:  "bg-rose-500/10 text-rose-400 border-rose-500/20",
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
              <h1 className="font-display text-3xl font-bold text-white">{t("dashboard")}</h1>
              <p className="text-slate-500 mt-1">Welcome back, GameZone Store</p>
            </div>
            <button className="btn-primary">
              <Plus size={16} /> {t("add_product")}
            </button>
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

            {/* Mobile tabs */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 w-full mb-4 flex-shrink-0">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                    activeTab === id
                      ? "bg-brand-600 text-white"
                      : "bg-dark-800 border border-dark-700 text-slate-400"
                  }`}
                >
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* ── Overview ── */}
              {activeTab === "overview" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map(({ label, value, change, icon: Icon, color, bg }, i) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="stat-card"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                            <Icon size={16} className={color} />
                          </div>
                          <span className="text-xs text-emerald-400 font-medium">{change}</span>
                        </div>
                        <p className="font-display text-2xl font-bold text-white">{value}</p>
                        <p className="text-xs text-slate-500">{label}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Revenue Chart */}
                  <div className="glass rounded-2xl border border-dark-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold text-white">{t("statistics")}</h3>
                      <select className="text-xs bg-dark-800 border border-dark-700 rounded-lg px-3 py-1.5 text-slate-400">
                        <option>Last 7 months</option>
                        <option>Last 30 days</option>
                        <option>Last year</option>
                      </select>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={REVENUE_DATA}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, color: "#f1f5f9" }}
                          formatter={(v) => [`$${v}`, "Revenue"]}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#colorRevenue)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Top Products + Recent Orders grid */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Top Products */}
                    <div className="glass rounded-2xl border border-dark-700 p-5">
                      <h3 className="font-semibold text-white mb-4">Top Products</h3>
                      <div className="space-y-3">
                        {TOP_PRODUCTS.map((p, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-dark-800 flex items-center justify-center text-xs font-bold text-slate-400">
                              {i + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">{p.title}</p>
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span>{p.sold} sold</span>
                                <span>·</span>
                                <Star size={10} className="text-amber-400 fill-amber-400" />
                                <span>{p.rating}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-emerald-400">${p.revenue.toFixed(0)}</p>
                              <p className="text-xs text-slate-600">{p.stock} left</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="glass rounded-2xl border border-dark-700 p-5">
                      <h3 className="font-semibold text-white mb-4">Recent Orders</h3>
                      <div className="space-y-3">
                        {RECENT_ORDERS.map((order) => (
                          <div key={order.id} className="flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">{order.product}</p>
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span>@{order.buyer}</span>
                                <span>·</span>
                                <span>{order.time}</span>
                              </div>
                            </div>
                            <div className="text-right flex flex-col items-end gap-1">
                              <span className="text-sm font-semibold text-white">${order.amount}</span>
                              <span className={statusBadge(order.status)}>{order.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Upload Keys ── */}
              {activeTab === "upload" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl border border-dark-700 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-brand-600/10 border border-brand-600/20 flex items-center justify-center">
                      <Upload size={18} className="text-brand-400" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-white">{t("upload_keys")}</h2>
                      <p className="text-sm text-slate-500">Upload activation keys in bulk (one per line)</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">Select Product</label>
                      <select
                        value={uploadProductId}
                        onChange={(e) => setUploadProductId(e.target.value)}
                        className="input-field"
                      >
                        <option value="">-- Choose product --</option>
                        {TOP_PRODUCTS.map((p, i) => (
                          <option key={i} value={String(i)}>{p.title}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 flex items-center justify-between">
                        Keys (one per line)
                        <span className="text-xs text-slate-500 font-normal">
                          {uploadText.split("\n").filter((k) => k.trim()).length} keys
                        </span>
                      </label>
                      <textarea
                        value={uploadText}
                        onChange={(e) => setUploadText(e.target.value)}
                        rows={10}
                        placeholder={"XXXXX-XXXXX-XXXXX\nYYYYY-YYYYY-YYYYY\nZZZZZ-ZZZZZ-ZZZZZ"}
                        className="input-field font-mono text-sm resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-400">
                      <AlertCircle size={13} />
                      Duplicate keys are automatically detected and rejected
                    </div>

                    <button
                      onClick={handleBulkUpload}
                      disabled={!uploadProductId || !uploadText.trim()}
                      className="btn-primary w-full disabled:opacity-50"
                    >
                      <Zap size={16} />
                      Upload {uploadText.split("\n").filter((k) => k.trim()).length || 0} Keys
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── Orders ── */}
              {activeTab === "orders" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl border border-dark-700 overflow-hidden">
                  <div className="p-5 border-b border-dark-800">
                    <h3 className="font-semibold text-white">All Orders</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-dark-800">
                          {["Order ID","Product","Buyer","Amount","Status","Time"].map((h) => (
                            <th key={h} className="text-left text-xs font-medium text-slate-500 px-5 py-3">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-800">
                        {RECENT_ORDERS.map((order) => (
                          <tr key={order.id} className="hover:bg-dark-800/50 transition-colors">
                            <td className="px-5 py-3 text-xs font-mono text-slate-400">{order.id}</td>
                            <td className="px-5 py-3 text-sm text-white">{order.product}</td>
                            <td className="px-5 py-3 text-sm text-slate-400">@{order.buyer}</td>
                            <td className="px-5 py-3 text-sm font-semibold text-white">${order.amount}</td>
                            <td className="px-5 py-3"><span className={statusBadge(order.status)}>{order.status}</span></td>
                            <td className="px-5 py-3 text-xs text-slate-500">{order.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* ── Products tab ── */}
              {activeTab === "products" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">My Products</h3>
                    <button className="btn-primary text-sm py-2 px-4"><Plus size={14} /> New Product</button>
                  </div>
                  <div className="glass rounded-2xl border border-dark-700 overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-dark-800">
                          {["Product","Price","Stock","Sold","Rating","Status",""].map((h) => (
                            <th key={h} className="text-left text-xs font-medium text-slate-500 px-5 py-3">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-800">
                        {TOP_PRODUCTS.map((p, i) => (
                          <tr key={i} className="hover:bg-dark-800/50 transition-colors">
                            <td className="px-5 py-3 text-sm font-medium text-white">{p.title}</td>
                            <td className="px-5 py-3 text-sm text-white">$4.99</td>
                            <td className="px-5 py-3">
                              <span className={`badge text-xs ${p.stock < 10 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-dark-800 text-slate-400"}`}>
                                {p.stock}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-sm text-slate-400">{p.sold}</td>
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-1 text-sm">
                                <Star size={11} className="text-amber-400 fill-amber-400" />
                                <span className="text-white">{p.rating}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3">
                              <span className="badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">Active</span>
                            </td>
                            <td className="px-5 py-3">
                              <button className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
                                Edit <ChevronRight size={12} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
