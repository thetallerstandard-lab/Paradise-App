import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { FormAlert } from "@/components/forms/form-parts";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/modules/identity/server";
import { LANCASTER_TOWNS, metersToMiles } from "@/modules/network";
import { getProfileForEditing, listTradeCategories } from "@/modules/network/server";
import { getActiveOrganization } from "@/modules/organizations/server";

import { ProfileForm } from "./profile-form";

export const metadata: Metadata = { title: "Business profile" };

const SAVED_MESSAGES: Record<string, string> = {
  published: "Saved and published. Your profile is live.",
  draft: "Saved as a draft. Only your business can see it.",
};

export default async function ProfilePage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const user = await requireUser("/profile");
  const organization = await getActiveOrganization(user.id);
  if (!organization) redirect("/onboarding");

  const [params, trades, profile] = await Promise.all([
    searchParams,
    listTradeCategories(),
    getProfileForEditing(organization.id),
  ]);
  const canEdit = organization.role !== "member";
  const isPublished = profile?.visibility === "published";

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        {params.welcome ? <p className="text-sm font-medium text-brass">Step 2 of 2</p> : null}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-3xl font-semibold tracking-tight">Business profile</h1>
          <Badge variant={isPublished ? "default" : "secondary"}>{isPublished ? "Published" : "Draft"}</Badge>
        </div>
        <p className="text-muted-foreground">
          This is what contractors see on{" "}
          <Link href={`/c/${organization.slug}`} className="underline underline-offset-4">
            your public page
          </Link>
          . Only an approximate location is shown — the town you choose.
        </p>
      </div>

      <FormAlert message={params.saved ? SAVED_MESSAGES[params.saved] : undefined} />

      {canEdit ? (
        <ProfileForm
          trades={trades}
          towns={LANCASTER_TOWNS.map((t) => t.name)}
          initial={{
            headline: profile?.headline ?? "",
            bio: profile?.bio ?? "",
            yearsInBusiness: profile?.years_in_business?.toString() ?? "",
            licenseNumber: profile?.license_number ?? "",
            isInsured: profile?.is_insured ?? false,
            baseTown: profile?.base_town ?? "",
            serviceRadiusMiles: profile?.serviceRadiusMeters ? String(metersToMiles(profile.serviceRadiusMeters)) : "25",
            primaryTradeId: profile?.primaryTradeId ?? "",
            tradeIds: profile?.tradeIds ?? [],
            isPublished,
          }}
        />
      ) : (
        <FormAlert error="Only owners and admins of your business can edit this profile." />
      )}
    </div>
  );
}
