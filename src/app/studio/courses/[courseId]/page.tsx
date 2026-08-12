import Link from "next/link";
import { notFound } from "next/navigation";
import { WorkPage, Card, Metric, Pill } from "@/components/app/Page";
import { ModuleEditor } from "@/components/app/ModuleEditor";
import { STATUS } from "@/components/app/statusPill";
import { BackButton } from "@/components/ui/BackButton";
import { courseById, CREATOR_COURSES } from "@/lib/platform";

export async function generateStaticParams() {
  return CREATOR_COURSES.map((c) => ({ courseId: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  return { title: courseById(courseId)?.title ?? "Module" };
}

/**
 * ONE MODULE.
 *
 * The reviewer's note, if there is one, sits above the editor rather than
 * beside it. A creator opening a module that came back has exactly one job,
 * and putting the note in a sidebar means scrolling past the thing you were
 * asked to fix on the way to fixing it.
 *
 * Performance figures only appear once it is live, and they are aggregated.
 * There is no view anywhere in studio that resolves to a child.
 */
export default async function StudioCourse({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const c = courseById(courseId);
  if (!c) notFound();

  const s = STATUS[c.status];

  return (
    <WorkPage
      title={c.title}
      blurb={`Ages ${c.ages[0]} to ${c.ages[1]} · about ${c.minutes} minutes · ${c.lessons} lessons, ${c.checks} checks`}
      action={<Pill tone={s.tone}>{s.label}</Pill>}
    >
      <div className="mb-6">
        <BackButton fallbackHref="/studio/courses" label="All modules" />
      </div>

      {c.note && (
        <Card
          tone="warn"
          className="mb-6"
          title="A reviewer read this and asked for changes"
        >
          <p className="text-[1rem] leading-relaxed text-ink">{c.note}</p>
          <p className="mt-3 text-[0.875rem] text-ink-45">
            Fix it below and resubmit. It goes back into the same queue, not to
            the end of it.
          </p>
        </Card>
      )}

      {c.status === "waiting" && (
        <Card className="mb-6" title="With us">
          <p className="text-[0.9375rem] leading-relaxed text-ink-70">
            A person is reading this. You can keep editing, but changes made now
            will not be what they see; submit again afterwards if you change
            anything substantive.
          </p>
        </Card>
      )}

      {c.stats && (
        <section className="mb-6">
          <h2 className="mb-4 text-lg font-semibold tracking-[-0.02em] text-ink">
            How it lands
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric
              value={c.stats.medianHelpRung.toFixed(1)}
              label="Median help needed"
              hint="0 is a bare question, 5 is being told"
              tone={c.stats.medianHelpRung <= 2 ? "green" : "amber"}
            />
            <Metric
              value={`${c.stats.independentPct}%`}
              label="Finish independently"
              tone="green"
            />
            <Metric
              value={c.stats.learners.toLocaleString("en-GB")}
              label="Learners"
              hint="aggregated, never named"
            />
            <Metric
              value={`${c.stats.stickiestWrongPct}%`}
              label="Wrong on the hardest check"
              hint="first attempt"
              tone="amber"
            />
          </div>

          <Card className="mt-4" title="The check they get wrong">
            <p className="text-[1.0625rem] leading-snug text-ink">
              &ldquo;{c.stats.stickiestCheck}&rdquo;
            </p>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-70">
              {c.stats.stickiestWrongPct}% get this wrong first time. That is not
              necessarily a fault: a check nobody fails is a check that was not
              worth asking. It is worth reading your re-teach for this one and
              making sure it explains rather than repeats.
            </p>
            <Link
              href="/studio/insights"
              className="mt-3 inline-block text-[0.875rem] font-medium text-indigo underline underline-offset-4 hover:text-indigo-hi"
            >
              See it across every module
            </Link>
          </Card>
        </section>
      )}

      <ModuleEditor initialTitle={c.title} status={c.status} />
    </WorkPage>
  );
}
