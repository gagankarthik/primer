import { cn } from "@/components/ui/cn";

/**
 * Shared furniture for the parent area.
 *
 * Extracted the second a third page needed it. Six pages each hand-rolling a
 * "card with a heading and a blurb" is how an application ends up with six
 * slightly different cards, and a parent notices that as sloppiness even when
 * they cannot name what is wrong.
 */

export function PageHead({
  title,
  blurb,
  action,
}: {
  title: string;
  blurb?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-[1.75rem] font-semibold tracking-[-0.03em] text-ink">
          {title}
        </h1>
        {blurb && (
          <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-70">
            {blurb}
          </p>
        )}
      </div>
      {action}
    </header>
  );
}

export function Panel({
  title,
  blurb,
  children,
  tone = "plain",
  className,
}: {
  title?: string;
  blurb?: string;
  children: React.ReactNode;
  tone?: "plain" | "warn";
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border p-6 shadow-tight sm:p-7",
        tone === "warn"
          ? "border-rose/30 bg-rose/[0.03]"
          : "border-line bg-surface",
        className,
      )}
    >
      {title && (
        <h2 className="text-[1.0625rem] font-semibold text-ink">{title}</h2>
      )}
      {blurb && (
        <p className="mt-1.5 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-70">
          {blurb}
        </p>
      )}
      <div className={cn(title || blurb ? "mt-5" : undefined)}>{children}</div>
    </section>
  );
}

export function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-4 first:border-t-0 first:pt-0">
      <div className="min-w-0">
        <p className="text-[0.9375rem] font-medium text-ink">{label}</p>
        {hint && (
          <p className="mt-0.5 text-[0.8125rem] leading-snug text-ink-45">
            {hint}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

/**
 * SWITCH
 *
 * There were two of these, hand-rolled in Settings and again in Profile, and
 * both were a grey pill with a white dot: geometrically correct and completely
 * mute. Nothing said which state was "on" except the colour, there was no
 * focus ring, and the knob teleported.
 *
 * What it now says, in order of how quickly you can read it:
 *
 *  - Colour. Indigo on, plain grey off.
 *  - Position. The knob travels, on a spring, so the change reads as a
 *    physical throw rather than a repaint.
 *  - Shape. A tick appears in the knob when on. Colour alone fails for the
 *    roughly one in twelve men with a red-green deficiency, and it fails
 *    completely in a screenshot printed in black and white, which is how
 *    settings pages get shared with a co-parent.
 *
 * Focus is a visible ring, not a browser default that the rounded track hides.
 */
export function Switch({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  /** Announced to screen readers. The visible text is the Row's label. */
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "group relative h-8 w-[3.375rem] shrink-0 rounded-full outline-none transition-colors duration-200",
        "focus-visible:ring-2 focus-visible:ring-indigo/45 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        checked
          ? "bg-indigo hover:bg-indigo-hi"
          : "bg-ink/[0.14] hover:bg-ink/20",
        disabled && "cursor-not-allowed opacity-45",
      )}
    >
      <span
        className={cn(
          "absolute top-1 grid h-6 w-6 place-items-center rounded-full bg-white shadow-[0_1px_3px_rgba(11,18,32,0.28)]",
          "transition-transform duration-200 ease-[cubic-bezier(.22,1,.36,1)]",
          checked ? "translate-x-[1.625rem]" : "translate-x-1",
        )}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
          className={cn(
            "transition-opacity duration-150",
            checked ? "opacity-100" : "opacity-0",
          )}
        >
          <path
            d="M2.5 6.2 4.8 8.5 9.5 3.8"
            stroke="var(--color-indigo)"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}

/** A single figure with its label. The parent area's only stat treatment. */
export function Stat({
  value,
  label,
  caption,
  tone = "ink",
}: {
  value: React.ReactNode;
  label: string;
  caption?: string;
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
      <p className={cn("figure-num text-3xl font-semibold", colour)}>{value}</p>
      <p className="mt-1 text-[0.875rem] font-medium text-ink">{label}</p>
      {caption && (
        <p className="mt-0.5 text-[0.8125rem] leading-snug text-ink-45">
          {caption}
        </p>
      )}
    </div>
  );
}
