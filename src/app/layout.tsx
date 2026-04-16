import type { ReactNode } from 'react';

// A root layout is required by Next.js 15 for every page in the app router.
// The actual <html> and <body> structure is provided by [locale]/layout.tsx.
// This layout simply passes children through — the recommended next-intl pattern
// for apps where locale-specific segments provide the full HTML shell.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
