"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "./cn";

/**
 * BACK BUTTON
 *
 * Every screen should answer "how do I get out of here?", and a browser chevron
 * doesn't count on a page a parent opened from a link, or on a tablet handed
 * to a six-year-old in kiosk mode, where there is no browser chrome at all.
 *
 * Two behaviours, chosen automatically:
 *  - If there's history to go back to, it goes back.
 *  - If there isn't (someone landed here directly, or opened a new tab), it
 *    falls back to a real destination rather than doing nothing. A dead back
 *    button is worse than no back button.
 *
 * It is always a visible, labelled control, not a bare icon. "Back" costs four
 * characters and removes all doubt about what the arrow does.
 */
export function BackButton({
  fallbackHref = "/",
  label = "Back",
  variant = "light",
  className,
}: {
  /** Where to go when there's no history to pop. */
  fallbackHref?: string;
  label?: string;
  /** `light` for pale grounds, `dark` for ink/photo grounds. */
  variant?: "light" | "dark";
  className?: string;
}) {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  // window.history.length is the only signal available without an app-level
  // history stack. It's imperfect, a fresh tab reports 1, which is exactly
  // the case the fallback exists for.
  useEffect(() => {
    setCanGoBack(window.history.length > 1);
  }, []);

  const classes = cn(
    "group inline-flex items-center gap-2 rounded-full py-2 pl-2 pr-4 text-[0.875rem] font-medium transition-all active:scale-[0.98]",
    variant === "light"
      ? "border border-line-strong bg-surface text-ink shadow-tight hover:border-ink/25"
      : "border border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20",
    className,
  );

  const chevron = (
    <span
      aria-hidden
      className={cn(
        "grid h-7 w-7 place-items-center rounded-full transition-transform group-hover:-translate-x-0.5",
        variant === "light" ? "bg-grey-tint" : "bg-white/15",
      )}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M8.5 2.5L4 7l4.5 4.5"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );

  // Rendered as a real <a> when falling back, so it works before hydration and
  // supports open-in-new-tab. Only the true "go back" case needs JS.
  if (!canGoBack) {
    return (
      <Link href={fallbackHref} className={classes}>
        {chevron}
        {label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={() => router.back()} className={classes}>
      {chevron}
      {label}
    </button>
  );
}
