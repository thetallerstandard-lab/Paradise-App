"use client";

import { startTransition, useActionState, type FormEvent } from "react";

import type { FormState } from "@/lib/forms";

/**
 * Like useActionState, but submits via onSubmit so React 19 does not reset the
 * form's fields after the action — users keep what they typed when validation
 * fails. Includes the clicked submit button's name/value (e.g. intent=publish).
 */
export function useFormAction(action: (prev: FormState, formData: FormData) => Promise<FormState>) {
  const [state, dispatch, isPending] = useActionState(action, {} as FormState);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const formData = new FormData(event.currentTarget, submitter instanceof HTMLElement ? submitter : null);
    startTransition(() => dispatch(formData));
  }

  return { state, onSubmit, isPending };
}
