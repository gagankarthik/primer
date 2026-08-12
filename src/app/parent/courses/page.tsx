import type { Metadata } from "next";
import Link from "next/link";
import { CHILD_LIST, getChild, type MockChild } from "@/lib/mock";
import { MODULES, GROUPS, modulesForAge, type ModuleGroup } from "@/lib/modules";
import { ParentShell } from "@/components/parent/ParentShell";
import { ModuleArt } from "@/components/modules/ModuleArt";
import { toneBg } from "@/lib/tone";
import { cn } from "@/components/ui/cn";

export const metadata: Metadata = {
  title: "Courses",
  robots: { index: false, follow: false },
};

/**
 * PARENT VIEW OF THE COURSES.
 *
 * Not the catalogue. /modules answers "what is there?" for someone deciding
 * whether to sign up; this answers "where is my child up to, and what is
 * hard?", which is a different question with different columns.
 *
 * On the word: the nav says Courses because that is what a parent calls this,
 * and the items say modules because that is what a child does. The distinction
 * is real, a course is the subject and a module is the four minutes, so both
 * words earn their place rather than being two names for one thing.
 *
 * Deliberately not a completion percentage per module. A module is practised
 * rather than finished, so the honest unit is how much help the last few
 * sessions took, which is the number the whole product is built around.
 */

type Status = "steady" | "working" | "hard" | "notYet";

const STATUS_COPY: Record<Status, { label: string; note: string; className: string }> =
  {
    steady: {
      label: "Steady",
      note: "Getting there with little or no help.",
      className: "bg-green/12 text-green",
    },
    working: {
      label: "Working on it",
      note: "Needs a nudge, then finds it.",
      className: "bg-indigo-tint text-indigo",
    },
    hard: {
      label: "Finding it hard",
      note: "Asked to be told the answer more than once.",
      className: "bg-rose/10 text-rose",
    },
    notYet: {
      label: "Not started",
      note: "Available, not attempted yet.",
      className: "bg-grey-tint text-ink-45",
    },
  };

/**
 * Derived from the child's own topic history rather than invented per render,
 * so this page and the overview can never disagree about how a topic is going.
 */
function statusFor(child: MockChild, moduleId: string): Status {
  const tender = child.profile.emotional.tenderTopics ?? [];
  if (tender.some((t: string) => moduleId.includes(t.split("-")[0]))) return "hard";

  const seen = child.sessions.some((s) =>
    s.topic.toLowerCase().includes(moduleId.split("-")[0]),
  );
  if (!seen) return "notYet";

  // Null until enough sessions exist to estimate it. No estimate means we have
  // not earned the right to call a topic steady, so it reads as in progress.
  const rung = child.profile.cognitive.medianSolveRung;
  return rung !== null && rung <= 2 ? "steady" : "working";
}

