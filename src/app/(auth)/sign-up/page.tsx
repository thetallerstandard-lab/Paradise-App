import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "../auth-card";
import { SignUpForm } from "./sign-up-form";

export const metadata: Metadata = { title: "Join Paradise" };

export default function SignUpPage() {
  return (
    <AuthCard
      title="Join Paradise"
      description="Create your account, then set up your business profile. It takes about five minutes."
      footer={
        <p>
          Already a member?{" "}
          <Link href="/sign-in" className="font-medium text-foreground underline underline-offset-4">
            Sign in
          </Link>
        </p>
      }
    >
      <SignUpForm />
    </AuthCard>
  );
}
