import Link from "next/link";
import { CHILD_LIST, getChild, type MockChild } from "@/lib/mock";
import { modulesForAge, MODULES } from "@/lib/modules";
import { DescentTrace } from "@/components/DescentTrace";
import { ParentShell } from "@/components/parent/ParentShell";
import { Kpis } from "@/components/parent/Kpis";
import { ModuleArt } from "@/components/modules/ModuleArt";
import { Stars } from "@/components/modules/ModuleCard";
import { Badge } from "@/components/Badge";
import { BADGES, type BadgeKind } from "@/lib/badges";
import { RankChip } from "@/components/child/RankCard";
import { ProgressBar } from "@/components/ui/Progress";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconVoice, IconClock, IconFlag, IconTrace } from "@/components/ui/Icons";
import { toneBg, toneBar } from "@/lib/tone";
import { cn } from "@/components/ui/cn";

/**
 * PARENT OVERVIEW.
 *
 * Opens with one sentence in plain English, because a parent checks this for
 * ninety seconds between other things and a grid of tiles makes them hunt for
 * the point. Everything below the sentence is the evidence for it.
 */
export default async function ParentOverview({
  searchParams,
}: {
  searchParams: Promise<{ child?: string }>;
}) {
  const { child: param } = await searchParams;
  const child = getChild(param ?? "nell") ?? CHILD_LIST[0];

  return (
    <ParentShell childId={child.profile.childId}>
      {/* Fills the width rather than sitting in a centred column: the rail is
          already on the left, and a capped column left a third of a desktop
          monitor empty to the right of every chart. */}
      <main className="px-5 py-10 sm:px-8 sm:py-12 xl:px-10">
        <Headline child={child} />
        <Kpis child={child} />
        <InProgress child={child} />
        <Sessions child={child} />
        <Earned child={child} />
        <Suggested child={child} />
        <Controls child={child} />
      </main>
    </ParentShell>
  );
}

/* ------------------------------------------------------------- headline */

