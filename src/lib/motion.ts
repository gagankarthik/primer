/**
 * Motion foundation, Apple's fluid-interface model, on the web.
 *
 * Two ideas drive everything here:
 *
 *  1. Springs, not durations. A spring has no fixed length; it can be
 *     re-targeted mid-flight and it always animates from wherever the element
 *     currently *is*. That is what makes an interface interruptible, the user
 *     can grab a moving thing and reverse it without waiting for it to finish.
 *
 *  2. Velocity is handed off, never discarded. When a drag ends, the animation
 *     continues at the finger's exact speed, so there is no visible seam
 *     between "dragging" and "animating".
 *
 * Apple parameterises springs as damping + response rather than
 * mass/stiffness/damping. Motion's `bounce` + `duration` maps onto that:
 * bounce 0 == critically damped (damping 1.0), and duration == response.
 */

/** Critically damped. The default for anything that isn't momentum-driven. */
export const SPRING_UI = { type: "spring", bounce: 0, duration: 0.4 } as const;

/** Snappier, still no overshoot. Small controls, chips, tab pills. */
export const SPRING_SNAP = { type: "spring", bounce: 0, duration: 0.28 } as const;

/**
 * Slight overshoot, use ONLY after a gesture that carried momentum (a flick,
 * a throw, a drag release). Bounce on something that merely faded in reads as
 * decoration; bounce on something you threw reads as physics.
 */
export const SPRING_MOMENTUM = { type: "spring", bounce: 0.2, duration: 0.4 } as const;

/** Sheets and drawers. Apple ships damping 0.8 / response 0.3 here. */
export const SPRING_SHEET = { type: "spring", bounce: 0.2, duration: 0.3 } as const;

/**
 * Where a flick is *going*, not where the finger left off.
 *
 * This is the same exponential decay a scroll view uses, and it is what makes
 * a small flick throw an element a long way. Snapping to the nearest point
 * from the release position instead makes every gesture feel weak.
 *
 * Note this is deliberately NOT the textbook v²/(2·a), it is the decay form
 * Apple ships in the Designing Fluid Interfaces sample code.
 */
export function project(velocity: number, decelerationRate = 0.998): number {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/** The snap target nearest a projected landing point. */
export function nearestSnap(value: number, points: number[]): number {
  return points.reduce((best, p) =>
    Math.abs(p - value) < Math.abs(best - value) ? p : best,
  );
}

/**
 * Progressive resistance past a boundary. A hard stop reads as "frozen"; the
 * element should keep responding but give less and less, exactly like pulling
 * against something elastic.
 */
export function rubberband(
  overshoot: number,
  dimension: number,
  constant = 0.55,
): number {
  return (
    (overshoot * dimension * constant) /
    (dimension + constant * Math.abs(overshoot))
  );
}

/** Clamp with rubber-banding outside the range rather than a hard stop. */
export function clampElastic(
  value: number,
  min: number,
  max: number,
  dimension: number,
): number {
  if (value < min) return min - rubberband(min - value, dimension);
  if (value > max) return max + rubberband(value - max, dimension);
  return value;
}

/** Tracks recent pointer samples so release velocity is real, not a guess. */
export class VelocityTracker {
  private samples: { v: number; t: number }[] = [];

  add(value: number, time = performance.now()) {
    this.samples.push({ v: value, t: time });
    // ~100ms window: long enough to be stable, short enough to reflect the
    // *end* of the gesture rather than its average.
    const cutoff = time - 100;
    while (this.samples.length > 2 && this.samples[0].t < cutoff) {
      this.samples.shift();
    }
  }

  /** px per second. */
  velocity(): number {
    if (this.samples.length < 2) return 0;
    const first = this.samples[0];
    const last = this.samples[this.samples.length - 1];
    const dt = (last.t - first.t) / 1000;
    if (dt <= 0) return 0;
    return (last.v - first.v) / dt;
  }

  reset() {
    this.samples = [];
  }
}

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia(REDUCED_MOTION_QUERY).matches
  );
}
