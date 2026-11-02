import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Coins,
  GraduationCap,
  Hammer,
  HardHat,
  MapPin,
  Megaphone,
  Package,
  Truck,
  Users,
} from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";
import { LANCASTER_TOWNS } from "@/modules/network";

const steps = [
  {
    icon: BadgeCheck,
    title: "Set up your business",
    body: "Create a profile for your business — your trades, your experience, your insurance, the towns you work.",
  },
  {
    icon: MapPin,
    title: "Get found nearby",
    body: "Contractors and crews within driving distance can find you by trade when they need a hand or a referral.",
  },
  {
    icon: Users,
    title: "Trade help, not favors",
    body: "Post what you need, answer what others need, and agree terms in Paradise Points — fair, simple, on the record.",
  },
] as const;

const exchangeExamples = [
  { icon: Truck, kind: "Equipment", text: "Mini excavator for three days near Ephrata", points: 450 },
  { icon: HardHat, kind: "Labor", text: "Two framers for a Saturday in Lititz", points: 300 },
  { icon: Package, kind: "Materials", text: "Leftover architectural shingles, 12 bundles", points: 120 },
  { icon: Hammer, kind: "Subcontracting", text: "Licensed electrician for a basement finish", points: 900 },
] as const;

const ecosystems = [
  { icon: Briefcase, name: "Paradise Business", body: "Customers, estimates and scheduling in one place." },
  { icon: Megaphone, name: "Paradise Media", body: "Project portfolios and promotion that win local work." },
  { icon: GraduationCap, name: "Maestro", body: "Apprenticeships and mentorship with a nonprofit partner." },
] as const;

