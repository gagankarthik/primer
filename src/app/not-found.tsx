import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { LostCharacter } from "@/components/marketing/LostCharacter";
import { Squiggle, Spark, Dots, Loop } from "@/components/brand/Doodles";

/**
 * 404
 *
 * Playful first, useful second, in that order on purpose. This is the one page
 * a child is as likely to hit as a parent (a mistyped URL, a stale bookmark on
 * a shared tablet), so it opens with a friendly character rather than an
 * apology, then answers the only question that matters: where can I go instead?
 *
 * Three destinations, named for what's behind them. No "go back" as the primary
 * action, someone who arrived here from a bad link has nothing useful to go
 * back to.
 */

const LINKS = [
  { href: "/learning", label: "Open the Primer", note: "Start a lesson" },
  { href: "/modules", label: "Browse modules", note: "See what it teaches" },
  { href: "/parent", label: "Parent dashboard", note: "How this week went" },
];

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-base">
      <Squiggle className="absolute left-[7%] top-[18%] hidden lg:block" size={72} />
      <Spark
        className="absolute right-[11%] top-[15%] hidden lg:block"
        color="var(--color-rose)"
        size={26}
      />
      <Loop
        className="absolute right-[6%] bottom-[22%] hidden xl:block"
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
        <LostCharacter>
          <h1 className="text-[clamp(1.75rem,4.5vw,3rem)] font-bold leading-[1.1] tracking-[-0.035em] text-balance text-ink">
            This page has wandered off.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[1.0625rem] leading-[1.6] text-ink-70">
            Nothing lives at this address. Either it moved, or there&rsquo;s a
            typo in the link. Both are easily fixed.
          </p>

          <Link
            href="/"
            className="mt-9 inline-flex items-center gap-2.5 rounded-full bg-indigo py-2 pl-7 pr-2 text-[1rem] font-semibold text-white shadow-[0_6px_22px_rgba(61,78,232,0.35)] transition-all hover:bg-indigo-hi active:scale-[0.98]"
          >
            Take me home
            <span
              aria-hidden
              className="grid h-10 w-10 place-items-center rounded-full bg-white/20"
            >
              <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
                <path
                  d="M3 11L11 3M11 3H4.5M11 3v6.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>

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
        </LostCharacter>
      </div>
    </main>
  );
}
