"use client";

import Link from "next/link";

import { Field, FormAlert, SubmitButton } from "@/components/forms/form-parts";
import { useFormAction } from "@/components/forms/use-form-action";
import { Input } from "@/components/ui/input";

import { signInAction } from "../actions";

export function SignInForm({ next, notice }: { next?: string; notice?: string }) {
  const { state, onSubmit, isPending } = useFormAction(signInAction);
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <FormAlert error={state.error ?? notice} />
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <Field label="Email" htmlFor="email" errors={state.fieldErrors?.email}>
        <Input id="email" name="email" type="email" autoComplete="email" inputMode="email" required />
      </Field>
      <Field label="Password" htmlFor="password" errors={state.fieldErrors?.password}>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </Field>
      <div className="flex flex-col-reverse items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/forgot-password" className="text-sm underline underline-offset-4">
          Forgot your password?
        </Link>
        <SubmitButton pending={isPending} pendingLabel="Signing in…">
          Sign in
        </SubmitButton>
      </div>
    </form>
  );
}
