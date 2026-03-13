// This file is intentionally minimal — the real layout is in [locale]/layout.tsx
// Next.js App Router requires a root layout, but locale detection happens in middleware.

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
