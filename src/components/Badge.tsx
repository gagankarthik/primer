"use client";

import { motion } from "motion/react";
import { cn } from "./ui/cn";
import { BADGES, BADGE_TONE as TONE, type BadgeKind } from "@/lib/badges";

/**
 * THE BADGE TILE.
 *
 * Flat, not a faux-metal medallion. A gradient "struck coin" turns to mud at
 * the 46px this renders at in a list, which is where it is seen most.
 *
 * Colour carries meaning rather than decoration: indigo for independent
 * thinking, green for persistence, amber for self-correction. A child reads
 * the colour before the shape and learns the categories without being told.
 *
 * The names, descriptions and colours themselves live in `@/lib/badges`, not
 * here. This file is a client component, and a server component that imports
 * data from a client module receives a reference stub rather than the data.
 * See the note in that file; it cost a 500 on the parent dashboard.
 *
 * Re-exported below so existing client-side imports keep working.
 */

export { BADGES, type BadgeKind } from "@/lib/badges";
export function Badge({
  kind,
  earned = true,
  size = 72,
  className,
}: {
  kind: BadgeKind;
  earned?: boolean;
  size?: number;
  className?: string;
}) {
  const meta = BADGES[kind];
  const tone = TONE[kind];

  return (
    <motion.div
      className={cn("relative shrink-0", className)}
      initial={false}
      whileHover={earned ? { y: -3, scale: 1.04 } : undefined}
      transition={{ type: "spring", stiffness: 320, damping: 20 }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        role="img"
        aria-label={earned ? meta.name : `${meta.name}, not earned yet`}
        className={earned ? "" : "opacity-35 grayscale"}
      >
        <rect width="48" height="48" rx="14" fill={tone.bg} />
        <rect
          x="0.6"
          y="0.6"
          width="46.8"
          height="46.8"
          rx="13.4"
          fill="none"
          stroke={tone.fg}
          strokeOpacity="0.18"
          strokeWidth="1.2"
        />
        <g
          stroke={tone.fg}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <Glyph kind={kind} />
        </g>
      </svg>
    </motion.div>
  );
}

/** Glyphs on a 48 grid, drawn heavy enough to read at 28px. */
function Glyph({ kind }: { kind: BadgeKind }) {
  switch (kind) {
    case "first-word":
      // Three separate sounds resolving into one continuous line.
      return (
        <>
          <path d="M15 18h3.5M22.5 18h3M30 18h3.5" />
          <path d="M14 30h20" />
        </>
      );
    case "asked-why":
      // An arc turning back on itself, the question returned.
      return (
        <>
          <path d="M14 24a10 10 0 1 0 3.6-7.7" />
          <path d="M13 13v5h5" />
        </>
      );
    case "climbed-back":
      // The descent trace: down, then up. The glyph IS the story.
      return <path d="M13 19l5 8 6-3 5 7 6-13" />;
    case "own-mistake":
      // A crossed-out slip, then a tick.
      return (
        <>
          <path d="M13 17l6 6M19 17l-6 6" strokeWidth="2" opacity="0.55" />
          <path d="M26 26l4 4 6-9" />
        </>
      );
    case "no-help":
      // One rung, standing alone.
      return (
        <>
          <circle cx="24" cy="24" r="8.5" strokeWidth="2" />
          <path d="M18.5 24h11" />
        </>
      );
    case "long-haul":
      // A loop returning to where it began.
      return (
        <>
          <path d="M16 30a10 10 0 1 1 10 0" />
          <path d="M20 28l-5 2.5 2.5 5" />
        </>
      );
  }
}

/** A badge with its words. Used on the child's shelf and in the parent view. */
export function BadgeCard({
  kind,
  earned = true,
  date,
  tone = "dark",
}: {
  kind: BadgeKind;
  earned?: boolean;
  date?: string;
  tone?: "dark" | "light";
}) {
  const meta = BADGES[kind];
  return (
    <div className="flex items-center gap-4">
      <Badge kind={kind} earned={earned} size={56} />
      <div className="min-w-0">
        <p
          className={cn(
            "font-[family-name:var(--font-display)] text-[0.9375rem]",
            tone === "dark" ? "text-chalk" : "text-ink",
            !earned && "opacity-45",
          )}
        >
          {meta.name}
        </p>
        <p
          className={cn(
            "mt-0.5 font-[family-name:var(--font-read)] text-xs leading-snug",
            tone === "dark" ? "text-chalk/55" : "text-ink/55",
          )}
        >
          {earned ? meta.blurb : meta.earnedFor}
        </p>
        {earned && date && (
          <p className="figure-num mt-1 text-[0.6875rem] text-indigo/70">{date}</p>
        )}
      </div>
    </div>
  );
}
