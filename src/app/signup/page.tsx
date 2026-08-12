import Link from "next/link";
import type { Metadata } from "next";
import {
  AuthShell,
  Field,
  SubmitButton
} from "@/components/auth/AuthShell";

export const metadata: Metadata = {
  title: "Create a parent account",
  description: "Two weeks free. No card. Every child in the house included.",
};

export default function SignUp() {
  return (
    <AuthShell
      title="Create a parent account"
      subtitle="Two weeks free, every child in the house included. We won't ask for a card until you decide to keep it."
      note="Accounts are for parents and guardians only. Children are added from inside the account and sign in with a code, so no child ever gives us an email address."
      footer={
        <>
          Already have one?{" "}
          <Link href="/signin" className="font-medium text-indigo hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      {/*
        There is no learner tab here, unlike sign-in. A child cannot open an
        account: the adult agrees to the terms, holds the billing relationship,
        and sets the PIN. Adding a learner happens in onboarding, once there is
        an adult attached to it.
      */}
      <div className="mb-7 flex items-start gap-3 rounded-xl bg-indigo-tint p-4">
        <span
          aria-hidden
          className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-indigo text-[0.6875rem] font-bold text-white"
        >
          i
        </span>
        <p className="text-[0.8125rem] leading-relaxed text-ink-70">
          This is the grown-up&rsquo;s account. If you&rsquo;re here to use the
          Primer,{" "}
          <Link
            href="/signin"
            className="font-medium text-indigo underline underline-offset-4"
          >
            sign in with your code
          </Link>{" "}
          instead.
        </p>
      </div>

      {/* Posts to onboarding: the account is only half the job, a profile has
          to exist before a child can use anything. */}
      <form action="/onboarding" className="space-y-4">
        <Field
          label="Your name"
          id="name"
          placeholder="Sarah Rowe"
          autoComplete="name"
          required
        />
        <Field
          label="Email"
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <Field
          label="Password"
          id="password"
          type="password"
          autoComplete="new-password"
          hint="At least 10 characters. A short sentence works well."
          required
        />

        <div className="pt-2">
          <SubmitButton>Create account</SubmitButton>
        </div>

        <p className="text-[0.75rem] leading-relaxed text-ink-45">
          By continuing you agree to our terms and privacy notice. You can
          export or delete everything, at any time, from your dashboard.
        </p>
      </form>
    </AuthShell>
  );
}
