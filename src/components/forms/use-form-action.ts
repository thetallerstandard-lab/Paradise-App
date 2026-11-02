"use client";

import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, type FormEvent } from "react";

import type { FormState } from "@/lib/forms";

/**
 * Like useActionState, but submits via onSubmit so React 19 does not reset the
 * form's fields after the action — users keep what they typed when validation
 * fails. Includes the clicked submit button's name/value (e.g. intent=publish).
 * Follows `redirectTo` from the action's result with a normal navigation.
 */
export function useFormAction(action: (prev: FormState, formData: FormData) => Promise<FormState>) {
  const router = useRouter();
  const [state, dispatch, isPending] = useActionState(action, {} as FormState);

  useEffect(() => {
    if (state.redirectTo) router.push(state.redirectTo);
  }, [state, router]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const formData = new FormData(event.currentTarget, submitter instanceof HTMLElement ? submitter : null);
    startTransition(() => dispatch(formData));
  }

  // Keep showing "Saving…" while the browser moves to the next page.
  return { state, onSubmit, isPending: isPending || Boolean(state.redirectTo) };
}
