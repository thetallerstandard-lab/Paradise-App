"use client";

import { Field, FormAlert, SubmitButton } from "@/components/forms/form-parts";
import { useFormAction } from "@/components/forms/use-form-action";
import { Input } from "@/components/ui/input";

import { resetPasswordAction } from "../actions";

export function ResetPasswordForm() {
  const { state, onSubmit, isPending } = useFormAction(resetPasswordAction);
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <FormAlert error={state.error} />
      <Field label="New password" htmlFor="password" hint="At least 10 characters." errors={state.fieldErrors?.password}>
        <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={10} />
      </Field>
      <Field label="Confirm new password" htmlFor="confirmPassword" errors={state.fieldErrors?.confirmPassword}>
        <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required />
      </Field>
      <SubmitButton pending={isPending} pendingLabel="Saving…">
        Save new password
      </SubmitButton>
    </form>
  );
}
