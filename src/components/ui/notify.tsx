"use client";

import toast from "react-hot-toast";
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";

export const notify = {
  success: (msg: string) =>
    toast.custom(() => (
      <div className="flex items-center gap-3 px-4 py-3 bg-dark-800 border border-emerald-500/30 rounded-xl shadow-2xl text-sm text-white min-w-[240px]">
        <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
        <span>{msg}</span>
      </div>
    )),

  error: (msg: string) =>
    toast.custom(() => (
      <div className="flex items-center gap-3 px-4 py-3 bg-dark-800 border border-rose-500/30 rounded-xl shadow-2xl text-sm text-white min-w-[240px]">
        <XCircle size={16} className="text-rose-400 flex-shrink-0" />
        <span>{msg}</span>
      </div>
    )),

  warning: (msg: string) =>
    toast.custom(() => (
      <div className="flex items-center gap-3 px-4 py-3 bg-dark-800 border border-amber-500/30 rounded-xl shadow-2xl text-sm text-white min-w-[240px]">
        <AlertCircle size={16} className="text-amber-400 flex-shrink-0" />
        <span>{msg}</span>
      </div>
    )),

  info: (msg: string) =>
    toast.custom(() => (
      <div className="flex items-center gap-3 px-4 py-3 bg-dark-800 border border-brand-500/30 rounded-xl shadow-2xl text-sm text-white min-w-[240px]">
        <Info size={16} className="text-brand-400 flex-shrink-0" />
        <span>{msg}</span>
      </div>
    )),
};
