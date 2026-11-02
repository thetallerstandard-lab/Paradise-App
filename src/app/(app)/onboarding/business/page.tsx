import type { Metadata } from "next";

import { LANCASTER_TOWNS } from "@/modules/network";

import { guardStep } from "../state";
import { BusinessForm } from "./business-form";

export const metadata: Metadata = { title: "Your business" };

export default async function BusinessStepPage() {
  const { details, profile } = await guardStep("business");
  return (
    <>
      <header className="flex flex-col gap-2">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Tell us about your business</h1>
        <p className="text-muted-foreground">Three quick steps and you&apos;re on Paradise. You can change any of this later.</p>
      </header>
      <BusinessForm
        towns={LANCASTER_TOWNS.map((t) => t.name)}
        initial={{ name: details?.name ?? "", phone: details?.phone ?? "", baseTown: profile?.base_town ?? "" }}
      />
    </>
  );
}