export default async function ParentModules({
  searchParams,
}: {
  searchParams: Promise<{ child?: string }>;
}) {
  const { child: param } = await searchParams;
  const child = getChild(param ?? "nell") ?? CHILD_LIST[0];
  const name = child.profile.displayName;

  const available = modulesForAge(child.profile.contextual.ageYears);
  const availableIds = new Set(available.map((m) => m.id));
  const order: ModuleGroup[] = ["numbers", "arithmetic", "letters"];

  const rows = MODULES.map((m) => ({
    module: m,
    status: availableIds.has(m.id) ? statusFor(child, m.id) : ("notYet" as Status),
    inAgeRange: availableIds.has(m.id),
  }));

  const counts = {
    steady: rows.filter((r) => r.inAgeRange && r.status === "steady").length,
    working: rows.filter((r) => r.inAgeRange && r.status === "working").length,
    hard: rows.filter((r) => r.inAgeRange && r.status === "hard").length,
  };

  return (
    <ParentShell childId={child.profile.childId}>
      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-12">
        <header className="mb-8">
          <h1 className="text-[1.75rem] font-semibold tracking-[-0.03em] text-ink">
            What {name} is working through
          </h1>
          <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-70">
            {available.length} of {MODULES.length} modules are open at{" "}
            {child.profile.contextual.ageYears}. The rest unlock as {name} gets older, not
            as a reward for finishing anything.
          </p>
        </header>

        {/* Summary strip. Three numbers, in the order a parent cares about. */}
        <section className="mb-10 grid gap-3 sm:grid-cols-3">
          {(
            [
              ["hard", counts.hard, "worth a look"],
              ["working", counts.working, "in progress"],
              ["steady", counts.steady, "going well"],
            ] as const
          ).map(([key, n, caption]) => (
            <div
              key={key}
              className="rounded-2xl border border-line bg-surface p-5 shadow-tight"
            >
              <p className="figure-num text-3xl font-semibold text-ink">{n}</p>
              <p className="mt-1 text-[0.875rem] font-medium text-ink">
                {STATUS_COPY[key].label}
              </p>
              <p className="mt-0.5 text-[0.8125rem] text-ink-45">{caption}</p>
            </div>
          ))}
        </section>

        {order.map((group) => {
          const items = rows.filter((r) => r.module.group === group);
          if (items.length === 0) return null;

          return (
            <section key={group} className="mb-10">
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
                <h2 className="text-[1.0625rem] font-semibold text-ink">
                  {GROUPS[group].label}
                </h2>
                <p className="text-[0.875rem] text-ink-45">
                  {GROUPS[group].blurb}
                </p>
              </div>

              <ul className="space-y-3">
                {items.map(({ module: m, status, inAgeRange }) => {
                  const s = STATUS_COPY[status];
                  return (
                    <li key={m.id}>
                      <div
                        className={cn(
                          "flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-surface p-4 shadow-tight sm:flex-nowrap",
                          !inAgeRange && "opacity-55",
                        )}
                      >
                        <span
                          className={cn(
                            "hidden h-14 w-20 shrink-0 overflow-hidden rounded-xl sm:block",
                            toneBg(m.tone),
                          )}
                        >
                          <ModuleArt
                            art={m.art}
                            tone={m.tone}
                            className="h-full w-full"
                          />
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="text-[0.9375rem] font-semibold text-ink">
                            {m.title}
                          </p>
                          <p className="mt-0.5 text-[0.8125rem] text-ink-45">
                            {inAgeRange
                              ? s.note
                              : `Opens at ${m.minAge}. ${name} is ${child.profile.contextual.ageYears}.`}
                          </p>
                        </div>

                        <span
                          className={cn(
                            "shrink-0 rounded-full px-3 py-1.5 text-[0.8125rem] font-medium",
                            inAgeRange ? s.className : "bg-grey-tint text-ink-45",
                          )}
                        >
                          {inAgeRange ? s.label : "Later"}
                        </span>

                        <Link
                          href={`/modules/${m.id}`}
                          className="shrink-0 text-[0.875rem] font-medium text-indigo underline underline-offset-4 hover:text-indigo-hi"
                        >
                          Details
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}

        {/* The one thing to actually do, at the end rather than the top. */}
        <section className="rounded-2xl bg-indigo-tint p-6 sm:p-7">
          <h2 className="text-[1.0625rem] font-semibold text-ink">
            If you only change one thing
          </h2>
          <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-70">
            {counts.hard > 0
              ? `Sit next to ${name} for one session on whatever is marked "finding it hard". Not to help, just to be there. Difficulty a child faces alone becomes avoidance faster than it becomes learning.`
              : `Nothing is stuck. The useful move is to leave it alone and let ${name} keep going at their own pace.`}
          </p>
          <div className="mt-5">
            <Link
              href="/parent"
              className="inline-block rounded-xl bg-indigo px-5 py-3 text-[0.9375rem] font-semibold text-white shadow-[0_2px_10px_rgba(61,78,232,0.35)] transition-colors hover:bg-indigo-hi"
            >
              Back to the overview
            </Link>
          </div>
        </section>
      </main>
    </ParentShell>
  );
}
