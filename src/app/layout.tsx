import { ReactNode } from 'react';

// This layout just wraps children in HTML/Body to satisfy Next.js requirements.
// The actual styled layout and providers are in [locale]/layout.tsx.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
