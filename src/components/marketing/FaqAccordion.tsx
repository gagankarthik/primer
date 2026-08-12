"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SPRING_UI } from "@/lib/motion";
import { cn } from "@/components/ui/cn";

/**
 * FAQ ACCORDION
 *
 * Built on native <button> + aria-expanded rather than <details>, because the
 * height animation needs a measured value and <details> gives no hook for it.
 * Everything <details> provides for free is reimplemented deliberately: the
 * heading is a real button, state is announced, and the panel is labelled by
 * its trigger.
 *
 * One panel open at a time. With eight questions, allowing several open at once
 * means the answer you are reading pushes itself off screen when you open the
 * next one.
 *
 * Answers stay in the DOM when collapsed (height 0, hidden) so browser find and
 * search-engine crawlers still see them. An FAQ whose answers only exist after
 * a click is an FAQ that never ranks.
 */
export function FaqAccordion({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ul className="divide-y divide-line border-y border-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <li key={item.q}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                id={`faq-trigger-${i}`}
                className="flex w-full items-start justify-between gap-6 py-6 text-left transition-colors hover:text-indigo"
              >
                <span className="text-[1.0625rem] font-semibold text-ink">
                  {item.q}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-colors",
                    isOpen
                      ? "border-indigo bg-indigo text-white"
                      : "border-line-strong text-ink-45",
                  )}
                >
                  <motion.svg
                    width="13"
                    height="13"
                    viewBox="0 0 12 12"
                    fill="none"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={SPRING_UI}
                  >
                    <path
                      d="M6 1.5v9M1.5 6h9"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </motion.svg>
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="panel"
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={SPRING_UI}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-6 pr-12 text-[0.9375rem] leading-[1.7] text-ink-70">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
