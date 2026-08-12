import Link from "next/link";
import { HelpTrend, TopicBars, WeekBars } from "@/components/parent/Charts";
import { Panel } from "@/components/parent/Layout";
import type { MockChild } from "@/lib/mock";
import { topicsFor } from "@/lib/learner";
import { cn } from "@/components/ui/cn";

/**
 * THE KPI BLOCK.
 *
 * Four figures, then the charts behind them. Chosen against one test: if this
 * number moved, would a parent do something different this week? Anything that
 * fails that test is vanity and is not here, which is why there is no total
 * questions answered, no lifetime minutes, and no streak.
 *
 *   Help needed      the product's whole thesis, as one number, with direction
 *   Independent      things they now do from a bare question
 *   Comebacks        got stuck, carried on. The behaviour we are buying
 *   Needs a hand     the count that turns into an action
 *
 * Each carries a direction indicator against the previous period, because a
 * number with no baseline is a number nobody can act on. Where there is not
 * enough history for a comparison it says so rather than inventing one.
 */

type Trend = { dir: "up" | "down" | "flat"; label: string; good: boolean };

function Kpi({
  value,
  label,
  hint,
  trend,
  tone = "ink",
}: {
  value: React.ReactNode;
  label: string;
  hint?: string;
  trend?: Trend;
  tone?: "ink" | "green" | "amber" | "indigo";
}) {
  const colour = {
    ink: "text-ink",
    green: "text-green",
    amber: "text-amber",
    indigo: "text-indigo",
  }[tone];

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-tight">
      <div className="flex items-baseline gap-2">
        <p className={cn("figure-num text-[2rem] font-semibold leading-none", colour)}>
          {value}
        </p>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.75rem] font-semibold",
              trend.dir === "flat"
                ? "bg-grey-tint text-ink-45"
                : trend.good
                  ? "bg-green/12 text-green"
                  : "bg-amber/15 text-amber",
            )}
          >
            <span aria-hidden>
              {trend.dir === "up" ? "▲" : trend.dir === "down" ? "▼" : "–"}
            </span>
            {trend.label}
          </span>
        )}
      </div>
      <p className="mt-2 text-[0.9375rem] font-medium text-ink">{label}</p>
      {hint && (
        <p className="mt-0.5 text-[0.8125rem] leading-snug text-ink-45">{hint}</p>
      )}
    </div>
  );
}

export function Kpis({ child }: { child: MockChild }) {
  const sessions = child.sessions;
  const topics = topicsFor(child);

  /**
   * Mean help rung per session, so the trend is comparable across sessions of
   * different lengths. `rungTrace` is a union of literal rungs rather than
   * `number[]`, so the accumulator is widened explicitly.
   */
  const meanRung = (s: (typeof sessions)[number]) =>
    s.rungTrace.reduce<number>((a, b) => a + b, 0) /
    Math.max(1, s.rungTrace.length);

  const recent = sessions.slice(0, Math.ceil(sessions.length / 2));
  const older = sessions.slice(Math.ceil(sessions.length / 2));

  const avg = (xs: typeof sessions) =>
    xs.length ? xs.reduce((a, s) => a + meanRung(s), 0) / xs.length : 0;

  const nowHelp = avg(recent);
  const wasHelp = avg(older);
  const helpDelta = wasHelp ? nowHelp - wasHelp : 0;

  const comebacks = sessions.filter((s) => {
    const t = s.rungTrace;
    return t.length > 1 && Math.max(...t) > t[t.length - 1];
  }).length;

  const independent = topics.filter((t) => t.mastery >= 0.7).length;
  const needsHand = topics.filter((t) => t.tender || t.mastery < 0.4).length;

  // Oldest first, so the trend line reads left to right like a calendar.
  const trendPoints = [...sessions]
    .reverse()
    .map((s) => ({
      label: new Date(s.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      }),
      rung: meanRung(s),
    }));

  const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({
    day,
    minutes: sessions[i]?.minutes ?? 0,
  }));

  return (
    <>
      <section className="mb-10">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">
            The four that matter
          </h2>
          <p className="text-[0.8125rem] text-ink-45">
            compared with the previous {older.length} session
            {older.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi
            value={nowHelp.toFixed(1)}
            label="Help needed, on average"
            hint="0 is a bare question. 5 is being told."
            tone={nowHelp <= 2 ? "green" : nowHelp <= 3.5 ? "indigo" : "amber"}
            trend={
              older.length === 0
                ? { dir: "flat", label: "no baseline", good: true }
                : {
                    dir: helpDelta < 0 ? "down" : helpDelta > 0 ? "up" : "flat",
                    label: `${Math.abs(helpDelta).toFixed(1)}`,
                    // Less help is better, so a fall is the good direction.
                    good: helpDelta <= 0,
                  }
            }
          />
          <Kpi
            value={independent}
            label="Doing it independently"
            hint="Topics they finish from a bare question."
            tone="green"
          />
          <Kpi
            value={comebacks}
            label="Got stuck, carried on"
            hint="The behaviour worth paying for."
            tone="indigo"
          />
          <Kpi
            value={needsHand}
            label="Could use a hand"
            hint="Where sitting next to them would help most."
            tone={needsHand > 0 ? "amber" : "green"}
          />
        </div>
      </section>

      {/* ------------------------------------------------------------ charts */}
      <section className="mb-10 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Panel
          title="How much help, session by session"
          blurb="Up is better. The line rises as they need less help, which is the only direction that matters here."
        >
          <HelpTrend points={trendPoints} />
        </Panel>

        <Panel
          title="Minutes this week"
          blurb="A fact, not a target."
        >
          <WeekBars days={week} />
        </Panel>
      </section>

      <section className="mb-10">
        <Panel
          title="Where they are, topic by topic"
          blurb="Sorted by how solid it is. Amber is where the frustration has been."
        >
          <TopicBars
            rows={topics.map((t) => ({
              label: t.label,
              value: Math.round(t.mastery * 100),
              tender: t.tender,
            }))}
          />
          <Link
            href={`/parent/courses?child=${child.profile.childId}`}
            className="mt-5 inline-block text-[0.875rem] font-medium text-indigo underline underline-offset-4 hover:text-indigo-hi"
          >
            See every course
          </Link>
        </Panel>
      </section>
    </>
  );
}
