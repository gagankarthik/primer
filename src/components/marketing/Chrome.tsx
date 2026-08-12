"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { cn } from "@/components/ui/cn";
import { Logo } from "@/components/brand/Logo";
import { MegaMenu } from "@/components/marketing/MegaMenu";

/*
  There used to be a second navbar here called MarketingNav, a plain link bar,
  while the landing, features and pricing pages rendered MegaMenu. Both were
  "the site header", so the header changed shape depending on which page you
  landed on, which reads as a broken site rather than a design choice.

  MegaMenu is now the only site header. If a public page needs chrome it gets
  it from SiteChrome below, never by assembling its own.
*/

/** Primary button. Used for the one action that matters on each screen. */
export function Cta({
  href,
  children,
  variant = "solid",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline";
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [d, setD] = useState({ x: 0, y: 0 });

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        setD({
          x: ((e.clientX - (r.left + r.width / 2)) / r.width) * 6,
          y: ((e.clientY - (r.top + r.height / 2)) / r.height) * 6,
        });
      }}
      onMouseLeave={() => setD({ x: 0, y: 0 })}
      style={{
        transform: `translate(${d.x}px, ${d.y}px)`,
        transition: "transform 220ms cubic-bezier(.22,1,.36,1), background-color 180ms, box-shadow 180ms",
      }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[0.9375rem] font-medium active:scale-[0.985]",
        variant === "solid"
          ? "bg-ink text-white shadow-lift hover:bg-ink/88"
          : "border border-line-strong bg-surface text-ink shadow-tight hover:border-ink/25",
        className,
      )}
    >
      {children}
    </Link>
  );
}

const FOOTER_COLS: { title: string; links: { href: string; label: string }[] }[] =
  [
    {
      title: "What it teaches",
      links: [
        { href: "/modules", label: "All modules" },
        { href: "/modules/counting", label: "Numbers" },
        { href: "/modules/adding", label: "Sums" },
        { href: "/modules/blending", label: "Words" },
      ],
    },
    {
      title: "How it works",
      links: [
        { href: "/features", label: "The scaffold ladder" },
        { href: "/features#profile", label: "The learner profile" },
        { href: "/features#safety", label: "Safety and privacy" },
        { href: "/pricing", label: "Pricing" },
      ],
    },
    {
      title: "For parents",
      links: [
        { href: "/parent", label: "Your dashboard" },
        { href: "/onboarding", label: "Set up a child" },
        { href: "/signin", label: "Sign in" },
        { href: "/contact", label: "Talk to us" },
      ],
    },
  ];

/**
 * FOOTER
 *
 * Dark, so the page ends on a deliberate full stop rather than fading out into
 * more white. Two things: navigation, and a thin legal bar.
 *
 * It used to open with three promise cards (ages, no recording, you set the
 * hours) and a repeat of the sign-up button. Both are gone. The promises are
 * made three times higher up the page, and a footer that pitches is a footer
 * that has stopped being useful for the one job people scroll here to do,
 * which is find a link.
 *
 * No licence line either. Nobody has ever chosen a tutoring product because of
 * its software licence.
 */
export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-[88rem] px-5 py-16 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_2fr] lg:gap-16">
          <div>
            <Logo size={30} tone="light" />
            <p className="mt-4 max-w-xs text-[0.9375rem] leading-relaxed text-white/60">
              A tutor that asks instead of tells, and shows you how much help it
              took.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {FOOTER_COLS.map((col) => (
              <div key={col.title}>
                <p className="mb-4 text-[0.8125rem] font-semibold text-white">
                  {col.title}
                </p>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-[0.875rem] text-white/50 transition-colors hover:text-white"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Thin legal bar. Required, not a pitch. */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <p className="text-[0.8125rem] text-white/40">
            © 2026 Primer. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              { href: "/privacy", label: "Privacy" },
              { href: "/terms", label: "Terms" },
              { href: "/accessibility", label: "Accessibility" },
              { href: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[0.8125rem] text-white/40 transition-colors hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

/**
 * SITE CHROME
 *
 * The header and footer for every public page, in one place so they cannot
 * drift apart again. Pages render their own content and nothing else.
 *
 * `pt-*` is on the main element rather than each page: the header is fixed, so
 * every page owes it the same clearance, and making each page remember that
 * was how they ended up with slightly different top spacing.
 */
export function SiteChrome({
  children,
  padded = true,
}: {
  children: React.ReactNode;
  /** Off for pages that begin with their own full-bleed surface. */
  padded?: boolean;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-base text-ink">
      <MegaMenu />
      <main className={cn("flex-1", padded && "pt-24 sm:pt-28")}>{children}</main>
      <Footer />
    </div>
  );
}
