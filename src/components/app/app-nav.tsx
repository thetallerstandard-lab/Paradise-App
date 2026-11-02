"use client";

import { Briefcase, Home, Inbox, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const TABS: { href: string; label: string; icon: LucideIcon; match: string[] }[] = [
  { href: "/dashboard", label: "Home", icon: Home, match: ["/dashboard"] },
  { href: "/requests", label: "Requests", icon: Inbox, match: ["/requests"] },
  { href: "/profile", label: "My business", icon: Briefcase, match: ["/profile", "/onboarding"] },
];

function useActive() {
  const pathname = usePathname();
  return (match: string[]) => match.some((m) => pathname === m || pathname.startsWith(`${m}/`));
}

/** Tabs across the top on tablets and desktops. */
export function TopTabs() {
  const isActive = useActive();
  return (
    <nav aria-label="Main" className="hidden gap-1 md:flex">
      {TABS.map(({ href, label, icon: Icon, match }) => {
        const active = isActive(match);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Thumb-reachable tab bar fixed to the bottom of phones. */
export function BottomTabs() {
  const isActive = useActive();
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="grid grid-cols-3">
        {TABS.map(({ href, label, icon: Icon, match }) => {
          const active = isActive(match);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 text-xs font-medium",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <Icon className={cn("size-5", active && "text-brass")} aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
