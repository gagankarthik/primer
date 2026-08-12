import { notFound } from "next/navigation";
import { getChild } from "@/lib/mock";
import { factsFor } from "@/lib/learner";
import { BADGES, RANKS, nextRank, type BadgeKind } from "@/lib/badges";
import { Badge } from "@/components/Badge";
import { RankMedal } from "@/components/child/RankCard";
import { LearnerPage, Section } from "@/components/child/Page";
import { LearnerAside } from "@/components/child/LearnerAside";
import { AwardIcon } from "@/components/child/AwardIcon";
import { cn } from "@/components/ui/cn";

/**
 * MY BADGES.
 *
 * One grid, every badge, earned first. The ones not yet earned are in the same
 * grid as silhouettes: same size, same position, greyed and dimmed.
 *
 * This replaced two separate sections, "You've got 3" and "Still to get",
 * which was worse for a reason worth writing down. Splitting them turned the
 * second heading into a list of failures a child had to scroll past to leave
 * the page, and it hid the only useful thing about a locked badge, which is
 * that it sits in a set you are already partway through. In one grid, three
 * bright badges among six read as progress. In two lists, three bright badges
 * and a heading saying "still to get" read as a shortfall.
 *
 * Every one is behavioural. Nothing here is for minutes, sessions, or days in
 * a row, because a child who learns to farm a streak has learned the wrong
 * lesson from a product whose whole thesis is that shortcuts hollow you out.
 */
export default async function LearnerAchievements({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const child = getChild(childId);
  if (!child) notFound();

  const f = factsFor(child);
  const earned = new Set(f.badges);
  const next = nextRank(f.badges.length);

  // Earned first, then the rest, but all in one grid.
  const all = (Object.keys(BADGES) as BadgeKind[]).sort(
    (a, b) => Number(earned.has(b)) - Number(earned.has(a)),
  );

  return (
    <LearnerPage
      aside={<LearnerAside facts={f} childId={childId} hide="rank" />}
      title="My badges"
      blurb={`You've got ${f.badges.length} of ${all.length}. None of them are for turning up.`}
    >
      <div className="mb-8 flex items-center gap-3 text-ink-45">
        <AwardIcon name="medal" size={22} className="text-amber" />
        <p className="text-[0.9375rem]">
          Every badge is for something you did, never for minutes or days in a
          row.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
        {all.map((k) => {
          const got = earned.has(k);
          return (
            <li
              key={k}
              className={cn(
                "flex items-start gap-4 rounded-2xl border p-5 transition-colors",
                got
                  ? "border-line bg-surface shadow-tight"
                  : // Silhouette: present, placed, and clearly not yours yet.
                    // Not hidden behind a question mark, because a locked badge
                    // you cannot identify is a lottery ticket rather than a
                    // thing you can decide to go and do.
                    "border-dashed border-line-strong bg-grey-tint/40",
              )}
            >
              <span className={cn(!got && "opacity-45 grayscale")}>
                <Badge kind={k} earned={got} size={56} />
              </span>

              <div className="min-w-0">
                <p
                  className={cn(
                    "text-[1.0625rem] font-bold",
                    got ? "text-ink" : "text-ink-45",
                  )}
                >
                  {BADGES[k].name}
                </p>
                <p
                  className={cn(
                    "mt-1 text-[0.9375rem] leading-snug",
                    got ? "text-ink-70" : "text-ink-45",
                  )}
                  style={{ fontFamily: "var(--font-read)" }}
                >
                  {/* Earned: what it meant. Not earned: exactly how to get it. */}
                  {got ? BADGES[k].blurb : BADGES[k].earnedFor}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      {/* ------------------------------------------------------- the ladder */}
      <Section
        title="Your rank"
        blurb={
          next
            ? `${next.remaining} more badge${next.remaining > 1 ? "s" : ""} and you're ${f.name} the ${next.rank.title}.`
            : "Top of the ladder."
        }
      >
        <ol className="flex flex-wrap items-start gap-3">
          {RANKS.map((r) => {
            const held = r.level <= f.rank.level;
            return (
              <li
                key={r.level}
                className={cn(
                  "flex min-w-[8.5rem] flex-1 flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-center",
                  held ? "border-indigo/25 bg-indigo-tint" : "border-line bg-surface",
                )}
              >
                <RankMedal rank={r} size={56} locked={!held} />
                <span
                  className={cn(
                    "text-[0.9375rem] font-bold leading-tight",
                    held ? "text-ink" : "text-ink-45",
                  )}
                >
                  {r.title}
                </span>
                <span className="text-[0.75rem] leading-snug text-ink-45">
                  {r.needs === 0 ? "from the start" : `${r.needs} badges`}
                </span>
              </li>
            );
          })}
        </ol>
      </Section>
    </LearnerPage>
  );
}
