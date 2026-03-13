import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full";
}

const roundedMap = {
  sm:   "rounded",
  md:   "rounded-lg",
  lg:   "rounded-2xl",
  full: "rounded-full",
};

export function Skeleton({ className, rounded = "md" }: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-dark-800 animate-pulse",
        roundedMap[rounded],
        className
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-2xl overflow-hidden border border-dark-800">
      <Skeleton className="h-40 w-full" rounded="sm" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-32" />
        <div className="flex justify-between items-center pt-1">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-8 w-14" rounded="lg" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}
