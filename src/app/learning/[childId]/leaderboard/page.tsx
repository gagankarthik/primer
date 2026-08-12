import { notFound } from "next/navigation";
import { getChild } from "@/lib/mock";
import { board, household } from "@/lib/learner";
import { RANKS } from "@/lib/badges";
import { RankMedal } from "@/components/child/RankCard";
import { Place } from "@/components/child/Place";
import { AwardTile } from "@/components/child/AwardIcon";
import { LearnerPage, Section } from "@/components/child/Page";
import { cn } from "@/components/ui/cn";

/**
 * THE TOP TEN.
 *
 * Ranked on effort, never attainment: badges earned (all behavioural), times
 * they got stuck and carried on, times they asked why, times they caught their
 * own mistake. Nothing in the number rewards being ahead, being fast, or being
 * on for longer.
 *
 * That is the whole design. On an attainment board the child who finds
 * everything hard loses every week for years and draws a permanent conclusion
 * from it. On this one they can lead, because what is being counted is exactly
 * the thing they are doing more of than anyone else.
 *
 * Peers are first name and initial, within two years of age, and nothing on
 * this page links to another child. See lib/learner.ts for the constraints the
 * real query has to keep.
 */
export default async function LearnerLeaderboard({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const child = getChild(childId);
  if (!child) notFound();

  const { top, me, myPosition } = board(childId, 50);
  const inTop = top.some((e) => e.id === childId);
  const house = household();
  const rankOf = (level: number) => RANKS[level - 1];

  return (
    <LearnerPage
      title="Top ten"
      blurb="Learners about your age who keep going when things get hard. This isn't about who's ahead."
    >
      <div className="mb-5 flex items-center gap-4 rounded-2xl bg-indigo-tint px-5 py-4">
        <AwardTile name="podium" tone="indigo" size={52} />
        <p className="text-[1rem] leading-snug text-ink">
          Everyone here is ranked on{" "}
          <span className="font-semibold">sticking at it</span>, not on being
          ahead. The person who finds things hardest can be top.
        </p>
      </div>

      <ol className="space-y-2.5">
        {top.map((e, i) => {
          const isMe = e.id === childId;
          return (
            <li key={e.id}>
              <div
                className={cn(
                  "flex flex-wrap items-center gap-4 rounded-2xl border px-4 py-3.5 shadow-tight sm:px-5",
                  isMe
                    ? "border-indigo/35 bg-indigo-tint"
                    : e.isHousehold
                      ? "border-green/30 bg-green-tint"
                      : "border-line bg-surface",
                )}
              >
                <Place position={i + 1} isMe={isMe} />
                <RankMedal rank={rankOf(e.rankLevel)} size={44} />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[1.0625rem] font-bold text-ink">
                    {e.name}
                    {isMe && (
                      <span className="ml-2 text-[0.8125rem] font-semibold text-indigo">
                        that&rsquo;s you
                      </span>
                    )}
                    {!isMe && e.isHousehold && (
                      <span className="ml-2 text-[0.8125rem] font-semibold text-green">
                        your house
                      </span>
                    )}
                  </p>
                  <p className="truncate text-[0.875rem] text-ink-45">
                    the {e.rankTitle} · {e.badges} badge{e.badges === 1 ? "" : "s"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="figure-num text-[1.375rem] font-bold leading-none text-ink">
                    {e.effort}
                  </p>
                  <p className="text-[0.6875rem] text-ink-45">stickability</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Off the board? Say where they are plainly rather than hiding it.
          A child who cannot find themselves assumes the worst. */}
      {!inTop && me && (
        <div className="mt-3 rounded-2xl border-2 border-dashed border-indigo/35 bg-indigo-tint px-5 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <Place position={myPosition} isMe />
            <RankMedal rank={rankOf(me.rankLevel)} size={44} />
            <div className="min-w-0 flex-1">
              <p className="text-[1.0625rem] font-bold text-ink">
                {me.name}
                <span className="ml-2 text-[0.8125rem] font-semibold text-indigo">
                  that&rsquo;s you
                </span>
              </p>
              <p className="text-[0.875rem] text-ink-45">
                the {me.rankTitle} · {me.badges} badge
                {me.badges === 1 ? "" : "s"}
              </p>
            </div>
            <div className="text-right">
              <p className="figure-num text-[1.375rem] font-bold leading-none text-ink">
                {me.effort}
              </p>
              <p className="text-[0.6875rem] text-ink-45">stickability</p>
            </div>
          </div>
        </div>
      )}

      {/*
        The explainer is not optional furniture. A child who does not
        understand why they are below someone will assume it is because they
        are worse at maths, and that assumption is the harm this whole design
        is built to avoid.
      */}
      <Section title="What is stickability?">
        <div className="rounded-2xl bg-green-tint px-5 py-5">
          <p
            className="text-[1.0625rem] leading-[1.5] text-ink"
            style={{ fontFamily: "var(--font-read)" }}
          >
            It counts the hard things. Badges you&rsquo;ve earned, times you got
            stuck and carried on anyway, times you asked why, and times you
            spotted your own mistake.
          </p>
          <p
            className="mt-3 text-[1.0625rem] leading-[1.5] text-ink"
            style={{ fontFamily: "var(--font-read)" }}
          >
            It does <strong>not</strong> count how old you are, how many minutes
            you spent, how fast you were, or how many you got right first time.
            So the person who finds things hardest can be top of this list. That
            is on purpose.
          </p>
        </div>
      </Section>

      {/* The household strip. A sibling rivalry is bounded and a parent is in
          the room to referee it, which is not true of the wider board. */}
      {house.length > 1 && (
        <Section title="Just our house">
          <ul className="grid gap-3 sm:grid-cols-2">
            {house.map((h) => {
              const isMe = h.child.profile.childId === childId;
              return (
                <li
                  key={h.child.profile.childId}
                  className={cn(
                    "flex items-center gap-4 rounded-2xl border px-5 py-4",
                    isMe
                      ? "border-indigo/30 bg-indigo-tint"
                      : "border-line bg-surface",
                  )}
                >
                  <RankMedal rank={h.rank} size={48} />
                  <div className="min-w-0">
                    <p className="text-[1.0625rem] font-bold text-ink">{h.name}</p>
                    <p className="text-[0.875rem] text-ink-45">
                      the {h.rank.title} · {h.effort} stickability
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Section>
      )}
    </LearnerPage>
  );
}
