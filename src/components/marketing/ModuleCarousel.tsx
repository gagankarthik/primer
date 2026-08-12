"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ModuleArt } from "@/components/modules/ModuleArt";
import { Stars } from "@/components/modules/ModuleCard";
import { MODULES } from "@/lib/modules";
import { toneBg } from "@/lib/tone";
import { cn } from "@/components/ui/cn";

/**
 * MODULE CAROUSEL
 *
 * All nine modules on one row you push through, rather than four cherry-picked
 * ones in a static grid. The grid was quietly saying "here are four things";
 * a track that runs off the edge says "there are more of these", which is the
 * true and more useful message.
 *
 * Built on native scrolling with scroll-snap rather than a transform-driven
 * slider. Touch, trackpad, shift-wheel, keyboard and screen-reader navigation
 * all work for free, and the row stays usable if the JS never runs, which is
 * not true of a slider that positions its own track. The arrow buttons are a
 * convenience layered on top for mouse users, not the mechanism.
 */
export function ModuleCarousel() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    // 2px of slack: sub-pixel scroll positions mean an exact comparison leaves
    // the end button live but inert at the last card.
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    // A resize can change which card is last, so the end state has to be
    // recomputed rather than only tracked on scroll.
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      ro.disconnect();
    };
  }, [sync]);

  /** Scrolls by whole cards, so the row never stops mid-card. */
  function page(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step * 2, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <ul
        ref={trackRef}
        /*
          scroll-pl-* must match the horizontal padding. Without it the first
          card snaps its own edge to the scrollport edge, so the track rests at
          scrollLeft: 32 instead of 0 and never reports itself as being at the
          start, which left the "previous" arrow lit on first paint.
        */
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-pl-5 gap-5 overflow-x-auto scroll-smooth px-5 pb-4 pt-2 sm:-mx-8 sm:scroll-pl-8 sm:px-8"
      >
        {MODULES.map((m) => (
          <li
            key={m.id}
            className="w-[63%] shrink-0 snap-start sm:w-[38%] lg:w-[23.5%]"
          >
            <Link
              href={`/modules/${m.id}`}
              className="group block h-full overflow-hidden rounded-3xl border-4 border-white bg-surface shadow-lift transition-transform duration-300 hover:-translate-y-1.5"
            >
              <span className={cn("block", toneBg(m.tone))}>
                <ModuleArt art={m.art} tone={m.tone} className="h-36 w-full" />
              </span>
              <span className="block px-4 py-3.5">
                <span className="block text-[0.9375rem] font-semibold text-ink">
                  {m.kidTitle}
                </span>
                <span className="mt-1 flex items-center gap-1.5 text-[0.75rem] text-ink-45">
                  <Stars value={m.rating} size={11} />
                  <span className="figure-num">{m.rating}</span>
                  <span aria-hidden>·</span>
                  <span>{m.minutes} min</span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/*
        Sat outside the track on desktop so they never cover a card. Hidden
        below lg, where a thumb is the better control and a button would just
        be something else to hit by accident.
      */}
      <ArrowButton dir="prev" onClick={() => page(-1)} disabled={atStart} />
      <ArrowButton dir="next" onClick={() => page(1)} disabled={atEnd} />
    </div>
  );
}

function ArrowButton({
  dir,
  onClick,
  disabled,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous modules" : "More modules"}
      className={cn(
        "absolute top-[38%] z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-line-strong bg-base text-ink shadow-lift transition-all lg:grid",
        "hover:border-ink/25 hover:bg-surface active:scale-95",
        // Kept in the layout when unavailable rather than removed, so the row
        // doesn't shift sideways the moment you reach either end.
        disabled && "pointer-events-none opacity-0",
        dir === "prev" ? "-left-5 xl:-left-7" : "-right-5 xl:-right-7",
      )}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <path
          d={dir === "prev" ? "M11 3.5L5.5 9l5.5 5.5" : "M7 3.5L12.5 9 7 14.5"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
