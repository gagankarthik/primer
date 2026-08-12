import Link from "next/link";
import type { Metadata } from "next";
import { SiteChrome, Cta } from "@/components/marketing/Chrome";
import { PlayableLadder } from "@/components/marketing/PlayableLadder";
import { ParentDashMock } from "@/components/marketing/ProductMock";
import { DescentTrace } from "@/components/DescentTrace";
import { Reveal } from "@/components/ui/primitives";
import {
  IconTile,
  IconVoice,
  IconShield,
  IconGrow,
  IconPage,
} from "@/components/ui/Icons";
import { SCAFFOLD_RUNGS } from "@/lib/profile";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "A scaffold ladder, a learner profile that admits what it doesn't know, and a dashboard that shows how much help it took.",
};

const DIMENSIONS = [
  {
    name: "What they know",
    detail: "Topic by topic, and how deeply, can they recall it, use it, or explain it.",
    trust: "Reliable from the first week",
    solid: true,
  },
  {
    name: "What you told us",
    detail: "Age, year group, your goals, and what your child is actually into.",
    trust: "You tell us this one",
    solid: true,
  },
  {
    name: "When they show up",
    detail: "How long a sitting lasts, what time of day, and when attention goes.",
    trust: "Needs about two weeks",
    solid: false,
  },
  {
    name: "How they're feeling",
    detail: "Frustration and momentum, read from how they write and when they give up.",
    trust: "Kept coarse, it's the noisiest thing we measure",
    solid: false,
  },
  {
    name: "How they learn",
    detail: "Whether they poke at things or want the steps laid out first.",
    trust: "Takes around twenty sessions to be worth anything",
    solid: false,
  },
];

const SHAPES = [
  { trace: [0, 1, 2, 2, 1, 0], label: "Dipped, then recovered", read: "A normal, good evening." },
  { trace: [1, 2, 3, 3, 4, 5], label: "Kept going down", read: "This one hasn't landed yet." },
  { trace: [0, 0, 0, 1, 0, 0], label: "Flat along the top", read: "Too easy. They're coasting." },
];

const PROMISES = [
  {
    Icon: IconVoice,
    t: "We don't keep their voice",
    d: "What your child says becomes text on the way through, and the audio is deleted. No voiceprint is stored anywhere, which also keeps us the right side of the 2026 COPPA rules that reclassified voiceprints as biometric data.",
  },
  {
    Icon: IconShield,
    t: "None of it trains a model",
    d: "Not ours, and not our suppliers'. That's in the contract, not a switch in settings, and it's the one thing we'll never sell back to you as an upgrade.",
  },
  {
    Icon: IconGrow,
    t: "It won't pretend to be a person",
    d: "No character, no backstory, no roleplay. Asked outright whether it's real, it says it's a program that likes teaching them, and gets back to work.",
  },
  {
    Icon: IconPage,
    t: "You can read every word of it",
    d: "AGPL-3.0. The prompts that decide how your child gets taught are in the repository in plain English. Read them, and tell us publicly if you think we've got something wrong.",
  },
];

