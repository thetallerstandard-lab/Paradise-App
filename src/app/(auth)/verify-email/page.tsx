import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "../auth-card";
import { VerifyEmailForm } from "./verify-email-form";

export const metadata: Metadata = { title: "Verify your email" };

const NOTICES: Record<string, string> = {
  unconfirmed: "Your email isn't verified yet. Enter the code we emailed you, or send a new one.",
};

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const { email = "", notice } = await searchParams;
  return (
    <AuthCard
      title="Verify your email"
      description={
        <>
          We emailed a verification code to {email ? <strong className="text-foreground">{email}</strong> : "your inbox"}.
          Enter it below. The code expires after one hour.
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
      <VerifyEmailForm email={email} notice={notice ? NOTICES[notice] : undefined} />
    </AuthCard>
  );
}
