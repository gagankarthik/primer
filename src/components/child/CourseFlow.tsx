"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CourseVisual } from "@/components/child/CourseVisual";
import { Guide, GuideSays } from "@/components/child/Guide";
import { AwardIcon } from "@/components/child/AwardIcon";
import { BackButton } from "@/components/ui/BackButton";
import { courseFor, lessonCount, type Check, type Step } from "@/lib/course";
import type { LearningModule } from "@/lib/modules";
import { SPRING_SNAP } from "@/lib/motion";
import { cn } from "@/components/ui/cn";

/**
 * THE COURSE PLAYER.
 *
 * Runs the teach -> check -> (right: on / wrong: re-teach) loop from
 * lib/course.ts. Four states, only ever one on screen: lesson, check, retry,
 * done.
 *
 * LAYOUT: everything fits one screen, and that is a hard rule rather than a
 * preference. The first version let the card grow and the page scroll, which
 * broke the product's central promise in two ways at once: a child who has to
 * scroll to find the button loses the question off the top of the screen, and
 * a child on a tablet in a stand cannot scroll and read at the same time. So
 * the shell is a fixed `h-dvh` with `overflow-hidden`, the prop is given the
 * flexible space and shrinks to fit, and the text is sized in vh-aware clamps
 * rather than the huge `read-lg` display size, which was built for a paragraph
 * on a marketing page and not for a card that also has to hold a picture and
 * three buttons.
 *
 * Rules this screen keeps, all about a child rather than a user:
 *
 *  - A wrong answer is never destructive. It costs one screen and rewinds to
 *    the idea it came from, re-taught. It never restarts the module, never
 *    shows a cross, and never appears in a total at the end.
 *  - No timer, no streak, no score. Nothing rewards speed, because the whole
 *    product exists to reward thinking.
 *  - The progress track counts lessons, not attempts, so it cannot go
 *    backwards. A bar that retreats tells a child they lost ground, when what
 *    happened is they found the gap.
 *  - Explanations come from the module's guide, so there is a face attached to
 *    the voice, and questions come from the page, so "your turn" is visibly a
 *    different moment.
 *  - It reads aloud at 0.92 rate, and the audio never leaves the device.
 *  - The way out is always there, leading edge, labelled.
 */

type Phase = { at: number; retrying: boolean };

