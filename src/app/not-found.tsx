import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark-950">
      <div className="text-center">
        <div className="text-8xl font-display font-bold text-gradient mb-4">404</div>
        <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-slate-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/" className="btn-primary">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
