"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { LogoMark } from "@/components/brand/Logo";
import { RANKS, rankFor, nextRank } from "@/lib/badges";
import { cn } from "@/components/ui/cn";

/**
 * THE RANK CARD
 *
 * A child's standing, with their own name on it and the product's name under
 * it, so the thing they are proud of is identifiably a Primer thing. It is the
 * screen they turn round to show a parent, which is why the name is set large
 * and the medallion is the biggest object on it.
 *
 * What is deliberately absent: a percentage, a points total, a position
 * relative to other children, and any countdown. "Two more to go" appears
 * because a near-term, reachable next step encourages; "you are 41st" does not
 * encourage, it sorts, and sorting five-to-eleven-year-olds against each other
 * is the fastest way to teach the bottom half that effort is pointless.
 *
 * Artwork is from public/badges, served locally. Nothing about a child's
 * progress is fetched from anywhere.
 */

/**
 * A medallion with its level drawn on it.
 *
 * The artwork in /public/badges is a blank shape, and blank is what it looked
 * like: five coloured outlines that said nothing about which was which or how
 * far apart they were. The numeral fixes that in the one way that works for
 * this audience, since it is legible at 36px, needs no reading ability, and
 * makes the ladder countable at a glance.
 *
 * `locked` desaturates without hiding: a rung being aimed at has to stay
 * readable, or it is not a target.
 */
export function RankMedal({
  rank,
  size,
  locked = false,
  className,
  priority = false,
}: {
  rank: (typeof RANKS)[number];
  size: number;
  locked?: boolean;
  className?: string;
  /**
   * Set on the medallion that appears above the fold. It is the largest image
   * on the learner pages, so Next flags it as the Largest Contentful Paint and
   * warns that it is lazily loaded; without this the badge visibly pops in
   * after the rest of the card has painted.
   */
  priority?: boolean;
}) {
  return (
    <span
      className={cn("relative inline-grid shrink-0 place-items-center", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={`/badges/${rank.art}.svg`}
        alt=""
        width={size}
        height={size}
        priority={priority}
        draggable={false}
        className={cn(
          "h-full w-full select-none transition-all",
          locked && "opacity-40 grayscale",
        )}
      />
      <span
        aria-hidden
        className="absolute font-bold leading-none"
        style={{
          // Optical centre, not geometric: shields and rosettes carry their
          // mass above the midpoint, so a numeral centred on the box sits low.
          transform: "translateY(-4%)",
          fontSize: size * 0.4,
          color: locked ? "rgba(11,18,32,0.45)" : rank.ink,
          textShadow: locked ? "none" : "0 1px 1px rgba(0,0,0,0.16)",
        }}
      >
        {rank.level}
      </span>
      <span className="sr-only">
        Rank {rank.level}, {rank.title}
      </span>
    </span>
  );
}

export function RankCard({
  childName,
  badgeCount,
  className,
  compact = false,
}: {
  childName: string;
  badgeCount: number;
  className?: string;
  /** Half-width form: smaller medallion, tighter type, same information. */
  compact?: boolean;
}) {
  const rank = rankFor(badgeCount);
  const next = nextRank(badgeCount);

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] bg-indigo text-white",
        compact ? "px-5 py-5 sm:px-6" : "px-6 py-7 sm:px-8",
        className,
      )}
    >
      {/* Soft rings, kept far behind the medallion so nothing competes. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border-[22px] border-white/[0.07]"
      />

      <div className={cn("relative flex flex-wrap items-center", compact ? "gap-4" : "gap-6 sm:gap-8")}>
        <motion.div
          initial={{ scale: 0.7, opacity: 0, rotate: -8 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.42, duration: 0.8 }}
          className="shrink-0 drop-shadow-[0_10px_24px_rgba(0,0,0,0.28)]"
        >
          {/* Above the fold on every learner page, and the biggest image on
              them, so it is the LCP element. */}
          <RankMedal rank={rank} size={compact ? 72 : 108} priority />
        </motion.div>

        <div className="min-w-0 flex-1">
          <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-white/60">
            Rank {rank.level} of {RANKS.length}
          </p>
          <h2 className={cn("mt-1.5 font-bold leading-none tracking-[-0.02em]", compact ? "text-[1.375rem]" : "text-[1.75rem] sm:text-[2.125rem]")}>
            {childName} the {rank.title}
          </h2>
          <p
            className={cn("mt-2 max-w-md leading-[1.45] text-white/80", compact ? "text-[0.9375rem]" : "mt-2.5 text-[1rem]")}
            style={{ fontFamily: "var(--font-read)" }}
          >
            {rank.says}
          </p>

          {/* The product's name on the thing they are proud of. */}
          <p className={cn("flex items-center gap-2 text-[0.8125rem] font-medium text-white/55", compact ? "mt-3" : "mt-4")}>
            {/* `bare` renders the steps in currentColor, so the mark inherits
                the card's white rather than sitting on its own indigo tile
                inside an indigo card. */}
            <LogoMark size={18} variant="bare" />
            The Primer
          </p>
        </div>
      </div>

      {/* -------------------------------------------------------- the ladder */}
      <div className={cn("relative border-t border-white/15", compact ? "mt-5 pt-4" : "mt-7 pt-5")}>
        <ol className="flex items-end justify-between gap-2">
          {RANKS.map((r) => {
            const held = r.level <= rank.level;
            return (
              <li key={r.level} className="flex min-w-0 flex-1 flex-col items-center">
                {/* Locked rungs stay legible. A rung being aimed at that you
                    cannot make out is not a target. */}
                <RankMedal rank={r} size={compact ? 34 : 44} locked={!held} />
                <span
                  className={cn(
                    "mt-1.5 truncate text-center text-[0.6875rem] leading-tight sm:text-[0.75rem]",
                    held ? "font-semibold text-white" : "text-white/50",
                  )}
                >
                  {r.title}
                </span>
              </li>
            );
          })}
        </ol>

        {next && (
          <p className={cn("mt-4 rounded-xl bg-white/12 px-4 py-3 text-center text-white/90", compact ? "text-[0.875rem]" : "text-[0.9375rem]")}>
            <span className="font-semibold">{next.remaining}</span> more badge
            {next.remaining > 1 ? "s" : ""} and you&rsquo;ll be{" "}
            <span className="font-semibold">{childName} the {next.rank.title}</span>.
          </p>
        )}
        {!next && (
          <p className={cn("mt-4 rounded-xl bg-white/12 px-4 py-3 text-center text-white/90", compact ? "text-[0.875rem]" : "text-[0.9375rem]")}>
            Top of the ladder. Now go and find something harder.
          </p>
        )}
      </div>
    </section>
  );
}

/**
 * The compact form: medallion and title only. For the parent dashboard and
 * anywhere the full card would be shouting.
 */
export function RankChip({
  childName,
  badgeCount,
  className,
}: {
  childName: string;
  badgeCount: number;
  className?: string;
}) {
  const rank = rankFor(badgeCount);

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 shadow-tight",
        className,
      )}
    >
      <RankMedal rank={rank} size={44} />
      <div className="min-w-0">
        <p className="text-[0.9375rem] font-semibold text-ink">
          {childName} the {rank.title}
        </p>
        <p className="text-[0.8125rem] text-ink-45">
          Rank {rank.level} of {RANKS.length} · earned from {badgeCount} badge
          {badgeCount === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  );
}
