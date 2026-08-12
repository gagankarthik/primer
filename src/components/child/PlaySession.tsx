"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { SPRING_SNAP, SPRING_UI, prefersReducedMotion } from "@/lib/motion";
import { SCAFFOLD_RUNGS, type ScaffoldRung } from "@/lib/profile";
import type { LearningModule } from "@/lib/modules";
import { cn } from "@/components/ui/cn";

/**
 * THE PLAY SESSION, the screen a child actually spends their time on.
 *
 * Design constraints, in priority order:
 *
 *  1. One thing at a time. No transcript, no scrollback. A beginning reader
 *     cannot hold a scrollback in working memory and will re-read the wrong
 *     line; showing only the current question removes the problem entirely.
 *  2. Everything is a big touch target. Nothing here is smaller than 44px.
 *  3. It reads aloud. For a five-year-old the question has to be heard, not
 *     read, the reading is the thing being learned, so it can't also be the
 *     price of entry. Speech is synthesised in the browser; nothing is
 *     recorded, and nothing is sent anywhere.
 *  4. The child can always answer, and can always leave.
 */

type Line = { who: "primer" | "child"; text: string; rung?: ScaffoldRung };

/** A short scripted exchange per module, standing in for the model turn. */
function scriptFor(m: LearningModule): Line[] {
  const generic: Line[] = [
    { who: "primer", rung: 0, text: m.opener },
    { who: "child", text: "um… I'm not sure" },
    {
      who: "primer",
      rung: 1,
      text: "That's alright. Let's take a smaller bite, what's the very first thing you notice?",
    },
    { who: "child", text: "there's four of them on this side" },
    {
      who: "primer",
      rung: 1,
      text: "Good spotting. Hold onto that four. Now what's on the other side?",
    },
    { who: "child", text: "three! so… seven?" },
    {
      who: "primer",
      rung: 0,
      text: "Seven it is, and you worked it out yourself. Shall we try a trickier one?",
    },
  ];
  return generic;
}

const TONE_BG: Record<string, string> = {
  indigo: "bg-indigo-tint",
  green: "bg-green-tint",
  amber: "bg-amber/10",
  rose: "bg-rose/8",
};

const TONE_SOLID: Record<string, string> = {
  indigo: "bg-indigo",
  green: "bg-green",
  amber: "bg-amber",
  rose: "bg-rose",
};

export function PlaySession({
  module: m,
  childId,
  childName,
}: {
  module: LearningModule;
  childId: string;
  childName: string;
}) {
  const script = scriptFor(m);
  const [i, setI] = useState(0);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);

  const line = script[i];
  const done = i >= script.length - 1;

  const lastPrimer = [...script.slice(0, i + 1)]
    .reverse()
    .find((l) => l.who === "primer");
  const rung: ScaffoldRung = lastPrimer?.rung ?? 0;

  /* ------------------------------------------------------------ speech */

  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback(
    (text: string) => {
      if (!voiceOn) return;
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      // Slower than default and slightly lower, a rushed, bright voice is hard
      // for a young child to follow, and this is often read while they think.
      u.rate = 0.92;
      u.pitch = 1.0;
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      speechRef.current = u;
      window.speechSynthesis.speak(u);
    },
    [voiceOn],
  );

  // Read each new Primer line aloud as it appears.
  useEffect(() => {
    if (line.who === "primer") speak(line.text);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [i]); // eslint-disable-line react-hooks/exhaustive-deps

  // Never leave speech running after the child leaves the screen.
  useEffect(
    () => () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    },
    [],
  );

  /* ------------------------------------------------------------- turns */

  function advance() {
    if (done) return;
    setListening(true);
    const wait = prefersReducedMotion() ? 0 : 900;
    setTimeout(() => {
      setListening(false);
      setI((n) => Math.min(script.length - 1, n + 2));
    }, wait);
  }

  return (
    <main className={cn("min-h-dvh", TONE_BG[m.tone])}>
      {/* ------------------------------------------------------- top bar */}
      <header className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-5 py-5">
        <Link
          href={`/learning/${childId}`}
          className="grid h-11 w-11 place-items-center rounded-full bg-white/70 text-ink shadow-tight backdrop-blur transition-colors hover:bg-white"
          aria-label="Back to your things"
        >
          &larr;
        </Link>

        <span className="rounded-full bg-white/70 px-4 py-2 text-[0.8125rem] font-medium text-ink shadow-tight backdrop-blur">
          {m.kidTitle}
        </span>

        <button
          type="button"
          onClick={() => {
            const next = !voiceOn;
            setVoiceOn(next);
            if (!next && typeof window !== "undefined") {
              window.speechSynthesis?.cancel();
              setSpeaking(false);
            } else if (next && line.who === "primer") {
              speak(line.text);
            }
          }}
          aria-pressed={voiceOn}
          aria-label={voiceOn ? "Turn the voice off" : "Turn the voice on"}
          className="grid h-11 w-11 place-items-center rounded-full bg-white/70 text-ink shadow-tight backdrop-blur transition-colors hover:bg-white"
        >
          <VoiceIcon on={voiceOn} speaking={speaking} />
        </button>
      </header>

      {/* --------------------------------------------------- help gauge */}
      <div className="mx-auto max-w-3xl px-5">
        <div
          className="flex gap-1.5"
          role="img"
          aria-label={`Help level ${rung} of 5`}
        >
          {SCAFFOLD_RUNGS.map((r) => (
            <motion.span
              key={r.rung}
              className="h-1.5 flex-1 rounded-full"
              animate={{
                backgroundColor:
                  r.rung === rung
                    ? "rgba(11,18,32,0.55)"
                    : r.rung < rung
                      ? "rgba(11,18,32,0.22)"
                      : "rgba(11,18,32,0.08)",
              }}
              transition={SPRING_UI}
            />
          ))}
        </div>
      </div>

      {/* -------------------------------------------------------- stage */}
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 pb-16 pt-10 text-center sm:pt-16">
        <AnimatePresence mode="wait">
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={SPRING_UI}
            className="font-[family-name:var(--font-read)] text-[1.5rem] leading-[1.55] text-ink sm:text-[1.875rem]"
          >
            {line.who === "primer" ? line.text : script[i - 1]?.text}
          </motion.p>
        </AnimatePresence>

        {line.who === "child" && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING_UI}
            className="mt-8 rounded-2xl bg-white/70 px-5 py-3 font-[family-name:var(--font-read)] text-lg text-ink-70 shadow-tight backdrop-blur"
          >
            {line.text}
          </motion.p>
        )}

        {/* The one control. */}
        <div className="mt-14">
          {done ? (
            <div className="flex flex-col items-center gap-5">
              <p className="text-[1.125rem] font-semibold text-ink">
                Nice work, {childName}.
              </p>
              <Link
                href={`/learning/${childId}`}
                className={cn(
                  "rounded-2xl px-7 py-4 text-[1.0625rem] font-medium text-white shadow-lift transition-transform active:scale-[0.98]",
                  TONE_SOLID[m.tone],
                )}
              >
                Pick something else
              </Link>
            </div>
          ) : (
            <TalkButton
              listening={listening}
              speaking={speaking}
              tone={m.tone}
              onPress={advance}
            />
          )}
        </div>
      </div>
    </main>
  );
}

