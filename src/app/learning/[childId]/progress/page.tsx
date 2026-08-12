import Link from "next/link";
import { notFound } from "next/navigation";
import { getChild } from "@/lib/mock";
import { factsFor } from "@/lib/learner";
import { LearnerPage } from "@/components/child/Page";
import { LearnerAside } from "@/components/child/LearnerAside";
import { AwardTile } from "@/components/child/AwardIcon";
import { ModuleArt } from "@/components/modules/ModuleArt";
import { toneBg } from "@/lib/tone";
import { cn } from "@/components/ui/cn";

/**
 * MY PROGRESS.
 *
 * Three lists: done, doing, not started. That is the whole page.
 *
 * It used to have five things on it: three mastery buckets with unlabelled
 * bars, a run of recent sessions, and a help-rung trace per session. All of
 * that is true and none of it is answerable by a seven-year-old, who opens
 * this page to find out one thing, which of these have I done. Bars invited a
 * comparison between two half-full states that mean almost the same thing, and
 * the trace was a chart of a concept the child has never been shown.
 *
 * So: no bars, no percentages, no charts. Every item is in exactly one of
 * three lists, and each list says in a sentence what being in it means. The
 * detail that got cut is not lost, it is on the parent dashboard, which is
 * where an adult reading a trend line was always going to be.
 */
export default async function LearnerProgress({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const child = getChild(childId);
  if (!child) notFound();

  const f = factsFor(child);

  // Every module open to them, sorted into exactly one of three states. Using
  // the module list rather than the topic list means nothing can be missing:
  // a module they have never touched still appears, under "not started".
  const byModule = new Map(
    f.topics.filter((t) => t.module).map((t) => [t.module!.id, t]),
  );

  const done = [];
  const doing = [];
  const notYet = [];

  for (const m of f.open) {
    const t = byModule.get(m.id);
    if (!t || t.attempts === 0) notYet.push({ module: m });
    else if (t.mastery >= 0.7) done.push({ module: m });
    else doing.push({ module: m, tender: t.tender });
  }

  return (
    <LearnerPage
      aside={<LearnerAside facts={f} childId={childId} />}
      title="My progress"
      blurb="Not a score. Just which ones you've done, which you're on, and which are still waiting."
    >
      <List
        icon="trophy"
        tone="green"
        title="Done"
        blurb="You can do these on your own now."
        items={done}
        childId={childId}
        empty="Nothing here yet. It fills up as you go."
      />

      <List
        icon="ribbon"
        tone="indigo"
        title="Doing now"
        blurb="Started, and still getting the hang of them."
        items={doing}
        childId={childId}
        cta="Carry on"
        empty="Nothing on the go. Pick something from below."
      />

      <List
        icon="cap"
        tone="amber"
        title="Not started"
        blurb="Waiting for you, whenever you fancy them."
        items={notYet}
        childId={childId}
        cta="Have a go"
        empty="You've started everything that's open to you."
      />
    </LearnerPage>
  );
}

function List({
  icon,
  tone,
  title,
  blurb,
  items,
  childId,
  cta,
  empty,
}: {
  icon: "trophy" | "ribbon" | "cap";
  tone: "green" | "indigo" | "amber";
  title: string;
  blurb: string;
  items: { module: { id: string; kidTitle: string; art: string; tone: string; minutes: number }; tender?: boolean }[];
  childId: string;
  cta?: string;
  empty: string;
}) {
  return (
    <section className="mt-8 first:mt-0">
      <div className="flex items-center gap-3">
        <AwardTile name={icon} tone={tone} size={44} />
        <div>
          <h2 className="text-[1.25rem] font-bold tracking-[-0.02em] text-ink">
            {title}{" "}
            <span className="figure-num font-bold text-ink-45">
              {items.length}
            </span>
          </h2>
          <p className="text-[0.9375rem] text-ink-45">{blurb}</p>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="mt-3 rounded-2xl border border-dashed border-line-strong px-5 py-4 text-[0.9375rem] text-ink-45">
          {empty}
        </p>
      ) : (
        <ul className="mt-3 space-y-2.5">
          {items.map(({ module: m, tender }) => (
            <li key={m.id}>
              <Link
                href={`/learning/${childId}/play/${m.id}`}
                className="group flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-surface p-3 shadow-tight transition-all hover:-translate-y-0.5 hover:shadow-lift sm:p-4"
              >
                <span
                  className={cn(
                    "grid h-14 w-20 shrink-0 place-items-center overflow-hidden rounded-xl",
                    toneBg(m.tone as never),
                  )}
                >
                  <ModuleArt
                    art={m.art as never}
                    tone={m.tone as never}
                    className="h-full w-full"
                  />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-[1.0625rem] font-bold text-ink">
                    {m.kidTitle}
                  </span>
                  <span className="mt-0.5 block text-[0.875rem] text-ink-45">
                    {tender
                      ? "This one has been tricky. That's fine."
                      : `About ${m.minutes} minutes`}
                  </span>
                </span>

                {cta && (
                  <span className="shrink-0 rounded-xl bg-ink px-4 py-2.5 text-[0.9375rem] font-semibold text-white transition-colors group-hover:bg-ink/88">
                    {cta}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
