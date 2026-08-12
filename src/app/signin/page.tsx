import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignInForm } from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to your parent dashboard, or set up a device for a learner with the code from your dashboard.",
  alternates: { canonical: "/signin" },
};

export default function SignIn() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Parents sign in with an email. Learners sign in with a code."
      note="Only a parent or guardian can create an account. A learner signs in here with a code from that account, never with an email address or a password."
      footer={
        <>
          No account yet?{" "}
          <Link href="/signup" className="font-medium text-indigo hover:underline">
            Create a parent account
          </Link>
        </>
      }
    >
      <SignInForm />
    </AuthShell>
  );
}
