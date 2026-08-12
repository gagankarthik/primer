import Link from "next/link";
import { notFound } from "next/navigation";
import { getChild } from "@/lib/mock";
import { factsFor, board } from "@/lib/learner";
import { RANKS } from "@/lib/badges";
import { GROUPS } from "@/lib/modules";
import { ModuleArt } from "@/components/modules/ModuleArt";
import { RankCard, RankMedal } from "@/components/child/RankCard";
import { Place } from "@/components/child/Place";
import { LearnerKpis } from "@/components/child/LearnerKpis";
import { AwardIcon } from "@/components/child/AwardIcon";
import { toneBg } from "@/lib/tone";
import { cn } from "@/components/ui/cn";

/**
 * THE LEARNER'S OWN DASHBOARD.
 *
 * Answers, in this order: who am I here, what shall I do next, and how am I
 * doing. That order is deliberate. A child opening this is not auditing
 * themselves, they are deciding what to tap, so the pick-something-up card
 * comes before any figure.
 *
 * Everything below the fold is a fact about them, never a target set for them.
 * There is no "you should do 20 minutes today", because a goal a child did not
 * choose becomes a debt, and a debt is the thing that makes them stop opening
 * the app.
 */
export default async function LearnerDashboard({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const child = getChild(childId);
  if (!child) notFound();

  const f = factsFor(child);

  // What to pick up: the thing they found hard comes first, but framed as an
  // invitation rather than as homework.
  const hard = f.topics.find((t) => t.tender && t.module);
  const next = hard ?? f.topics.find((t) => t.module && t.mastery < 0.7);
  const pickUp = next?.module ?? f.open[0];

  const { top, me, myPosition } = board(childId, 10);
  const boardSize = board(childId, 999).top.length;

  return (
    <main className="px-6 pb-16 pt-2 lg:px-10 lg:pt-10">
      <h1 className="text-[2rem] font-bold tracking-[-0.03em] text-ink sm:text-[2.5rem]">
        Hello, {f.name}.
      </h1>
      <p
        className="mt-2 text-[1.0625rem] text-ink-45"
        style={{ fontFamily: "var(--font-read)" }}
      >
        Here&rsquo;s where you got to.
      </p>

      {/*
        Standing and the board, side by side. At full width the rank card was
        a banner: a lot of indigo carrying four short lines, and it pushed
        everything a child actually taps below the fold. Halving it and giving
        the other half to the board puts "who I am" and "where I am" in the
        same glance, which is the comparison they were making anyway.
      */}
      {/* items-stretch, not items-start: the two cards are a pair and should
          share a baseline at the bottom as well as the top. Left to their own
          heights the rank card ended two hundred pixels short of the board and
          the row read as one card plus an accident. */}
      <div className="mt-8 grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
        {/* Left column, split: standing on top, the four numbers underneath.
            The rank card no longer has to stretch to match a ten-row board,
            which is what left a void through its middle. */}
        <div className="flex flex-col gap-4">
          <RankCard childName={f.name} badgeCount={f.badges.length} compact />
          <LearnerKpis facts={f} />
        </div>

        <section className="flex h-full flex-col rounded-[1.75rem] border border-line bg-surface p-5 shadow-tight sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2.5 text-[1.25rem] font-bold tracking-[-0.02em] text-ink">
              <AwardIcon name="cup" size={26} className="text-amber" />
              Top ten
            </h2>
            <Link
              href={`/learning/${childId}/leaderboard`}
              className="text-[0.875rem] font-semibold text-indigo underline underline-offset-4 hover:text-indigo-hi"
            >
              See all {boardSize}
            </Link>
          </div>
          <p className="mt-1 text-[0.875rem] text-ink-45">
            Ranked on sticking at it, not on being ahead.
          </p>

          <ol className="mt-3 flex-1">
            {top.map((e, i) => {
              const isMe = e.id === childId;
              return (
                <li
                  key={e.id}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-2 py-1.5",
                    isMe && "bg-indigo-tint",
                  )}
                >
                  <Place position={i + 1} isMe={isMe} size="sm" />
                  <RankMedal rank={RANKS[e.rankLevel - 1]} size={26} />
                  <span className="min-w-0 flex-1 truncate text-[0.9375rem] font-semibold text-ink">
                    {e.name}
                    {isMe && (
                      <span className="ml-1.5 text-[0.75rem] font-semibold text-indigo">
                        you
                      </span>
                    )}
                  </span>
                  <span className="figure-num shrink-0 text-[0.9375rem] font-bold text-ink">
                    {e.effort}
                  </span>
                </li>
              );
            })}
          </ol>

          {/*
            Outside the ten, their own row is pinned below the list in the same
            shape as the rows above it. Reduced to a sentence it read as a
            consolation note; as a row it reads as "here you are", which is the
            only thing a child was looking for.
          */}
          {!top.some((e) => e.id === childId) && me && (
            <div className="mt-3 border-t border-dashed border-line-strong pt-3">
              <div className="flex items-center gap-3 rounded-xl bg-indigo-tint px-2 py-1.5">
                <Place position={myPosition} isMe size="sm" />
                <RankMedal rank={RANKS[me.rankLevel - 1]} size={26} />
                <span className="min-w-0 flex-1 truncate text-[0.9375rem] font-semibold text-ink">
                  {me.name}
                  <span className="ml-1.5 text-[0.75rem] font-semibold text-indigo">
                    you
                  </span>
                </span>
                <span className="figure-num shrink-0 text-[0.9375rem] font-bold text-ink">
                  {me.effort}
                </span>
              </div>
              <p className="mt-2 px-2 text-[0.8125rem] text-ink-45">
                {myPosition} out of {boardSize}. {" "}
                {top[9] && `${top[9].effort - me.effort + 1} more and you're in the ten.`}
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Same two columns as the row above, so the page reads as a grid rather
          than as a stack of differently-proportioned bands. */}
      <div className="mt-8 grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="min-w-0">
      {/* ------------------------------------------------------- pick it up */}
      {pickUp && (
        <section>
          <h2 className="text-[1.25rem] font-bold tracking-[-0.02em] text-ink">
            {hard ? "Shall we have another go at this?" : "Pick up where you left off"}
          </h2>
          {hard && (
            <p className="mt-1 text-[0.9375rem] text-ink-45">
              It was tricky last time. Tricky is where the learning is.
            </p>
          )}

          <Link
            href={`/learning/${childId}/play/${pickUp.id}`}
            className="group mt-4 flex flex-wrap items-center gap-5 overflow-hidden rounded-[1.75rem] border border-line bg-surface p-4 shadow-tight transition-all hover:-translate-y-1 hover:shadow-lift sm:p-5"
          >
            <span
              className={cn(
                "grid h-24 w-32 shrink-0 place-items-center overflow-hidden rounded-2xl",
                toneBg(pickUp.tone),
              )}
            >
              <ModuleArt art={pickUp.art} tone={pickUp.tone} className="h-full w-full" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[1.25rem] font-bold text-ink">
                {pickUp.kidTitle}
              </span>
              <span className="mt-1 block text-[0.9375rem] text-ink-45">
                About {pickUp.minutes} minutes
              </span>
            </span>
            <span
              aria-hidden
              className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-indigo text-[1.5rem] text-white transition-transform group-hover:translate-x-1"
            >
              &rarr;
            </span>
          </Link>
        </section>
      )}

      {/* The "this week" stat row that used to sit here is gone: the four
          tiles beside the rank card say the same thing, higher up. */}
        </div>

      {/* ----------------------------------------------------- what's open */}
      <section className="mt-0">
        <h2 className="text-[1.25rem] font-bold tracking-[-0.02em] text-ink">
          Everything you can try
        </h2>
        <p className="mt-1 text-[0.9375rem] text-ink-45">
          {f.open.length} things, in three kinds.
        </p>

        <ul className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {(["numbers", "arithmetic", "letters"] as const).map((g) => {
            const n = f.open.filter((m) => m.group === g).length;
            if (n === 0) return null;
            return (
              <li key={g}>
                <Link
                  href={`/learning/${childId}/courses#${g}`}
                  className="block rounded-2xl border border-line bg-surface p-5 shadow-tight transition-all hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <span className="block text-[1.125rem] font-bold text-ink">
                    {GROUPS[g].kidLabel}
                  </span>
                  <span className="mt-1 block text-[0.9375rem] text-ink-45">
                    {n} to try
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

      </section>
      </div>
    </main>
  );
}
