"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SCAFFOLD_RUNGS, type ScaffoldRung } from "@/lib/profile";
import { cn } from "@/components/ui/cn";

/**
 * The interactive proof.
 *
 * A parent's real question is "will this actually make my child think, or will
 * it just hand over answers like everything else?". Letting them press "I don't
 * get it" and watch the Primer give a little more each time, without ever
 * jumping to the answer, and without ever leaving them stranded, answers that
 * faster than any amount of copy. The interaction is the argument.
 */

const RUNG_LINES: Record<ScaffoldRung, string> = {
  0: "I could tell you, but you'd have lost it again by Thursday. What do three lots of four look like in your head?",
  1: "Let's take a smaller bite. What's four, and then another four?",
  2: "Picture four apples on the table. Now four more beside them. And four more. How many piles is that?",
  3: "Three piles, four apples in each. Count them up with me, four, eight, and then?",
  4: "Let me do a different one first. Two lots of five: five, ten. Ten altogether. Now yours, three lots of four.",
  5: "It's twelve. Three fours: four, eight, twelve. Now you take this one, what's three lots of five?",
};

const STUCK_LABELS = [
  "I don't get it",
  "Still don't get it",
  "I really don't get it",
  "Just tell me",
  "Please just tell me",
];

export function PlayableLadder({ className }: { className?: string }) {
  const [rung, setRung] = useState<ScaffoldRung>(0);
  const [solved, setSolved] = useState(false);
  const [nudges, setNudges] = useState(0);

  const atFloor = rung === 5;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-line bg-surface shadow-lift",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <span className="flex items-center gap-2 text-[0.8125rem] font-medium text-ink">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
          </span>
          Try it, you&rsquo;re the child
        </span>
        <span className="figure-num text-[0.6875rem] text-ink-45">
          rung {rung}/5 · {SCAFFOLD_RUNGS[rung].name}
        </span>
      </div>

      {/* rung gauge */}
      <div className="flex gap-1 px-5 pt-4" aria-hidden>
        {SCAFFOLD_RUNGS.map((r) => (
          <motion.span
            key={r.rung}
            className="h-1.5 flex-1 rounded-full"
            animate={{
              backgroundColor:
                r.rung === rung
                  ? "#3d4ee8"
                  : r.rung < rung
                    ? "#c3caf9"
                    : "#e6e9ef",
            }}
            transition={{ duration: 0.35 }}
          />
        ))}
      </div>

      <div className="min-h-[8.5rem] px-5 py-6 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.p
            key={solved ? "solved" : rung}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="font-[family-name:var(--font-read)] text-[1.0625rem] leading-[1.6] text-ink"
          >
            {solved
              ? "That's it, and you got there yourself. That's the bit that sticks."
              : RUNG_LINES[rung]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-line bg-grey-tint/50 px-5 py-3.5">
        {solved ? (
          <button
            onClick={() => {
              setRung(0);
              setSolved(false);
              setNudges(0);
            }}
            className="rounded-lg border border-line-strong bg-surface px-4 py-2 text-[0.8125rem] font-medium text-ink transition-colors hover:border-ink/25"
          >
            Start again
          </button>
        ) : (
          <>
            <button
              onClick={() => {
                if (atFloor) return;
                setRung((r) => Math.min(5, r + 1) as ScaffoldRung);
                setNudges((n) => n + 1);
              }}
              disabled={atFloor}
              className="rounded-lg border border-line-strong bg-surface px-4 py-2 text-[0.8125rem] font-medium text-ink transition-colors hover:border-ink/25 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {STUCK_LABELS[Math.min(nudges, STUCK_LABELS.length - 1)]}
            </button>
            <button
              onClick={() => setSolved(true)}
              className="rounded-lg bg-ink px-4 py-2 text-[0.8125rem] font-medium text-white transition-colors hover:bg-ink/88"
            >
              Oh, I see it
            </button>
          </>
        )}
        <span className="ml-auto hidden text-[0.75rem] text-ink-45 sm:block">
          {atFloor && !solved
            ? "Told outright, then handed a twin problem."
            : "It never skips ahead."}
        </span>
      </div>
    </div>
  );
}
