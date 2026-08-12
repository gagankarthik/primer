import { cn } from "./cn";

/**
 * CUBE LOADER
 *
 * Four isometric cubes trading places. The CSS lives in globals.css, see the
 * note there for why this isn't styled-components.
 *
 * Three things worth keeping if you touch it:
 *
 *  - It is a *server* component. No "use client", no hooks, no JS at all. A
 *    spinner that ships a client bundle is a spinner that arrives after the
 *    thing it was meant to cover.
 *  - `role="status"` with a live region and a visually-hidden label, so screen
 *    readers announce the wait instead of hitting silence.
 *  - Under prefers-reduced-motion the cubes stop dead (the global rule in
 *    globals.css kills the animation), which would leave a static, meaningless
 *    stack, so the label is always rendered, and `motion-reduce:` restores it
 *    to visible text. A frozen 3D diagram is not a loading state.
 */
export function CubeLoader({
  label = "Loading",
  size = 32,
  className,
}: {
  /** Announced to assistive tech, and shown when motion is reduced. */
  label?: string;
  /** Edge length of one cube, in px. The block is 3× wide and 2× tall. */
  size?: number;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex flex-col items-center justify-center gap-4", className)}
    >
      <div
        className="cube-loader motion-reduce:hidden"
        style={{ "--cube": `${size}px` } as React.CSSProperties}
        aria-hidden
      >
        {[0, 1, 2, 3].map((i) => (
          <div className="cube" key={i}>
            <div />
            <div />
            <div />
            <div />
          </div>
        ))}
      </div>

      <span className="sr-only motion-reduce:not-sr-only motion-reduce:text-[0.875rem] motion-reduce:text-ink-45">
        {label}
      </span>
    </div>
  );
}

/**
 * Full-screen variant for route transitions. Centres the loader and reserves
 * the space the cubes need above it, the block uses a negative top margin to
 * sit on its own baseline, so it needs headroom or it clips the header.
 */
export function CubeLoaderScreen({ label = "Loading" }: { label?: string }) {
  return (
    <div className="grid min-h-dvh place-items-center bg-base">
      <div className="pt-24">
        <CubeLoader label={label} />
      </div>
    </div>
  );
}
