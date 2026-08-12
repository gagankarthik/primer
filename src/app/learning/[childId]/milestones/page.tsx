import Link from "next/link";
import { notFound } from "next/navigation";
import { getChild } from "@/lib/mock";
import { factsFor } from "@/lib/learner";
import { LearnerPage } from "@/components/child/Page";
import { LearnerAside } from "@/components/child/LearnerAside";
import { AwardIcon } from "@/components/child/AwardIcon";
import { EmptyState } from "@/components/ui/EmptyState";

/**
 * REMEMBER WHEN.
 *
 * The milestones, written for the child to have read back to them months
 * later. This is the one screen in the product whose entire job is emotional:
 * a durable record that the hard thing they are stuck on today is the same
 * kind of hard thing they beat in June.
 *
 * The text comes from the profile and is deliberately phrased as a memory
 * rather than an achievement, "the day you counted all the way to twenty
 * without stopping once", not "Counting: mastered". A child recognises
 * themselves in the first and skips past the second.
 *
 * Newest last, oldest first. This reads as a path they walked rather than a
 * feed, and the most recent entry sitting at the bottom next to "and you're
 * still going" is the point of the page.
 */
export default async function LearnerMilestones({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const child = getChild(childId);
  if (!child) notFound();

  const f = factsFor(child);
  const milestones = [...f.child.profile.milestones].sort(
    (a, b) => +new Date(a.at) - +new Date(b.at),
  );

  return (
    <LearnerPage
      aside={<LearnerAside facts={f} childId={childId} />}
      title="Remember when"
      blurb="Things you did that are worth keeping. We'll add to this as you go."
    >
      {milestones.length === 0 ? (
        <EmptyState
          title="Nothing here yet"
          body="The first time you work something out that had you stuck, it'll show up here."
          actionLabel="Go and have a go"
          actionHref={`/learning/${childId}/courses`}
        />
      ) : (
        <ol className="relative space-y-5 pl-8">
          {/* The path itself. Drawn behind the dots, stopping at the last one. */}
          <span
            aria-hidden
            className="absolute bottom-6 left-[0.6875rem] top-3 w-0.5 rounded-full bg-indigo/25"
          />

          {milestones.map((m, i) => (
            <li key={m.id} className="relative">
              <span
                aria-hidden
                className="absolute -left-8 top-2 grid h-6 w-6 place-items-center rounded-full bg-indigo text-[0.6875rem] font-bold text-white"
              >
                {i + 1}
              </span>

              <div className="rounded-2xl border border-line bg-surface px-5 py-4 shadow-tight">
                <p className="flex items-center gap-2 text-[0.8125rem] font-medium uppercase tracking-[0.1em] text-ink-45">
                  <AwardIcon name="cap" size={18} className="text-rose" />
                  {new Date(m.at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p
                  className="mt-2 text-[1.125rem] leading-[1.45] text-ink"
                  style={{ fontFamily: "var(--font-read)" }}
                >
                  {m.text}
                </p>
              </div>
            </li>
          ))}

          <li className="relative">
            <span
              aria-hidden
              className="absolute -left-8 top-2 grid h-6 w-6 place-items-center rounded-full border-2 border-dashed border-indigo/40 bg-base"
            />
            <p className="py-2 text-[1.0625rem] font-semibold text-ink-45">
              And you&rsquo;re still going.
            </p>
          </li>
        </ol>
      )}

      <div className="mt-10 rounded-2xl bg-indigo-tint px-5 py-5">
        <p
          className="text-[1.0625rem] leading-[1.5] text-ink"
          style={{ fontFamily: "var(--font-read)" }}
        >
          Every one of these was hard before it was easy. The thing you&rsquo;re
          stuck on today goes on this list too, eventually.
        </p>
        <Link
          href={`/learning/${childId}/progress`}
          className="mt-4 inline-block rounded-xl bg-indigo px-5 py-3 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-indigo-hi"
        >
          See what I&rsquo;m working on
        </Link>
      </div>
    </LearnerPage>
  );
}
