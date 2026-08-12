"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue } from "motion/react";
import {
  SPRING_MOMENTUM,
  VelocityTracker,
  clampElastic,
  project,
  prefersReducedMotion,
} from "@/lib/motion";

/**
 * AGE SCRUBBER
 *
 * A continuous drag from five to eleven, not a handful of fixed stops. The
 * point of the section is that the product changes shape gradually as a child
 * grows, and a notched control contradicts that before a word is read.
 *
 * Built on Apple's fluid-interface model:
 *  - 1:1 tracking from the grab offset, so the handle stays under the finger
 *    rather than jumping to its centre.
 *  - Pointer capture, so a drag that leaves the track keeps working.
 *  - Rubber-banding at both ends: progressive resistance, never a hard stop.
 *  - On release, momentum is *projected* forward and the handle springs to the
 *    age it was actually heading for, carrying the release velocity through so
 *    there is no seam between dragging and animating.
 */

type Stage = {
  age: number;
  band: string;
  surface: string;
  primer: string;
  child: string;
  subjects: string[];
};

const STAGES: Stage[] = [
  {
    age: 5,
    band: "Sounds out loud",
    surface: "One question, spoken. One button to answer it.",
    primer: "Biscuit is sitting on something. C, A, T. What do you think it is?",
    child: "kuh… a… cat! Biscuit is on a cat!",
    subjects: ["Letter sounds", "Counting to 20", "Feelings words"],
  },
  {
    age: 6,
    band: "Blends words",
    surface: "Still voice-only. Sessions run about eight minutes.",
    primer: "You got 'cat'. Try this one the same way, S, U, N.",
    child: "sss… uh… n… sun!",
    subjects: ["Blending", "Adding within 10", "First stories"],
  },
  {
    age: 7,
    band: "Reads sentences",
    surface: "Words appear on screen as they say them.",
    primer: "That sentence has a word you already know inside it. Can you spot it?",
    child: "playing! because play is in it",
    subjects: ["Sight words", "Number bonds", "Why things happen"],
  },
  {
    age: 8,
    band: "Reads and writes",
    surface: "The conversation stays on the page so they can look back.",
    primer:
      "You said 3 × 4 is 12. Would 4 × 3 give you something different? Guess before you work it out.",
    child: "i think its the same but i dont know why",
    subjects: ["Times tables", "Comprehension", "First science"],
  },
  {
    age: 9,
    band: "Checks its work",
    surface: "Asked to predict before calculating.",
    primer: "Before you divide, roughly how big should the answer be? Bigger or smaller than 10?",
    child: "smaller. because im splitting it up",
    subjects: ["Division", "Estimation", "Living things"],
  },
  {
    age: 10,
    band: "Spots the pattern",
    surface: "Longer problems, held across several turns.",
    primer: "You've done four of these. What's the same about every one of them?",
    child: "you always take the bottom one away first",
    subjects: ["Fractions", "Grammar", "Forces"],
  },
  {
    age: 11,
    band: "Explains why",
    surface: "Asked to say why an answer works, not just what it is.",
    primer:
      "That's right. Now tell me why, why does sharing something into more piles make each pile smaller?",
    child: "because theres the same amount but more people getting some",
    subjects: ["Fractions", "Living things", "Saying why"],
  },
];

const MIN = 5;
const MAX = 11;
const SPAN = MAX - MIN;

