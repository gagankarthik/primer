import { WorkPage, Card, Metric, Pill, Rows } from "@/components/app/Page";
import { AppIcon } from "@/components/app/AppIcons";
import { SAFETY_FLAGS, PLATFORM, type SafetyFlag } from "@/lib/platform";
import { cn } from "@/components/ui/cn";

export const metadata = { title: "Safety queue" };

/**
 * THE SAFETY QUEUE.
 *
 * The most consequential screen in the product, and the one most likely to be
 * designed badly, because the obvious design is a red list of alarms that a
 * reviewer stops reading by the fortieth one.
 *
 * Three decisions push against that:
 *
 *  1. Cleared flags stay on the page, greyed. A queue that only shows the
 *     unresolved teaches a reviewer that everything they see is real, and the
 *     false-positive rate is the single most useful thing on this screen. Two
 *     of the five here are the classifier being wrong, and that is visible.
 *  2. Every row shows why it matched, not just that it did. "Classifier
 *     matched on a maths word" is a reviewer clearing it in two seconds; a bare
 *     severity badge is the same reviewer reading the excerpt to find out.
 *  3. Nothing here is named. The queue works on references. A name is resolved
 *     only when an escalation means somebody has to phone a household, and
 *     that is a deliberate extra step rather than an oversight.
 *
 * The excerpt is the matched turn and nothing around it. A reviewer does not
 * get the session, because "I needed context" is how every transcript-access
 * scandal starts.
 */
export default function SafetyQueue() {
  const open = SAFETY_FLAGS.filter((f) => !f.reviewed);
  const done = SAFETY_FLAGS.filter((f) => f.reviewed);
  const falsePositives = done.filter((f) => f.severity === "cleared").length;

  return (
    <WorkPage
      title="Safety queue"
      blurb="Every flag the classifier raised. A human clears all of them, including the obvious false positives, because the rate of those is how we know whether the classifier is still tuned."
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Metric
          value={open.length}
          label="Waiting for a human"
          hint={
            open.some((f) => f.severity === "escalate")
              ? "one or more escalated"
              : "none escalated"
          }
          tone={open.some((f) => f.severity === "escalate") ? "rose" : "ink"}
        />
        <Metric
          value={`${PLATFORM.medianTimeToReviewFlag}m`}
          label="Median time to a human"
          hint="from the moment the flag is raised"
          tone="green"
        />
        <Metric
          value={`${Math.round((falsePositives / Math.max(1, done.length)) * 100)}%`}
          label="Cleared as false positives"
          hint="of everything reviewed. Too low means we are missing things."
          tone="amber"
        />
      </div>

      <Card
        title={`Waiting (${open.length})`}
        blurb="Oldest first. Escalated flags open the exchange they matched on; the rest do not."
        className="mb-6"
      >
        {open.length === 0 ? (
          <p className="rounded-xl bg-green-tint px-4 py-3 text-[0.9375rem] text-ink">
            Nothing waiting.
          </p>
        ) : (
          <Rows>
            {open.map((f) => (
              <FlagRow key={f.id} flag={f} />
            ))}
          </Rows>
        )}
      </Card>

      <Card
        title={`Already reviewed (${done.length})`}
        blurb="Kept on the page on purpose. A queue that hides its own false positives makes every remaining flag look real."
      >
        <Rows>
          {done.map((f) => (
            <FlagRow key={f.id} flag={f} />
          ))}
        </Rows>
      </Card>
    </WorkPage>
  );
}

function FlagRow({ flag: f }: { flag: SafetyFlag }) {
  const tone =
    f.severity === "escalate" ? "rose" : f.severity === "watch" ? "amber" : "neutral";
  const label =
    f.severity === "escalate"
      ? "Escalated"
      : f.severity === "watch"
        ? "Worth a look"
        : "Cleared";

  return (
    <li className={cn("px-4 py-4 sm:px-5", f.reviewed && "opacity-60")}>
      <div className="flex flex-wrap items-start gap-3">
        <AppIcon
          name="flag"
          size={18}
          className={cn(
            "mt-1",
            f.severity === "escalate"
              ? "text-rose"
              : f.severity === "watch"
                ? "text-amber"
                : "text-ink-45",
          )}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={tone}>{label}</Pill>
            <span className="figure-num text-[0.8125rem] text-ink-45">
              {f.learnerRef} · age {f.ageYears}
            </span>
            <span className="text-[0.8125rem] text-ink-45">· {f.module}</span>
          </div>

          <p className="mt-2 text-[0.9375rem] font-medium text-ink">{f.reason}</p>

          {/* The matched turn only. Never the session around it. */}
          <blockquote className="mt-2 rounded-xl border-l-[3px] border-line-strong bg-base px-4 py-2.5 text-[0.9375rem] text-ink-70">
            {f.excerpt}
          </blockquote>

          <p className="mt-2 text-[0.75rem] text-ink-45">
            {new Date(f.at).toLocaleString("en-GB", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
            {f.severity === "escalate" &&
              " · escalating resolves the household and notifies the parent"}
          </p>
        </div>

        {!f.reviewed && (
          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              type="button"
              className="rounded-lg bg-ink px-4 py-2 text-[0.875rem] font-semibold text-white transition-colors hover:bg-ink/88"
            >
              {f.severity === "escalate" ? "Open and notify" : "Mark reviewed"}
            </button>
            <button
              type="button"
              className="rounded-lg border border-line-strong bg-base px-4 py-2 text-[0.875rem] font-medium text-ink transition-colors hover:border-ink/25"
            >
              False positive
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
