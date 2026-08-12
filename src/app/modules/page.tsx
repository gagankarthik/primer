import type { Metadata } from "next";
import { ModuleCard } from "@/components/modules/ModuleCard";
import { Reveal } from "@/components/ui/primitives";
import { MODULES, GROUPS, type ModuleGroup } from "@/lib/modules";

export const metadata: Metadata = {
  title: "Modules",
  description:
    "Numbers, arithmetic, letters and sounds, one concept per module, four to six minutes each.",
};

/**
 * MODULES, the public catalogue.
 *
 * Grouped rather than searchable. Nine modules do not need a search box, and a
 * parent browsing for the first time is trying to understand the shape of the
 * thing, not locate a specific item they already know exists.
 */
export default function ModulesIndex() {
  const order: ModuleGroup[] = ["numbers", "arithmetic", "letters"];

  return (
    <>
      <section className="pt-8 sm:pt-12">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <p className="eyebrow mb-4 text-indigo">modules</p>
            <h1 className="max-w-2xl text-[clamp(2.25rem,5vw,3.25rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-balance">
              One idea at a time, in about five minutes.
            </h1>
            <p className="mt-5 max-w-xl text-[1.0625rem] leading-[1.65] text-ink-70">
              Khan Academy Kids found that cutting lessons to a few minutes
              raised completion by half. So the unit here is a small, finishable
              thing, not a course tree to navigate.
            </p>
          </Reveal>
        </div>
      </section>

      {order.map((group, gi) => {
        const items = MODULES.filter((m) => m.group === group);
        return (
          <section key={group} className="mx-auto max-w-[88rem] px-5 py-14 sm:px-8">
            <Reveal delay={gi * 0.04}>
              <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-4">
                <h2 className="text-xl font-semibold tracking-[-0.02em] text-ink">
                  {GROUPS[group].label}
                </h2>
                <p className="text-[0.9375rem] text-ink-45">
                  {GROUPS[group].blurb}
                </p>
              </div>
            </Reveal>

            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((m, i) => (
                <Reveal key={m.id} delay={i * 0.05}>
                  <li className="h-full">
                    <ModuleCard module={m} href={`/modules/${m.id}`} />
                  </li>
                </Reveal>
              ))}
            </ul>
          </section>
        );
      })}

      <div className="h-16" />
    </>
  );
}
