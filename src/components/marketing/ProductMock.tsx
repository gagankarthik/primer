"use client";

import { motion } from "motion/react";
import { DescentTrace } from "@/components/DescentTrace";
import { cn } from "@/components/ui/cn";

/**
 * Product mockups for the marketing pages.
 *
 * These render the real interface rather than a stock illustration, because
 * the single thing a parent is trying to work out on a landing page is whether
 * this will actually hold their child's attention. A drawing of a happy cartoon
 * child answers nothing. A picture of the screen their child will be looking at
 * answers it in about two seconds.
 */

/* ------------------------------------------------------------- frames */

export function BrowserFrame({
  children,
  label = "primer.app/parent",
  className,
}: {
  children: React.ReactNode;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-line bg-surface shadow-pop",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-line bg-grey-tint/60 px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          {["#E5484D", "#F0A020", "#12B981"].map((c) => (
            <span
              key={c}
              className="block h-2.5 w-2.5 rounded-full opacity-60"
              style={{ background: c }}
            />
          ))}
        </div>
        <div className="mx-auto rounded-md bg-surface px-3 py-1 text-[0.6875rem] text-ink-45">
          {label}
        </div>
      </div>
      {children}
    </div>
  );
}

export function PhoneFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-[228px] shrink-0 overflow-hidden rounded-[2.25rem] border-[6px] border-ink bg-night shadow-pop",
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute left-1/2 top-2 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-ink"
      />
      {children}
    </div>
  );
}

/* -------------------------------------------------- child app (phone) */

export function ChildAppMock() {
  return (
    <PhoneFrame>
      <div className="flex h-[430px] flex-col bg-night px-4 pb-5 pt-8">
        <div className="flex items-center justify-between">
          <span className="eyebrow text-chalk-dim">Nell · sounds</span>
          <span className="rounded-full bg-night-2 px-2.5 py-1 text-[0.625rem] text-chalk-dim">
            8 min
          </span>
        </div>

        {/* rung gauge */}
        <div className="mt-6 flex gap-1.5" aria-hidden>
          {[0, 1, 2, 3, 4, 5].map((r) => (
            <span
              key={r}
              className={cn(
                "h-1 flex-1 rounded-full",
                r === 2 ? "bg-indigo" : r < 2 ? "bg-indigo/35" : "bg-night-line",
              )}
            />
          ))}
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="font-[family-name:var(--font-read)] text-[1.35rem] leading-[1.55] text-chalk">
            Biscuit is sitting on something. C&nbsp;, &nbsp;A&nbsp;, &nbsp;T.
          </p>

          {/* orb */}
          <div className="relative mt-10 grid h-28 w-28 place-items-center">
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full border border-indigo/40"
              animate={{ scale: [0.94, 1.4], opacity: [0.5, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
            />
            <span
              aria-hidden
              className="absolute inset-2 rounded-full bg-indigo/20"
              style={{ animation: "breathe 4s ease-in-out infinite" }}
            />
            <span
              aria-hidden
              className="absolute inset-5 rounded-full border border-indigo/60"
            />
            <span className="relative text-[0.625rem] uppercase tracking-[0.12em] text-chalk-dim">
              listening
            </span>
          </div>
        </div>

        <p className="text-center font-[family-name:var(--font-read)] text-sm text-indigo-hi">
          &ldquo;kuh… a… cat!&rdquo;
        </p>
      </div>
    </PhoneFrame>
  );
}

/* ------------------------------------------- parent dashboard (browser) */

export function ParentDashMock({ compact = false }: { compact?: boolean }) {
  return (
    <BrowserFrame>
      <div className={cn("bg-base", compact ? "p-5" : "p-6 sm:p-7")}>
        {/* headline observation */}
        <div className="rounded-xl border border-line bg-surface p-5 shadow-tight">
          <p className="eyebrow mb-2.5 text-ink-45">this week</p>
          <p className="text-[0.9375rem] font-medium leading-[1.5] text-ink">
            <span
              aria-hidden
              className="mr-2 inline-block h-2 w-2 translate-y-[-1px] rounded-full bg-amber"
            />
            Nell asked to just be told the answer 3 times, all on blending
            sounds.
          </p>
        </div>

        {/* stat row */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { v: "4", l: "sessions" },
            { v: "37", l: "minutes" },
            { v: "2", l: "usual rung" },
          ].map((s) => (
            <div
              key={s.l}
              className="rounded-xl border border-line bg-surface px-4 py-3.5 shadow-tight"
            >
              <p className="figure-num text-xl text-ink">{s.v}</p>
              <p className="mt-0.5 text-[0.6875rem] text-ink-45">{s.l}</p>
            </div>
          ))}
        </div>

        {/* traces */}
        <div className="mt-4 rounded-xl border border-line bg-surface p-5 shadow-tight">
          <p className="eyebrow mb-4 text-ink-45">how much help it took</p>
          <div className="space-y-3.5">
            {[
              { t: "Blending sounds", d: [0, 1, 2, 3, 3, 4, 2, 1] },
              { t: "Adding within 10", d: [0, 1, 2, 2, 1, 0] },
            ].map((row) => (
              <div key={row.t} className="flex items-center justify-between gap-4">
                <span className="text-[0.8125rem] text-ink-70">{row.t}</span>
                <DescentTrace
                  trace={row.d as never}
                  width={compact ? 130 : 168}
                  height={38}
                  showFloor={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}
