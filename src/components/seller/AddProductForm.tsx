"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Package, DollarSign, Tag, Image, ChevronDown, X, Plus, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import type { ProductType } from "@/types";

const CATEGORIES = [
  { id: "games",         name: "Games",          icon: "🎮" },
  { id: "software",      name: "Software",        icon: "💻" },
  { id: "subscriptions", name: "Subscriptions",   icon: "📺" },
  { id: "gift-cards",    name: "Gift Cards",      icon: "🎁" },
  { id: "accounts",      name: "Accounts",        icon: "👤" },
  { id: "vpn-security",  name: "VPN & Security",  icon: "🔒" },
  { id: "education",     name: "Education",       icon: "📚" },
  { id: "social-media",  name: "Social Media",    icon: "📱" },
];

const PRODUCT_TYPES: { value: ProductType; label: string }[] = [
  { value: "key",          label: "Activation Key" },
  { value: "account",      label: "Account" },
  { value: "subscription", label: "Subscription" },
  { value: "file",         label: "Digital File" },
  { value: "other",        label: "Other" },
];

interface AddProductFormProps {
  onSuccess?: () => void;
}

export function AddProductForm({ onSuccess }: AddProductFormProps) {
  const locale = useLocale();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    original_price: "",
    category_id: "",
    type: "key" as ProductType,
    tags: [] as string[],
    region: "",
    currency: "USD",
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (tag && !form.tags.includes(tag) && form.tags.length < 10) {
      update("tags", [...form.tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => update("tags", form.tags.filter((t) => t !== tag));

  const handleSubmit = async (status: "draft" | "active") => {
    if (!form.title || !form.price || !form.category_id) {
      setError("Title, price and category are required");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        original_price: form.original_price ? parseFloat(form.original_price) : null,
        status,
        stock_count: 0,
      }),
    });

    if (!res.ok) {
      const { error: err } = await res.json();
      setError(err || "Failed to create product");
      setLoading(false);
      return;
    }

    toast.success(status === "active" ? "Product published!" : "Saved as draft");
    onSuccess?.();
    router.push(`/${locale}/seller/dashboard`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-400 mb-4">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      <div className="space-y-5">
        {/* Title */}
        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 block">Product Title *</label>
          <input
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="e.g. Counter-Strike 2 Prime Status Key"
            className="input-field"
            maxLength={120}
          />
          <p className="text-xs text-slate-600 mt-1">{form.title.length}/120</p>
        </div>

        {/* Category + Type row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Category *</label>
            <div className="relative">
              <select
                value={form.category_id}
                onChange={(e) => update("category_id", e.target.value)}
                className="input-field appearance-none pr-8"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Product Type *</label>
            <div className="relative">
              <select
                value={form.type}
                onChange={(e) => update("type", e.target.value as ProductType)}
                className="input-field appearance-none pr-8"
              >
                {PRODUCT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Sale Price (USD) *</label>
            <div className="relative">
              <DollarSign size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
                placeholder="4.99"
                className="input-field pl-9"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              Original Price
              <span className="text-xs text-slate-600 font-normal ml-2">(for discount display)</span>
            </label>
            <div className="relative">
              <DollarSign size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={form.original_price}
                onChange={(e) => update("original_price", e.target.value)}
                placeholder="9.99"
                className="input-field pl-9"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 block">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={6}
            placeholder={"## What you get\n- Item 1\n- Item 2\n\n## How it works\n1. Step one\n2. Step two"}
            className="input-field font-mono text-sm resize-none"
          />
          <p className="text-xs text-slate-600 mt-1">Markdown supported</p>
        </div>

        {/* Tags */}
        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 block">
            Tags
            <span className="text-xs text-slate-600 font-normal ml-2">({form.tags.length}/10)</span>
          </label>
          <div className="flex gap-2 mb-2 flex-wrap">
            {form.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-brand-600/10 border border-brand-600/20 rounded-full text-xs text-brand-300">
                #{tag}
                <button onClick={() => removeTag(tag)} className="text-brand-400 hover:text-white transition-colors">
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              placeholder="Add tag (press Enter)"
              className="input-field flex-1 py-2"
              maxLength={20}
            />
            <button onClick={addTag} className="btn-secondary py-2 px-3">
              <Plus size={15} />
            </button>
          </div>
        </div>

        {/* Region */}
        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 block">
            Target Region
            <span className="text-xs text-slate-600 font-normal ml-2">(leave empty for global)</span>
          </label>
          <div className="relative">
            <select
              value={form.region}
              onChange={(e) => update("region", e.target.value)}
              className="input-field appearance-none pr-8"
            >
              <option value="">🌐 Global</option>
              <option value="US">🇺🇸 United States</option>
              <option value="RU">🇷🇺 Russia / CIS</option>
              <option value="UZ">🇺🇿 Uzbekistan</option>
              <option value="TR">🇹🇷 Turkey</option>
              <option value="EU">🇪🇺 Europe</option>
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => handleSubmit("draft")}
            disabled={loading}
            className="btn-secondary flex-1 disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            onClick={() => handleSubmit("active")}
            disabled={loading}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Publishing...
              </span>
            ) : (
              "Publish Product"
            )}
          </button>
        </div>

        <p className="text-xs text-slate-600 text-center">
          After publishing, add keys via the Upload Keys tab. Products without keys will show "Out of Stock".
        </p>
      </div>
    </motion.div>
  );
}
