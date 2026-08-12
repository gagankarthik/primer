import { SCAFFOLD_RUNGS, type ScaffoldRung } from "@/lib/profile";

/**
 * THE SIGNATURE ELEMENT (child surface).
 *
 * Six marks in the margin. The lit one is how much help the Primer is
 * currently giving: top is a bare open question, bottom is being told outright.
 *
 * Every competitor puts a progress bar here, a thing that only goes up, and
 * that a child learns to farm. This goes *down* when they need help and climbs
 * back when they get traction, which is the only honest picture of learning
 * and the one thing this product can show that others cannot.
 *
 * It is deliberately unlabelled on the child's screen. A six-year-old should
 * feel it as ambient weather, not read it as a score. The words attach on the
 * parent's side, where they are useful.
 */
export function RungGauge({
  rung,
  className = "",
}: {
  rung: ScaffoldRung;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col gap-2 ${className}`}
      role="img"
      aria-label={`Help level ${rung} of 5: ${SCAFFOLD_RUNGS[rung].intent}`}
    >
      {SCAFFOLD_RUNGS.map((r) => {
        const active = r.rung === rung;
        const passed = r.rung < rung;
        return (
          <span
            key={r.rung}
            aria-hidden
            className={[
              "block rounded-full transition-all duration-700 ease-out",
              active ? "h-6 w-[3px] bg-indigo" : "h-3 w-[3px]",
              !active && passed ? "bg-indigo" : "",
              !active && !passed ? "bg-night-line" : "",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}

/**
 * Parent-side variant: same six marks, horizontal, labelled. Sits beside a
 * topic so the parent can see at a glance whether their child is reasoning
 * their way in or being walked in.
 */
export function RungMeter({ rung }: { rung: number }) {
  const clamped = Math.max(0, Math.min(5, Math.round(rung)));
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1" aria-hidden>
        {SCAFFOLD_RUNGS.map((r) => (
          <span
            key={r.rung}
            className={[
              "block h-1.5 w-5 rounded-full",
              r.rung === clamped
                ? "bg-indigo"
                : r.rung < clamped
                  ? "bg-indigo/35"
                  : "bg-line",
            ].join(" ")}
          />
        ))}
      </div>
      <span className="figure-num text-xs text-ink/55">
        rung {clamped} · {SCAFFOLD_RUNGS[clamped].name}
      </span>
    </div>
  );
}
