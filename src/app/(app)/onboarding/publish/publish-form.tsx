"use client";

import { ArrowLeft, Rocket } from "lucide-react";
import Link from "next/link";

import { FormAlert, SubmitButton } from "@/components/forms/form-parts";
import { useFormAction } from "@/components/forms/use-form-action";
import { Button } from "@/components/ui/button";

import { onboardingPublishAction } from "../../actions";

export function PublishForm() {
  const { state, onSubmit, isPending } = useFormAction(onboardingPublishAction);
  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <FormAlert error={state.error} />
      <SubmitButton pending={isPending} name="intent" value="publish" size="lg" pendingLabel="Going live…" className="w-full">
        <Rocket aria-hidden />
        Go live
      </SubmitButton>
      <div className="flex items-center justify-between gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/onboarding/trade">
            <ArrowLeft aria-hidden />
            Back
          </Link>
        </Button>
        <SubmitButton pending={isPending} name="intent" value="later" variant="ghost" size="sm" className="w-auto">
          Not yet — finish later
        </SubmitButton>
      </div>
    </form>
  );
}