/** Rough positions for the decorative town map, projected from real coordinates. */
function townDots() {
  const west = -76.68, east = -75.95, south = 39.86, north = 40.27;
  return LANCASTER_TOWNS.map((t) => ({
    name: t.name,
    x: ((t.lng - west) / (east - west)) * 100,
    y: (1 - (t.lat - south) / (north - south)) * 100,
  }));
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <Container className="grid gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="flex flex-col gap-6">
            <Badge variant="brass">Now open in {BRAND.launchMarket}</Badge>
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              {BRAND.tagline}
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Paradise is the local network for independent contractors. Get found by the trades around you, borrow the
              equipment you need, find extra hands, and pass work to people you trust.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/sign-up">
                  Join Paradise — it&apos;s free
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#how-it-works">See how it works</Link>
              </Button>
            </div>
          </div>
          <TownMap />
        </Container>
      </section>

      {/* How it works */}
      <section id="how-it-works" aria-labelledby="how-heading" className="scroll-mt-20 py-16 sm:py-24">
        <Container className="flex flex-col gap-10">
          <SectionHeading id="how-heading" eyebrow="How it works" title="Your business, connected to the trades around you" />
          <ol className="grid gap-4 sm:grid-cols-3">
            {steps.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="flex flex-col gap-3 rounded-xl border bg-card p-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">Step {i + 1}</span>
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-muted-foreground">{body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Network */}
      <section aria-labelledby="network-heading" className="border-y bg-forest-900 py-16 text-ivory-50 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold tracking-wide text-brass-300 uppercase">Paradise Network</p>
            <h2 id="network-heading" className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              Be the name that comes up when someone nearby needs your trade
            </h2>
            <p className="text-ivory-50/80">
              Your Paradise profile shows what you do, how long you&apos;ve done it, whether you&apos;re insured, and the area
              you cover. Only an approximate location is shown — never your home or shop address.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {["Trades and specialties", "Years in business", "Licence and insurance", "Service area by town", "A public profile page to share", "Map listing (coming soon)"].map(
              (item) => (
                <li key={item} className="flex items-center gap-2 rounded-lg bg-ivory-50/5 px-4 py-3">
                  <BadgeCheck className="size-4 shrink-0 text-brass-300" aria-hidden />
                  {item}
                </li>
              ),
            )}
          </ul>
        </Container>
      </section>

      {/* Exchange */}
      <section aria-labelledby="exchange-heading" className="py-16 sm:py-24">
        <Container className="flex flex-col gap-10">
          <SectionHeading
            id="exchange-heading"
            eyebrow="Paradise Exchange"
            title="Ask for what you need. Offer what you've got."
            body="Post a request for equipment, labor, materials or a subcontractor. Contractors nearby respond with offers. You choose."
          />
          <ul className="grid gap-4 sm:grid-cols-2">
            {exchangeExamples.map(({ icon: Icon, kind, text, points }) => (
              <li key={text} className="flex items-start gap-4 rounded-xl border bg-card p-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-xs font-semibold tracking-wide text-brass uppercase">{kind}</span>
                  <p className="font-medium">{text}</p>
                </div>
                <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-sm font-semibold tabular-nums">{points} pts</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">Example requests. The Exchange opens to members after launch.</p>
        </Container>
      </section>

      {/* Points */}
      <section aria-labelledby="points-heading" className="border-y bg-muted/50 py-16 sm:py-24">
        <Container className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-start">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <Coins className="size-7" aria-hidden />
          </span>
          <div className="flex max-w-2xl flex-col gap-4">
            <h2 id="points-heading" className="font-serif text-3xl font-semibold tracking-tight">
              Paradise Points, in plain terms
            </h2>
            <p className="text-muted-foreground">
              Every offer on the Exchange names a price in Paradise Points, so both sides agree on value up front. At
              launch, points record what was agreed — <strong className="text-foreground">no points change hands yet</strong>.
              Balances and transfers come later, on a secure ledger, and we&apos;ll tell you before anything changes.
            </p>
          </div>
        </Container>
      </section>

      {/* Local */}
      <section aria-labelledby="local-heading" className="py-16 sm:py-24">
        <Container className="flex flex-col gap-6">
          <SectionHeading
            id="local-heading"
            eyebrow="Built here first"
            title={`Starting in ${BRAND.launchMarket}`}
            body="Paradise works when the people near you are on it. We're starting with one county and growing town by town."
          />
          <ul className="flex flex-wrap gap-2" aria-label="Towns in the launch area">
            {LANCASTER_TOWNS.map((t) => (
              <li key={t.name}>
                <Badge variant="outline" className="px-3 py-1 text-sm">
                  {t.name}
                </Badge>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Future */}
      <section aria-labelledby="future-heading" className="border-t py-16 sm:py-24">
        <Container className="flex flex-col gap-10">
          <SectionHeading id="future-heading" eyebrow="Coming next" title="More tools for running your trade" />
          <ul className="grid gap-4 sm:grid-cols-3">
            {ecosystems.map(({ icon: Icon, name, body }) => (
              <li key={name} className="flex flex-col gap-2 rounded-xl border border-dashed p-6">
                <Icon className="size-6 text-brass" aria-hidden />
                <h3 className="font-semibold">{name}</h3>
                <p className="text-sm text-muted-foreground">{body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="pb-20">
        <Container>
          <div className="flex flex-col items-start gap-6 rounded-2xl bg-forest-900 px-6 py-12 text-ivory-50 sm:px-12">
            <h2 className="max-w-2xl font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              Independent doesn&apos;t mean alone.
            </h2>
            <p className="max-w-xl text-ivory-50/80">
              Join the contractors building Paradise in {BRAND.launchMarket}. Free to join, five minutes to set up.
            </p>
            <Button asChild size="lg" variant="accent">
              <Link href="/sign-up">
                Join Paradise
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

function SectionHeading({ id, eyebrow, title, body }: { id: string; eyebrow: string; title: string; body?: string }) {
  return (
    <div className="flex max-w-2xl flex-col gap-3">
      <p className="text-sm font-semibold tracking-wide text-brass uppercase">{eyebrow}</p>
      <h2 id={id} className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {body ? <p className="text-lg text-muted-foreground">{body}</p> : null}
    </div>
  );
}

function TownMap() {
  const dots = townDots();
  return (
    <figure className="relative mx-auto aspect-square w-full max-w-md rounded-3xl border bg-card p-6 shadow-sm">
      <div aria-hidden className="relative size-full rounded-2xl bg-forest-100/50 dark:bg-forest-800/40">
        <div className="absolute inset-0 rounded-2xl [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:18px_18px]" />
        {dots.map((d) => (
          <span
            key={d.name}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1"
            style={{ left: `${d.x}%`, top: `${d.y}%` }}
          >
            <span className="size-2.5 rounded-full bg-primary ring-4 ring-brass/25" />
            {d.name === "Lancaster" || d.name === "Ephrata" || d.name === "Elizabethtown" || d.name === "Quarryville" ? (
              <span className="text-[11px] font-medium text-muted-foreground">{d.name}</span>
            ) : null}
          </span>
        ))}
      </div>
      <figcaption className="mt-3 text-center text-xs text-muted-foreground">
        {LANCASTER_TOWNS.length} towns across Lancaster County
      </figcaption>
    </figure>
  );
}