function Headline({ child }: { child: MockChild }) {
  const watch = child.headline.tone === "watch";
  return (
    <section className="mb-8">
      <p className="eyebrow mb-3 text-ink-45">this week</p>
      <div
        className={cn(
          "rounded-2xl border p-6 shadow-tight sm:p-7",
          watch
            ? "border-amber/30 bg-amber/[0.06]"
            : "border-green/25 bg-green-tint",
        )}
      >
        <div className="flex gap-4">
          <span
            className={cn(
              "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full",
              watch ? "bg-amber/20 text-amber" : "bg-green/15 text-green",
            )}
          >
            <IconFlag size={18} />
          </span>
          <p className="text-[1.0625rem] leading-[1.55] text-ink sm:text-[1.125rem]">
            {child.headline.text}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- stats */

function Stats({ child }: { child: MockChild }) {
  const minutes = child.sessions.reduce((s, x) => s + x.minutes, 0);
  const rung = child.profile.cognitive.medianSolveRung;
  const count = child.sessions.length;
  const p = child.profile;

  // How many distinct topics this child has actually attempted, and how many
  // of those they get through without needing to be walked down the ladder.
  const topics = Object.entries(p.cognitive.topics);
  const solid = topics.filter(([, t]) => t.mastery >= 0.7).length;

  const items = [
    { v: String(count), l: "sessions", note: "this week" },
    {
      v: String(minutes),
      l: "minutes",
      // Two placeholders here used to read ", " — an em-dash that a bulk
      // find-replace turned into a comma and a space, so an empty stat
      // rendered as stray punctuation.
      note: count ? `${Math.round(minutes / count)} min average` : "no sessions yet",
    },
    {
      v: rung === null ? "not yet" : `rung ${rung}`,
      l: "usual help needed",
      note:
        rung === null
          ? "not enough data yet"
          : rung <= 1
            ? "reasoning it out"
            : rung <= 3
              ? "needs a nudge"
              : "needs walking through",
    },
    {
      v: `${solid}/${topics.length}`,
      l: "topics solid",
      note:
        topics.length === 0
          ? "nothing attempted yet"
          : `${p.behavioral.sessionsLast30d} sessions in 30 days`,
    },
  ];

  return (
    <section className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((s) => (
        <div
          key={s.l}
          className="rounded-2xl border border-line bg-surface px-5 py-5 shadow-tight"
        >
          <p className="figure-num text-3xl font-semibold text-ink">{s.v}</p>
          <p className="mt-1.5 text-[0.875rem] font-medium text-ink">{s.l}</p>
          <p className="mt-0.5 text-[0.8125rem] text-ink-45">{s.note}</p>
        </div>
      ))}
    </section>
  );
}

/* ---------------------------------------------------------- in progress */

function InProgress({ child }: { child: MockChild }) {
  const topics = Object.entries(child.profile.cognitive.topics);
  const mods = modulesForAge(child.profile.contextual.ageYears).slice(0, 3);

  if (mods.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold tracking-[-0.02em] text-ink">
          What {child.profile.displayName} is working on
        </h2>
        <EmptyState
          title="Nothing started yet"
          body="Pick a module together and it'll show up here after the first session."
          actionLabel="Browse modules"
          actionHref="/modules"
        />
      </section>
    );
  }

  const registered = modulesForAge(child.profile.contextual.ageYears).length;

  return (
    <section className="mb-12">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">
          What {child.profile.displayName} is working on
        </h2>
        <Link
          href={`/parent/courses?child=${child.profile.childId}`}
          className="text-[0.875rem] font-medium text-indigo underline underline-offset-4 hover:text-indigo-hi"
        >
          All {registered} registered courses
        </Link>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mods.map((m, i) => {
          // Pair each module with the closest tracked topic so the progress
          // shown is real rather than decorative.
          const entry = topics[i];
          const pct = entry ? Math.round(entry[1].mastery * 100) : 0;
          const band =
            pct >= 75 ? "Solid" : pct >= 45 ? "Getting there" : "Just started";
          const tender =
            entry && child.profile.emotional.tenderTopics.includes(entry[0]);

          return (
            <li key={m.id}>
              <Link
                href={`/modules/${m.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-tight transition-all hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift"
              >
                <span className={toneBg(m.tone)}>
                  <ModuleArt art={m.art} tone={m.tone} className="h-24 w-full" />
                </span>

                <span className="flex flex-1 flex-col p-5">
                  <span className="text-[0.9375rem] font-semibold text-ink">
                    {m.title}
                  </span>
                  <span className="mt-1 text-[0.8125rem] text-ink-45">{band}</span>

                  <span className="mt-4 block">
                    <ProgressBar
                      value={pct}
                      tone={pct >= 75 ? "green" : pct >= 45 ? "indigo" : "amber"}
                      label={`${m.title} progress`}
                    />
                  </span>

                  {tender && (
                    <span className="mt-3 text-[0.75rem] text-amber">
                      Has been frustrating
                    </span>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------- sessions */

function Sessions({ child }: { child: MockChild }) {
  if (child.sessions.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold tracking-[-0.02em] text-ink">
          How much help each session took
        </h2>
        <EmptyState
          icon={<IconTrace size={22} />}
          title="No sessions this week"
          body="Once they've had a go at something, the shape of each session appears here."
        />
      </section>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="mb-1 text-lg font-semibold tracking-[-0.02em] text-ink">
        How much help each session took
      </h2>
      <p className="mb-5 max-w-xl text-[0.9375rem] leading-relaxed text-ink-45">
        The line drops when they got stuck and rises when they found their
        footing. A dip that recovers is a good session.
      </p>

      <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface shadow-tight">
        {child.sessions.map((s) => (
          <li
            key={s.id}
            className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"
          >
            <div className="min-w-40">
              <p className="text-[0.9375rem] font-medium capitalize text-ink">
                {s.topic.replace(/-/g, " ")}
              </p>
              <p className="figure-num mt-0.5 text-xs text-ink-45">
                {s.date} &middot; {s.minutes} min
              </p>
            </div>
            <DescentTrace trace={s.rungTrace} width={200} height={44} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/* --------------------------------------------------------------- badges */

function Earned({ child }: { child: MockChild }) {
  const earned: BadgeKind[] = ["climbed-back", "asked-why", "first-word"];
  return (
    <section className="mb-12">
      <h2 className="mb-1 text-lg font-semibold tracking-[-0.02em] text-ink">
        Earned this month
      </h2>
      <p className="mb-5 text-[0.9375rem] text-ink-45">
        Nothing here is for minutes spent or days in a row.
      </p>

      {/* The standing the child sees on their own screen, shown here so a
          parent knows what they are being told at the dinner table. */}
      <RankChip
        childName={child.profile.displayName}
        badgeCount={earned.length}
        className="mb-5"
      />
      <ul className="grid gap-4 sm:grid-cols-3">
        {earned.map((k) => (
          <li
            key={k}
            className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 shadow-tight"
          >
            <Badge kind={k} size={48} />
            <span className="min-w-0">
              <span className="block text-[0.875rem] font-semibold text-ink">
                {BADGES[k].name}
              </span>
              <span className="mt-0.5 block text-[0.75rem] leading-snug text-ink-45">
                {BADGES[k].earnedFor}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------ suggested */

function Suggested({ child }: { child: MockChild }) {
  const age = child.profile.contextual.ageYears;
  const picks = MODULES.filter((m) => age >= m.minAge - 1 && age <= m.maxAge + 1)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <section className="mb-12">
      <h2 className="mb-4 text-lg font-semibold tracking-[-0.02em] text-ink">
        You might add next
      </h2>
      <ul className="overflow-hidden rounded-2xl border border-line bg-surface shadow-tight">
        {picks.map((m, i) => (
          <li
            key={m.id}
            className={cn(
              "flex items-center gap-4 p-4",
              i > 0 && "border-t border-line",
            )}
          >
            <span
              className={cn(
                "hidden h-14 w-24 shrink-0 overflow-hidden rounded-xl sm:block",
                toneBg(m.tone),
              )}
            >
              <ModuleArt art={m.art} tone={m.tone} className="h-full w-full" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-[0.9375rem] font-semibold text-ink">
                {m.title}
              </span>
              <span className="mt-0.5 block text-[0.8125rem] text-ink-45">
                {m.blurb}
              </span>
              <span className="mt-2 flex items-center gap-2 text-[0.75rem] text-ink-45">
                <Stars value={m.rating} size={12} />
                <span className="figure-num">{m.rating}</span>
                <span className="figure-num">({m.reviews})</span>
              </span>
            </span>

            <Link
              href={`/modules/${m.id}`}
              className="shrink-0 rounded-lg border border-line-strong px-4 py-2 text-[0.8125rem] font-medium text-ink transition-colors hover:border-ink/30"
            >
              View
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------- controls */

function Controls({ child }: { child: MockChild }) {
  const hours = child.profile.behavioral.activeHours;
  const fmt = (h: number) => `${h % 12 || 12}${h < 12 ? "am" : "pm"}`;

  return (
    <section className="rounded-2xl border border-line bg-surface p-6 shadow-tight sm:p-7">
      <h2 className="mb-5 text-lg font-semibold tracking-[-0.02em] text-ink">
        Your settings
      </h2>

      <dl className="space-y-4 text-[0.9375rem]">
        <div className="flex items-center justify-between gap-6">
          <dt className="flex items-center gap-3 text-ink-70">
            <IconClock size={18} className="text-indigo" />
            Can use the Primer
          </dt>
          <dd className="figure-num text-ink">7am &ndash; 8pm</dd>
        </div>
        <div className="flex items-center justify-between gap-6 border-t border-line pt-4">
          <dt className="flex items-center gap-3 text-ink-70">
            <IconVoice size={18} className="text-indigo" />
            Usually opens it
          </dt>
          <dd className="figure-num text-ink">{hours.map(fmt).join(", ")}</dd>
        </div>
        <div className="flex items-start justify-between gap-6 border-t border-line pt-4">
          <dt className="flex items-center gap-3 text-ink-70">
            <IconFlag size={18} className="text-indigo" />
            Tell me if
          </dt>
          <dd className="max-w-64 text-right text-ink">
            something upsetting comes up, or a week goes quiet
          </dd>
        </div>
      </dl>

      <p className="mt-6 border-t border-line pt-5 text-[0.8125rem] leading-relaxed text-ink-45">
        The Primer never keeps a recording of {child.profile.displayName}
        &rsquo;s voice. Speech is turned into text on the way through and the
        audio is discarded. Nothing they say trains a model.
      </p>
    </section>
  );
}
