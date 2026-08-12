import Link from "next/link";
import { WorkPage, Card, Pill } from "@/components/app/Page";
import { STATUS } from "@/components/app/statusPill";
import { CREATOR_COURSES } from "@/lib/platform";
import { toneBg } from "@/lib/tone";
import { cn } from "@/components/ui/cn";

export const metadata = { title: "My modules" };

/**
 * MY MODULES.
 *
 * Grouped by what the creator has to do about them, not by date or alphabet.
 * Needing changes first, then drafts they have not finished, then things in
 * review they can only wait on, then live.
 *
 * Live is last on purpose. It is the most satisfying section and the one with
 * nothing to do in it, and a list that opens with your best work is a list
 * that buries the module a reviewer sent back nine days ago.
 */
export default function StudioCourses() {
  const buckets = [
    {
      key: "changes" as const,
      title: "Needs changes",
      blurb: "A reviewer read these and asked for something specific.",
      tone: "warn" as const,
    },
    {
      key: "draft" as const,
      title: "Drafts",
      blurb: "Yours only. Nobody has seen these.",
      tone: "plain" as const,
    },
    {
      key: "waiting" as const,
      title: "In review",
      blurb: "With us. Nothing for you to do.",
      tone: "plain" as const,
    },
    {
      key: "live" as const,
      title: "Live",
      blurb: "Children are using these now.",
      tone: "plain" as const,
    },
  ];

  return (
    <WorkPage
      title="My modules"
      blurb="In the order you would deal with them, not the order you wrote them."
      action={
        <Link
          href="/studio/courses/new"
          className="rounded-xl bg-ink px-4 py-2.5 text-[0.875rem] font-semibold text-white transition-colors hover:bg-ink/88"
        >
          New module
        </Link>
      }
    >
      <div className="space-y-6">
        {buckets.map((b) => {
          const items = CREATOR_COURSES.filter((c) => c.status === b.key);
          if (items.length === 0) return null;

          return (
            <Card
              key={b.key}
              title={`${b.title} (${items.length})`}
              blurb={b.blurb}
              tone={b.tone}
            >
              <ul className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                {items.map((c) => {
                  const s = STATUS[c.status];
                  return (
                    <li key={c.id}>
                      <Link
                        href={`/studio/courses/${c.id}`}
                        className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-base shadow-tight transition-all hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift"
                      >
                        {/* A colour block rather than the module art: in studio
                            this is a row in a work list, not a thing being sold
                            to a parent. */}
                        <span className={cn("block h-2", toneBg(c.tone))} />

                        <span className="flex flex-1 flex-col p-5">
                          <span className="flex flex-wrap items-center gap-2">
                            <Pill tone={s.tone}>{s.label}</Pill>
                            <span className="text-[0.75rem] text-ink-45">
                              ages {c.ages[0]}&ndash;{c.ages[1]}
                            </span>
                          </span>

                          <span className="mt-2.5 text-[1.0625rem] font-semibold text-ink">
                            {c.title}
                          </span>
                          <span className="mt-0.5 text-[0.875rem] text-ink-45">
                            {c.lessons} lessons, {c.checks} checks · {c.minutes} min
                          </span>

                          {c.note && (
                            <span className="mt-3 block rounded-xl bg-amber/10 px-3 py-2 text-[0.8125rem] leading-snug text-ink-70">
                              {c.note}
                            </span>
                          )}

                          {c.stats && (
                            <span className="mt-3 flex flex-wrap gap-x-5 gap-y-1 border-t border-line pt-3">
                              <span className="text-[0.8125rem] text-ink-45">
                                help{" "}
                                <span className="figure-num font-semibold text-ink">
                                  {c.stats.medianHelpRung.toFixed(1)}
                                </span>
                              </span>
                              <span className="text-[0.8125rem] text-ink-45">
                                independent{" "}
                                <span className="figure-num font-semibold text-ink">
                                  {c.stats.independentPct}%
                                </span>
                              </span>
                            </span>
                          )}

                          <span className="mt-3 block text-[0.75rem] text-ink-45">
                            edited{" "}
                            {new Date(c.updatedAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Card>
          );
        })}
      </div>
    </WorkPage>
  );
}
