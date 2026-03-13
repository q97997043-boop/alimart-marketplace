import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  className?: string;
  showValue?: boolean;
  reviewCount?: number;
}

export function StarRating({
  rating,
  max = 5,
  size = 14,
  className,
  showValue = false,
  reviewCount,
}: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const half   = !filled && i < rating;
          return (
            <Star
              key={i}
              size={size}
              className={cn(
                filled ? "text-amber-400 fill-amber-400" :
                half   ? "text-amber-400 fill-amber-400/50" :
                         "text-dark-600"
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-white">{rating.toFixed(1)}</span>
      )}
      {reviewCount !== undefined && (
        <span className="text-xs text-slate-500">({reviewCount.toLocaleString()})</span>
      )}
    </div>
  );
}
