import { WorkPage, Card, Metric, Pill, Rows } from "@/components/app/Page";
import { SUBMISSIONS, type Submission } from "@/lib/platform";
import { cn } from "@/components/ui/cn";

export const metadata = { title: "Module review" };

/**
 * MODULE REVIEW.
 *
 * Every module a creator submits is read by a person before a child sees it.
 * The checklist below is on the page rather than in a wiki, because a review
 * standard nobody can see while reviewing is a review standard nobody applies.
 *
 * The first item on it is the one that actually rejects things: a check whose
 * question contains its own answer. It is the easiest mistake to make when you
 * already know the material, and it turns a Socratic module into a reading
 * comprehension exercise, which is the one thing this product must not ship.
 */
export default function ModuleReview() {
  const waiting = SUBMISSIONS.filter((s) => s.status === "waiting");
  const changes = SUBMISSIONS.filter((s) => s.status === "changes");
  const settled = SUBMISSIONS.filter(
    (s) => s.status === "approved" || s.status === "live",
  );
  const oldest = Math.max(0, ...waiting.map((s) => s.waitingDays));

  return (
    <WorkPage
      title="Module review"
      blurb="Nothing reaches a child without a person reading it first."
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Metric value={waiting.length} label="Waiting to be read" />
        <Metric
          value={`${oldest}d`}
          label="Oldest in the queue"
          hint="anything past a week is a creator who has stopped trusting us"
          tone={oldest >= 7 ? "amber" : "green"}
        />
        <Metric value={changes.length} label="Sent back for changes" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <Card title={`Waiting (${waiting.length})`}>
            {waiting.length === 0 ? (
              <p className="rounded-xl bg-green-tint px-4 py-3 text-[0.9375rem] text-ink">
                Queue is empty.
              </p>
            ) : (
              <Rows>
                {waiting.map((s) => (
                  <SubmissionRow key={s.id} s={s} />
                ))}
              </Rows>
            )}
          </Card>

          {changes.length > 0 && (
            <Card
              title={`Sent back (${changes.length})`}
              blurb="With the creator. The note we sent is on the row."
              tone="warn"
            >
              <Rows>
                {changes.map((s) => (
                  <SubmissionRow key={s.id} s={s} />
                ))}
              </Rows>
            </Card>
          )}

          <Card title="Settled">
            <Rows>
              {settled.map((s) => (
                <SubmissionRow key={s.id} s={s} />
              ))}
            </Rows>
          </Card>
        </div>

        {/* The standard, visible while reviewing against it. */}
        <Card title="What to check" className="h-fit">
          <ol className="space-y-4">
            {[
              {
                t: "No check gives away its own answer",
                b: "The commonest reason to send one back. Easy to write when you already know the material, and it turns the module into reading comprehension.",
              },
              {
                t: "The retry is genuinely different",
                b: "A re-teach that repeats the first explanation in new words is not a re-teach. If the words worked, the child would not be there.",
              },
              {
                t: "One idea per lesson",
                b: "Two ideas in a lesson means a wrong answer cannot tell you which one is missing.",
              },
              {
                t: "Readable at the lower age",
                b: "Written for the youngest child in the stated range, not the average one.",
              },
              {
                t: "Nothing rewards speed",
                b: "No timers, no 'quick', no 'easy'. Easy is the word a stuck child reads as an accusation.",
              },
            ].map((r, i) => (
              <li key={r.t} className="flex gap-3">
                <span
                  aria-hidden
                  className="figure-num grid h-6 w-6 shrink-0 place-items-center rounded-full bg-grey-tint text-[0.75rem] font-bold text-ink-45"
                >
                  {i + 1}
                </span>
                <span>
                  <span className="block text-[0.9375rem] font-medium text-ink">
                    {r.t}
                  </span>
                  <span className="mt-0.5 block text-[0.875rem] leading-snug text-ink-45">
                    {r.b}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </WorkPage>
  );
}

function SubmissionRow({ s }: { s: Submission }) {
  const pill = {
    waiting: { tone: "indigo" as const, label: "Waiting" },
    changes: { tone: "amber" as const, label: "Changes asked for" },
    approved: { tone: "green" as const, label: "Approved" },
    live: { tone: "neutral" as const, label: "Live" },
  }[s.status];

  return (
    <li className="px-4 py-4 sm:px-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[1rem] font-semibold text-ink">{s.title}</p>
            <Pill tone={pill.tone}>{pill.label}</Pill>
            {s.status === "waiting" && s.waitingDays >= 7 && (
              <Pill tone="rose">{s.waitingDays} days</Pill>
            )}
          </div>

          <p className="mt-1 text-[0.875rem] text-ink-45">
            {s.creator} · ages {s.ages[0]} to {s.ages[1]} · {s.minutes} min ·{" "}
            {s.lessons} lessons, {s.checks} checks
          </p>

          {s.note && (
            <p className="mt-2 rounded-xl bg-amber/10 px-3.5 py-2 text-[0.875rem] leading-snug text-ink-70">
              <span className="font-medium text-amber">We said:</span> {s.note}
            </p>
          )}
        </div>

        {(s.status === "waiting" || s.status === "approved") && (
          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              type="button"
              className={cn(
                "rounded-lg px-4 py-2 text-[0.875rem] font-semibold transition-colors",
                s.status === "approved"
                  ? "bg-green text-white hover:brightness-95"
                  : "bg-ink text-white hover:bg-ink/88",
              )}
            >
              {s.status === "approved" ? "Publish" : "Read it"}
            </button>
            {s.status === "waiting" && (
              <button
                type="button"
                className="rounded-lg border border-line-strong bg-base px-4 py-2 text-[0.875rem] font-medium text-ink transition-colors hover:border-ink/25"
              >
                Ask for changes
              </button>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
