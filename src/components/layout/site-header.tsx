import Link from "next/link";

import { Wordmark } from "@/components/brand/wordmark";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

/** Public header. Static on purpose so marketing pages can be prerendered. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Paradise home" className="rounded-md">
          <Wordmark />
        </Link>
        <nav aria-label="Account" className="flex items-center gap-1 sm:gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/sign-up">Join Paradise</Link>
          </Button>
        </nav>
      </Container>
    </header>
  );
}
