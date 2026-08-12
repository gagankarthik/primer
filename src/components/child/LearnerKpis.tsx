import { cn } from "@/components/ui/cn";
import type { LearnerFacts } from "@/lib/learner";

/**
 * THE LEARNER'S FOUR NUMBERS.
 *
 * Sits under the rank card, so the left column reads: who you are, then what
 * you have done. Four tiles rather than three, because three across leaves a
 * gap under a two-column card and a 2x2 block squares off against the ten-row
 * board beside it.
 *
 * What is counted, and why each one is safe to show a child:
 *
 *   Finished     courses they have been through. A count of real things.
 *   Time         hours spent. A fact, never a target, and never a rank input.
 *   Modules      how much is open to them. Grows with age, not with effort,
 *                so it can never read as something they failed to unlock.
 *   Badges       behaviours, not volume.
 *
 * Deliberately absent: anything with a percentage, anything with a streak, and
 * anything phrased as a goal. A number a child did not choose to chase becomes
 * a debt the first week they miss it.
 */

type P = { size?: number; className?: string };

function S({ size = 22, className, children }: P & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

const TICK = (p: P) => (
  <S {...p}>
    <path d="M4 12.5 9.5 18 20 6.5" />
  </S>
);

const CLOCK = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </S>
);

const STACK = (p: P) => (
  <S {...p}>
    <rect x="3" y="4.5" width="18" height="5" rx="1.8" />
    <rect x="3" y="12" width="18" height="5" rx="1.8" />
    <path d="M6 20h9" />
  </S>
);

const ROSETTE = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="9.5" r="5.5" />
    <path d="M8.5 14.2 7 21l5-2.6L17 21l-1.5-6.8" />
  </S>
);

export function LearnerKpis({ facts: f }: { facts: LearnerFacts }) {
  // Whole hours where there are any, otherwise minutes, so a child who has
  // done twenty minutes does not see "0".
  const mins = f.minutesThisWeek;
  const time = mins >= 60 ? `${(mins / 60).toFixed(1)}h` : `${mins}m`;

  const tiles = [
    {
      Icon: TICK,
      value: f.solid,
      label: "finished",
      hint: "you can do these alone",
      tone: "green" as const,
    },
    {
      Icon: CLOCK,
      value: time,
      label: "time spent",
      hint: "this week",
      tone: "indigo" as const,
    },
    {
      Icon: STACK,
      value: f.open.length,
      label: "modules open",
      hint: "more unlock as you grow",
      tone: "amber" as const,
    },
    {
      Icon: ROSETTE,
      value: f.badges.length,
      label: "badges",
      hint: "for things you did",
      tone: "rose" as const,
    },
  ];

  const styles = {
    green: "bg-green-tint text-green",
    indigo: "bg-indigo-tint text-indigo",
    amber: "bg-amber/12 text-amber",
    rose: "bg-rose/10 text-rose",
  };

  return (
    <ul className="grid grid-cols-2 gap-3">
      {tiles.map((t) => (
        <li
          key={t.label}
          className="rounded-2xl border border-line bg-surface p-4 shadow-tight sm:p-5"
        >
          {/*
            Icon on the trailing edge, on the number's line.

            Above the figure it was the first thing read on every tile, and
            four icons stacked down the left of a 2x2 block made a column of
            decoration that arrived before any of the content. Beside the
            number it reads as a label for that number, and the eye still lands
            on the figure first because the figure is four times the size.
          */}
          {/* Both the figure and the tile shrink below sm. Two of these sit
              side by side in a 360px column, which leaves about 118px of
              content per tile: a 1.75rem number next to a 40px tile does not
              fit that, and the icon wraps under the number. */}
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <p className="figure-num text-[1.5rem] font-bold leading-none text-ink sm:text-[1.75rem]">
              {t.value}
            </p>
            <span
              className={cn(
                "grid h-9 w-9 shrink-0 place-items-center rounded-xl sm:h-10 sm:w-10",
                styles[t.tone],
              )}
            >
              <t.Icon size={20} className="sm:hidden" />
              <t.Icon size={22} className="hidden sm:block" />
            </span>
          </div>
          <p className="mt-2 text-[0.9375rem] font-semibold text-ink">{t.label}</p>
          <p className="mt-0.5 text-[0.8125rem] leading-snug text-ink-45">
            {t.hint}
          </p>
        </li>
      ))}
    </ul>
  );
}
