import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublicEnv } from "@/lib/env";
import { requireUser } from "@/modules/identity/server";
import { getActiveOrganization } from "@/modules/organizations/server";

import { OrganizationForm } from "./organization-form";

export const metadata: Metadata = { title: "Set up your business" };

export default async function OnboardingPage() {
  const user = await requireUser("/onboarding");
  if (await getActiveOrganization(user.id)) redirect("/profile");

  const host = new URL(getPublicEnv().NEXT_PUBLIC_SITE_URL).host;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-brass">Step 1 of 2</p>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Tell us about your business</h1>
        <p className="text-muted-foreground">
          On Paradise, your business is the account — later you can invite your crew to join it.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Business details</CardTitle>
          <CardDescription>You can change the phone and website later.</CardDescription>
        </CardHeader>
        <CardContent>
          <OrganizationForm host={host} />
        </CardContent>
      </Card>
    </div>
  );
}
