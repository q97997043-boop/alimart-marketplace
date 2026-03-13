"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Zap, Twitter, Github, MessageCircle, Shield, CreditCard, Truck } from "lucide-react";

export function Footer() {
  const locale = useLocale();

  return (
    <footer className="border-t border-dark-800 bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Trust badges */}
        <div className="grid grid-cols-3 gap-4 mb-10 pb-10 border-b border-dark-800">
          {[
            { icon: Shield, title: "Secure Payments", desc: "256-bit SSL encrypted" },
            { icon: Truck, title: "Instant Delivery", desc: "Keys delivered instantly" },
            { icon: CreditCard, title: "Money-back Guarantee", desc: "100% buyer protection" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600/10 border border-brand-600/20 flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-brand-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link href={`/${locale}`} className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br bg-brand-600 flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <span className="font-display font-800 text-xl text-white">AliMart</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed mb-4 max-w-xs">
              The modern digital marketplace for game keys, accounts, subscriptions and digital goods.
            </p>
            <div className="flex items-center gap-3">
              {[Twitter, Github, MessageCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-dark-800 border border-dark-700 flex items-center justify-center text-slate-500 hover:text-white hover:border-brand-600/50 transition-all"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: "Marketplace",
              links: ["Browse All", "Game Keys", "Accounts", "Subscriptions", "Gift Cards"],
            },
            {
              title: "Sellers",
              links: ["Start Selling", "Seller Dashboard", "Upload Products", "Pricing", "Docs"],
            },
            {
              title: "Support",
              links: ["Help Center", "Contact Us", "Dispute Center", "Terms of Service", "Privacy Policy"],
            },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white mb-3">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-dark-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} AliMart. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {["Visa", "Mastercard", "PayPal", "Stripe"].map((method) => (
              <span key={method} className="text-xs text-slate-600 px-2 py-1 bg-dark-800 rounded-md border border-dark-700">
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
