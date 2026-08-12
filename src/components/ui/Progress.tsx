"use client";

import { motion } from "motion/react";
import { SPRING_UI } from "@/lib/motion";
import { toneBar, type Tone } from "@/lib/tone";
import { cn } from "./cn";

/**
 * Progress bar.
 *
 * Fills on a critically damped spring rather than a linear transition, so it
 * settles rather than stopping dead. Carries proper ARIA because it reports a
 * real value a parent may be reading with assistive tech.
 *
 * Minimum visible width is 6%, a bar showing genuine 2% progress reads as
 * broken, and "barely started" is the honest message either way.
 */
export function ProgressBar({
  value,
  tone = "indigo",
  label,
  className,
}: {
  /** 0–100 */
  value: number;
  tone?: Tone;
  label?: string;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));

  return (
    <span
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn(
        "block h-1.5 w-full overflow-hidden rounded-full bg-line",
        className,
      )}
    >
      <motion.span
        className={cn("block h-full rounded-full", toneBar(tone))}
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(6, pct)}%` }}
        transition={{ ...SPRING_UI, delay: 0.1 }}
      />
    </span>
  );
}

/** Circular variant, used where a bar would be too wide, e.g. list rows. */
export function ProgressRing({
  value,
  size = 36,
  tone = "indigo",
  label,
}: {
  value: number;
  size?: number;
  tone?: Tone;
  label?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  const r = (size - 5) / 2;
  const c = 2 * Math.PI * r;
  const stroke = {
    indigo: "#3D4EE8",
    green: "#12B981",
    amber: "#F0A020",
    rose: "#E5484D",
  }[tone];

  return (
    <svg
      width={size}
      height={size}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--color-line)"
        strokeWidth="3.5"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray={c}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c - (pct / 100) * c }}
        transition={{ ...SPRING_UI, delay: 0.1 }}
      />
    </svg>
  );
}