export function CourseFlow({
  module: m,
  childId,
}: {
  module: LearningModule;
  childId: string;
}) {
  const course = courseFor(m.id);
  const [phase, setPhase] = useState<Phase>({ at: 0, retrying: false });
  const [chosen, setChosen] = useState<number | null>(null);
  const [voiceOn, setVoiceOn] = useState(true);
  const spoken = useRef<string>("");

  const step: Step | undefined = course?.steps[phase.at];
  const done = !!course && phase.at >= course.steps.length;

  const speech = !course
    ? ""
    : done
      ? `You did it. ${course.canNowDo.join(". ")}`
      : step?.kind === "lesson"
        ? `${step.title}. ${step.body}`
        : step?.kind === "check"
          ? phase.retrying
            ? `${step.onWrong} ${step.retry.title}. ${step.retry.body}`
            : step.question
          : "";

  const say = useCallback(
    (text: string) => {
      if (!voiceOn || !text) return;
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      // Slower than default. Adult-paced synthesis outruns a five-year-old's
      // processing and they stop listening rather than ask you to repeat it.
      u.rate = 0.92;
      u.pitch = 1.05;
      window.speechSynthesis.speak(u);
    },
    [voiceOn],
  );

  useEffect(() => {
    if (speech && speech !== spoken.current) {
      spoken.current = speech;
      say(speech);
    }
  }, [speech, say]);

  // Never leave the browser talking to an empty room.
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!course) return null;

  const lessons = lessonCount(course);
  const lessonsDone = course.steps
    .slice(0, phase.at)
    .filter((s) => s.kind === "lesson").length;

  function advance() {
    setChosen(null);
    setPhase((p) => ({ at: p.at + 1, retrying: false }));
  }

  function answer(i: number, check: Check) {
    if (chosen !== null) return;
    setChosen(i);
    const right = !!check.options[i].correct;

    window.setTimeout(
      () => {
        if (right) {
          setChosen(null);
          setPhase((p) => ({ at: p.at + 1, retrying: false }));
        } else {
          // Rewind to the lesson this check tests, re-taught with `retry`. The
          // step index does not move, so the progress track stays put.
          setChosen(null);
          setPhase((p) => ({ ...p, retrying: true }));
        }
      },
      right ? 1100 : 1400,
    );
  }

  return (
    // h-dvh + overflow-hidden: the screen is the frame, and content fits it.
    <main className="flex h-dvh flex-col overflow-hidden bg-base">
      {/* ------------------------------------------------------------ top */}
      <header className="flex shrink-0 items-center justify-between gap-4 px-4 py-3 sm:px-8 sm:py-4">
        <BackButton fallbackHref={`/learning/${childId}`} label="Stop for now" />

        <div className="flex items-center gap-3">
          <ProgressTrack total={lessons} done={lessonsDone} tone={m.tone} />
          <button
            type="button"
            onClick={() => {
              const next = !voiceOn;
              setVoiceOn(next);
              if (!next && typeof window !== "undefined") {
                window.speechSynthesis.cancel();
              } else {
                spoken.current = "";
              }
            }}
            aria-pressed={voiceOn}
            aria-label={voiceOn ? "Turn the voice off" : "Turn the voice on"}
            className={cn(
              "grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-colors",
              voiceOn
                ? "border-line-strong bg-surface text-ink"
                : "border-line bg-grey-tint text-ink-45",
            )}
          >
            <SpeakerGlyph on={voiceOn} />
          </button>
        </div>
      </header>

      {/* --------------------------------------------------------- middle */}
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col overflow-hidden px-4 pb-4 sm:px-8 sm:pb-8">
        <AnimatePresence mode="wait">
          {done ? (
            <Card key="done">
              <Done course={course} module={m} childId={childId} />
            </Card>
          ) : step?.kind === "lesson" ? (
            <Card key={step.id}>
              {/* One centred group, not two blocks pinned to opposite edges.
                  min-h-0 lets the prop shrink instead of pushing the button
                  off the bottom on a short screen. */}
              <div className="min-h-0 shrink">
                <CourseVisual visual={step.visual} tone={m.tone} />
              </div>
              <div className="shrink-0 pt-5 sm:pt-6">
                <GuideSays
                  moduleId={m.id}
                  title={step.title}
                  body={step.body}
                  tone={m.tone}
                />
                <BigButton tone={m.tone} onClick={advance}>
                  Got it
                </BigButton>
              </div>
            </Card>
          ) : step?.kind === "check" && phase.retrying ? (
            <Card key={`${step.id}-retry`}>
              {/*
                The re-teach. Framed as "here's another way to see it", never
                as a correction, and it uses different words and a different
                prop from the first explanation. Repeating the original
                wording to a child who just failed on it is the mistake this
                whole flow exists to avoid.
              */}
              <div className="min-h-0 shrink">
                <CourseVisual visual={step.retry.visual} tone={m.tone} />
              </div>
              <div className="shrink-0 pt-5 sm:pt-6">
                <p className="mb-3 inline-block rounded-full bg-amber/12 px-4 py-2 text-[0.9375rem] font-medium text-amber">
                  {step.onWrong}
                </p>
                <GuideSays
                  moduleId={m.id}
                  title={step.retry.title}
                  body={step.retry.body}
                  tone={m.tone}
                />
                <BigButton
                  tone={m.tone}
                  onClick={() => setPhase((p) => ({ ...p, retrying: false }))}
                >
                  Let me try again
                </BigButton>
              </div>
            </Card>
          ) : step?.kind === "check" ? (
            <Card key={step.id}>
              <div className="flex min-h-0 flex-1 flex-col justify-center">
                {/* The guide is present but quiet: this is the child's turn,
                    so it stops bobbing and the question is the page's, not
                    something being said at them. */}
                <div className="flex items-center gap-3">
                  <Guide moduleId={m.id} size={52} speaking={false} />
                  <div>
                    <p className="eyebrow text-ink-45">your turn</p>
                    <h1 className="mt-1 text-[clamp(1.25rem,1rem+1.6vh,1.75rem)] font-bold leading-[1.2] tracking-[-0.02em] text-ink">
                      {step.question}
                    </h1>
                  </div>
                </div>

                <ul className="mt-5 space-y-2.5">
                  {step.options.map((o, i) => {
                    const picked = chosen === i;
                    const revealed = chosen !== null;
                    const right = !!o.correct;
                    return (
                      <li key={o.label}>
                        <button
                          type="button"
                          onClick={() => answer(i, step)}
                          disabled={revealed}
                          className={cn(
                            "flex w-full items-center gap-4 rounded-2xl border-2 px-5 py-[clamp(0.85rem,0.5rem+1vh,1.15rem)] text-left text-[1.0625rem] font-semibold transition-all sm:text-[1.1875rem]",
                            !revealed &&
                              "border-line-strong bg-surface text-ink hover:-translate-y-0.5 hover:border-ink/30 hover:shadow-lift active:scale-[0.99]",
                            revealed &&
                              picked &&
                              right &&
                              "border-green bg-green-tint text-ink",
                            revealed &&
                              picked &&
                              !right &&
                              "border-amber bg-amber/10 text-ink",
                            revealed && !picked && "border-line bg-surface text-ink-45",
                          )}
                        >
                          <span
                            aria-hidden
                            className={cn(
                              "grid h-9 w-9 shrink-0 place-items-center rounded-full text-[0.9375rem] font-bold",
                              revealed && picked && right
                                ? "bg-green text-white"
                                : revealed && picked
                                  ? "bg-amber text-white"
                                  : "bg-grey-tint text-ink-45",
                            )}
                          >
                            {revealed && picked
                              ? right
                                ? "✓"
                                : "?"
                              : String.fromCharCode(65 + i)}
                          </span>
                          {o.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {chosen !== null && step.options[chosen].correct && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4"
                  >
                    <GuideSays
                      moduleId={m.id}
                      body={step.onCorrect}
                      tone="green"
                    />
                  </motion.div>
                )}
              </div>
            </Card>
          ) : null}
        </AnimatePresence>
      </div>
    </main>
  );
}

/* ----------------------------------------------------------------- parts */

/** Fills the available height so children can distribute themselves in it. */
function Card({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={SPRING_SNAP}
      className="flex min-h-0 flex-1 flex-col justify-center"
    >
      {children}
    </motion.div>
  );
}

function BigButton({
  children,
  onClick,
  tone,
}: {
  children: React.ReactNode;
  onClick: () => void;
  tone: "indigo" | "green" | "amber" | "rose";
}) {
  const bg = {
    indigo: "bg-indigo hover:bg-indigo-hi",
    green: "bg-green hover:brightness-95",
    amber: "bg-amber hover:brightness-95",
    rose: "bg-rose hover:brightness-95",
  }[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "mt-4 w-full rounded-2xl px-8 py-4 text-[1.125rem] font-bold text-white shadow-lift transition-all active:scale-[0.99] sm:w-auto sm:px-10",
        bg,
      )}
    >
      {children}
    </button>
  );
}

/**
 * Lessons complete, not questions attempted. It can only ever move forwards,
 * which is the point: a wrong answer is not lost ground.
 */
function ProgressTrack({
  total,
  done,
  tone,
}: {
  total: number;
  done: number;
  tone: "indigo" | "green" | "amber" | "rose";
}) {
  const fill = {
    indigo: "bg-indigo",
    green: "bg-green",
    amber: "bg-amber",
    rose: "bg-rose",
  }[tone];

  return (
    <div
      className="flex items-center gap-1.5"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={done}
      aria-label="How far through"
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            "h-2.5 rounded-full transition-all duration-500",
            i < done ? cn("w-8", fill) : "w-4 bg-ink/12",
          )}
        />
      ))}
    </div>
  );
}

