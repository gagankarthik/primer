"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "@/components/brand/Logo";
import { ProgressBar } from "@/components/ui/Progress";
import { IconCheck, IconClock, IconLock, IconChild } from "@/components/ui/Icons";
import { SPRING_UI, prefersReducedMotion } from "@/lib/motion";
import { ageBand } from "@/lib/profile";
import { modulesForAge } from "@/lib/modules";
import { ModuleArt } from "@/components/modules/ModuleArt";
import { toneBg } from "@/lib/tone";
import { cn } from "@/components/ui/cn";

/**
 * PARENT ONBOARDING
 *
 * Five steps, in the order a parent can actually answer them: who the child is,
 * what they like, what the rules are, what it costs, and then the handover.
 *
 * Two decisions worth defending:
 *
 *  - Age is asked before anything else and drives everything downstream, the
 *    vocabulary ceiling, session length, which modules appear, and whether the
 *    child's surface is voice-first or text-first. Getting it wrong is the
 *    single most damaging setup error, so it is a large, deliberate control
 *    rather than a dropdown.
 *
 *  - The PIN step explains *why* it exists rather than just demanding four
 *    digits. A parent who understands it's the lock on settings, not a
 *    paywall, sets a real one instead of 1234.
 *
 * Steps animate along a consistent axis: forward enters from the right and
 * exits left, backward reverses exactly. Enter and exit share one path, so
 * moving back feels like retracing rather than a new screen.
 */

type Draft = {
  name: string;
  age: number;
  grade: string;
  interests: string[];
  pin: string;
  fromHour: number;
  toHour: number;
  dailyMinutes: number;
  plan: "free" | "family" | "household";
};

const INTEREST_OPTIONS = [
  "Dinosaurs", "Space", "Animals", "Football", "Drawing", "Building things",
  "Cooking", "Music", "Cars", "Nature", "Superheroes", "Dancing",
];

const STEPS = ["Child", "Interests", "Rules", "Plan", "Done"] as const;

