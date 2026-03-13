import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<string, string> = {
  primary:   "bg-brand-600 hover:bg-brand-500 text-white font-semibold active:scale-95",
  secondary: "bg-dark-800 hover:bg-dark-700 text-slate-200 font-semibold border border-dark-700 hover:border-dark-600 active:scale-95",
  ghost:     "text-slate-400 hover:text-white hover:bg-dark-800",
  danger:    "bg-rose-600 hover:bg-rose-500 text-white font-semibold active:scale-95",
};

const sizeClasses: Record<string, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-8 py-4 text-base rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, disabled, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 transition-all duration-200",
          variantClasses[variant],
          sizeClasses[size],
          (disabled || loading) && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {loading && (
          <span className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin flex-shrink-0" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
