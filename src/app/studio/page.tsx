import Link from "next/link";
import { WorkPage, Card, Metric, Pill } from "@/components/app/Page";
import { CREATOR_COURSES, PAYOUTS } from "@/lib/platform";
import { STATUS } from "@/components/app/statusPill";

/**
 * STUDIO OVERVIEW.
 *
 * Leads on the one thing a creator can act on today: the module that came back
 * with changes asked for. A dashboard that opens with lifetime learner counts
 * is a dashboard that lets a rejected module sit for a fortnight.
 *
 * The headline metric is median help rung, not learners reached. A module used
 * by four hundred children who all had to be walked to the answer is a worse
 * module than one used by forty who got there themselves, and the numbers on
 * this page should make that obvious rather than reward reach.
 */
export default function StudioOverview() {
  const live = CREATOR_COURSES.filter((c) => c.status === "live");
  const needsWork = CREATOR_COURSES.filter((c) => c.status === "changes");
  const waiting = CREATOR_COURSES.filter((c) => c.status === "waiting");
  const drafts = CREATOR_COURSES.filter((c) => c.status === "draft");

  const learners = live.reduce((n, c) => n + (c.stats?.learners ?? 0), 0);
  const avgRung =
    live.length > 0
      ? live.reduce((n, c) => n + (c.stats?.medianHelpRung ?? 0), 0) / live.length
      : 0;
  const avgIndependent =
    live.length > 0
      ? live.reduce((n, c) => n + (c.stats?.independentPct ?? 0), 0) / live.length
      : 0;

  return (
    <WorkPage
      title="Studio"
      blurb="What you have written, and how it lands with the children who use it."
      action={
        <Link
          href="/studio/courses/new"
          className="rounded-xl bg-ink px-4 py-2.5 text-[0.875rem] font-semibold text-white transition-colors hover:bg-ink/88"
        >
          New module
        </Link>
      }
    >
      {/* ------------------------------------------------- act on this first */}
      {needsWork.length > 0 && (
        <Card
          tone="warn"
          className="mb-6"
          title="Waiting on you"
          blurb="A reviewer read it and sent it back. Nothing else on this page is more useful than fixing these."
        >
          <ul className="space-y-3">
            {needsWork.map((c) => (
              <li
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-base px-4 py-3.5"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.9375rem] font-semibold text-ink">
                    {c.title}
                  </span>
                  {c.note && (
                    <span className="mt-0.5 block text-[0.875rem] leading-snug text-ink-70">
                      {c.note}
                    </span>
                  )}
                </span>
                <Link
                  href={`/studio/courses/${c.id}`}
                  className="shrink-0 rounded-lg bg-ink px-4 py-2 text-[0.875rem] font-semibold text-white transition-colors hover:bg-ink/88"
                >
                  Fix it
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <section className="mb-6">
        <h2 className="mb-4 text-lg font-semibold tracking-[-0.02em] text-ink">
          How your live modules are doing
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            value={avgRung.toFixed(1)}
            label="Median help needed"
            hint="Across your modules. Lower is better; this is the number to write for."
            tone={avgRung <= 2 ? "green" : "amber"}
          />
          <Metric
            value={`${Math.round(avgIndependent)}%`}
            label="Finish independently"
            hint="Got there without dropping to a worked example."
            tone="green"
          />
          <Metric
            value={learners.toLocaleString("en-GB")}
            label="Learners reached"
            hint="Aggregated. No module tells you who."
          />
          <Metric
            value={`$${PAYOUTS.thisMonth.toFixed(2)}`}
            label="This month"
            hint={`${PAYOUTS.sessionsThisMonth.toLocaleString("en-GB")} sessions at $${PAYOUTS.ratePerSession.toFixed(2)}`}
            tone="indigo"
          />
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card
          title="Your modules"
          action={
            <Link
              href="/studio/courses"
              className="text-[0.875rem] font-medium text-indigo underline underline-offset-4 hover:text-indigo-hi"
            >
              See all
            </Link>
          }
        >
          <ul className="space-y-2.5">
            {CREATOR_COURSES.map((c) => {
              const s = STATUS[c.status];
              return (
                <li key={c.id}>
                  <Link
                    href={`/studio/courses/${c.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-base px-4 py-3 transition-colors hover:bg-grey-tint"
                  >
                    <span className="min-w-0">
                      <span className="block text-[0.9375rem] font-medium text-ink">
                        {c.title}
                      </span>
                      <span className="block text-[0.8125rem] text-ink-45">
                        ages {c.ages[0]} to {c.ages[1]} · {c.lessons} lessons,{" "}
                        {c.checks} checks
                      </span>
                    </span>
                    <Pill tone={s.tone}>{s.label}</Pill>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card
          title="Where children get stuck"
          blurb="The check most of them get wrong first time, per live module. This is the most useful thing on the page: it is a specific sentence you can rewrite."
        >
          {live.length === 0 ? (
            <p className="text-[0.9375rem] text-ink-45">
              Nothing live yet.
            </p>
          ) : (
            <ul className="space-y-4">
              {live.map((c) => (
                <li key={c.id}>
                  <p className="text-[0.8125rem] font-medium uppercase tracking-[0.1em] text-ink-45">
                    {c.title}
                  </p>
                  <p className="mt-1 text-[0.9375rem] leading-snug text-ink">
                    &ldquo;{c.stats?.stickiestCheck}&rdquo;
                  </p>
                  <p className="mt-1 text-[0.875rem] text-amber">
                    {c.stats?.stickiestWrongPct}% get this wrong first time
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <p className="mt-6 text-[0.875rem] text-ink-45">
        {live.length} live · {waiting.length} in review · {needsWork.length} needing
        changes · {drafts.length} draft
      </p>
    </WorkPage>
  );
}
