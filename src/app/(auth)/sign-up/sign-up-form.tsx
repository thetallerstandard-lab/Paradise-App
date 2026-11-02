"use client";

import { Field, FormAlert, SubmitButton } from "@/components/forms/form-parts";
import { useFormAction } from "@/components/forms/use-form-action";
import { Input } from "@/components/ui/input";

import { signUpAction } from "../actions";

export function SignUpForm() {
  const { state, onSubmit, isPending } = useFormAction(signUpAction);
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <FormAlert error={state.error} />
      <Field label="Your name" htmlFor="displayName" errors={state.fieldErrors?.displayName}>
        <Input id="displayName" name="displayName" autoComplete="name" required />
      </Field>
      <Field label="Email" htmlFor="email" errors={state.fieldErrors?.email}>
        <Input id="email" name="email" type="email" autoComplete="email" inputMode="email" required />
      </Field>
      <Field label="Password" htmlFor="password" hint="At least 10 characters." errors={state.fieldErrors?.password}>
        <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={10} />
      </Field>
      <SubmitButton pending={isPending} pendingLabel="Creating account…">
        Create account
      </SubmitButton>
    </form>
  );
}
