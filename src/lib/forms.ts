import type { z } from "zod";

/** State returned by server actions to `useActionState` forms. */
export type FormState = {
  error?: string;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  /**
   * Where the browser should go after a successful action. Used instead of a
   * server-side redirect() where the next page depends on data the action just
   * wrote: a client navigation always renders it in a fresh request.
   */
  redirectTo?: string;
};

export const initialFormState: FormState = {};

/** Maps a failed Zod parse to per-field messages for the form. */
export function fieldErrorsFrom(error: z.ZodError): FormState["fieldErrors"] {
  const out: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    (out[key] ??= []).push(issue.message);
  }
  return out;
}

/** Reads a FormData text field, trimming and treating blanks as absent. */
export function textField(formData: FormData, name: string): string | undefined {
  const value = formData.get(name);
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}
