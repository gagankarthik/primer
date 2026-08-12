import { cn } from "@/components/ui/cn";

/**
 * Furniture for the admin and studio pages. Denser than the parent area and
 * far denser than the child area: these are read by someone at a desk doing a
 * job, not by a parent between other things or a child learning to read.
 */

export function WorkPage({
  title,
  blurb,
  action,
  children,
}: {
  title: string;
  blurb?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="px-5 py-8 sm:px-8 lg:px-10">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="text-[1.75rem] font-semibold tracking-[-0.03em] text-ink">
            {title}
          </h1>
          {blurb && (
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-70">
              {blurb}
            </p>
          )}
        </div>
        {action}
      </header>
      {children}
    </main>
  );
}

export function Card({
  title,
  blurb,
  action,
  children,
  tone = "plain",
  className,
}: {
  title?: string;
  blurb?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  tone?: "plain" | "warn" | "danger";
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border p-5 shadow-tight sm:p-6",
        tone === "danger"
          ? "border-rose/30 bg-rose/[0.03]"
          : tone === "warn"
            ? "border-amber/30 bg-amber/[0.04]"
            : "border-line bg-surface",
        className,
      )}
    >
      {(title || action) && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && (
              <h2 className="text-[1.0625rem] font-semibold text-ink">{title}</h2>
            )}
            {blurb && (
              <p className="mt-1 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-70">
                {blurb}
              </p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

/**
 * A KPI. Every one carries a comparison, because a number with no baseline is
 * a number nobody can act on.
 */
export function Metric({
  value,
  label,
  hint,
  delta,
  tone = "ink",
}: {
  value: React.ReactNode;
  label: string;
  hint?: string;
  delta?: { text: string; good: boolean };
  tone?: "ink" | "green" | "amber" | "rose" | "indigo";
}) {
  const colour = {
    ink: "text-ink",
    green: "text-green",
    amber: "text-amber",
    rose: "text-rose",
    indigo: "text-indigo",
  }[tone];

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-tight">
      <div className="flex flex-wrap items-baseline gap-2">
        <p className={cn("figure-num text-[1.875rem] font-semibold leading-none", colour)}>
          {value}
        </p>
        {delta && (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[0.75rem] font-semibold",
              delta.good ? "bg-green/12 text-green" : "bg-amber/15 text-amber",
            )}
          >
            {delta.text}
          </span>
        )}
      </div>
      <p className="mt-2 text-[0.9375rem] font-medium text-ink">{label}</p>
      {hint && (
        <p className="mt-0.5 text-[0.8125rem] leading-snug text-ink-45">{hint}</p>
      )}
    </div>
  );
}

const PILL_TONES = {
  neutral: "bg-grey-tint text-ink-45",
  indigo: "bg-indigo-tint text-indigo",
  green: "bg-green-tint text-green",
  amber: "bg-amber/15 text-amber",
  rose: "bg-rose/12 text-rose",
} as const;

export function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: keyof typeof PILL_TONES;
}) {
  return (
    <span
      className={cn(
        "inline-block shrink-0 rounded-full px-2.5 py-1 text-[0.75rem] font-semibold",
        PILL_TONES[tone],
      )}
    >
      {children}
    </span>
  );
}

/**
 * A table that becomes cards on a phone.
 *
 * `overflow-x-auto` on its own is not responsive, it is a promise that the
 * right-hand columns exist somewhere off-screen. Below `md` each row stacks
 * instead, which is why every cell carries its own label.
 */
export function Rows({ children }: { children: React.ReactNode }) {
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
      {children}
    </ul>
  );
}
