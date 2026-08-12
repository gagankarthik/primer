import { cn } from "@/components/ui/cn";

/**
 * Shared furniture for the learner pages.
 *
 * Bigger type and looser spacing than the parent equivalent throughout. The
 * parent area is scanned in ninety seconds between other things; this is read,
 * slowly, sometimes out loud, by someone still learning to read.
 *
 * LAYOUT. The content used to sit in a fixed `max-w-4xl` column, which on a
 * 1900px monitor left roughly a third of the screen empty to the right of
 * everything. A reading measure has to be capped, but the *page* does not:
 * capping the page just wastes the display.
 *
 * So the page fills the width, and above `xl` it splits into content plus a
 * sticky side column. The side column carries the at-a-glance facts a child
 * would otherwise have to navigate away to see, which is what that space is
 * actually for. Below `xl` the side column moves inline, above the content,
 * because on a tablet the summary is the more useful thing to meet first.
 */

export function LearnerPage({
  title,
  blurb,
  aside,
  children,
}: {
  title: string;
  blurb?: string;
  /** At-a-glance facts. Sticky right column on wide screens, inline below. */
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="px-6 pb-16 pt-2 lg:px-10 lg:pt-10">
      <header className="max-w-3xl">
        <h1 className="text-[1.875rem] font-bold tracking-[-0.03em] text-ink sm:text-[2.25rem]">
          {title}
        </h1>
        {blurb && (
          <p
            className="mt-2 text-[1.0625rem] leading-[1.5] text-ink-45"
            style={{ fontFamily: "var(--font-read)" }}
          >
            {blurb}
          </p>
        )}
      </header>

      {aside ? (
        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_21rem] xl:gap-10">
          {/* Content first in the DOM, so a screen reader and a keyboard both
              reach the page's actual subject before the summary. Order is
              swapped visually only below xl. */}
          <div className="order-2 min-w-0 xl:order-1">{children}</div>
          <aside className="order-1 xl:order-2">
            <div className="space-y-4 xl:sticky xl:top-6">{aside}</div>
          </aside>
        </div>
      ) : (
        <div className="mt-8">{children}</div>
      )}
    </main>
  );
}

export function Section({
  title,
  blurb,
  children,
  className,
}: {
  title: string;
  blurb?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mt-10 first:mt-0", className)}>
      <h2 className="text-[1.25rem] font-bold tracking-[-0.02em] text-ink">
        {title}
      </h2>
      {blurb && <p className="mt-1 text-[0.9375rem] text-ink-45">{blurb}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

/**
 * A number a child is allowed to see.
 *
 * Nothing here is ever a percentage. "62% mastery" means nothing to a
 * seven-year-old and means something slightly wrong to a parent; a count of
 * real things does neither.
 */
export function BigStat({
  value,
  label,
  tone = "indigo",
}: {
  value: React.ReactNode;
  label: string;
  tone?: "indigo" | "green" | "amber" | "rose";
}) {
  const bg = {
    indigo: "bg-indigo-tint text-indigo",
    green: "bg-green-tint text-green",
    amber: "bg-amber/12 text-amber",
    rose: "bg-rose/10 text-rose",
  }[tone];

  return (
    <div className={cn("rounded-2xl px-5 py-5", bg)}>
      <p className="figure-num text-[2.25rem] font-bold leading-none">{value}</p>
      <p className="mt-2 text-[0.9375rem] font-semibold leading-snug text-ink">
        {label}
      </p>
    </div>
  );
}

/** A card for the side column. Quiet, so it never competes with the content. */
export function AsideCard({
  title,
  children,
  tone = "plain",
}: {
  title: string;
  children: React.ReactNode;
  tone?: "plain" | "indigo";
}) {
  return (
    <section
      className={cn(
        "rounded-2xl px-5 py-5",
        tone === "indigo"
          ? "bg-indigo-tint"
          : "border border-line bg-surface shadow-tight",
      )}
    >
      <h2 className="text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-ink-45">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
