import type { Metadata } from "next";
import Link from "next/link";

import { getCurrentUser } from "@/modules/identity/server";

import { AuthCard } from "../auth-card";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = { title: "Choose a new password" };

export default async function ResetPasswordPage() {
  // The emailed link signs the user in via /auth/callback before landing here.
  const user = await getCurrentUser();
  if (!user) {
    return (
      <AuthCard title="Link expired" description="Your password reset link is invalid or has expired.">
        <Link href="/forgot-password" className="font-medium underline underline-offset-4">
          Request a new link
        </Link>
      </AuthCard>
    );
  }
  return (
    <AuthCard title="Choose a new password" description={`For ${user.email}`}>
      <ResetPasswordForm />
    </AuthCard>
  );
}