export function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [d, setD] = useState<Draft>({
    name: "",
    age: 6,
    grade: "Year 1",
    interests: [],
    pin: "",
    fromHour: 15,
    toHour: 19,
    dailyMinutes: 20,
    plan: "family",
  });

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) =>
    setD((prev) => ({ ...prev, [k]: v }));

  function go(next: number) {
    setDir(next > step ? 1 : -1);
    setStep(next);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }

  const canContinue =
    (step === 0 && d.name.trim().length > 0) ||
    step === 1 ||
    (step === 2 && d.pin.length === 4) ||
    step === 3;

  const reduce = prefersReducedMotion();
  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: reduce ? 0 : dir * 28 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: reduce ? 0 : dir * -28 }),
  };

  return (
    <main className="min-h-dvh bg-base">
      <header className="mx-auto flex max-w-2xl items-center justify-between px-6 py-6">
        <Link href="/" aria-label="Primer home">
          <Logo size={28} />
        </Link>
        <span className="figure-num text-[0.8125rem] text-ink-45">
          Step {Math.min(step + 1, STEPS.length)} of {STEPS.length}
        </span>
      </header>

      <div className="mx-auto max-w-2xl px-6">
        <ProgressBar
          value={((step + 1) / STEPS.length) * 100}
          label="Setup progress"
        />

        <div className="mt-10 min-h-[26rem]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={SPRING_UI}
            >
              {step === 0 && <StepChild d={d} set={set} />}
              {step === 1 && <StepInterests d={d} set={set} />}
              {step === 2 && <StepRules d={d} set={set} />}
              {step === 3 && <StepPlan d={d} set={set} />}
              {step === 4 && <StepDone d={d} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {step < 4 && (
          <div className="sticky bottom-0 flex items-center gap-3 bg-base/90 py-6 backdrop-blur">
            {step > 0 && (
              <button
                onClick={() => go(step - 1)}
                className="rounded-xl border border-line-strong bg-surface px-5 py-3 text-[0.9375rem] font-medium text-ink shadow-tight transition-colors hover:border-ink/25"
              >
                Back
              </button>
            )}
            <button
              onClick={() => canContinue && go(step + 1)}
              disabled={!canContinue}
              className="flex-1 rounded-xl bg-ink px-5 py-3.5 text-[0.9375rem] font-medium text-white shadow-lift transition-all hover:bg-ink/88 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {step === 3 ? "Finish setup" : "Continue"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

/* ------------------------------------------------------------- step: child */

function StepChild({
  d,
  set,
}: {
  d: Draft;
  set: <K extends keyof Draft>(k: K, v: Draft[K]) => void;
}) {
  const band = ageBand(d.age);
  const bandCopy = {
    "5-7": "Read out loud. One question at a time, with a big button to answer.",
    "8-9": "Reads and writes. The chat stays on screen so they can look back.",
    "10-11": "Asked to say why an answer works, not just what it is.",
  }[band];

  return (
    <div>
      <Heading
        eyebrow="who's learning"
        title="Tell us about your child"
        body="Age is the one that matters most, it sets how the Primer talks, how long a sitting runs, and what it offers them."
      />

      <div className="mt-8 space-y-7">
        <div>
          <label
            htmlFor="child-name"
            className="mb-1.5 block text-[0.875rem] font-medium text-ink"
          >
            Their first name
          </label>
          <input
            id="child-name"
            value={d.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Nell"
            className="w-full rounded-xl border border-line-strong bg-surface px-4 py-3 text-[0.9375rem] text-ink shadow-tight outline-none transition-colors placeholder:text-ink-45/70 focus:border-indigo"
          />
          <p className="mt-1.5 text-[0.8125rem] text-ink-45">
            First name only. The Primer uses it when it talks to them.
          </p>
        </div>

        <div>
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-[0.875rem] font-medium text-ink">Age</span>
            <span className="figure-num text-2xl font-semibold text-ink">
              {d.age}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 10 }, (_, i) => i + 5).map((a) => (
              <button
                key={a}
                onClick={() => set("age", a)}
                aria-pressed={d.age === a}
                className={cn(
                  "h-12 w-12 rounded-xl text-[0.9375rem] font-medium transition-all active:scale-95",
                  d.age === a
                    ? "bg-ink text-white shadow-lift"
                    : "border border-line-strong bg-surface text-ink-70 hover:border-ink/25",
                )}
              >
                {a}
              </button>
            ))}
          </div>

          <div className="mt-4 flex gap-3 rounded-xl border border-line bg-indigo-tint/60 p-4">
            <IconChild size={20} className="mt-0.5 shrink-0 text-indigo" />
            <p className="text-[0.875rem] leading-relaxed text-ink-70">
              {bandCopy}
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor="grade"
            className="mb-1.5 block text-[0.875rem] font-medium text-ink"
          >
            Year group{" "}
            <span className="font-normal text-ink-45">(optional)</span>
          </label>
          <input
            id="grade"
            value={d.grade}
            onChange={(e) => set("grade", e.target.value)}
            className="w-full rounded-xl border border-line-strong bg-surface px-4 py-3 text-[0.9375rem] text-ink shadow-tight outline-none transition-colors focus:border-indigo"
          />
          <p className="mt-1.5 text-[0.8125rem] text-ink-45">
            Helps line things up with what they&rsquo;re doing at school.
          </p>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------- step: interests */

function StepInterests({
  d,
  set,
}: {
  d: Draft;
  set: <K extends keyof Draft>(k: K, v: Draft[K]) => void;
}) {
  const toggle = (i: string) =>
    set(
      "interests",
      d.interests.includes(i)
        ? d.interests.filter((x) => x !== i)
        : [...d.interests, i],
    );

  return (
    <div>
      <Heading
        eyebrow="what they're into"
        title={`What does ${d.name || "your child"} like?`}
        body="The Primer builds its examples out of these. A child who won't count apples will happily count dinosaurs."
      />

      <div className="mt-8 flex flex-wrap gap-2.5">
        {INTEREST_OPTIONS.map((i) => {
          const on = d.interests.includes(i);
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              aria-pressed={on}
              className={cn(
                "rounded-full px-4 py-2.5 text-[0.9375rem] transition-all active:scale-95",
                on
                  ? "bg-ink text-white shadow-tight"
                  : "border border-line-strong bg-surface text-ink-70 hover:border-ink/25",
              )}
            >
              {i}
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-[0.875rem] text-ink-45">
        Skip this if you&rsquo;d rather, it works out what they like
        anyway, it just takes a few sessions longer.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------- step: rules */

function StepRules({
  d,
  set,
}: {
  d: Draft;
  set: <K extends keyof Draft>(k: K, v: Draft[K]) => void;
}) {
  const fmt = (h: number) => `${h % 12 || 12}${h < 12 ? "am" : "pm"}`;

  return (
    <div>
      <Heading
        eyebrow="your rules"
        title="Set the guardrails"
        body="These are yours, not ours. You can change any of them later without losing anything."
      />

      <div className="mt-8 space-y-6">
        {/* PIN */}
        <section className="rounded-2xl border border-line bg-surface p-5 shadow-tight">
          <div className="flex gap-3">
            <IconLock size={20} className="mt-0.5 shrink-0 text-indigo" />
            <div className="flex-1">
              <h3 className="text-[0.9375rem] font-semibold text-ink">
                A four-digit PIN
              </h3>
              <p className="mt-1 text-[0.875rem] leading-relaxed text-ink-45">
                This locks the settings and the dashboard, so your child
                can&rsquo;t extend their own time limit. It isn&rsquo;t needed to
                start a lesson, that would just teach them the PIN.
              </p>

              <div className="mt-4 flex gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <input
                    key={i}
                    inputMode="numeric"
                    maxLength={1}
                    aria-label={`PIN digit ${i + 1}`}
                    value={d.pin[i] ?? ""}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "");
                      const next = d.pin.split("");
                      next[i] = v;
                      set("pin", next.join("").slice(0, 4));
                      if (v && e.target.nextElementSibling instanceof HTMLInputElement) {
                        e.target.nextElementSibling.focus();
                      }
                    }}
                    className="h-14 w-12 rounded-xl border border-line-strong bg-base text-center font-[family-name:var(--font-figure)] text-xl text-ink shadow-tight outline-none transition-colors focus:border-indigo"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Hours */}
        <section className="rounded-2xl border border-line bg-surface p-5 shadow-tight">
          <div className="flex gap-3">
            <IconClock size={20} className="mt-0.5 shrink-0 text-indigo" />
            <div className="flex-1">
              <h3 className="text-[0.9375rem] font-semibold text-ink">
                When it can be used
              </h3>
              <p className="mt-1 text-[0.875rem] text-ink-45">
                Outside these hours it simply won&rsquo;t open.
              </p>

              <div className="mt-4 flex items-center gap-3">
                <HourPicker
                  label="From"
                  value={d.fromHour}
                  onChange={(v) => set("fromHour", v)}
                />
                <span className="mt-5 text-ink-45">&ndash;</span>
                <HourPicker
                  label="Until"
                  value={d.toHour}
                  onChange={(v) => set("toHour", v)}
                />
              </div>

              <p className="mt-3 figure-num text-[0.8125rem] text-ink-45">
                {fmt(d.fromHour)} to {fmt(d.toHour)}
              </p>
            </div>
          </div>
        </section>

        {/* Daily cap */}
        <section className="rounded-2xl border border-line bg-surface p-5 shadow-tight">
          <h3 className="text-[0.9375rem] font-semibold text-ink">
            How long a day
          </h3>
          <p className="mt-1 text-[0.875rem] text-ink-45">
            Most children this age run out of attention around 10&ndash;20
            minutes. Longer isn&rsquo;t better.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[10, 15, 20, 30, 45].map((m) => (
              <button
                key={m}
                onClick={() => set("dailyMinutes", m)}
                aria-pressed={d.dailyMinutes === m}
                className={cn(
                  "rounded-xl px-4 py-2.5 text-[0.875rem] font-medium transition-all active:scale-95",
                  d.dailyMinutes === m
                    ? "bg-ink text-white shadow-tight"
                    : "border border-line-strong bg-base text-ink-70 hover:border-ink/25",
                )}
              >
                {m} min
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function HourPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex-1">
      <span className="mb-1.5 block text-[0.8125rem] text-ink-45">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-xl border border-line-strong bg-base px-3 py-2.5 text-[0.875rem] text-ink shadow-tight outline-none focus:border-indigo"
      >
        {Array.from({ length: 17 }, (_, i) => i + 6).map((h) => (
          <option key={h} value={h}>
            {h % 12 || 12}
            {h < 12 ? "am" : "pm"}
          </option>
        ))}
      </select>
    </label>
  );
}

/* -------------------------------------------------------------- step: plan */

function StepPlan({
  d,
  set,
}: {
  d: Draft;
  set: <K extends keyof Draft>(k: K, v: Draft[K]) => void;
}) {
  const plans = [
    {
      id: "free" as const,
      name: "Free",
      price: "£0",
      note: "20 minutes a day, one child. Stays free.",
    },
    {
      id: "family" as const,
      name: "Family",
      price: "£12",
      note: "One child, no limits, every subject. 14 days free.",
    },
    {
      id: "household" as const,
      name: "Household",
      price: "£24",
      note: "Up to four children. 14 days free.",
    },
  ];

  return (
    <div>
      <Heading
        eyebrow="last bit"
        title="Pick a plan"
        body="No card needed for the trial, and nothing renews without telling you first."
      />

      <ul className="mt-8 space-y-3">
        {plans.map((p) => {
          const on = d.plan === p.id;
          return (
            <li key={p.id}>
              <button
                onClick={() => set("plan", p.id)}
                aria-pressed={on}
                className={cn(
                  "flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition-all",
                  on
                    ? "border-ink bg-surface shadow-lift"
                    : "border-line bg-surface shadow-tight hover:border-line-strong",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors",
                    on ? "border-ink bg-ink text-white" : "border-line-strong",
                  )}
                >
                  {on && <IconCheck size={14} />}
                </span>
                <span className="flex-1">
                  <span className="block text-[1.0625rem] font-semibold text-ink">
                    {p.name}
                  </span>
                  <span className="mt-0.5 block text-[0.875rem] text-ink-45">
                    {p.note}
                  </span>
                </span>
                <span className="figure-num text-xl font-semibold text-ink">
                  {p.price}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------- step: done */

function StepDone({ d }: { d: Draft }) {
  const picks = modulesForAge(d.age).slice(0, 3);
  const name = d.name || "Your child";

  return (
    <div>
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-green-tint text-green">
        <IconCheck size={26} />
      </span>

      <h2 className="mt-6 text-[1.875rem] font-semibold leading-tight tracking-[-0.03em] text-ink">
        {name} is set up.
      </h2>
      <p className="mt-3 text-[1.0625rem] leading-relaxed text-ink-45">
        Hand them the device and they&rsquo;ll see their own name. They never
        sign in, and they can&rsquo;t reach your dashboard without the PIN.
      </p>

      <div className="mt-8">
        <p className="eyebrow mb-3 text-ink-45">first up for them</p>
        <ul className="grid gap-3 sm:grid-cols-3">
          {picks.map((m) => (
            <li
              key={m.id}
              className="overflow-hidden rounded-2xl border border-line bg-surface shadow-tight"
            >
              <span className={toneBg(m.tone)}>
                <ModuleArt art={m.art} tone={m.tone} className="h-20 w-full" />
              </span>
              <span className="block p-3 text-[0.875rem] font-medium text-ink">
                {m.kidTitle}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/learning"
          className="rounded-xl bg-ink px-6 py-3.5 text-[0.9375rem] font-medium text-white shadow-lift transition-colors hover:bg-ink/88"
        >
          Hand it to {name}
        </Link>
        <Link
          href="/parent"
          className="rounded-xl border border-line-strong bg-surface px-6 py-3.5 text-[0.9375rem] font-medium text-ink shadow-tight transition-colors hover:border-ink/25"
        >
          Go to my dashboard
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ shared */

function Heading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div>
      <p className="eyebrow mb-3 text-indigo">{eyebrow}</p>
      <h2 className="text-[1.875rem] font-semibold leading-tight tracking-[-0.03em] text-ink">
        {title}
      </h2>
      <p className="mt-3 text-[1.0625rem] leading-relaxed text-ink-45">{body}</p>
    </div>
  );
}
