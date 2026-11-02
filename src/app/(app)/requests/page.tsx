import { ArrowRight, HardHat, Hammer, Package, Truck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Requests" };

const KINDS = [
  { icon: Truck, label: "Equipment", example: "A mini excavator for three days" },
  { icon: HardHat, label: "Labor", example: "Two framers for a Saturday" },
  { icon: Package, label: "Materials", example: "Leftover shingles, 12 bundles" },
  { icon: Hammer, label: "Subcontractor", example: "An electrician for a basement" },
] as const;

/** Placeholder until the Exchange ships (Milestone 3): explains what's coming. */
export default function RequestsPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Requests near you</h1>
        <p className="text-muted-foreground">
          Coming soon: contractors nearby will post what they need, and you&apos;ll be able to offer help — or post
          your own request in under a minute.
        </p>
      </header>
      <ul className="grid gap-3 sm:grid-cols-2">
        {KINDS.map(({ icon: Icon, label, example }) => (
          <li key={label} className="flex items-start gap-3 rounded-xl border border-dashed bg-card p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
              <Icon className="size-5" aria-hidden />
            </span>
            <div>
              <p className="font-semibold">{label}</p>
              <p className="text-sm text-muted-foreground">{example}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="rounded-xl bg-muted p-5">
        <p className="font-medium">Get ready now</p>
        <p className="mt-1 text-sm text-muted-foreground">
          A complete profile is how other contractors decide to work with you.
        </p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/profile">
            Finish your profile
            <ArrowRight aria-hidden />
          </Link>
        </Button>
      </div>
    </div>
  );
}
