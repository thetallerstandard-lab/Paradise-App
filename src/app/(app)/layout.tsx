import Link from "next/link";

import { Wordmark } from "@/components/brand/wordmark";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { displayNameOf, requireUser } from "@/modules/identity/server";
import { getActiveOrganization } from "@/modules/organizations/server";

// Every page in this group is per-user; never prerender.
export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("/dashboard");
  const organization = await getActiveOrganization(user.id);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b bg-background">
        <Container className="flex h-16 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-4">
            <Link href="/dashboard" aria-label="Dashboard" className="rounded-md">
              <Wordmark />
            </Link>
            {organization ? (
              <span className="hidden truncate text-sm text-muted-foreground sm:inline">{organization.name}</span>
            ) : null}
          </div>
          <form action="/auth/sign-out" method="post">
            <Button type="submit" variant="ghost" size="sm">
              Sign out
            </Button>
          </form>
        </Container>
        <Container>
          <nav aria-label="App" className="-mb-px flex gap-4 overflow-x-auto text-sm">
            <AppNavLink href="/dashboard">Dashboard</AppNavLink>
            {organization ? <AppNavLink href="/profile">Business profile</AppNavLink> : <AppNavLink href="/onboarding">Set up business</AppNavLink>}
            {organization ? <AppNavLink href={`/c/${organization.slug}`}>Public page</AppNavLink> : null}
          </nav>
        </Container>
      </header>
      <main className="flex-1 py-8 sm:py-12">
        <Container>{children}</Container>
      </main>
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">Signed in as {displayNameOf(user)}</footer>
    </div>
  );
}

function AppNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="border-b-2 border-transparent py-3 whitespace-nowrap text-muted-foreground hover:border-border hover:text-foreground">
      {children}
    </Link>
  );
}
