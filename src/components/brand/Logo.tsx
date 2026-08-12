import { cn } from "@/components/ui/cn";

/**
 * THE MARK
 *
 * A staircase of three treads, ascending left to right.
 *
 * The reasoning: this product's entire idea is that you get there one rung at
 * a time, never carried, never dropped. A staircase says that in a shape a
 * six-year-old can read and an adult can respect. It is also the only mark in
 * this category that isn't a book, an owl, a graduation cap, or a rocket, all
 * of which say "school", and the Primer is deliberately not school.
 *
 * Constraints it is built to survive:
 *  - legible at 16px in a browser tab (three treads, nothing finer)
 *  - works as a solid tile, an outline, or knocked out of a dark surface
 *  - no gradient, no inner shadow, no detail that turns to mud when scaled
 */

type MarkProps = {
  size?: number;
  className?: string;
  /** `tile` = white steps on indigo. `bare` = steps in currentColor. */
  variant?: "tile" | "bare";
};

export function LogoMark({ size = 32, className, variant = "tile" }: MarkProps) {
  const steps = (
    <path
      d="M7.5 23.5H13V18H18.5V12.5H24.5"
      fill="none"
      stroke={variant === "tile" ? "#fff" : "currentColor"}
      strokeWidth="2.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={cn("shrink-0", className)}
      role="img"
      aria-label="Primer"
    >
      {variant === "tile" && (
        <rect width="32" height="32" rx="9" fill="var(--color-indigo, #3D4EE8)" />
      )}
      {steps}
    </svg>
  );
}

/**
 * Horizontal lockup. Tracking is tightened on the wordmark because Inter Tight
 * reads too loose at this size next to a solid tile, type tracking is
 * size-specific, never one value everywhere.
 */
export function Logo({
  size = 30,
  className,
  tone = "dark",
}: {
  size?: number;
  className?: string;
  /** `dark` = ink wordmark for light surfaces. `light` = white for dark. */
  tone?: "dark" | "light";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={size} />
      <span
        className={cn(
          "font-semibold",
          tone === "dark" ? "text-ink" : "text-white",
        )}
        style={{
          fontSize: size * 0.55,
          letterSpacing: "-0.03em",
        }}
      >
        Primer
      </span>
    </span>
  );
}

/** Stacked lockup, for splash and empty states. */
export function LogoStacked({
  size = 56,
  tone = "dark",
}: {
  size?: number;
  tone?: "dark" | "light";
}) {
  return (
    <span className="inline-flex flex-col items-center gap-3">
      <LogoMark size={size} />
      <span
        className={cn(
          "font-semibold",
          tone === "dark" ? "text-ink" : "text-white",
        )}
        style={{ fontSize: size * 0.34, letterSpacing: "-0.03em" }}
      >
        Primer
      </span>
    </span>
  );
}
