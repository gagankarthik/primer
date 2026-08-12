"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { IconCheck } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";

/**
 * Pricing, anchored against what actually exists rather than invented.
 *
 * Khanmigo sits at $4 a month and Khan itself is free, so "cheaper than a
 * tutor" is not a claim that lands: the floor of this market is already near
 * zero. Synthesis sustains $29 a month for elementary maths alone, which says
 * depth sells where breadth does not. Hence a genuinely useful free tier to
 * answer the price anchor, one obvious paid tier, and a household tier.
 *
 * Annual is two months free. Enough to move a real share of buyers without
 * training everyone to wait for a discount.
 */

const TIERS = [
  {
    name: "Free",
    monthly: 0,
    annual: 0,
    line: "Enough to find out whether it works for your child.",
    cta: "Start free",
    href: "/signup",
    featured: false,
    features: [
      "One child",
      "20 minutes a day",
      "Reading and number modules",
      "Weekly summary email",
      "Safety alerts",
    ],
  },
  {
    name: "Family",
    monthly: 15,
    annual: 12,
    line: "The whole Primer, one child, no clock on it.",
    cta: "Start 14 days free",
    href: "/signup?plan=family",
    featured: true,
    features: [
      "One child, unlimited sessions",
      "All nine modules, ages 5 to 11",
      "Full parent dashboard",
      "Session by session help traces",
      "Memory that carries across years",
      "Screen free voice mode",
    ],
  },
  {
    name: "Household",
    monthly: 29,
    annual: 24,
    line: "For more than one child in the house.",
    cta: "Start 14 days free",
    href: "/signup?plan=household",
    featured: false,
    features: [
      "Up to four children",
      "Everything in Family",
      "A dashboard per child",
      "Shared reading goals",
      "Priority support",
    ],
  },
];

export function PricingTable() {
  const [annual, setAnnual] = useState(false);

  return (
    <>
      <div className="mb-12 flex justify-center">
        <div
          role="radiogroup"
          aria-label="Billing period"
          className="relative flex rounded-full border border-line bg-surface p-1 shadow-tight"
        >
          {(
            [
              { key: false, label: "Monthly" },
              { key: true, label: "Annual" },
            ] as const
          ).map((opt) => (
            <button
              key={String(opt.key)}
              role="radio"
              aria-checked={annual === opt.key}
              onClick={() => setAnnual(opt.key)}
              className={cn(
                "relative rounded-full px-6 py-2.5 text-sm font-medium transition-colors",
                annual === opt.key ? "text-white" : "text-ink-45 hover:text-ink",
              )}
            >
              {annual === opt.key && (
                <motion.span
                  layoutId="billing-pill"
                  className="absolute inset-0 rounded-full bg-indigo"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">
                {opt.label}
                {opt.key && (
                  <span
                    className={cn(
                      "ml-2 text-xs",
                      annual ? "text-white/80" : "text-indigo",
                    )}
                  >
                    2 months free
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {TIERS.map((t) => {
          const price = annual ? t.annual : t.monthly;
          return (
            <div
              key={t.name}
              className={cn(
                "relative flex flex-col overflow-hidden rounded-3xl border p-8",
                t.featured
                  ? "border-indigo/30 bg-surface shadow-lift"
                  : "border-line bg-surface shadow-tight",
              )}
            >
              {t.featured && (
                <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-indigo" />
              )}

              <div className="flex items-baseline justify-between">
                <h2 className="text-xl font-semibold text-ink">{t.name}</h2>
                {t.featured && (
                  <span className="rounded-full bg-indigo/10 px-3 py-1 text-[0.6875rem] font-semibold text-indigo">
                    Most families
                  </span>
                )}
              </div>

              <p className="mt-6 flex items-baseline gap-1.5">
                <span className="figure-num text-[2.75rem] font-semibold leading-none text-ink">
                  ${price}
                </span>
                <span className="text-sm text-ink-45">
                  {price === 0 ? "always" : "/ month"}
                </span>
              </p>
              <p className="mt-2 h-4 text-xs text-ink-45">
                {annual && price > 0 ? `Billed $${price * 12} a year` : ""}
              </p>

              <p className="mt-5 text-sm leading-relaxed text-ink-45">{t.line}</p>

              <ul className="mt-8 flex-1 space-y-3.5">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-ink-70">
                    <IconCheck size={17} className="mt-0.5 shrink-0 text-indigo" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={t.href}
                className={cn(
                  "mt-10 rounded-xl px-6 py-3.5 text-center text-sm font-semibold transition-all active:scale-[0.99]",
                  t.featured
                    ? "bg-indigo text-white shadow-[0_4px_16px_rgba(61,78,232,0.32)] hover:bg-indigo-hi"
                    : "border border-line-strong text-ink hover:border-ink/25",
                )}
              >
                {t.cta}
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
