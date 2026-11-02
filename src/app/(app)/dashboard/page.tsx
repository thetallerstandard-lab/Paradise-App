import { ArrowRight, CheckCircle2, Circle, Handshake } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { displayNameOf, requireUser } from "@/modules/identity/server";
import { getProfileForEditing } from "@/modules/network/server";
import { getActiveOrganization } from "@/modules/organizations/server";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await requireUser("/dashboard");
  const organization = await getActiveOrganization(user.id);
  const profile = organization ? await getProfileForEditing(organization.id) : null;
  const published = profile?.visibility === "published";

  const checklist = [
    { done: true, label: "Create your account" },
    { done: Boolean(organization), label: "Add your business", href: "/onboarding" },
    { done: Boolean(profile), label: "Fill in your business profile", href: "/profile" },
    { done: published, label: "Publish your profile", href: "/profile" },
  ];
  const nextStep = checklist.find((item) => !item.done);
  const firstName = displayNameOf(user).split(" ")[0];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Welcome, {firstName}</h1>
        <p className="text-muted-foreground">
          {organization ? `You're managing ${organization.name}.` : "Let's get your business on Paradise."}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Getting started</CardTitle>
            <CardDescription>
              {nextStep ? "A few steps and you'll be visible to contractors nearby." : "You're all set — your profile is live."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="flex flex-col gap-3">
              {checklist.map((item) => (
                <li key={item.label} className="flex items-center gap-3">
                  {item.done ? (
                    <CheckCircle2 className="size-5 shrink-0 text-forest-700 dark:text-forest-100" aria-label="Done" />
                  ) : (
                    <Circle className="size-5 shrink-0 text-muted-foreground" aria-label="To do" />
                  )}
                  <span className={item.done ? "text-muted-foreground line-through" : ""}>{item.label}</span>
                </li>
              ))}
            </ol>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {nextStep?.href ? (
                <Button asChild>
                  <Link href={nextStep.href}>
                    {nextStep.label}
                    <ArrowRight aria-hidden />
                  </Link>
                </Button>
              ) : null}
              {organization && profile ? (
                <Button asChild variant="outline">
                  <Link href={`/c/${organization.slug}`}>View your public page</Link>
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader>
            <Handshake className="size-6 text-brass" aria-hidden />
            <CardTitle className="text-lg">Paradise Exchange is coming</CardTitle>
            <CardDescription>
              Soon you&apos;ll be able to post requests for equipment, labor, materials and subcontractors — and make offers
              on what others need. Finish your profile now so you&apos;re ready.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
