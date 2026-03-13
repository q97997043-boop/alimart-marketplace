"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark-950">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
        <p className="text-slate-500 mb-8 text-sm">{error.message || "An unexpected error occurred"}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn-primary">Try Again</button>
          <a href="/" className="btn-secondary">Go Home</a>
        </div>
      </div>
    </div>
  );
}
