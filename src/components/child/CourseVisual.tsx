"use client";

import { motion } from "motion/react";
import type { Visual } from "@/lib/course";
import { cn } from "@/components/ui/cn";

/**
 * THE PROP.
 *
 * Every lesson gets a thing on screen that shows the idea rather than
 * decorating it: counters you can see and count, a ten-frame with visible
 * gaps, sounds as separate tiles that slide together into a word.
 *
 * These are large and plain on purpose. A five-year-old counting six circles
 * needs six circles, not an illustration containing six circles somewhere.
 */
export function CourseVisual({
  visual,
  tone,
}: {
  visual: Visual;
  tone: "indigo" | "green" | "amber" | "rose";
}) {
  const fill = {
    indigo: "bg-indigo",
    green: "bg-green",
    amber: "bg-amber",
    rose: "bg-rose",
  }[tone];

  const soft = {
    indigo: "bg-indigo-tint",
    green: "bg-green-tint",
    amber: "bg-amber/10",
    rose: "bg-rose/8",
  }[tone];

  if (visual.type === "count") {
    return (
      <Frame soft={soft}>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {Array.from({ length: visual.total }, (_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.07, type: "spring", bounce: 0.35 }}
              className={cn(
                "h-11 w-11 rounded-full sm:h-14 sm:w-14",
                i < visual.filled ? fill : "border-[3px] border-dashed border-ink/15",
              )}
            />
          ))}
        </div>
      </Frame>
    );
  }

  if (visual.type === "groups") {
    return (
      <Frame soft={soft}>
        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8">
          <Cluster n={visual.left} fill={fill} />
          <span aria-hidden className="text-3xl font-bold text-ink/30">
            +
          </span>
          <Cluster n={visual.right} fill={fill} offset={visual.left} />
        </div>
      </Frame>
    );
  }

  if (visual.type === "bar") {
    return (
      <Frame soft={soft}>
        <div className="grid w-full max-w-md grid-cols-5 gap-1.5">
          {Array.from({ length: visual.segments }, (_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn(
                "h-12 rounded-lg sm:h-14",
                i < visual.filled ? fill : "border-2 border-dashed border-ink/15",
              )}
            />
          ))}
        </div>
      </Frame>
    );
  }

  // sounds
  return (
    <Frame soft={soft}>
      <div className="flex flex-col items-center gap-5">
        <div className="flex items-center gap-2.5 sm:gap-3">
          {visual.parts.map((p, i) => (
            <motion.span
              key={i}
              initial={{ x: (i - 1) * 14, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1, type: "spring", bounce: 0.3 }}
              className={cn(
                "grid h-16 w-16 place-items-center rounded-2xl text-3xl font-bold text-white sm:h-20 sm:w-20 sm:text-4xl",
                fill,
              )}
              style={{ fontFamily: "var(--font-read)" }}
            >
              {p}
            </motion.span>
          ))}
        </div>
        {visual.word && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="text-4xl font-bold tracking-[0.02em] text-ink sm:text-5xl"
            style={{ fontFamily: "var(--font-read)" }}
          >
            {visual.word}
          </motion.span>
        )}
      </div>
    </Frame>
  );
}

/**
 * The prop's container. Sized in vh rather than px so it takes whatever room
 * the step has left over and no more: on a short laptop window it collapses
 * toward 120px, on a tablet held upright it opens out to 240px. A fixed
 * min-height here was what pushed the "Got it" button off the bottom of the
 * screen, because the prop refused to give up space the text needed.
 */
function Frame({ soft, children }: { soft: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "grid w-full place-items-center overflow-hidden rounded-[1.75rem] p-4 sm:p-6",
        "h-[clamp(7.5rem,26vh,15rem)]",
        soft,
      )}
    >
      {children}
    </div>
  );
}

function Cluster({
  n,
  fill,
  offset = 0,
}: {
  n: number;
  fill: string;
  offset?: number;
}) {
  return (
    <div className="grid max-w-[9rem] grid-cols-3 gap-2">
      {Array.from({ length: n }, (_, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: (offset + i) * 0.05, type: "spring", bounce: 0.4 }}
          className={cn("h-9 w-9 rounded-full sm:h-11 sm:w-11", fill)}
        />
      ))}
    </div>
  );
}
