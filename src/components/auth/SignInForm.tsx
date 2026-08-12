"use client";

import Link from "next/link";
import { useState } from "react";
import { Field, SubmitButton } from "@/components/auth/AuthShell";
import { cn } from "@/components/ui/cn";

/**
 * SIGN IN, for two different people.
 *
 * A parent signs in with an email and a password. A child signs in with the
 * four-character code from the parent's dashboard and their own name, because
 * a six-year-old does not have an email address, cannot type one reliably, and
 * should not be given a password to lose.
 *
 * One page rather than two, with a toggle at the top. Two sign-in URLs means a
 * child eventually lands on the parent form, tries their code in the email
 * field, and concludes they are locked out.
 *
 * The order matters: parent first, because the parent signs in first and sets
 * everything up. The child tab exists for the tablet that has been handed over.
 */

type Role = "parent" | "learner";

export function SignInForm() {
  const [role, setRole] = useState<Role>("parent");

  return (
    <div>
      <div
        role="tablist"
        aria-label="Who is signing in"
        className="mb-7 grid grid-cols-2 gap-1 rounded-xl bg-grey-tint p-1"
      >
        {(
          [
            ["parent", "I'm a parent"],
            ["learner", "I'm a learner"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={role === value}
            onClick={() => setRole(value)}
            className={cn(
              "rounded-lg py-2.5 text-[0.875rem] font-medium transition-all",
              role === value
                ? "bg-base text-ink shadow-tight"
                : "text-ink-45 hover:text-ink",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {role === "parent" ? <ParentForm /> : <LearnerForm />}
    </div>
  );
}

function ParentForm() {
  return (
    <form action="/parent" className="space-y-4">
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
        autoComplete="current-password"
        required
      />

      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 text-[0.875rem] text-ink-70">
          <input
            type="checkbox"
            name="remember"
            className="h-4 w-4 rounded border-line-strong accent-indigo"
          />
          Keep me signed in
        </label>
        <Link
          href="/signin/reset"
          className="text-[0.875rem] text-indigo hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <div className="pt-2">
        <SubmitButton>Sign in</SubmitButton>
      </div>
    </form>
  );
}

function LearnerForm() {
  return (
    <form action="/learning" className="space-y-4">
      <div>
        <label
          htmlFor="code"
          className="mb-1.5 block text-[0.875rem] font-medium text-ink"
        >
          Your code
        </label>
        <input
          id="code"
          name="code"
          // Uppercase, wide letter-spacing, and no autocorrect: this is four
          // characters read off a screen by someone who is still learning to
          // read, and every browser convenience gets in the way of that.
          inputMode="text"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          maxLength={4}
          placeholder="4KQ7"
          required
          className="figure-num w-full rounded-xl border border-line-strong bg-surface px-4 py-4 text-center text-2xl uppercase tracking-[0.5em] text-ink shadow-tight outline-none transition-colors placeholder:text-ink-45/50 focus:border-indigo"
        />
        <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-45">
          Ask a grown-up. It&rsquo;s on their dashboard, under Learners, and it
          only works for ten minutes.
        </p>
      </div>

      <div className="pt-2">
        <SubmitButton>Let&rsquo;s go</SubmitButton>
      </div>

      <p className="pt-1 text-[0.8125rem] leading-relaxed text-ink-45">
        Once this device is set up you won&rsquo;t need a code again. You just
        tap your name.
      </p>
    </form>
  );
}
