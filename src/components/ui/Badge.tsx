import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "brand" | "success" | "warning" | "danger" | "cyan" | "outline";
  size?: "sm" | "md";
  className?: string;
}

const variantClasses: Record<string, string> = {
  default: "bg-dark-800 text-slate-400 border border-dark-700",
  brand:   "bg-brand-600/20 text-brand-400 border border-brand-600/30",
  success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  danger:  "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  cyan:    "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
  outline: "bg-transparent text-slate-400 border border-dark-600",
};

const sizeClasses: Record<string, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
};

export function Badge({ children, variant = "default", size = "sm", className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full font-medium", variantClasses[variant], sizeClasses[size], className)}>
      {children}
    </span>
  );
}
