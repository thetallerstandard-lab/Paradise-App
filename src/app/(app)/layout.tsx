import { LogOut } from "lucide-react";
import Link from "next/link";

import { BottomTabs, TopTabs } from "@/components/app/app-nav";
import { Wordmark } from "@/components/brand/wordmark";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/modules/identity/server";
import { getActiveOrganization } from "@/modules/organizations/server";

// Every page in this group is per-user; never prerender.
export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("/dashboard");
  const organization = await getActiveOrganization(user.id);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <Container className="flex h-16 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-6">
            <Link href="/dashboard" aria-label="Paradise home" className="rounded-md">
              <Wordmark />
            </Link>
            <TopTabs />
          </div>
          <div className="flex min-w-0 items-center gap-2">
            {organization ? (
              <span className="hidden max-w-48 truncate text-sm text-muted-foreground lg:inline">{organization.name}</span>
            ) : null}
            <form action="/auth/sign-out" method="post">
              <Button type="submit" variant="ghost" size="sm" aria-label="Sign out">
                <LogOut aria-hidden />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </form>
          </div>
        </Container>
      </header>
      <main className="flex-1 pt-6 pb-28 sm:pt-10 md:pb-12">
        <Container>{children}</Container>
      </main>
      <BottomTabs />
    </div>
  );
}
