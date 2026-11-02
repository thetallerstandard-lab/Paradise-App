import { ArrowRight, CheckCircle2, ExternalLink, Inbox, PartyPopper, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { CopyLinkButton } from "@/components/app/copy-link-button";
import { FormAlert } from "@/components/forms/form-parts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublicEnv } from "@/lib/env";
import { displayNameOf } from "@/modules/identity/server";
import { ONBOARDING_STEPS, profileStrength, stepIndex } from "@/modules/network";

import { loadOnboarding } from "../onboarding/state";

export const metadata: Metadata = { title: "Home" };

const WELCOME: Record<string, string> = {
  live: "You're live! Contractors nearby can now find your business.",
  later: "Saved. Your profile stays private until you go live.",
};

export default async function HomePage({ searchParams }: { searchParams: Promise<{ welcome?: string }> }) {
  const [{ user, organization, details, snapshot, next }, params] = await Promise.all([
    loadOnboarding("/dashboard"),
    searchParams,
  ]);
  const firstName = displayNameOf(user).split(" ")[0];
  const publicUrl = details ? `${getPublicEnv().NEXT_PUBLIC_SITE_URL}/c/${details.slug}` : null;
  const strength = snapshot ? profileStrength(snapshot) : null;
  const canEdit = organization?.role !== "member";

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Hi, {firstName}</h1>
        <p className="text-muted-foreground">{details ? details.name : "Let's get your business on Paradise."}</p>
      </header>

      <FormAlert message={params.welcome ? WELCOME[params.welcome] : undefined} />

      {next !== "done" && canEdit ? (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <p className="text-sm font-medium text-brass">
              Step {stepIndex(next) + 1} of {ONBOARDING_STEPS.length}
            </p>
            <CardTitle className="text-xl">
              {next === "business" ? "Set up your business" : next === "trade" ? "Tell us your trade" : "Go live"}
            </CardTitle>
            <CardDescription>
              {next === "publish"
                ? "Your profile is ready. Go live so contractors nearby can find you."
                : "A couple of quick questions and contractors nearby can find you."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg">
              <Link href={ONBOARDING_STEPS[stepIndex(next)]!.path}>
                {next === "publish" ? "Preview and go live" : "Continue setup"}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {next === "done" && publicUrl ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-sm font-medium text-forest-700 dark:text-forest-100">
              <CheckCircle2 className="size-4" aria-hidden />
              You&apos;re live
            </div>
            <CardTitle className="text-xl">Share your Paradise page</CardTitle>
            <CardDescription>Send it to customers and other contractors — it works like a business card.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <CopyLinkButton url={publicUrl} />
            <Button asChild variant="ghost">
              <Link href={`/c/${details!.slug}`}>
                <ExternalLink aria-hidden />
                View your page
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {strength && canEdit && strength.missing.length > 0 && next !== "business" && next !== "trade" ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="size-5 text-brass" aria-hidden />
                Strengthen your profile
              </CardTitle>
              <span className="text-sm font-semibold tabular-nums">{strength.percent}%</span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-label="Profile completeness"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={strength.percent}
            >
              <div className="h-full rounded-full bg-primary" style={{ width: `${strength.percent}%` }} />
            </div>
            <CardDescription>Contractors trust complete profiles. Each takes a few seconds.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col divide-y rounded-lg border">
              {strength.missing.slice(0, 3).map((item) => (
                <li key={item.key}>
                  <Link
                    href={`/profile#${item.key}`}
                    className="flex min-h-12 items-center justify-between gap-3 px-4 text-sm hover:bg-muted"
                  >
                    {item.label}
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Inbox className="size-5 text-brass" aria-hidden />
            Requests are coming soon
          </CardTitle>
          <CardDescription>
            Soon you&apos;ll see equipment, labor and subcontracting requests from contractors near you — and post
            your own.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/requests">
              <PartyPopper aria-hidden />
              See what&apos;s coming
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
