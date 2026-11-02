import type { Metadata } from "next";
import Link from "next/link";

import { safeNextPath } from "@/lib/redirects";

import { AuthCard } from "../auth-card";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = { title: "Sign in" };

const NOTICES: Record<string, string> = {
  link: "That link is invalid or has expired. Sign in, or request a new link.",
};

export default async function SignInPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const next = params.next ? safeNextPath(params.next) : undefined;
  const notice = params.error ? NOTICES[params.error] : undefined;

  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to manage your business on Paradise."
      footer={
        <p>
          New to Paradise?{" "}
          <Link href="/sign-up" className="font-medium text-foreground underline underline-offset-4">
            Create an account
          </Link>
        </p>
      }
    >
      <SignInForm next={next} notice={notice} />
    </AuthCard>
  );
}