function Done({
  course,
  module: m,
  childId,
}: {
  course: NonNullable<ReturnType<typeof courseFor>>;
  module: LearningModule;
  childId: string;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto text-center">
      <div className="flex items-center justify-center gap-4">
        <Guide moduleId={m.id} size={72} speaking />
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.7 }}
          className="grid h-16 w-16 place-items-center rounded-full bg-green-tint text-green"
        >
          <AwardIcon name="trophy" size={34} />
        </motion.div>
      </div>

      <h1 className="mt-5 text-[clamp(1.5rem,1.1rem+2vh,2.125rem)] font-bold tracking-[-0.025em] text-ink">
        You worked it out.
      </h1>
      <p
        className="mx-auto mt-2 max-w-md text-[1.0625rem] leading-[1.5] text-ink-70"
        style={{ fontFamily: "var(--font-read)" }}
      >
        {course.objective}
      </p>

      {/* What they can do, not what they scored. There is no score. */}
      <ul className="mx-auto mt-5 w-full max-w-md space-y-2 text-left">
        {course.canNowDo.map((c) => (
          <li
            key={c}
            className="flex items-start gap-3 rounded-2xl bg-surface px-4 py-3 shadow-tight"
          >
            <span
              aria-hidden
              className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-green/15 text-[0.75rem] text-green"
            >
              ✓
            </span>
            <span className="text-[1rem] leading-snug text-ink">{c}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href={`/learning/${childId}`}
          className="w-full rounded-2xl bg-ink px-8 py-3.5 text-[1.0625rem] font-bold text-white shadow-lift transition-colors hover:bg-ink/88 sm:w-auto"
        >
          Pick something else
        </Link>
        <Link
          href={`/modules/${m.id}`}
          className="w-full rounded-2xl border border-line-strong bg-surface px-8 py-3.5 text-[1.0625rem] font-medium text-ink shadow-tight transition-colors hover:border-ink/25 sm:w-auto"
        >
          About this one
        </Link>
      </div>
    </div>
  );
}

function SpeakerGlyph({ on }: { on: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {on ? (
        <>
          <path
            d="M15.5 9.2a4 4 0 0 1 0 5.6"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M18 7a7.5 7.5 0 0 1 0 10"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </>
      ) : (
        <path
          d="m16 9.5 5 5m0-5-5 5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
