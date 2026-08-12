"use client";

import { useState } from "react";
import { Card, Pill } from "@/components/app/Page";
import { cn } from "@/components/ui/cn";

/**
 * THE MODULE EDITOR.
 *
 * A module is a loop: teach an idea, check it, and on a wrong answer re-teach
 * that same idea differently and ask again. The editor is built around that
 * shape rather than around a generic block list, because the shape is the
 * product. A creator cannot add a check without a lesson for it to test, and
 * cannot save a check without writing the re-teach.
 *
 * THE RETRY FIELD IS THE POINT OF THIS SCREEN. It is required, it sits at the
 * same level as the first explanation rather than in an "advanced" panel, and
 * it carries a warning if it looks too similar to the original. Re-showing the
 * same words to a child who just failed on them is the single most common
 * mistake in children's courseware, and an editor that makes the re-teach
 * optional guarantees it.
 *
 * Nothing here saves. This is the UI phase; the shape of the payload is what
 * matters, and `onSave` is the one place the API gets wired in.
 */

type Lesson = { id: string; kind: "lesson"; title: string; body: string };
type Check = {
  id: string;
  kind: "check";
  teaches: string;
  question: string;
  options: { label: string; correct: boolean }[];
  onCorrect: string;
  onWrong: string;
  retryTitle: string;
  retryBody: string;
};
type Step = Lesson | Check;

const SEED: Step[] = [
  {
    id: "l1",
    kind: "lesson",
    title: "Count in fives on your fingers",
    body: "One hand is five. Two hands is ten. Say five, ten, fifteen as you tap each hand.",
  },
  {
    id: "c1",
    kind: "check",
    teaches: "l1",
    question: "How many fingers on three hands?",
    options: [
      { label: "15", correct: true },
      { label: "8", correct: false },
      { label: "3", correct: false },
    ],
    onCorrect: "Fifteen. You added five three times without doing a sum.",
    onWrong: "Not quite. Let's tap them out rather than work it out.",
    retryTitle: "Tap, don't add",
    retryBody:
      "Tap the first hand and say FIVE. Tap the next and say TEN. Tap the last and say FIFTEEN. You never had to add anything.",
  },
];

