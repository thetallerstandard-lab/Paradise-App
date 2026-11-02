"use client";

import { useState } from "react";

import { Field, FormAlert, SubmitButton } from "@/components/forms/form-parts";
import { useFormAction } from "@/components/forms/use-form-action";
import { Input } from "@/components/ui/input";
import { slugify } from "@/modules/organizations";

import { createOrganizationAction } from "../actions";

export function OrganizationForm({ host }: { host: string }) {
  const { state, onSubmit, isPending } = useFormAction(createOrganizationAction);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <FormAlert error={state.error} />
      <Field label="Business name" htmlFor="name" errors={state.fieldErrors?.name}>
        <Input
          id="name"
          name="name"
          autoComplete="organization"
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slugEdited) setSlug(slugify(e.target.value));
          }}
        />
      </Field>
      <Field
        label="Profile web address"
        htmlFor="slug"
        hint={`${host}/c/${slug || "your-business"}`}
        errors={state.fieldErrors?.slug}
      >
        <Input
          id="slug"
          name="slug"
          required
          autoCapitalize="none"
          spellCheck={false}
          value={slug}
          onChange={(e) => {
            setSlugEdited(true);
            setSlug(e.target.value.toLowerCase());
          }}
        />
      </Field>
      <Field label="Business phone (optional)" htmlFor="phone" errors={state.fieldErrors?.phone}>
        <Input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" />
      </Field>
      <Field label="Website (optional)" htmlFor="website" errors={state.fieldErrors?.website}>
        <Input id="website" name="website" type="text" inputMode="url" placeholder="example.com" autoCapitalize="none" />
      </Field>
      <SubmitButton pending={isPending} pendingLabel="Creating…">
        Continue
      </SubmitButton>
    </form>
  );
}
