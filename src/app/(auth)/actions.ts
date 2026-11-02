"use server";

import { redirect } from "next/navigation";

import { getPublicEnv } from "@/lib/env";
import { fieldErrorsFrom, type FormState } from "@/lib/forms";
import { safeNextPath } from "@/lib/redirects";
import { createClient } from "@/lib/supabase/server";
import {
  forgotPasswordInputSchema,
  resetPasswordInputSchema,
  signInInputSchema,
  signUpInputSchema,
} from "@/modules/identity";

function callbackUrl(next: string) {
  const { NEXT_PUBLIC_SITE_URL } = getPublicEnv();
  return `${NEXT_PUBLIC_SITE_URL}/auth/callback?next=${encodeURIComponent(next)}`;
}

export async function signUpAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = signUpInputSchema.safeParse({
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { display_name: parsed.data.displayName },
      emailRedirectTo: callbackUrl("/onboarding"),
    },
  });

  if (error) {
    if (error.code === "weak_password") return { fieldErrors: { password: [error.message] } };
    if (error.code === "over_email_send_rate_limit") {
      return { error: "Too many sign-up emails were sent recently. Please try again in a little while." };
    }
    return { error: "We couldn't create your account. Please try again." };
  }

  // With email confirmation on, Supabase returns no session (and does not reveal
  // whether the address was already registered).
  if (data.session) redirect("/onboarding");
  redirect(`/check-email?email=${encodeURIComponent(parsed.data.email)}`);
}

export async function signInAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = signInInputSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    if (error.code === "email_not_confirmed") {
      return { error: "Please confirm your email first — check your inbox for the link we sent." };
    }
    return { error: "That email and password don't match. Try again or reset your password." };
  }

  const next = formData.get("next");
  redirect(safeNextPath(typeof next === "string" ? next : null));
}

export async function forgotPasswordAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = forgotPasswordInputSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, { redirectTo: callbackUrl("/reset-password") });

  // Same answer whether or not the account exists.
  return { message: "If an account exists for that email, a reset link is on its way." };
}

export async function resetPasswordAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = resetPasswordInputSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { error: "Your reset link has expired. Request a new one." };

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    if (error.code === "same_password") return { fieldErrors: { password: ["Choose a different password from your current one."] } };
    return { error: "We couldn't update your password. Please try again." };
  }
  redirect("/dashboard");
}
