import Link from "next/link";

import { Wordmark } from "@/components/brand/wordmark";
import { BRAND } from "@/lib/brand";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="px-4 py-5 sm:px-6">
        <Link href="/" aria-label="Paradise home" className="inline-flex rounded-md">
          <Wordmark />
        </Link>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pb-16 sm:items-center">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <footer className="px-4 py-6 text-center text-xs text-muted-foreground">{BRAND.tagline}</footer>
    </div>
  );
}
