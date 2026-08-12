"use client";

import { useId } from "react";
import { cn } from "@/components/ui/cn";

/**
 * ADMIN CHARTS
 *
 * Hand-drawn SVG for the same reason as the parent charts: a charting library
 * is 90–150kB for what is four `<path>` elements, and these have opinions a
 * general library will not hold.
 *
 * Every one of them keeps two rules learned the hard way on the parent
 * dashboard:
 *
 *  - No `preserveAspectRatio="none"` on a square viewBox. It scales x and y by
 *    different factors, so circles render as ellipses and strokes thicken
 *    vertically. Where the box is stretched, strokes carry
 *    `vectorEffect="non-scaling-stroke"`.
 *  - Axis labels are HTML, outside the SVG. Text inside a viewBox scales with
 *    the drawing and becomes unreadable on a phone.
 */

/* -------------------------------------------------------------- area line */

/** Growth over time. Up is good, so nothing is inverted here. */
export function AreaLine({
  points,
  tone = "indigo",
  unit = "plain",
}: {
  points: { label: string; value: number }[];
  tone?: "indigo" | "green";
  /**
   * How to read the numbers aloud in the aria-label.
   *
   * A string rather than a formatter function: this renders inside a server
   * component, and a function prop crossing that boundary throws "Functions
   * cannot be passed directly to Client Components". Serialisable props only.
   */
  unit?: "plain" | "money" | "decimal";
}) {
  const format = (n: number) =>
    unit === "money"
      ? `$${n.toLocaleString("en-GB")}`
      : unit === "decimal"
        ? n.toFixed(1)
        : n.toLocaleString("en-GB");

  const id = useId();
  if (points.length < 2) return null;

  const W = 560;
  const H = 180;
  const P = 10;

  const max = Math.max(...points.map((p) => p.value));
  const min = Math.min(...points.map((p) => p.value));
  const span = Math.max(1, max - min);

  const x = (i: number) => P + (i / (points.length - 1)) * (W - P * 2);
  const y = (v: number) => P + (1 - (v - min) / span) * (H - P * 2);

  const xy = points.map((p, i) => ({ x: x(i), y: y(p.value), ...p }));
  const line = xy.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${line} L${xy[xy.length - 1].x},${H - P} L${xy[0].x},${H - P} Z`;

  const stroke = tone === "green" ? "var(--color-green)" : "var(--color-indigo)";

  return (
    <figure className="m-0">
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="w-full"
          style={{ height: 180 }}
          role="img"
          aria-label={`From ${format(points[0].value)} to ${format(points[points.length - 1].value)}`}
        >
          <defs>
            <linearGradient id={`${id}-f`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity="0.18" />
              <stop offset="100%" stopColor={stroke} stopOpacity="0.01" />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#${id}-f)`} />
          <path
            d={line}
            fill="none"
            stroke={stroke}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Dots as HTML, so they stay circular under a stretched viewBox. */}
        <div className="absolute inset-0">
          {xy.map((p, i) => (
            <span
              key={i}
              className={cn(
                "absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-base",
                tone === "green" ? "border-green" : "border-indigo",
              )}
              style={{
                left: `${((p.x - P) / (W - P * 2)) * 100}%`,
                top: `${(p.y / H) * 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="mt-2 flex justify-between text-[0.75rem] text-ink-45">
        {points.map((p, i) => (
          <span key={i}>{p.label}</span>
        ))}
      </div>
    </figure>
  );
}

/* ------------------------------------------------------------ stacked bar */

/**
 * One bar, split by share. Used for plan mix, where a pie would need a legend
 * and a protractor to compare two adjacent slices.
 */
export function ShareBar({
  parts,
}: {
  parts: { label: string; value: number; tone: "indigo" | "green" | "amber" | "rose" | "grey" }[];
}) {
  const total = parts.reduce((n, p) => n + p.value, 0) || 1;
  const fill = {
    indigo: "bg-indigo",
    green: "bg-green",
    amber: "bg-amber",
    rose: "bg-rose",
    grey: "bg-ink/15",
  };
  const dot = {
    indigo: "bg-indigo",
    green: "bg-green",
    amber: "bg-amber",
    rose: "bg-rose",
    grey: "bg-ink/25",
  };

  return (
    <div>
      <div className="flex h-4 w-full overflow-hidden rounded-full">
        {parts.map((p) => (
          <span
            key={p.label}
            className={fill[p.tone]}
            style={{ width: `${(p.value / total) * 100}%` }}
            role="img"
            aria-label={`${p.label}: ${Math.round((p.value / total) * 100)}%`}
          />
        ))}
      </div>
      <ul className="mt-4 space-y-2">
        {parts.map((p) => (
          <li key={p.label} className="flex items-center gap-3">
            <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", dot[p.tone])} />
            <span className="min-w-0 flex-1 truncate text-[0.9375rem] text-ink-70">
              {p.label}
            </span>
            <span className="figure-num text-[0.9375rem] font-semibold text-ink">
              {p.value.toLocaleString("en-GB")}
            </span>
            <span className="figure-num w-12 text-right text-[0.8125rem] text-ink-45">
              {Math.round((p.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------- rung bars */

/**
 * Distribution of help rung across every session on the platform.
 *
 * The single most important chart in the product, and the reason it is a
 * histogram rather than an average: an average of 2.1 could be everyone
 * needing a nudge, or half the children solving it cold and half being told
 * outright. Those are completely different products and they need different
 * fixes.
 */
export function RungHistogram({
  buckets,
}: {
  buckets: { rung: number; label: string; sessions: number }[];
}) {
  const max = Math.max(...buckets.map((b) => b.sessions));

  return (
    <div>
      <div className="flex h-40 items-stretch gap-1.5 sm:gap-2">
        {buckets.map((b) => {
          // Rung 0-2 is the product working; 4-5 is it giving up.
          const tone =
            b.rung <= 1 ? "bg-green" : b.rung <= 3 ? "bg-indigo" : "bg-amber";
          return (
            <div key={b.rung} className="flex h-full min-w-0 flex-1 flex-col">
              <div className="flex min-h-0 flex-1 items-end">
                <div
                  className={cn("w-full rounded-t-lg", tone)}
                  style={{ height: `${Math.max(3, (b.sessions / max) * 100)}%` }}
                  role="img"
                  aria-label={`Rung ${b.rung}, ${b.label}: ${b.sessions.toLocaleString("en-GB")} sessions`}
                />
              </div>
              <span className="figure-num mt-2 shrink-0 text-center text-[0.75rem] font-semibold text-ink">
                {b.rung}
              </span>
              <span className="mt-0.5 shrink-0 truncate text-center text-[0.625rem] leading-tight text-ink-45">
                {b.label}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-[0.8125rem] leading-snug text-ink-45">
        An average hides this. 2.1 could be everyone needing one nudge, or half
        solving it cold and half being told outright, which are different
        products with different problems.
      </p>
    </div>
  );
}
