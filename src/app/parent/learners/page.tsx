import type { Metadata } from "next";
import Link from "next/link";
import { CHILD_LIST } from "@/lib/mock";
import { modulesForAge } from "@/lib/modules";
import { ParentShell } from "@/components/parent/ParentShell";
import { PageHead, Panel } from "@/components/parent/Layout";
import { cn } from "@/components/ui/cn";

export const metadata: Metadata = {
  title: "Learners",
  robots: { index: false, follow: false },
};

/**
 * THE LEARNERS ON THIS ACCOUNT.
 *
 * A roster, not a dashboard. It answers "who is set up, and is anything wrong
 * with any of them?" in one screen, and every card is a door into that child's
 * own view.
 *
 * The binding code lives here rather than in Settings because adding a device
 * is a thing you do to a learner, not to the account.
 */
export default function Learners() {
  return (
    <ParentShell
      childId={CHILD_LIST[0].profile.childId}
      showChildSwitcher={false}
    >
      <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-12">
        <PageHead
          title="Learners"
          blurb={`${CHILD_LIST.length} of 4 places used on your plan. Each learner has their own profile, their own hours, and their own history.`}
          action={
            <Link
              href="/onboarding"
              className="rounded-xl bg-indigo px-5 py-3 text-[0.9375rem] font-semibold text-white shadow-[0_2px_10px_rgba(61,78,232,0.35)] transition-colors hover:bg-indigo-hi"
            >
              Add a learner
            </Link>
          }
        />

        <ul className="space-y-4">
          {CHILD_LIST.map((c, i) => {
            const p = c.profile;
            const age = p.contextual.ageYears;
            const open = modulesForAge(age).length;
            const tender = p.emotional.tenderTopics.length;
            const sessions = p.behavioral.sessionsLast30d;

            return (
              <li key={p.childId}>
                <div className="rounded-2xl border border-line bg-surface p-5 shadow-tight sm:p-6">
                  <div className="flex flex-wrap items-start gap-4">
                    <span
                      className={cn(
                        "grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-xl font-semibold text-white",
                        ["bg-indigo", "bg-green", "bg-amber", "bg-rose"][i % 4],
                      )}
                      aria-hidden
                    >
                      {p.displayName[0]}
                    </span>

                    <div className="min-w-0 flex-1">
                      <h2 className="text-[1.125rem] font-semibold text-ink">
                        {p.displayName}
                      </h2>
                      <p className="mt-0.5 text-[0.875rem] text-ink-45">
                        {age} years old · {p.contextual.gradeLabel} · {open}{" "}
                        modules open
                      </p>

                      <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
                        <Mini label="sessions, 30 days" value={sessions} />
                        <Mini
                          label="a typical sitting"
                          value={`${p.behavioral.medianSessionMinutes ?? "—"} min`}
                        />
                        <Mini
                          label="usual rung"
                          value={p.cognitive.medianSolveRung ?? "—"}
                        />
                      </dl>

                      {tender > 0 && (
                        <p className="mt-4 rounded-xl bg-rose/[0.06] px-3.5 py-2.5 text-[0.875rem] text-ink-70">
                          <span className="font-medium text-rose">
                            Worth a look:
                          </span>{" "}
                          {tender} topic{tender > 1 ? "s" : ""} where{" "}
                          {p.displayName} has got frustrated more than once.
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      <Link
                        href={`/parent?child=${p.childId}`}
                        className="rounded-lg bg-ink px-4 py-2 text-[0.875rem] font-medium text-white hover:bg-ink/88"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href={`/parent/settings?child=${p.childId}`}
                        className="rounded-lg border border-line-strong bg-base px-4 py-2 text-[0.875rem] font-medium text-ink shadow-tight hover:border-ink/25"
                      >
                        Settings
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <Panel
          className="mt-8"
          title="Adding a device"
          blurb="To put the Primer on a tablet, open primer.app on it and enter this code. It lasts ten minutes and can only be used once, so a code shared by accident is not a way into your account."
        >
          <div className="flex flex-wrap items-center gap-4">
            <span className="figure-num rounded-xl bg-grey-tint px-6 py-3.5 text-2xl font-semibold tracking-[0.35em] text-ink">
              4KQ7
            </span>
            <button
              type="button"
              className="rounded-lg border border-line-strong bg-base px-4 py-2.5 text-[0.875rem] font-medium text-ink shadow-tight hover:border-ink/25"
            >
              Generate a new code
            </button>
          </div>
        </Panel>
      </main>
    </ParentShell>
  );
}

function Mini({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dd className="figure-num text-xl font-semibold text-ink">{value}</dd>
      <dt className="text-[0.75rem] text-ink-45">{label}</dt>
    </div>
  );
}