export function ModuleEditor({
  initialTitle = "",
  status = "draft",
}: {
  initialTitle?: string;
  status?: string;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [steps, setSteps] = useState<Step[]>(SEED);
  const [open, setOpen] = useState<string | null>("c1");

  const lessons = steps.filter((s): s is Lesson => s.kind === "lesson");
  const checks = steps.filter((s): s is Check => s.kind === "check");

  /** A check whose question contains its own answer. The commonest rejection. */
  function givesItAway(c: Check) {
    const answer = c.options.find((o) => o.correct)?.label.toLowerCase().trim();
    return !!answer && answer.length > 1 && c.question.toLowerCase().includes(answer);
  }

  /** A re-teach that is a paraphrase of the lesson it follows. */
  function retryTooSimilar(c: Check) {
    const lesson = lessons.find((l) => l.id === c.teaches);
    if (!lesson) return false;
    const a = new Set(lesson.body.toLowerCase().split(/\W+/).filter((w) => w.length > 4));
    const b = c.retryBody.toLowerCase().split(/\W+/).filter((w) => w.length > 4);
    if (b.length === 0) return false;
    const shared = b.filter((w) => a.has(w)).length;
    return shared / b.length > 0.6;
  }

  const problems = [
    ...checks.filter(givesItAway).map((c) => ({
      id: c.id,
      text: `"${c.question}" contains its own answer.`,
    })),
    ...checks.filter((c) => !c.retryBody.trim()).map((c) => ({
      id: c.id,
      text: "A check has no re-teach. Required before this can be submitted.",
    })),
    ...checks.filter((c) => c.retryBody.trim() && retryTooSimilar(c)).map((c) => ({
      id: c.id,
      text: "A re-teach mostly repeats its lesson. If those words worked, the child would not be there.",
    })),
  ];

  function addLesson() {
    const id = `l${Date.now()}`;
    setSteps((s) => [...s, { id, kind: "lesson", title: "", body: "" }]);
    setOpen(id);
  }

  function addCheck() {
    const last = [...steps].reverse().find((s) => s.kind === "lesson");
    if (!last) return;
    const id = `c${Date.now()}`;
    setSteps((s) => [
      ...s,
      {
        id,
        kind: "check",
        teaches: last.id,
        question: "",
        options: [
          { label: "", correct: true },
          { label: "", correct: false },
        ],
        onCorrect: "",
        onWrong: "",
        retryTitle: "",
        retryBody: "",
      },
    ]);
    setOpen(id);
  }

  function update(id: string, patch: Partial<Lesson> & Partial<Check>) {
    setSteps((s) => s.map((x) => (x.id === id ? ({ ...x, ...patch } as Step) : x)));
  }

  function remove(id: string) {
    // Removing a lesson removes the checks that tested it: a check with no
    // lesson has nowhere to rewind to, which is the one state this model
    // cannot represent.
    setSteps((s) => s.filter((x) => x.id !== id && !(x.kind === "check" && x.teaches === id)));
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="min-w-0 space-y-5">
        <Card title="The module">
          <Field
            label="Title, as a parent sees it"
            value={title}
            onChange={setTitle}
            placeholder="Counting in fives"
          />
        </Card>

        {steps.map((step, i) => {
          const isOpen = open === step.id;

          if (step.kind === "lesson") {
            return (
              <Card key={step.id} className="border-l-[3px] border-l-indigo">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : step.id)}
                  className="flex w-full items-center gap-3 text-left"
                >
                  <Pill tone="indigo">Lesson {lessons.indexOf(step) + 1}</Pill>
                  <span className="min-w-0 flex-1 truncate text-[0.9375rem] font-semibold text-ink">
                    {step.title || "Untitled lesson"}
                  </span>
                  <span aria-hidden className="text-ink-45">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="mt-4 space-y-4">
                    <Field
                      label="One idea, as a heading"
                      value={step.title}
                      onChange={(v) => update(step.id, { title: v })}
                      placeholder="Count in fives on your fingers"
                    />
                    <Field
                      label="Say it in two or three sentences"
                      value={step.body}
                      onChange={(v) => update(step.id, { body: v })}
                      multiline
                      hint="Written for the youngest child in your age range, not the average one."
                    />
                    <RemoveButton onClick={() => remove(step.id)} label="Remove lesson" />
                  </div>
                )}
              </Card>
            );
          }

          const away = givesItAway(step);
          const similar = step.retryBody.trim() && retryTooSimilar(step);

          return (
            <Card
              key={step.id}
              className={cn(
                "border-l-[3px]",
                away || similar || !step.retryBody.trim()
                  ? "border-l-amber"
                  : "border-l-green",
              )}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : step.id)}
                className="flex w-full items-center gap-3 text-left"
              >
                <Pill tone="green">Check {checks.indexOf(step) + 1}</Pill>
                <span className="min-w-0 flex-1 truncate text-[0.9375rem] font-semibold text-ink">
                  {step.question || "Untitled check"}
                </span>
                {(away || similar || !step.retryBody.trim()) && (
                  <Pill tone="amber">needs a look</Pill>
                )}
                <span aria-hidden className="text-ink-45">
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              {isOpen && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="text-[0.875rem] font-medium text-ink">
                      Tests which lesson
                    </label>
                    <select
                      value={step.teaches}
                      onChange={(e) => update(step.id, { teaches: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-line-strong bg-base px-4 py-3 text-[0.9375rem] text-ink outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/20"
                    >
                      {lessons.map((l, li) => (
                        <option key={l.id} value={l.id}>
                          Lesson {li + 1}: {l.title || "untitled"}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1.5 text-[0.8125rem] text-ink-45">
                      A wrong answer rewinds here and re-teaches it.
                    </p>
                  </div>

                  <Field
                    label="The question"
                    value={step.question}
                    onChange={(v) => update(step.id, { question: v })}
                    error={
                      away
                        ? "This question contains its own answer. A reviewer will send it back."
                        : undefined
                    }
                  />

                  <div>
                    <label className="text-[0.875rem] font-medium text-ink">
                      Answers, two or three
                    </label>
                    <ul className="mt-2 space-y-2">
                      {step.options.map((o, oi) => (
                        <li key={oi} className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name={`correct-${step.id}`}
                            checked={o.correct}
                            onChange={() =>
                              update(step.id, {
                                options: step.options.map((x, xi) => ({
                                  ...x,
                                  correct: xi === oi,
                                })),
                              })
                            }
                            aria-label={`Answer ${oi + 1} is correct`}
                            className="h-5 w-5 shrink-0 accent-[var(--color-green)]"
                          />
                          <input
                            value={o.label}
                            placeholder={oi === 0 ? "The right one" : "A plausible wrong one"}
                            onChange={(e) =>
                              update(step.id, {
                                options: step.options.map((x, xi) =>
                                  xi === oi ? { ...x, label: e.target.value } : x,
                                ),
                              })
                            }
                            className="w-full rounded-xl border border-line-strong bg-base px-4 py-2.5 text-[0.9375rem] text-ink outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/20"
                          />
                        </li>
                      ))}
                    </ul>
                    <p className="mt-1.5 text-[0.8125rem] text-ink-45">
                      Wrong answers should be what a child would actually think,
                      not obviously silly. A joke option is a free guess.
                    </p>
                  </div>

                  <Field
                    label="Say this when they get it right"
                    value={step.onCorrect}
                    onChange={(v) => update(step.id, { onCorrect: v })}
                    hint="Name what they did. Never just 'well done'."
                  />

                  {/* -------------------------------------------- the retry */}
                  <div className="rounded-2xl border border-amber/30 bg-amber/[0.04] p-4">
                    <p className="text-[0.9375rem] font-semibold text-ink">
                      When they get it wrong
                    </p>
                    <p className="mt-1 text-[0.875rem] leading-snug text-ink-70">
                      Required. The child goes back to the lesson above and is
                      taught it again from here, then asked the same question.
                    </p>

                    <div className="mt-4 space-y-4">
                      <Field
                        label="What to say first"
                        value={step.onWrong}
                        onChange={(v) => update(step.id, { onWrong: v })}
                        placeholder="Not quite, and it's a fair mistake. Let's try it another way."
                        hint="Never says 'wrong'. Never says 'try again' without saying what to try differently."
                      />
                      <Field
                        label="The second explanation, as a heading"
                        value={step.retryTitle}
                        onChange={(v) => update(step.id, { retryTitle: v })}
                      />
                      <Field
                        label="Explain it a different way"
                        value={step.retryBody}
                        onChange={(v) => update(step.id, { retryBody: v })}
                        multiline
                        error={
                          similar
                            ? "This mostly repeats the lesson. If those words had worked, the child would not be here."
                            : undefined
                        }
                        hint="Different words, and ideally something concrete to touch or count."
                      />
                    </div>
                  </div>

                  <RemoveButton onClick={() => remove(step.id)} label="Remove check" />
                </div>
              )}
            </Card>
          );
        })}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={addLesson}
            className="rounded-xl border border-line-strong bg-surface px-5 py-3 text-[0.9375rem] font-semibold text-ink shadow-tight transition-colors hover:border-ink/25"
          >
            Add a lesson
          </button>
          <button
            type="button"
            onClick={addCheck}
            disabled={lessons.length === 0}
            className="rounded-xl border border-line-strong bg-surface px-5 py-3 text-[0.9375rem] font-semibold text-ink shadow-tight transition-colors hover:border-ink/25 disabled:cursor-not-allowed disabled:opacity-45"
            title={lessons.length === 0 ? "Write a lesson for it to test first" : undefined}
          >
            Add a check
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------- side panel */}
      <div className="space-y-4 xl:sticky xl:top-6 xl:self-start">
        <Card title="Before you submit">
          {problems.length === 0 ? (
            <p className="rounded-xl bg-green-tint px-4 py-3 text-[0.9375rem] text-ink">
              Nothing obviously wrong. A person still reads it.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {problems.map((p, i) => (
                <li
                  key={i}
                  className="rounded-xl bg-amber/10 px-4 py-2.5 text-[0.875rem] leading-snug text-ink-70"
                >
                  {p.text}
                </li>
              ))}
            </ul>
          )}

          <dl className="mt-4 space-y-2 border-t border-line pt-4">
            {[
              ["Lessons", lessons.length],
              ["Checks", checks.length],
              ["Roughly", `${Math.max(2, lessons.length * 2)} min`],
            ].map(([k, v]) => (
              <div key={k as string} className="flex justify-between gap-3">
                <dt className="text-[0.875rem] text-ink-45">{k}</dt>
                <dd className="figure-num text-[0.875rem] font-semibold text-ink">
                  {v}
                </dd>
              </div>
            ))}
          </dl>

          <button
            type="button"
            disabled={problems.length > 0 || checks.length === 0}
            className="mt-4 w-full rounded-xl bg-ink px-5 py-3 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-ink/88 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {status === "changes" ? "Resubmit" : "Submit for review"}
          </button>
          <p className="mt-2 text-center text-[0.75rem] text-ink-45">
            Nothing saves yet. This is the UI phase.
          </p>
        </Card>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- fields */

function Field({
  label,
  value,
  onChange,
  placeholder,
  hint,
  error,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  multiline?: boolean;
}) {
  const cls = cn(
    "mt-2 w-full rounded-xl border bg-base px-4 py-3 text-[0.9375rem] text-ink outline-none transition-colors placeholder:text-ink-45/70",
    error ? "border-amber focus:border-amber" : "border-line-strong focus:border-indigo focus:ring-2 focus:ring-indigo/20",
  );

  return (
    <div>
      <label className="text-[0.875rem] font-medium text-ink">{label}</label>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cn(cls, "resize-y")}
        />
      ) : (
        <input
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
        />
      )}
      {error && <p className="mt-1.5 text-[0.8125rem] text-amber">{error}</p>}
      {hint && !error && (
        <p className="mt-1.5 text-[0.8125rem] leading-snug text-ink-45">{hint}</p>
      )}
    </div>
  );
}

function RemoveButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[0.875rem] font-medium text-rose underline underline-offset-4 hover:brightness-90"
    >
      {label}
    </button>
  );
}
