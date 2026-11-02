import Link from "next/link";

import { Wordmark } from "@/components/brand/wordmark";
import { Container } from "@/components/layout/container";
import { BRAND } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/40">
      <Container className="flex flex-col gap-6 py-10 text-sm sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <Wordmark />
          <p className="max-w-xs text-muted-foreground">{BRAND.tagline}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-col gap-2 text-muted-foreground">
          <Link href="/sign-up" className="hover:text-foreground">
            Join Paradise
          </Link>
          <Link href="/sign-in" className="hover:text-foreground">
            Sign in
          </Link>
        </nav>
        <p className="text-muted-foreground">
          Made in {BRAND.launchMarket}.
          <br />&copy; {new Date().getFullYear()} {BRAND.name}
        </p>
      </Container>
    </footer>
  );
}
