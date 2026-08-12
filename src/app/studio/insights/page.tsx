import { WorkPage, Card, Metric } from "@/components/app/Page";
import { HelpTrend, TopicBars } from "@/components/parent/Charts";
import { CREATOR_COURSES } from "@/lib/platform";

export const metadata = { title: "How they land" };

/**
 * INSIGHTS.
 *
 * Everything here is aggregated across every learner who used a module. There
 * is no drill-down, no cohort filter and no date-range picker that eventually
 * narrows to one child, which is how creator analytics usually ends up
 * identifying people by accident.
 *
 * The page is built around one question: which sentence should I rewrite? Not
 * "how many people used this", which a creator cannot act on, and which
 * rewards reach over quality.
 */
export default function Insights() {
  const live = CREATOR_COURSES.filter((c) => c.status === "live" && c.stats);

  const avgRung =
    live.reduce((n, c) => n + (c.stats?.medianHelpRung ?? 0), 0) /
    Math.max(1, live.length);
  const avgIndependent =
    live.reduce((n, c) => n + (c.stats?.independentPct ?? 0), 0) /
    Math.max(1, live.length);
  const learners = live.reduce((n, c) => n + (c.stats?.learners ?? 0), 0);

  // Illustrative: how the help needed on a module falls as it is refined.
  const trend = [
    { label: "Mar", rung: 3.1 },
    { label: "Apr", rung: 2.7 },
    { label: "May", rung: 2.4 },
    { label: "Jun", rung: 2.0 },
    { label: "Jul", rung: 1.8 },
  ];

  return (
    <WorkPage
      title="How they land"
      blurb="Aggregated across everyone who used your modules. Nothing here resolves to a child, and there is no way to make it."
    >
      {live.length === 0 ? (
        <Card title="Nothing live yet">
          <p className="text-[0.9375rem] text-ink-70">
            Once a module is published, this page fills with how children fare on
            it.
          </p>
        </Card>
      ) : (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric
              value={avgRung.toFixed(1)}
              label="Median help needed"
              hint="The number to write for. Lower is better."
              tone={avgRung <= 2 ? "green" : "amber"}
            />
            <Metric
              value={`${Math.round(avgIndependent)}%`}
              label="Finish independently"
              hint="Never dropped to a worked example"
              tone="green"
            />
            <Metric
              value={learners.toLocaleString("en-GB")}
              label="Learners reached"
            />
            <Metric value={live.length} label="Live modules" tone="indigo" />
          </div>

          <div className="mb-6 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
            <Card
              title="Help needed over time"
              blurb="Up is better. This is what a module getting better looks like: the same content, rewritten until children stop needing to be walked through it."
            >
              <HelpTrend points={trend} />
            </Card>

            <Card
              title="Per module"
              blurb="How independently children finish each one."
            >
              <TopicBars
                rows={live.map((c) => ({
                  label: c.title,
                  value: c.stats?.independentPct ?? 0,
                }))}
              />
            </Card>
          </div>

          <Card
            title="The sentences to rewrite"
            blurb="For each live module, the check most children get wrong first time. This is the only thing on this page you can act on today."
          >
            <ul className="space-y-5">
              {live.map((c) => (
                <li key={c.id} className="border-b border-line pb-5 last:border-0 last:pb-0">
                  <p className="text-[0.8125rem] font-medium uppercase tracking-[0.1em] text-ink-45">
                    {c.title}
                  </p>
                  <p className="mt-1.5 text-[1.0625rem] leading-snug text-ink">
                    &ldquo;{c.stats?.stickiestCheck}&rdquo;
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-4">
                    <span className="text-[0.875rem] text-amber">
                      {c.stats?.stickiestWrongPct}% wrong first time
                    </span>
                    <span className="text-[0.875rem] text-ink-45">
                      Read your re-teach for this one: does it explain
                      differently, or restate?
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="mt-6" title="What a good number looks like">
            <ul className="space-y-3 text-[0.9375rem] leading-relaxed text-ink-70">
              <li>
                <span className="font-medium text-ink">Help rung under 2</span> means
                most children get there from a question and a nudge. That is the
                product working.
              </li>
              <li>
                <span className="font-medium text-ink">
                  A check nobody fails is not a good check.
                </span>{" "}
                Around a third wrong first time is healthy. Near zero usually
                means the question contains its answer.
              </li>
              <li>
                <span className="font-medium text-ink">Reach is not quality.</span>{" "}
                Four hundred children who all had to be walked to the answer is
                a worse module than forty who got there themselves.
              </li>
            </ul>
          </Card>
        </>
      )}
    </WorkPage>
  );
}
