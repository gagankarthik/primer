"use client";

import { useState } from "react";
import { Panel, Row, Switch } from "@/components/parent/Layout";
import { cn } from "@/components/ui/cn";

/**
 * The editable half of the profile page. Local state only until the API lands.
 *
 * Read-only until you press Edit, rather than a permanently live form. A page
 * of always-editable inputs invites accidental changes and gives no signal that
 * anything was saved; a form with an explicit edit mode does both jobs.
 */

const EMAILS = [
  {
    key: "weekly",
    label: "The weekly summary",
    hint: "One email on Sunday evening: the single sentence, and what it was based on.",
    on: true,
  },
  {
    key: "flag",
    label: "When something needs you",
    hint: "A child stuck on the same thing repeatedly, or a session we thought you should see. Rare, and never marketing.",
    on: true,
  },
  {
    key: "product",
    label: "New modules and changes",
    hint: "When we add something, roughly once a month.",
    on: false,
  },
];

export function ProfileForm() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Sarah Reid");
  const [email, setEmail] = useState("sarah@example.com");
  const [emails, setEmails] = useState(
    () => new Set(EMAILS.filter((e) => e.on).map((e) => e.key)),
  );

  return (
    <>
      <Panel
        title="About you"
        blurb="The name a child sees when you approve something, and the address every summary goes to."
      >
        {editing ? (
          <div className="space-y-5">
            <Field label="Your name" value={name} onChange={setName} autoComplete="name" />
            <Field
              label="Email"
              value={email}
              onChange={setEmail}
              type="email"
              autoComplete="email"
              hint="Changing this sends a confirmation link to the new address. The old one keeps working until you use it."
            />
            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-lg bg-ink px-4 py-2 text-[0.875rem] font-medium text-white hover:bg-ink/88"
              >
                Save changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-lg px-4 py-2 text-[0.875rem] font-medium text-ink-45 hover:text-ink"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <Row label="Name" hint={name} />
            <Row label="Email" hint={email}>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="rounded-lg border border-line-strong bg-base px-4 py-2 text-[0.875rem] font-medium text-ink shadow-tight hover:border-ink/25"
              >
                Edit
              </button>
            </Row>
          </>
        )}
      </Panel>

      <Panel
        title="What we send you"
        blurb="Three kinds of email, and nothing else. There is no promotional list to be quietly added to."
        className="mt-6"
      >
        {EMAILS.map((e) => {
          const on = emails.has(e.key);
          return (
            <Row key={e.key} label={e.label} hint={e.hint}>
              <Switch
                checked={on}
                label={e.label}
                onChange={() =>
                  setEmails((cur) => {
                    const next = new Set(cur);
                    if (next.has(e.key)) next.delete(e.key);
                    else next.add(e.key);
                    return next;
                  })
                }
              />
            </Row>
          );
        })}
      </Panel>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  hint?: string;
}) {
  const id = `profile-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div>
      <label htmlFor={id} className="text-[0.875rem] font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-line-strong bg-base px-4 py-3 text-[0.9375rem] text-ink outline-none transition-colors focus:border-indigo focus:ring-2 focus:ring-indigo/20"
      />
      {hint && (
        <p className="mt-1.5 text-[0.8125rem] leading-snug text-ink-45">{hint}</p>
      )}
    </div>
  );
}
