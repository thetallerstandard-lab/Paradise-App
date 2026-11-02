import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Wordmark } from "@/components/brand/wordmark";

export function SiteHeader() {
  return (
    <header className="border-b bg-background/95">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" aria-label="Paradise home" className="rounded-md focus-visible:outline-2">
          <Wordmark />
        </Link>
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Lancaster County, PA
        </span>
      </Container>
    </header>
  );
}
