import { Handshake, MapPin, Wrench } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BRAND } from "@/lib/brand";

// Foundation placeholder only. The full landing page is Milestone 2 work:
// see docs/product/LANDING_PAGE.md.
const pillars = [
  {
    icon: MapPin,
    title: "Paradise Network",
    description: "Contractor profiles, a local map, and referrals built on professional trust.",
  },
  {
    icon: Handshake,
    title: "Paradise Exchange",
    description: "Request equipment, labor, materials, and subcontractors from contractors nearby.",
  },
  {
    icon: Wrench,
    title: "Built for the trades",
    description: "Organization-first accounts for owner-operators and growing crews.",
  },
] as const;

export default function HomePage() {
  return (
    <Container className="flex flex-col gap-12 py-16 sm:py-24">
      <section className="flex max-w-2xl flex-col gap-5">
        <Badge variant="brass">Launching in {BRAND.launchMarket}</Badge>
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {BRAND.tagline}
        </h1>
        <p className="text-lg text-muted-foreground">
          A hyperlocal professional network for independent contractors.
        </p>
      </section>

      <section aria-label="What Paradise offers" className="grid gap-4 sm:grid-cols-3">
        {pillars.map(({ icon: Icon, title, description }) => (
          <Card key={title}>
            <CardHeader>
              <Icon aria-hidden className="size-6 text-brass" />
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </section>
    </Container>
  );
}