export function AgeScrubber() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [age, setAge] = useState(8);
  const [dragging, setDragging] = useState(false);

  const x = useMotionValue(0);
  const tracker = useRef(new VelocityTracker());
  const grabOffset = useRef(0);

  // Measure the track. The handle's whole coordinate system is derived from it,
  // so this has to survive resize and font-loading reflow.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Keep x in sync when width changes so the handle doesn't drift on resize.
  useEffect(() => {
    if (width > 0) x.set(((age - MIN) / SPAN) * width);
  }, [width]); // eslint-disable-line react-hooks/exhaustive-deps

  const ageFromX = useCallback(
    (px: number) => MIN + (px / Math.max(1, width)) * SPAN,
    [width],
  );

  // The displayed age updates continuously as the handle moves, so the number
  // and the handle are never out of step even mid-flick.
  useEffect(() => {
    const unsub = x.on("change", (v) => {
      const next = Math.round(Math.min(MAX, Math.max(MIN, ageFromX(v))));
      setAge((prev) => (prev === next ? prev : next));
    });
    return unsub;
  }, [x, ageFromX]);

  function settle(velocity: number) {
    const current = x.get();
    // Where the flick is *going*, not where the finger stopped.
    const projected = current + project(velocity);
    const stepPx = width / SPAN;
    const targetAge = Math.min(
      MAX,
      Math.max(MIN, Math.round(ageFromX(projected))),
    );
    const targetPx = (targetAge - MIN) * stepPx;

    if (prefersReducedMotion()) {
      x.set(targetPx);
      return;
    }
    // Hand the release velocity to the spring, no seam between drag and
    // animation. Bounce is allowed here precisely because momentum preceded it.
    animate(x, targetPx, { ...SPRING_MOMENTUM, velocity });
  }

  function onPointerDown(e: React.PointerEvent) {
    if (!width) return;
    const handleRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const trackRect = trackRef.current!.getBoundingClientRect();
    // Respect where they grabbed it. Snapping to the handle's centre on grab
    // is the single most common way to break the illusion of direct touch.
    grabOffset.current = e.clientX - (handleRect.left + handleRect.width / 2);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    tracker.current.reset();
    tracker.current.add(e.clientX - trackRect.left - grabOffset.current);
    setDragging(true);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging || !width) return;
    const trackRect = trackRef.current!.getBoundingClientRect();
    const raw = e.clientX - trackRect.left - grabOffset.current;
    tracker.current.add(raw);
    // Elastic past the ends rather than a hard clamp.
    x.set(clampElastic(raw, 0, width, width * 0.5));
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!dragging) return;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    setDragging(false);
    settle(tracker.current.velocity());
  }

  function jumpTo(nextAge: number) {
    const clamped = Math.min(MAX, Math.max(MIN, nextAge));
    const target = ((clamped - MIN) / SPAN) * width;
    if (prefersReducedMotion()) x.set(target);
    else animate(x, target, SPRING_MOMENTUM);
  }

  const stage = STAGES[age - MIN];

  return (
    <div className="w-full">
      {/* ---------------------------------------------------------- control */}
      <div className="mb-12">
        <div className="mb-5 flex items-baseline justify-between">
          <span className="eyebrow text-ink-45">drag to change age</span>
          <span className="figure-num text-sm text-ink-45">
            age <span className="text-ink">{age}</span>
          </span>
        </div>

        <div
          ref={trackRef}
          className="relative h-12 cursor-pointer touch-none select-none"
          onPointerDown={(e) => {
            // Click anywhere on the track to jump, with the same spring.
            if (!trackRef.current) return;
            const r = trackRef.current.getBoundingClientRect();
            jumpTo(Math.round(ageFromX(e.clientX - r.left)));
          }}
        >
          {/* rail */}
          <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-line" />
          <motion.div
            className="pointer-events-none absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-indigo"
            style={{ width: x }}
          />

          {/* tick marks, every year, so the range reads as continuous */}
          <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between">
            {STAGES.map((s) => (
              <span
                key={s.age}
                className={
                  s.age <= age
                    ? "h-1.5 w-1.5 rounded-full bg-white/70"
                    : "h-1.5 w-1.5 rounded-full bg-ink/15"
                }
              />
            ))}
          </div>

          {/* handle */}
          <motion.button
            type="button"
            role="slider"
            aria-valuemin={MIN}
            aria-valuemax={MAX}
            aria-valuenow={age}
            aria-valuetext={`Age ${age}, ${stage.band}`}
            aria-label="Child's age"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                e.preventDefault();
                jumpTo(age + 1);
              }
              if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                e.preventDefault();
                jumpTo(age - 1);
              }
            }}
            className="absolute top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-grab place-items-center rounded-full bg-ink text-white shadow-lift active:cursor-grabbing"
            style={{ x, left: 0 }}
            animate={{ scale: dragging ? 1.12 : 1 }}
            transition={{ type: "spring", bounce: 0, duration: 0.25 }}
          >
            <span className="figure-num pointer-events-none text-[0.8125rem] font-medium">
              {age}
            </span>
          </motion.button>
        </div>

        <div className="mt-3 flex justify-between">
          <span className="figure-num text-xs text-ink-45">5</span>
          <span className="figure-num text-xs text-ink-45">11</span>
        </div>
      </div>

      {/* ----------------------------------------------------------- result */}
      <div className="grid gap-8 border-t border-line pt-10 md:grid-cols-[1fr_1.25fr] md:gap-14">
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={`meta-${age}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              <p className="eyebrow mb-3 text-indigo">age {stage.age}</p>
              <h3 className="text-2xl font-semibold tracking-[-0.02em] text-ink">
                {stage.band}
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-45">
                {stage.surface}
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {stage.subjects.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-ink-70"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6 shadow-tight sm:p-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={`ex-${age}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.24 }}
              className="space-y-5"
            >
              <div>
                <p className="eyebrow mb-2 text-indigo">the primer</p>
                <p className="font-[family-name:var(--font-read)] text-[1.0625rem] leading-[1.6] text-ink">
                  {stage.primer}
                </p>
              </div>
              <div className="border-t border-line pt-5">
                <p className="eyebrow mb-2 text-ink-45">age {stage.age}</p>
                <p className="font-[family-name:var(--font-read)] text-[0.9375rem] leading-relaxed text-ink-45">
                  {stage.child}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
