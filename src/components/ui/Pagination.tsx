"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  onChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, total, limit, onChange, className }: PaginationProps) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    pages.push(1);
    if (page > 4) pages.push("...");
    for (let i = Math.max(2, page - 2); i <= Math.min(totalPages - 1, page + 2); i++) {
      pages.push(i);
    }
    if (page < totalPages - 3) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className={cn("flex items-center justify-center gap-1.5", className)}>
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-dark-800 border border-dark-700 text-sm text-slate-400 hover:text-white hover:border-dark-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={14} /> Prev
      </button>

      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="w-9 text-center text-slate-600 text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className={cn(
              "w-9 h-9 rounded-xl text-sm font-medium transition-all",
              p === page
                ? "bg-brand-600 text-white"
                : "bg-dark-800 border border-dark-700 text-slate-400 hover:text-white hover:border-dark-600"
            )}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-dark-800 border border-dark-700 text-sm text-slate-400 hover:text-white hover:border-dark-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Next <ChevronRight size={14} />
      </button>
    </div>
  );
}
