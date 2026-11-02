import { BadgeCheck, Globe, MapPin, Phone, ShieldCheck, Timer } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { metersToMiles } from "@/modules/network";
import { getPublicProfile } from "@/modules/network/server";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getPublicProfile(slug);
  if (!profile) return { title: "Contractor not found" };
  return {
    title: profile.name,
    description: profile.headline ?? `${profile.name} on Paradise`,
    robots: profile.isPublished ? undefined : { index: false },
  };
}

export default async function PublicProfilePage({ params }: Params) {
  const { slug } = await params;
  const profile = await getPublicProfile(slug);
  if (!profile) notFound();

  const primary = profile.trades.find((t) => t.isPrimary);
  // Owners can write to the row directly via the API, so never trust the
  // stored value: only link http(s) URLs.
  const website = profile.website && /^https?:\/\//i.test(profile.website) ? profile.website : null;
  const facts = [
    profile.baseTown ? { icon: MapPin, text: `Based in ${profile.baseTown}${profile.serviceRadiusMeters ? ` · works within ${metersToMiles(profile.serviceRadiusMeters)} miles` : ""}` } : null,
    profile.yearsInBusiness != null ? { icon: Timer, text: `${profile.yearsInBusiness} ${profile.yearsInBusiness === 1 ? "year" : "years"} in business` } : null,
    profile.isInsured ? { icon: ShieldCheck, text: "Carries liability insurance (self-reported)" } : null,
    profile.licenseNumber ? { icon: BadgeCheck, text: `Licence / HIC: ${profile.licenseNumber}` } : null,
  ].filter((f): f is NonNullable<typeof f> => f !== null);

  return (
    <Container className="flex max-w-3xl flex-col gap-8 py-12 sm:py-16">
      {!profile.isPublished ? (
        <div role="status" className="rounded-md border border-brass/40 bg-accent/10 px-4 py-3 text-sm">
          This profile is a <strong>draft</strong>. Only members of this business can see it.{" "}
          <Link href="/profile" className="underline underline-offset-4">
            Edit and publish
          </Link>
        </div>
      ) : null}

      <header className="flex flex-col gap-3">
        {primary ? <p className="text-sm font-semibold tracking-wide text-brass uppercase">{primary.name}</p> : null}
        <h1 className="font-serif text-4xl font-semibold tracking-tight">{profile.name}</h1>
        {profile.headline ? <p className="text-lg text-muted-foreground">{profile.headline}</p> : null}
      </header>

      {profile.trades.length > 0 ? (
        <ul className="flex flex-wrap gap-2" aria-label="Trades">
          {profile.trades.map((t) => (
            <li key={t.slug}>
              <Badge variant={t.isPrimary ? "default" : "outline"} className="px-3 py-1 text-sm">
                {t.name}
              </Badge>
            </li>
          ))}
        </ul>
      ) : null}

      {facts.length > 0 ? (
        <ul className="grid gap-3 rounded-xl border bg-card p-5 sm:grid-cols-2">
          {facts.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-2 text-sm">
              <Icon className="mt-0.5 size-4 shrink-0 text-brass" aria-hidden />
              {text}
            </li>
          ))}
        </ul>
      ) : null}

      {profile.bio ? (
        <section aria-labelledby="about-heading" className="flex flex-col gap-2">
          <h2 id="about-heading" className="text-lg font-semibold">
            About
          </h2>
          <p className="whitespace-pre-line text-muted-foreground">{profile.bio}</p>
        </section>
      ) : null}

      {profile.phone || website ? (
        <section aria-label="Contact" className="flex flex-col gap-3 sm:flex-row">
          {profile.phone ? (
            <Button asChild>
              <a href={`tel:${profile.phone.replace(/[^0-9+]/g, "")}`}>
                <Phone aria-hidden />
                Call {profile.phone}
              </a>
            </Button>
          ) : null}
          {website ? (
            <Button asChild variant="outline">
              <a href={website} rel="nofollow noopener noreferrer" target="_blank">
                <Globe aria-hidden />
                Website
              </a>
            </Button>
          ) : null}
        </section>
      ) : null}
    </Container>
  );
}
