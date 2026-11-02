import Link from "next/link";

import { Wordmark } from "@/components/brand/wordmark";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <Wordmark />
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-3xl font-semibold">Page not found</h1>
        <p className="text-muted-foreground">That page doesn&apos;t exist, or the business hasn&apos;t published its profile yet.</p>
      </div>
      <Button asChild>
        <Link href="/">Back to Paradise</Link>
      </Button>
    </main>
  );
}
