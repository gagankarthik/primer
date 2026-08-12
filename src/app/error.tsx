"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { LostCharacter } from "@/components/marketing/LostCharacter";
import { Squiggle, Spark, Dots, Loop } from "@/components/brand/Doodles";

/**
 * Error boundary.
 *
 * Built to the same scale and rhythm as the 404, because they are the same
 * moment for the person looking at them: something didn't work and they need a
 * way onward. It used to be a small centred card with a logo mark, which read
 * as a system message rather than as part of the product, and next to the 404
 * it looked like a different site's error page.
 *
 * The one real difference is the primary action. On a 404 there is nothing to
 * retry, so the button goes home. Here the failure may well be transient, so
 * "Try again" leads and the escape routes follow.
 *
 * Errors don't apologise and they're never vague. This one says what broke and
 * what it means for the reader, and because a child may be the one looking at
 * it, there are no stack traces and no alarming language.
 */

const LINKS = [
  { href: "/learning", label: "Open the Primer", note: "Start a lesson" },
  { href: "/modules", label: "Browse modules", note: "See what it teaches" },
  { href: "/parent", label: "Parent dashboard", note: "How this week went" },
];

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Wire to your reporter here. Logged rather than shown: a digest is useful
    // to support and meaningless to a parent.
    console.error("[primer]", error);
  }, [error]);

  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-base">
      <Squiggle className="absolute left-[7%] top-[18%] hidden lg:block" size={72} />
      <Spark
        className="absolute right-[11%] top-[15%] hidden lg:block"
        color="var(--color-rose)"
        size={26}
      />
      <Loop
        className="absolute bottom-[22%] right-[6%] hidden xl:block"
        color="var(--color-green)"
        size={64}
      />
      <Dots className="absolute bottom-[18%] left-[10%] hidden xl:block" />

      <header className="mx-auto w-full max-w-5xl px-6 py-6">
        <Link href="/" aria-label="Primer home">
          <Logo size={30} />
        </Link>
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 pb-20">
        <LostCharacter left="5" right="0">
          <h1 className="text-balance text-[clamp(1.75rem,4.5vw,3rem)] font-bold leading-[1.1] tracking-[-0.035em] text-ink">
            That didn&rsquo;t load.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[1.0625rem] leading-[1.6] text-ink-70">
            Something went wrong on our side, not yours. Nothing has been lost.
            Try it again, and if it keeps happening, tell us.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2.5 rounded-full bg-indigo py-2 pl-7 pr-2 text-[1rem] font-semibold text-white shadow-[0_6px_22px_rgba(61,78,232,0.35)] transition-all hover:bg-indigo-hi active:scale-[0.98]"
            >
              Try again
              <span
                aria-hidden
                className="grid h-10 w-10 place-items-center rounded-full bg-white/20"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M13.2 6.6A5.4 5.4 0 1 0 13 9.8"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M13.6 2.9v3.9H9.7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>

            <Link
              href="/"
              className="rounded-full border border-line-strong bg-surface px-6 py-3.5 text-[1rem] font-medium text-ink shadow-tight transition-colors hover:border-ink/25"
            >
              Take me home
            </Link>
          </div>

          <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group inline-flex flex-col items-center text-center"
                >
                  <span className="text-[0.9375rem] font-medium text-ink underline decoration-line-strong underline-offset-4 transition-colors group-hover:decoration-indigo">
                    {l.label}
                  </span>
                  <span className="mt-0.5 text-[0.8125rem] text-ink-45">
                    {l.note}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {error.digest && (
            <p className="figure-num mt-10 text-xs text-ink-45">
              Reference {error.digest}
            </p>
          )}
        </LostCharacter>
      </div>
    </main>
  );
}
