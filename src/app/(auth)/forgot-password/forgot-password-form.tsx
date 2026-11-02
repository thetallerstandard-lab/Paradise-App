"use client";

import { Field, FormAlert, SubmitButton } from "@/components/forms/form-parts";
import { useFormAction } from "@/components/forms/use-form-action";
import { Input } from "@/components/ui/input";

import { forgotPasswordAction } from "../actions";

export function ForgotPasswordForm() {
  const { state, onSubmit, isPending } = useFormAction(forgotPasswordAction);
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <FormAlert error={state.error} message={state.message} />
      <Field label="Email" htmlFor="email" errors={state.fieldErrors?.email}>
        <Input id="email" name="email" type="email" autoComplete="email" inputMode="email" required />
      </Field>
      <SubmitButton pending={isPending} pendingLabel="Sending…">
        Send reset link
      </SubmitButton>
    </form>
  );
}
