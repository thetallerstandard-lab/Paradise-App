"use client";

import { ArrowRight } from "lucide-react";

import { Field, FormAlert, SubmitButton } from "@/components/forms/form-parts";
import { useFormAction } from "@/components/forms/use-form-action";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select";

import { onboardingBusinessAction } from "../../actions";

export function BusinessForm({
  towns,
  initial,
}: {
  towns: string[];
  initial: { name: string; phone: string; baseTown: string };
}) {
  const { state, onSubmit, isPending } = useFormAction(onboardingBusinessAction);
  const errors = state.fieldErrors;
  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <FormAlert error={state.error} />
      <Card>
        <CardContent className="flex flex-col gap-4">
          <Field label="Business name" htmlFor="name" errors={errors?.name}>
            <Input id="name" name="name" autoComplete="organization" defaultValue={initial.name} required autoFocus />
          </Field>
          <Field
            label="Town you work out of"
            htmlFor="baseTown"
            hint="Shown on your profile instead of an address."
            errors={errors?.baseTown}
          >
            <NativeSelect id="baseTown" name="baseTown" defaultValue={initial.baseTown} required>
              <option value="">Choose a town…</option>
              {towns.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field
            label="Business phone (optional)"
            htmlFor="phone"
            hint="Lets contractors call you from your profile."
            errors={errors?.phone}
          >
            <Input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" defaultValue={initial.phone} />
          </Field>
        </CardContent>
      </Card>
      <SubmitButton pending={isPending} pendingLabel="Saving…" size="lg" className="sm:self-end">
        Next: your trade
        <ArrowRight aria-hidden />
      </SubmitButton>
    </form>
  );
}
