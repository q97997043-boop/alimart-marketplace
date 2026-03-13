export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    </div>
  );
}
