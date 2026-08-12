"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ModuleArt } from "./ModuleArt";
import { SPRING_SNAP } from "@/lib/motion";
import { toneBg, toneChip } from "@/lib/tone";
import { cn } from "@/components/ui/cn";
import type { LearningModule } from "@/lib/modules";

/**
 * A module in the catalogue.
 *
 * Hover lifts on a critically-damped spring and press compresses, feedback on
 * pointer-down, never only on release. The whole card is one link rather than a
 * card containing a button, because a nested control gives a child two things
 * to aim at where there is only one destination.
 */
export function ModuleCard({
  module: m,
  href,
  showRating = true,
}: {
  module: LearningModule;
  href?: string;
  showRating?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.985 }}
      transition={SPRING_SNAP}
      className="h-full"
    >
      <Link
        href={href ?? `/modules/${m.id}`}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-tight transition-colors hover:border-line-strong"
      >
        {/* Cover, tinted ground so the group reads before the title does. */}
        <div className={cn("relative", toneBg(m.tone))}>
          <ModuleArt art={m.art} tone={m.tone} className="h-32 w-full" />
          <span
            className={cn(
              "absolute left-4 top-4 rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold",
              toneChip(m.tone),
            )}
          >
            {m.group === "arithmetic"
              ? "Sums"
              : m.group === "letters"
                ? "Words"
                : "Numbers"}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-[1.0625rem] font-semibold tracking-[-0.015em] text-ink">
            {m.kidTitle}
          </h3>
          <p className="mt-1.5 flex-1 text-[0.875rem] leading-relaxed text-ink-45">
            {m.blurb}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[0.75rem] text-ink-45">
            <span className="figure-num">
              ages {m.minAge}&ndash;{m.maxAge}
            </span>
            <Dot />
            <span className="figure-num">{m.minutes} min</span>
            {showRating && (
              <>
                <Dot />
                <Stars value={m.rating} />
                <span className="figure-num">{m.rating}</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function Dot() {
  return <span aria-hidden className="h-1 w-1 rounded-full bg-line-strong" />;
}

/**
 * Star row. Parent-facing only.
 *
 * Never rendered on a child's screen: a six-year-old choosing between a 4.9 and
 * a 4.6 is a child being taught to optimise, which is the exact habit this
 * product exists to avoid.
 */
export function Stars({ value, size = 13 }: { value: number; size?: number }) {
  return (
    <span
      className="inline-flex items-center gap-0.5"
      role="img"
      aria-label={`${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = value >= i - 0.25;
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 20 20" aria-hidden>
            <path
              d="M10 1.6l2.5 5.2 5.7.8-4.1 4 1 5.7L10 14.6 4.9 17.3l1-5.7-4.1-4 5.7-.8L10 1.6Z"
              fill={filled ? "#F0A020" : "none"}
              stroke={filled ? "#F0A020" : "#D3D8E2"}
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
        );
      })}
    </span>
  );
}
