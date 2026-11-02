import { MailCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "../auth-card";

export const metadata: Metadata = { title: "Check your email" };

export default async function CheckEmailPage({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const { email } = await searchParams;
  return (
    <AuthCard
      title="Check your email"
      description={
        <>
          We sent a confirmation link to {email ? <strong className="text-foreground">{email}</strong> : "your inbox"}.
          Open it on this device to finish setting up your account.
        </>
      }
      footer={
        <p>
          Wrong address?{" "}
          <Link href="/sign-up" className="font-medium text-foreground underline underline-offset-4">
            Start again
          </Link>
        </p>
      }
    >
      <div className="flex items-center gap-3 rounded-md bg-muted px-4 py-3 text-sm">
        <MailCheck className="size-5 shrink-0 text-brass" aria-hidden />
        <span>The link expires after 24 hours. Check your spam folder if it hasn&apos;t arrived in a few minutes.</span>
      </div>
    </AuthCard>
  );
}