export default function Features() {
  return (
    <SiteChrome>

      <section className="pt-8 sm:pt-12">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-balance">
              A tutor that gets to know one child.
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-[1.0625rem] leading-[1.65] text-ink-70">
              One-to-one teaching has been the best education available since
              Aristotle taught Alexander, for roughly nobody, because
              almost no family can afford it. What follows is an honest attempt
              at closing some of that gap, including the parts we can&rsquo;t.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mx-auto mt-14 max-w-2xl">
            <PlayableLadder />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-[clamp(1.75rem,3.4vw,2.5rem)] font-semibold leading-[1.12] tracking-[-0.025em] text-balance">
            Six rungs, and it only ever moves one at a time.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[1.0625rem] leading-[1.65] text-ink-70">
            Going straight to the answer teaches nothing. So does asking a
            fourth question at a child who is already stuck. They only
            learn that you withhold, and stop asking.
          </p>
        </Reveal>

        <ol className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl border border-line bg-surface shadow-tight">
          {SCAFFOLD_RUNGS.map((r, i) => (
            <Reveal key={r.rung} delay={i * 0.04}>
              <li
                className={`grid grid-cols-[3rem_1fr] items-baseline gap-x-4 px-6 py-5 sm:grid-cols-[3.5rem_7rem_1fr] sm:gap-x-6 ${
                  i > 0 ? "border-t border-line" : ""
                }`}
              >
                <span
                  className="figure-num text-2xl leading-none"
                  style={{ color: `var(--color-help-${r.rung})` }}
                >
                  {r.rung}
                </span>
                <span className="col-start-2 font-semibold capitalize text-ink">
                  {r.name}
                </span>
                <span className="col-span-2 col-start-1 mt-1.5 text-[0.9375rem] leading-relaxed text-ink-45 sm:col-span-1 sm:col-start-3 sm:mt-0">
                  {r.intent}
                </span>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section id="profile" className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-[clamp(1.75rem,3.4vw,2.5rem)] font-semibold leading-[1.12] tracking-[-0.025em] text-balance">
              Five things we track, and how far to trust each.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-[1.0625rem] leading-[1.65] text-ink-70">
              Every app of this kind shows you a confident portrait of your child
              after one session. That portrait is a guess wearing a chart. Ours
              carries its own confidence and says plainly when it doesn&rsquo;t
              know yet.
            </p>
          </Reveal>

          <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {DIMENSIONS.map((d, i) => (
              <Reveal key={d.name} delay={i * 0.05}>
                <li className="h-full rounded-2xl border border-line bg-base p-6 shadow-tight">
                  <h3 className="font-semibold text-ink">{d.name}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-45">
                    {d.detail}
                  </p>
                  <p
                    className={`mt-5 flex items-center gap-2 text-[0.8125rem] ${
                      d.solid ? "text-green" : "text-ink-45"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`block h-1.5 w-1.5 rounded-full ${
                        d.solid ? "bg-green" : "bg-line-strong"
                      }`}
                    />
                    {d.trust}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 className="text-[clamp(1.75rem,3.4vw,2.5rem)] font-semibold leading-[1.12] tracking-[-0.025em] text-balance">
              One sentence first. The evidence underneath.
            </h2>
            <p className="mt-5 text-[1.0625rem] leading-[1.65] text-ink-70">
              You&rsquo;ll look at this for about ninety seconds, standing up,
              between two other things. So it opens with the one thing worth
              knowing this week and keeps the charts below as the working.
            </p>

            <ul className="mt-8 space-y-4">
              {SHAPES.map((s) => (
                <li
                  key={s.label}
                  className="flex items-center gap-4 rounded-xl border border-line bg-surface p-4 shadow-tight"
                >
                  <DescentTrace
                    trace={s.trace as never}
                    width={120}
                    height={40}
                    showFloor={false}
                  />
                  <span>
                    <span className="block text-[0.9375rem] font-medium text-ink">
                      {s.label}
                    </span>
                    <span className="mt-0.5 block text-[0.8125rem] text-ink-45">
                      {s.read}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <ParentDashMock compact />
          </Reveal>
        </div>
      </section>

      <section id="safety" className="border-t border-line bg-surface">
        <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8 sm:py-24">
          <Reveal>
            <h2 className="text-[clamp(1.75rem,3.4vw,2.5rem)] font-semibold leading-[1.12] tracking-[-0.025em] text-balance">
              The boring parts, stated plainly.
            </h2>
            <p className="mt-5 max-w-lg text-[1.0625rem] leading-[1.65] text-ink-70">
              These are the questions we&rsquo;d ask before letting anything talk
              to our own children.
            </p>
          </Reveal>

          <ul className="mt-12 grid gap-5 sm:grid-cols-2">
            {PROMISES.map((p, i) => (
              <Reveal key={p.t} delay={i * 0.05}>
                <li className="h-full rounded-2xl border border-line bg-base p-6 shadow-tight">
                  <IconTile Icon={p.Icon} />
                  <h3 className="mt-5 font-semibold text-ink">{p.t}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-[1.65] text-ink-45">
                    {p.d}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-8 sm:py-28">
        <Reveal>
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-balance">
            Go and watch it refuse to help.
          </h2>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Cta href="/learning">Open the Primer</Cta>
            <Cta href="/modules" variant="outline">
              Browse modules
            </Cta>
          </div>
          <p className="mt-6 text-[0.8125rem] text-ink-45">
            Or{" "}
            <Link href="/pricing" className="text-indigo hover:underline">
              look at pricing
            </Link>
            . The free tier stays free.
          </p>
        </Reveal>
      </section>

    </SiteChrome>
  );
}
