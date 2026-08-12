import Link from "next/link";
import { RankMedal } from "@/components/child/RankCard";
import { AsideCard } from "@/components/child/Page";
import { nextRank } from "@/lib/badges";
import type { LearnerFacts } from "@/lib/learner";

/**
 * The at-a-glance column.
 *
 * Everything here is something a child would otherwise have to navigate away
 * to find out: where they are on the ladder, what they were in the middle of,
 * and the one number that actually reflects effort.
 *
 * It repeats information rather than introducing any, on purpose. A side
 * column that holds unique content becomes a second page nobody scrolls to on
 * a phone; one that summarises is safe to collapse away at narrow widths.
 */
export function LearnerAside({
  facts: f,
  childId,
  /** Hidden on the page that already shows this in full. */
  hide,
}: {
  facts: LearnerFacts;
  childId: string;
  hide?: "rank" | "next";
}) {
  const next = nextRank(f.badges.length);

  // What they were last in the middle of, preferring the thing they found hard.
  const pickUp =
    f.topics.find((t) => t.tender && t.module)?.module ??
    f.topics.find((t) => t.module && t.mastery < 0.7)?.module ??
    f.open[0];

  return (
    <>
      {hide !== "rank" && (
        <AsideCard title="Where you are" tone="indigo">
          <div className="flex items-center gap-4">
            <RankMedal rank={f.rank} size={56} />
            <div className="min-w-0">
              <p className="text-[1.0625rem] font-bold leading-tight text-ink">
                {f.name} the {f.rank.title}
              </p>
              <p className="mt-0.5 text-[0.875rem] text-indigo">
                Rank {f.rank.level} of 5
              </p>
            </div>
          </div>

          {next && hide !== "next" && (
            <p className="mt-4 border-t border-indigo/15 pt-3 text-[0.9375rem] leading-snug text-ink-70">
              <span className="font-semibold text-ink">{next.remaining}</span> more
              badge{next.remaining > 1 ? "s" : ""} to be the {next.rank.title}.
            </p>
          )}
        </AsideCard>
      )}

      {pickUp && (
        <AsideCard title="Carry on with">
          <Link
            href={`/learning/${childId}/play/${pickUp.id}`}
            className="group block"
          >
            <p className="text-[1.0625rem] font-bold text-ink group-hover:text-indigo">
              {pickUp.kidTitle}
            </p>
            <p className="mt-0.5 text-[0.875rem] text-ink-45">
              About {pickUp.minutes} minutes
            </p>
            <span className="mt-3 inline-flex items-center gap-2 rounded-xl bg-indigo px-4 py-2.5 text-[0.9375rem] font-semibold text-white transition-colors group-hover:bg-indigo-hi">
              Have a go
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                &rarr;
              </span>
            </span>
          </Link>
        </AsideCard>
      )}

      <AsideCard title="Your numbers">
        <dl className="space-y-3">
          {[
            ["Badges", f.badges.length],
            ["Can do on your own", f.solid],
            ["Still tricky", f.needsWork],
            ["Stickability", f.effort],
          ].map(([label, value]) => (
            <div
              key={label as string}
              className="flex items-baseline justify-between gap-3 border-b border-line pb-2.5 last:border-0 last:pb-0"
            >
              <dt className="text-[0.9375rem] text-ink-70">{label}</dt>
              <dd className="figure-num text-[1.25rem] font-bold text-ink">
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <Link
          href={`/learning/${childId}/leaderboard`}
          className="mt-4 inline-block text-[0.875rem] font-semibold text-indigo underline underline-offset-4 hover:text-indigo-hi"
        >
          See the top ten
        </Link>
      </AsideCard>
    </>
  );
}
