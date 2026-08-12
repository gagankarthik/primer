import Link from "next/link";
import { notFound } from "next/navigation";
import { getChild } from "@/lib/mock";
import { factsFor } from "@/lib/learner";
import { GROUPS, type ModuleGroup } from "@/lib/modules";
import { ModuleArt } from "@/components/modules/ModuleArt";
import { LearnerPage } from "@/components/child/Page";
import { LearnerAside } from "@/components/child/LearnerAside";
import { toneBg } from "@/lib/tone";
import { cn } from "@/components/ui/cn";

/**
 * MY COURSES.
 *
 * Every module open at this child's age, grouped, and each one wearing its
 * state: completed, in progress with a bar, or not started yet.
 *
 * The bar appears only on the ones in progress. On a completed card it would
 * be a full bar saying nothing, and on an untouched one an empty bar saying
 * "you have done none of this", which is a sentence no six-year-old needs to
 * read six times down a page. State is carried by a word and a colour; the bar
 * is there only where there is genuinely a partial amount to show.
 *
 * No ratings, no review counts, no "most popular". A six-year-old choosing
 * between a 4.9 and a 4.6 is a child being taught to optimise, which is the
 * habit this product exists to avoid. Those numbers live in the parent area.
 *
 * Nothing is locked behind finishing something else. A module is available or
 * it is not yet age-appropriate, and that is the only gate.
 */
export default async function LearnerCourses({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const child = getChild(childId);
  if (!child) notFound();

  const f = factsFor(child);
  const order: ModuleGroup[] = ["numbers", "arithmetic", "letters"];
  const byModule = new Map(
    f.topics.filter((t) => t.module).map((t) => [t.module!.id, t]),
  );

  return (
    <LearnerPage
      aside={<LearnerAside facts={f} childId={childId} />}
      title="My courses"
      blurb={`${f.open.length} things you can have a go at. Pick any of them, in any order.`}
    >
      {order.map((g) => {
        const items = f.open.filter((m) => m.group === g);
        if (items.length === 0) return null;

        return (
          <section key={g} id={g} className="mt-10 scroll-mt-6 first:mt-0">
            <h2 className="text-[1.25rem] font-bold tracking-[-0.02em] text-ink">
              {GROUPS[g].kidLabel}
            </h2>

            <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((m) => {
                const t = byModule.get(m.id);
                const started = !!t && t.attempts > 0;
                const done = started && t.mastery >= 0.7;
                const pct = t ? Math.round(t.mastery * 100) : 0;

                const state = done
                  ? { label: "Completed", cls: "bg-green-tint text-green" }
                  : started
                    ? { label: "In progress", cls: "bg-indigo-tint text-indigo" }
                    : { label: "Not started yet", cls: "bg-grey-tint text-ink-45" };

                return (
                  <li key={m.id}>
                    <Link
                      href={`/learning/${childId}/play/${m.id}`}
                      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-tight transition-all hover:-translate-y-1 hover:border-line-strong hover:shadow-lift"
                    >
                      <span className={cn("block", toneBg(m.tone))}>
                        <ModuleArt art={m.art} tone={m.tone} className="h-28 w-full" />
                      </span>

                      <span className="flex flex-1 flex-col p-5">
                        <span
                          className={cn(
                            "self-start rounded-full px-3 py-1 text-[0.75rem] font-semibold",
                            state.cls,
                          )}
                        >
                          {state.label}
                        </span>

                        <span className="mt-2.5 text-[1.0625rem] font-bold text-ink">
                          {m.kidTitle}
                        </span>

                        {/* Only where there is a partial amount to show. */}
                        {started && !done && (
                          <span className="mt-3 block">
                            <span
                              className="block h-2.5 w-full overflow-hidden rounded-full bg-ink/8"
                              role="img"
                              aria-label={`Part way through ${m.kidTitle}`}
                            >
                              <span
                                className="block h-full rounded-full bg-indigo"
                                style={{ width: `${Math.max(8, pct)}%` }}
                              />
                            </span>
                            {t?.tender && (
                              <span className="mt-1.5 block text-[0.8125rem] text-amber">
                                This one has been tricky. That&rsquo;s fine.
                              </span>
                            )}
                          </span>
                        )}

                        {!started && (
                          <span className="mt-1 text-[0.875rem] text-ink-45">
                            About {m.minutes} minutes
                          </span>
                        )}

                        {done && (
                          <span className="mt-1 text-[0.875rem] text-ink-45">
                            You can do this on your own
                          </span>
                        )}

                        <span
                          aria-hidden
                          className="mt-4 grid h-11 w-11 place-items-center self-end rounded-full bg-grey-tint text-ink transition-colors group-hover:bg-ink group-hover:text-white"
                        >
                          &rarr;
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </LearnerPage>
  );
}
