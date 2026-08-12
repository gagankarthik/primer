import Link from "next/link";
import { WorkPage, Card, Metric, Pill } from "@/components/app/Page";
import { AppIcon } from "@/components/app/AppIcons";
import { AreaLine, ShareBar, RungHistogram } from "@/components/app/AdminCharts";
import {
  PLATFORM,
  SAFETY_FLAGS,
  SUBMISSIONS,
  TRENDS,
  RUNG_SPREAD,
  PLAN_MIX,
} from "@/lib/platform";

/**
 * ADMIN OVERVIEW.
 *
 * Ordered by what somebody would have to drop everything for. The safety queue
 * is first and is a full-width card, not a tile in a grid, because on a
 * children's product an unreviewed distress flag outranks every commercial
 * number on this page, including all of them put together.
 *
 * The KPI row deliberately leads on median help rung rather than on revenue.
 * If that number climbs, the product has stopped working, and the revenue
 * figures below it are a lagging measure of a thing that already broke.
 */
export default function AdminOverview() {
  const open = SAFETY_FLAGS.filter((f) => !f.reviewed);
  const escalate = open.filter((f) => f.severity === "escalate");
  const waiting = SUBMISSIONS.filter((s) => s.status === "waiting");
  const oldest = Math.max(0, ...waiting.map((s) => s.waitingDays));

  const helpDelta = PLATFORM.medianHelpRung - PLATFORM.medianHelpRungLastMonth;
  const mrrDelta = PLATFORM.mrr - PLATFORM.mrrLastMonth;

  return (
    <WorkPage
      title="Overview"
      blurb="How the platform is doing, in the order it would need dealing with."
    >
      {/* ---------------------------------------------------- safety first */}
      <Card
        tone={escalate.length > 0 ? "danger" : "plain"}
        className="mb-6"
        title="Safety queue"
        blurb={
          open.length === 0
            ? "Nothing waiting. Median time to a human is under an hour."
            : `${open.length} waiting for a human, ${escalate.length} of them escalated.`
        }
        action={
          <Link
            href="/admin/safety"
            className="rounded-xl bg-ink px-4 py-2.5 text-[0.875rem] font-semibold text-white transition-colors hover:bg-ink/88"
          >
            Open the queue
          </Link>
        }
      >
        {escalate.length > 0 ? (
          <ul className="space-y-2.5">
            {escalate.map((f) => (
              <li
                key={f.id}
                className="flex flex-wrap items-center gap-3 rounded-xl bg-base px-4 py-3"
              >
                <AppIcon name="flag" size={18} className="text-rose" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.9375rem] font-medium text-ink">
                    {f.reason}
                  </span>
                  <span className="block text-[0.8125rem] text-ink-45">
                    {f.learnerRef} · age {f.ageYears} · {f.module}
                  </span>
                </span>
                <Pill tone="rose">escalated</Pill>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[0.9375rem] text-ink-70">
            Median time from flag to a human looking at it:{" "}
            <span className="figure-num font-semibold text-ink">
              {PLATFORM.medianTimeToReviewFlag} minutes
            </span>
            .
          </p>
        )}
      </Card>

      {/* ------------------------------------------------------------ KPIs */}
      <section className="mb-6">
        <h2 className="mb-4 text-lg font-semibold tracking-[-0.02em] text-ink">
          The numbers that decide whether this works
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            value={PLATFORM.medianHelpRung.toFixed(1)}
            label="Median help rung"
            hint="0 is a bare question. 5 is being told."
            tone={PLATFORM.medianHelpRung <= 2.5 ? "green" : "amber"}
            delta={{
              text: `${helpDelta <= 0 ? "▼" : "▲"} ${Math.abs(helpDelta).toFixed(1)}`,
              // Less help is the good direction.
              good: helpDelta <= 0,
            }}
          />
          <Metric
            value={PLATFORM.learners.toLocaleString("en-GB")}
            label="Learners"
            hint={`across ${PLATFORM.households.toLocaleString("en-GB")} households`}
          />
          <Metric
            value={PLATFORM.sessionsThisWeek.toLocaleString("en-GB")}
            label="Sessions this week"
            hint="a session is one module, start to finish"
          />
          <Metric
            value={`$${PLATFORM.mrr.toLocaleString("en-GB")}`}
            label="Monthly recurring"
            hint="net of refunds"
            tone="indigo"
            delta={{
              text: `▲ $${mrrDelta.toLocaleString("en-GB")}`,
              good: mrrDelta >= 0,
            }}
          />
        </div>
      </section>

      {/* ---------------------------------------------------------- graphs */}
      <section className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card
          title="Where sessions land on the ladder"
          blurb="Rung 0 is a child solving it from a bare question. Rung 5 is being told. This is the platform's actual product, drawn."
        >
          <RungHistogram buckets={RUNG_SPREAD} />
        </Card>

        <Card
          title="Median help needed, six months"
          blurb="The only chart here where down is good. If this climbs, everything else on the page is a lagging measure of something already broken."
        >
          <AreaLine points={TRENDS.helpRung} tone="green" unit="decimal" />

        </Card>
      </section>

      <section className="mb-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card title="Learners and revenue">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-ink-45">
                Learners
              </p>
              <AreaLine points={TRENDS.learners} />
            </div>
            <div>
              <p className="mb-2 text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-ink-45">
                Monthly recurring
              </p>
              <AreaLine points={TRENDS.mrr} tone="green" unit="money" />

            </div>
          </div>
        </Card>

        <Card
          title="Plan mix"
          blurb="The free tier is more than half of it, and stays free."
        >
          <ShareBar parts={PLAN_MIX} />
        </Card>
      </section>

      {/* ----------------------------------------------------------- queues */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card
          title="Module review"
          blurb={
            waiting.length === 0
              ? "Nothing waiting."
              : `${waiting.length} waiting. The oldest has been ${oldest} days.`
          }
          tone={oldest >= 7 ? "warn" : "plain"}
          action={
            <Link
              href="/admin/review"
              className="text-[0.875rem] font-medium text-indigo underline underline-offset-4 hover:text-indigo-hi"
            >
              Review
            </Link>
          }
        >
          <ul className="space-y-2.5">
            {waiting.map((s) => (
              <li
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-base px-4 py-3"
              >
                <span className="min-w-0">
                  <span className="block text-[0.9375rem] font-medium text-ink">
                    {s.title}
                  </span>
                  <span className="block text-[0.8125rem] text-ink-45">
                    {s.creator} · ages {s.ages[0]} to {s.ages[1]}
                  </span>
                </span>
                <Pill tone={s.waitingDays >= 7 ? "amber" : "neutral"}>
                  {s.waitingDays}d
                </Pill>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          title="What we do not have here"
          blurb="Stated so nobody goes looking for it."
        >
          <ul className="space-y-3 text-[0.9375rem] leading-relaxed text-ink-70">
            <li>
              <span className="font-medium text-ink">No transcripts.</span> A
              child&rsquo;s sessions are readable by their parent, and by nobody
              on this side of the product. A safety flag opens the single
              exchange it matched on, and nothing around it.
            </li>
            <li>
              <span className="font-medium text-ink">No names.</span> The safety
              queue works on references like L-8842. A name is only resolved when
              an escalation requires contacting the household.
            </li>
            <li>
              <span className="font-medium text-ink">No audio, ever.</span> There
              is nothing to retrieve. It is destroyed at capture, not stored and
              access-controlled.
            </li>
          </ul>
        </Card>
      </div>
    </WorkPage>
  );
}
