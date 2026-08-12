"use client";

import { useId } from "react";
import { cn } from "@/components/ui/cn";

/**
 * CHARTS
 *
 * Hand-drawn SVG rather than a charting library. Three reasons, in order:
 *
 *  1. Recharts and friends are 90–150kB for what amounts to four `<path>`
 *     elements here. On a dashboard a parent opens for ninety seconds on a
 *     phone, that is the entire budget spent on drawing lines.
 *  2. These charts have opinions a general library will not hold: the help
 *     axis is inverted (down is worse), the good direction is up, and the
 *     colours come from the help scale, not a default palette.
 *  3. They have to be readable without hovering. A tooltip-only chart is
 *     useless on a tablet and useless in a screenshot forwarded to a partner.
 *
 * Every chart here is labelled in words underneath. A parent should be able to
 * take the sentence and ignore the picture.
 */

/* ------------------------------------------------------------- help trend */

/**
 * How much help each session took, over time.
 *
 * The y axis is inverted deliberately: rung 0 (worked it out from one
 * question) is at the TOP, rung 5 (had to be told) is at the bottom. So the
 * line going up means improving, which is the direction every reader already
 * expects. A chart where "better" points downward gets misread every time,
 * however carefully the axis is labelled.
 */
export function HelpTrend({
  points,
}: {
  points: { label: string; rung: number }[];
}) {
  const id = useId();
  if (points.length < 2) return null;

  /*
    A real coordinate space, scaled uniformly.

    The first version used a 100x100 viewBox with preserveAspectRatio="none"
    stretched across a wide box. That scales x and y by different factors, so
    every circle rendered as an ellipse and the stroke was thicker vertically
    than horizontally. It looked like a broken sparkline rather than a chart.

    Here the viewBox matches the rendered aspect ratio and nothing is
    stretched, so a 4px dot is a 4px dot.
  */
  /*
    Axis labels are HTML, outside the SVG. Text inside a viewBox scales with
    the drawing: 13px in a 640-wide box renders at about 7px once the chart is
    squeezed onto a 360px phone, which is unreadable. Only the plot is drawn
    here; every word around it is real text at a real size.
  */
  const W = 560;
  const H = 240;
  const L = 8;
  const R = 8;
  const T = 14;
  const B = 14;
  const MAX = 5;

  const px = (i: number) => L + (i / (points.length - 1)) * (W - L - R);
  const py = (rung: number) => T + (rung / MAX) * (H - T - B);

  const xy = points.map((p, i) => ({ x: px(i), y: py(p.rung), ...p }));

  /** Catmull-Rom to cubic bezier. A straight polyline reads as sharper
      week-to-week swings than the underlying data supports. */
  const curve = xy
    .map((p, i, a) => {
      if (i === 0) return `M${p.x},${p.y}`;
      const p0 = a[i - 2] ?? a[i - 1];
      const p1 = a[i - 1];
      const p2 = p;
      const p3 = a[i + 1] ?? p;
      const c1x = p1.x + (p2.x - p0.x) / 6;
      const c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6;
      const c2y = p2.y - (p3.y - p1.y) / 6;
      return `C${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
    })
    .join(" ");

  const area = `${curve} L${xy[xy.length - 1].x},${H - B} L${xy[0].x},${H - B} Z`;

  const better = points[points.length - 1].rung < points[0].rung;

  // Words, not rung numbers. "Rung 3" means nothing without the ladder in
  // front of you; "needed a nudge" means something immediately.
  const bands: { rung: number; text: string }[] = [
    { rung: 0, text: "worked it out" },
    { rung: 2, text: "needed a nudge" },
    { rung: 5, text: "had to be told" },
  ];

  return (
    <figure className="m-0">
      <div className="flex gap-3">
        {/* Y axis, as HTML. The band labels sit at the same fractions of the
            plot height that the guide lines do inside the SVG. */}
        <div
          aria-hidden
          className="relative hidden w-[6.5rem] shrink-0 sm:block"
          style={{ height: 240 }}
        >
          {bands.map((b) => (
            <span
              key={b.rung}
              className="absolute right-0 -translate-y-1/2 text-right text-[0.75rem] leading-tight text-ink-45"
              style={{ top: `${(py(b.rung) / H) * 100}%` }}
            >
              {b.text}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="w-full"
            style={{ height: 240 }}
            role="img"
            aria-label={`Help needed across ${points.length} sessions. ${
              better
                ? "Needing less help than at the start."
                : "Needing more help than at the start."
            }`}
          >
            <defs>
              <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-indigo)" stopOpacity="0.18" />
                <stop offset="100%" stopColor="var(--color-indigo)" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {bands.map((b) => (
              <line
                key={b.rung}
                x1={L}
                x2={W - R}
                y1={py(b.rung)}
                y2={py(b.rung)}
                stroke="rgba(11,18,32,0.09)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                strokeDasharray={b.rung === 0 || b.rung === MAX ? undefined : "3 4"}
              />
            ))}

            <path d={area} fill={`url(#${id}-fill)`} />
            {/* non-scaling-stroke keeps the line 2.5px however the box is
                stretched, so the horizontal squeeze cannot fatten it. */}
            <path
              d={curve}
              fill="none"
              stroke="var(--color-indigo)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Points and their dates, positioned as HTML over the plot so both
              the dot and the label keep their real size at any width. */}
          <div className="relative" style={{ marginTop: -240, height: 240 }}>
            {xy.map((p, i) => {
              const last = i === xy.length - 1;
              return (
                <span
                  key={i}
                  className={cn(
                    "absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] bg-base",
                    last
                      ? better
                        ? "border-green"
                        : "border-amber"
                      : "border-indigo",
                  )}
                  style={{
                    left: `${((p.x - L) / (W - L - R)) * 100}%`,
                    top: `${(p.y / H) * 100}%`,
                  }}
                />
              );
            })}
          </div>

          <div className="mt-2 flex justify-between text-[0.75rem] text-ink-45">
            {xy.map((p, i) => (
              <span key={i} className="truncate">
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-3 text-[0.875rem] text-ink-70">
        <span className={cn("font-semibold", better ? "text-green" : "text-amber")}>
          {better ? "Needing less help" : "Needing more help"}
        </span>{" "}
        than at the start of this stretch.{" "}
        {/* The y axis is hidden below sm, so its meaning has to survive in
            words. Up is better, and that has to be said, not just drawn. */}
        <span className="sm:hidden">Higher on the chart is better.</span>
      </p>
    </figure>
  );
}

/* ------------------------------------------------------------ topic bars */

/** Horizontal bars, sorted. The only chart type that survives being small. */
export function TopicBars({
  rows,
}: {
  rows: { label: string; value: number; tender?: boolean }[];
}) {
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="truncate text-[0.9375rem] font-medium text-ink">
              {r.label}
            </span>
            <span className="figure-num shrink-0 text-[0.8125rem] text-ink-45">
              {r.tender ? "needs a hand" : r.value >= 70 ? "solid" : "getting there"}
            </span>
          </div>
          <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-ink/8">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                r.tender
                  ? "bg-amber"
                  : r.value >= 70
                    ? "bg-green"
                    : "bg-indigo",
              )}
              style={{ width: `${Math.max(6, r.value)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------ week bars */

/**
 * Minutes per day. Explicitly labelled as a fact rather than a target: there
 * is no goal line, because a goal a family did not set becomes a debt, and a
 * debt is what makes people stop opening the app.
 */
export function WeekBars({
  days,
}: {
  days: { day: string; minutes: number }[];
}) {
  const max = Math.max(20, ...days.map((d) => d.minutes));

  return (
    <div>
      {/*
        The column is `h-full` and the label is a fixed-height row beneath the
        track, not a sibling of the bar. Percentage heights resolve against the
        nearest definite-height ancestor, so when the label shared a column
        with the bar the column's height was auto and every bar computed to
        zero. The chart rendered as seven invisible bars and a row of day
        names, which read as "no data" rather than as a bug.
      */}
      {/* gap-1 below sm: seven columns plus 8px gutters overflows a 360px
          card, and a bar chart that scrolls sideways is a bar chart nobody
          reads the right-hand end of. */}
      <div className="flex h-32 items-stretch gap-1 sm:gap-2">
        {days.map((d) => (
          <div key={d.day} className="flex h-full min-w-0 flex-1 flex-col">
            <div className="flex min-h-0 flex-1 items-end">
              <div
                className={cn(
                  "w-full rounded-t-lg transition-all",
                  d.minutes === 0 ? "bg-ink/10" : "bg-indigo",
                )}
                style={{ height: `${Math.max(3, (d.minutes / max) * 100)}%` }}
                role="img"
                aria-label={`${d.day}: ${d.minutes} minutes`}
              />
            </div>
            <span className="mt-2 shrink-0 text-center text-[0.6875rem] text-ink-45">
              {d.day}
            </span>
            <span className="figure-num shrink-0 text-center text-[0.75rem] font-medium text-ink">
              {d.minutes || "–"}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[0.8125rem] text-ink-45">
        No target here on purpose. This is what happened, not what should have.
      </p>
    </div>
  );
}
