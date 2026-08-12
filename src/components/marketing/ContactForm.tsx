"use client";

import { useState } from "react";
import { cn } from "@/components/ui/cn";

/**
 * CONTACT FORM
 *
 * No backend yet, by design: the brief is UI first. `submit` below is the one
 * place that changes when the API lands, everything else here is finished.
 *
 * Two decisions worth keeping:
 *
 *  - Validation runs on submit, not on every keystroke. Marking a field invalid
 *    while someone is still typing their email address is telling them they got
 *    it wrong before they have finished getting it right.
 *  - There is no "child's name" field, and no "child's age" either. We ask for
 *    the minimum that lets us reply, and a support inbox is the last place a
 *    child's details should end up.
 */

type Topic = "using" | "billing" | "safety" | "other";

const TOPICS: { value: Topic; label: string }[] = [
  { value: "using", label: "Using the Primer" },
  { value: "billing", label: "Billing" },
  { value: "safety", label: "Safety" },
  { value: "other", label: "Something else" },
];

type Errors = Partial<Record<"name" | "email" | "message", string>>;

export function ContactForm() {
  const [topic, setTopic] = useState<Topic>("using");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const next: Errors = {};
    if (!name) next.name = "We need something to call you.";
    // Deliberately permissive. Strict email regexes reject valid addresses far
    // more often than they catch typos; the send attempt is the real test.
    if (!email || !/^\S+@\S+\.\S+$/.test(email))
      next.email = "That doesn't look like an email address we could reply to.";
    if (message.length < 10)
      next.message = "A sentence or two, so we can give you a useful answer.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setBusy(true);
    // BACKEND: POST { name, email, topic, message } here.
    await new Promise((r) => setTimeout(r, 600));
    setBusy(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-[1.75rem] border border-line bg-surface p-8 shadow-tight">
        <span
          aria-hidden
          className="grid h-12 w-12 place-items-center rounded-2xl bg-green/15"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              stroke="var(--color-green)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h2 className="mt-5 text-xl font-semibold tracking-[-0.02em] text-ink">
          That's with us.
        </h2>
        <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-70">
          You'll get a reply within one working day, to the address you gave us.
          If it's urgent and about your child, email{" "}
          <a
            href="mailto:safeguarding@theprimer.app"
            className="font-medium text-indigo underline underline-offset-4"
          >
            safeguarding@theprimer.app
          </a>{" "}
          and it gets read sooner.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-6 text-[0.875rem] font-medium text-ink-70 underline underline-offset-4 hover:text-ink"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="rounded-[1.75rem] border border-line bg-surface p-6 shadow-tight sm:p-8"
    >
      <h2 className="text-xl font-semibold tracking-[-0.02em] text-ink">
        Send us a message
      </h2>

      <fieldset className="mt-6">
        <legend className="text-[0.875rem] font-medium text-ink">
          What's it about?
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <label
              key={t.value}
              className={cn(
                "cursor-pointer rounded-full border px-4 py-2 text-[0.875rem] font-medium transition-all",
                topic === t.value
                  ? "border-indigo bg-indigo text-white shadow-tight"
                  : "border-line-strong bg-base text-ink-70 hover:border-ink/25 hover:text-ink",
              )}
            >
              <input
                type="radio"
                name="topic"
                value={t.value}
                checked={topic === t.value}
                onChange={() => setTopic(t.value)}
                className="sr-only"
              />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      <Field
        name="name"
        label="Your name"
        autoComplete="name"
        error={errors.name}
      />
      <Field
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email}
      />
      <Field
        name="message"
        label="Message"
        multiline
        error={errors.message}
      />

      <button
        type="submit"
        disabled={busy}
        className="mt-7 w-full rounded-xl bg-indigo px-6 py-3.5 text-[0.9375rem] font-semibold text-white shadow-[0_2px_10px_rgba(61,78,232,0.35)] transition-all hover:bg-indigo-hi active:scale-[0.99] disabled:opacity-60"
      >
        {busy ? "Sending…" : "Send message"}
      </button>

      <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-45">
        We use this to answer you and nothing else. Please don't include your
        child's full name or school.
      </p>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  autoComplete,
  multiline = false,
  error,
}: {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  multiline?: boolean;
  error?: string;
}) {
  const id = `contact-${name}`;
  const errId = `${id}-error`;

  const classes = cn(
    "mt-2 w-full rounded-xl border bg-base px-4 py-3 text-[0.9375rem] text-ink outline-none transition-colors placeholder:text-ink-45",
    "focus:border-indigo focus:ring-2 focus:ring-indigo/20",
    error ? "border-rose" : "border-line-strong",
  );

  return (
    <div className="mt-5">
      <label htmlFor={id} className="text-[0.875rem] font-medium text-ink">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          rows={5}
          aria-invalid={!!error}
          aria-describedby={error ? errId : undefined}
          className={cn(classes, "resize-y")}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? errId : undefined}
          className={classes}
        />
      )}
      {error && (
        <p id={errId} className="mt-1.5 text-[0.8125rem] text-rose">
          {error}
        </p>
      )}
    </div>
  );
}
