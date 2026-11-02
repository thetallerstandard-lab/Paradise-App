"use client";

import { Field, FormAlert, SubmitButton } from "@/components/forms/form-parts";
import { useFormAction } from "@/components/forms/use-form-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { resendCodeAction, verifyEmailAction } from "../actions";

export function VerifyEmailForm({ email, notice }: { email: string; notice?: string }) {
  const verify = useFormAction(verifyEmailAction);
  const resend = useFormAction(resendCodeAction);

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={verify.onSubmit} className="flex flex-col gap-4" noValidate>
        <FormAlert error={verify.state.error ?? (verify.state.fieldErrors ? undefined : notice)} />
        <Field label="Email" htmlFor="email" errors={verify.state.fieldErrors?.email}>
          <Input id="email" name="email" type="email" autoComplete="email" inputMode="email" defaultValue={email} required />
        </Field>
        <Field label="Verification code" htmlFor="code" errors={verify.state.fieldErrors?.code}>
          <Input
            id="code"
            name="code"
            autoComplete="one-time-code"
            inputMode="numeric"
            pattern="[0-9 -]*"
            maxLength={14}
            required
            autoFocus
            className="font-mono text-lg tracking-[0.3em]"
          />
        </Field>
        <SubmitButton pending={verify.isPending} pendingLabel="Checking…">
          Verify email
        </SubmitButton>
      </form>

      <form onSubmit={resend.onSubmit} className="flex flex-col gap-3 border-t pt-4" noValidate>
        <FormAlert error={resend.state.error} message={resend.state.message} />
        <input type="hidden" name="email" value={email} />
        <p className="text-sm text-muted-foreground">
          Didn&apos;t get it? Check spam, or send a new code. If your email has a confirmation link instead of a
          code, clicking the link works too.
        </p>
        <Button type="submit" variant="outline" size="sm" disabled={resend.isPending || !email} className="w-full sm:w-auto">
          {resend.isPending ? "Sending…" : "Send a new code"}
        </Button>
      </form>
    </div>
  );
}