/* --------------------------------------------------------------------- */

function TalkButton({
  listening,
  speaking,
  tone,
  onPress,
}: {
  listening: boolean;
  speaking: boolean;
  tone: string;
  onPress: () => void;
}) {
  return (
    <motion.button
      type="button"
      onPointerDown={onPress}
      whileTap={{ scale: 0.94 }}
      transition={SPRING_SNAP}
      aria-label="Hold to answer out loud"
      className="relative grid h-40 w-40 place-items-center rounded-full sm:h-44 sm:w-44"
    >
      {/* Expanding rings only while listening, so the screen visibly reacts to
          the child's voice instead of sitting inert while they talk. */}
      {listening && (
        <>
          <span
            aria-hidden
            className={cn("absolute inset-0 rounded-full opacity-40", TONE_SOLID[tone])}
            style={{ animation: "ring-out 1.8s ease-out infinite" }}
          />
          <span
            aria-hidden
            className={cn("absolute inset-0 rounded-full opacity-30", TONE_SOLID[tone])}
            style={{ animation: "ring-out 1.8s ease-out 0.9s infinite" }}
          />
        </>
      )}

      <span
        aria-hidden
        className={cn(
          "absolute inset-0 rounded-full shadow-lift transition-transform",
          TONE_SOLID[tone],
          listening && "scale-105",
        )}
      />

      <span className="relative flex flex-col items-center gap-2 text-white">
        <MicGlyph animated={listening || speaking} />
        <span className="text-[0.9375rem] font-medium">
          {listening ? "Listening…" : speaking ? "Reading…" : "Tap to talk"}
        </span>
      </span>
    </motion.button>
  );
}

function MicGlyph({ animated }: { animated: boolean }) {
  return (
    <span aria-hidden className="flex h-9 items-end gap-1.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="w-1.5 rounded-full bg-white"
          style={{
            height: animated ? undefined : `${[14, 22, 30, 22, 14][i]}px`,
            animation: animated
              ? `breathe ${0.7 + i * 0.11}s ease-in-out infinite`
              : undefined,
            ...(animated ? { height: `${[16, 26, 34, 26, 16][i]}px` } : {}),
          }}
        />
      ))}
    </span>
  );
}

function VoiceIcon({ on, speaking }: { on: boolean; speaking: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4v-5Z"
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      {on ? (
        <>
          <path
            d="M15.5 9a4 4 0 0 1 0 6"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            opacity={speaking ? 1 : 0.6}
          />
          <path
            d="M18.5 6.5a8 8 0 0 1 0 11"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            opacity={speaking ? 0.8 : 0.35}
          />
        </>
      ) : (
        <path
          d="M16 9.5l5 5M21 9.5l-5 5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
