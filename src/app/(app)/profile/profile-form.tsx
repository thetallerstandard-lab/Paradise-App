"use client";

import { useEffect, useState } from "react";

import { Field, FieldError, FormAlert, SubmitButton } from "@/components/forms/form-parts";
import { useFormAction } from "@/components/forms/use-form-action";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SERVICE_RADIUS_MILES } from "@/modules/network";

import { saveProfileAction } from "../actions";

type Trade = { id: string; name: string };

export type ProfileFormInitial = {
  headline: string;
  bio: string;
  yearsInBusiness: string;
  licenseNumber: string;
  isInsured: boolean;
  baseTown: string;
  serviceRadiusMiles: string;
  primaryTradeId: string;
  tradeIds: string[];
  isPublished: boolean;
};

export function ProfileForm({ trades, towns, initial }: { trades: Trade[]; towns: string[]; initial: ProfileFormInitial }) {
  const { state, onSubmit, isPending } = useFormAction(saveProfileAction);
  const [primaryTradeId, setPrimaryTradeId] = useState(initial.primaryTradeId);
  const errors = state.fieldErrors;

  // Links from the Home checklist (e.g. /profile#headline) land in the field, ready to type.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    const field = id ? document.getElementById(id) : null;
    if (field instanceof HTMLElement) {
      field.scrollIntoView({ block: "center" });
      field.focus({ preventScroll: true });
    }
  }, []);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      <FormAlert error={state.error} />

      <Card>
        <CardHeader>
          <CardTitle>What you do</CardTitle>
          <CardDescription>Your main trade is shown first.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Field label="Main trade" htmlFor="primaryTradeId" errors={errors?.primaryTradeId}>
            <NativeSelect
              id="primaryTradeId"
              name="primaryTradeId"
              required
              value={primaryTradeId}
              onChange={(e) => setPrimaryTradeId(e.target.value)}
            >
              <option value="">Choose a trade…</option>
              {trades.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1 text-sm font-medium">Other trades (optional)</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {trades
                .filter((t) => t.id !== primaryTradeId)
                .map((t) => (
                  <label key={t.id} className="flex min-h-10 items-center gap-2 rounded-md border px-3 text-sm">
                    <input
                      type="checkbox"
                      name="tradeIds"
                      value={t.id}
                      defaultChecked={initial.tradeIds.includes(t.id)}
                      className="size-4 accent-[var(--primary)]"
                    />
                    {t.name}
                  </label>
                ))}
            </div>
            <FieldError id="tradeIds-error" messages={errors?.tradeIds} />
          </fieldset>
          <Field label="Headline (optional)" htmlFor="headline" hint="One line, e.g. “Standing-seam metal roofs and repairs”." errors={errors?.headline}>
            <Input id="headline" name="headline" maxLength={160} defaultValue={initial.headline} />
          </Field>
          <Field label="About your business (optional)" htmlFor="bio" errors={errors?.bio}>
            <Textarea id="bio" name="bio" maxLength={4000} rows={5} defaultValue={initial.bio} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Where you work</CardTitle>
          <CardDescription>We show your town, never your address.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Town" htmlFor="baseTown" errors={errors?.baseTown}>
            <NativeSelect id="baseTown" name="baseTown" defaultValue={initial.baseTown}>
              <option value="">Choose a town…</option>
              {towns.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="How far you'll travel" htmlFor="serviceRadiusMiles" errors={errors?.serviceRadiusMiles}>
            <NativeSelect id="serviceRadiusMiles" name="serviceRadiusMiles" defaultValue={initial.serviceRadiusMiles}>
              {SERVICE_RADIUS_MILES.map((miles) => (
                <option key={miles} value={miles}>
                  Up to {miles} miles
                </option>
              ))}
            </NativeSelect>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Experience and credentials</CardTitle>
          <CardDescription>Self-reported for now. Verification is coming later.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Years in business" htmlFor="yearsInBusiness" errors={errors?.yearsInBusiness}>
            <Input id="yearsInBusiness" name="yearsInBusiness" type="number" inputMode="numeric" min={0} max={150} defaultValue={initial.yearsInBusiness} />
          </Field>
          <Field label="PA HIC or licence number (optional)" htmlFor="licenseNumber" errors={errors?.licenseNumber}>
            <Input id="licenseNumber" name="licenseNumber" maxLength={64} defaultValue={initial.licenseNumber} />
          </Field>
          <label className="flex min-h-10 items-center gap-2 text-sm sm:col-span-2">
            <input id="isInsured" type="checkbox" name="isInsured" defaultChecked={initial.isInsured} className="size-4 accent-[var(--primary)]" />
            My business carries liability insurance
          </label>
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <SubmitButton pending={isPending} name="intent" value="draft" variant="outline" pendingLabel="Saving…">
          {initial.isPublished ? "Save and hide my profile" : "Save (keep hidden)"}
        </SubmitButton>
        <SubmitButton pending={isPending} name="intent" value="publish" pendingLabel="Saving…">
          {initial.isPublished ? "Save changes" : "Save and go live"}
        </SubmitButton>
      </div>
    </form>
  );
}
