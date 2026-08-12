/**
 * DOODLES
 *
 * Hand-drawn marks scattered behind the layout, squiggles, sparks, loops,
 * dots. They do one job: stop a clean grid of cards from reading as corporate.
 *
 * Rules that keep them from becoming clutter:
 *  - Always `aria-hidden` and `pointer-events-none`. They carry no meaning.
 *  - Never behind body copy, only in the margins and gutters.
 *  - Low count per screen. Four or five, not a confetti field.
 *  - Drawn with round caps and slightly uneven curves so they read as a pen
 *    stroke rather than a perfect bezier.
 */

type D = { className?: string; color?: string; size?: number };

export function Squiggle({ className, color = "var(--color-amber)", size = 64 }: D) {
  return (
    <svg
      width={size}
      height={size * 0.45}
      viewBox="0 0 100 45"
      className={className}
      fill="none"
      aria-hidden
    >
      <path
        d="M4 30c8-20 20-20 28-6s20 14 28-2 22-14 34 4"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Spark({ className, color = "var(--color-indigo)", size = 28 }: D) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      aria-hidden
    >
      <path
        d="M20 2c1.5 10 6.5 15 18 18-11.5 3-16.5 8-18 18-1.5-10-6.5-15-18-18 11.5-3 16.5-8 18-18Z"
        fill={color}
      />
    </svg>
  );
}

export function Loop({ className, color = "var(--color-amber)", size = 70 }: D) {
  return (
    <svg
      width={size}
      height={size * 0.7}
      viewBox="0 0 100 70"
      className={className}
      fill="none"
      aria-hidden
    >
      <path
        d="M6 52c0-30 26-46 44-40s22 34 4 38-24-18-6-26 40-2 46 20"
        stroke={color}
        strokeWidth="5.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Dots({ className, color = "var(--color-green)", size = 44 }: D) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      className={className}
      fill="none"
      aria-hidden
    >
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => (
          <circle key={`${r}-${c}`} cx={6 + c * 16} cy={6 + r * 16} r="3.2" fill={color} />
        )),
      )}
    </svg>
  );
}

export function Rings({ className, color = "var(--color-indigo)", size = 56 }: D) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      className={className}
      fill="none"
      aria-hidden
    >
      {[26, 19, 12, 5].map((r, i) => (
        <circle
          key={r}
          cx="30"
          cy="30"
          r={r}
          stroke={color}
          strokeWidth="2.5"
          opacity={0.25 + i * 0.18}
        />
      ))}
    </svg>
  );
}

export function Arc({ className, color = "var(--color-rose)", size = 60 }: D) {
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 100 60"
      className={className}
      fill="none"
      aria-hidden
    >
      <path
        d="M6 54C6 24 28 6 52 6s42 18 42 48"
        stroke={color}
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeDasharray="1 16"
      />
    </svg>
  );
}
