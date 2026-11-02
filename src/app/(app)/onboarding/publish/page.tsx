import type { Metadata } from "next";

import { ProfilePreview } from "@/components/network/profile-preview";
import { getPublicEnv } from "@/lib/env";
import { metersToMiles } from "@/modules/network";
import { listTradeCategories } from "@/modules/network/server";

import { guardStep } from "../state";
import { PublishForm } from "./publish-form";

export const metadata: Metadata = { title: "Go live" };

export default async function PublishStepPage() {
  const [{ details, profile }, trades] = await Promise.all([guardStep("publish"), listTradeCategories()]);
  const tradeName = new Map(trades.map((t) => [t.id, t.name]));
  const profileTrades = [
    ...(profile?.primaryTradeId ? [{ name: tradeName.get(profile.primaryTradeId) ?? "", isPrimary: true }] : []),
    ...(profile?.tradeIds ?? []).map((id) => ({ name: tradeName.get(id) ?? "", isPrimary: false })),
  ].filter((t) => t.name);
  const host = new URL(getPublicEnv().NEXT_PUBLIC_SITE_URL).host;

  return (
    <>
      <header className="flex flex-col gap-2">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Here&apos;s how you&apos;ll look</h1>
        <p className="text-muted-foreground">
          This is what contractors nearby will see. Go live now — you can add your headline, insurance and more
          afterwards.
        </p>
      </header>
      <ProfilePreview
        data={{
          name: details?.name ?? "",
          headline: profile?.headline ?? null,
          baseTown: profile?.base_town ?? null,
          radiusMiles: profile?.serviceRadiusMeters ? metersToMiles(profile.serviceRadiusMeters) : null,
          trades: profileTrades,
          yearsInBusiness: profile?.years_in_business ?? null,
          isInsured: profile?.is_insured ?? false,
          phone: details?.phone ?? null,
        }}
      />
      {details ? (
        <p className="text-sm text-muted-foreground">
          Your page will be at <span className="font-medium text-foreground">{host}/c/{details.slug}</span>
        </p>
      ) : null}
      <PublishForm />
    </>
  );
}
