"use client";

import { useState } from "react";
import { Panel, Row, Switch } from "@/components/parent/Layout";
import { cn } from "@/components/ui/cn";
import { MODULES } from "@/lib/modules";

/**
 * SETTINGS PANELS
 *
 * State is local. There is no backend yet, so every control here is real and
 * interactive but nothing persists past a refresh; each panel notes where the
 * write goes when the API lands.
 *
 * The one rule this page follows throughout: never present a setting whose
 * effect we cannot describe in a sentence. A toggle labelled "Enhanced mode"
 * is worse than no toggle, because the parent now has to decide something they
 * have not been given the means to decide.
 */

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function SettingsPanels({
  childName,
  ageYears,
}: {
  childName: string;
  ageYears: number;
}) {
  return (
    <div className="space-y-6">
      <HoursPanel childName={childName} />
      <VoicePanel childName={childName} ageYears={ageYears} />
      <BlockedTopicsPanel childName={childName} />
      <PinPanel />
      <DataPanel childName={childName} />
    </div>
  );
}

/* ------------------------------------------------------------------ hours */

function HoursPanel({ childName }: { childName: string }) {
  const [days, setDays] = useState<string[]>(DAYS.slice(0, 5));
  const [from, setFrom] = useState("16:00");
  const [to, setTo] = useState("19:00");
  const [cap, setCap] = useState(20);

  return (
    <Panel
      title="When it opens, and for how long"
      blurb={`Outside these hours the Primer tells ${childName} it's closed rather than pretending to be broken. Children work out that a broken app might work if they keep trying.`}
    >
      <Row label="Days" hint="Tap to include or exclude.">
        <div className="flex flex-wrap gap-1.5">
          {DAYS.map((d) => {
            const on = days.includes(d);
            return (
              <button
                key={d}
                type="button"
                aria-pressed={on}
                onClick={() =>
                  setDays((cur) =>
                    cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d],
                  )
                }
                className={cn(
                  "h-9 w-11 rounded-lg text-[0.8125rem] font-medium transition-colors",
                  on
                    ? "bg-ink text-white"
                    : "bg-grey-tint text-ink-45 hover:text-ink",
                )}
              >
                {d}
              </button>
            );
          })}
        </div>
      </Row>

      <Row label="Window" hint="The Primer opens and closes at these times.">
        <div className="flex items-center gap-2">
          <TimeInput value={from} onChange={setFrom} label="Opens at" />
          <span className="text-ink-45">to</span>
          <TimeInput value={to} onChange={setTo} label="Closes at" />
        </div>
      </Row>

      <Row
        label="Daily cap"
        hint="It winds the session down before the cap rather than cutting off mid-question."
      >
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={5}
            max={60}
            step={5}
            value={cap}
            aria-label="Daily cap in minutes"
            onChange={(e) => setCap(Number(e.target.value))}
            className="w-40 accent-[var(--color-indigo)]"
          />
          <span className="figure-num w-16 text-[0.9375rem] font-medium text-ink">
            {cap} min
          </span>
        </div>
      </Row>
    </Panel>
  );
}

function TimeInput({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <input
      type="time"
      value={value}
      aria-label={label}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-line-strong bg-base px-3 py-2 text-[0.875rem] text-ink outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/20"
    />
  );
}

/* ------------------------------------------------------------------ voice */

function VoicePanel({
  childName,
  ageYears,
}: {
  childName: string;
  ageYears: number;
}) {
  const [readAloud, setReadAloud] = useState(ageYears <= 8);
  const [listen, setListen] = useState(true);

  return (
    <Panel
      title="Voice"
      blurb="Audio is turned into text on the way through and the recording is destroyed. We never store a voiceprint, and this is a contract term rather than a setting you could accidentally turn off."
    >
      <Row
        label="Read questions aloud"
        hint={
          ageYears <= 8
            ? "On by default at this age, so reading ability doesn't cap what they can attempt."
            : "Off by default at this age. Turn it on if reading is the harder part."
        }
      >
        <Switch checked={readAloud} onChange={setReadAloud} label="Read questions aloud" />
      </Row>
      <Row
        label={`Let ${childName} answer by speaking`}
        hint="Typing stays available either way."
      >
        <Switch checked={listen} onChange={setListen} label="Answer by speaking" />
      </Row>
    </Panel>
  );
}

/* --------------------------------------------------------- blocked topics */

function BlockedTopicsPanel({ childName }: { childName: string }) {
  const [blocked, setBlocked] = useState<string[]>([]);

  return (
    <Panel
      title="Modules to keep out of the way"
      blurb={`Blocked modules don't appear on ${childName}'s screen and won't be suggested. Useful when school is covering something a different way and two methods at once would confuse them.`}
    >
      <ul className="flex flex-wrap gap-2">
        {MODULES.map((m) => {
          const off = blocked.includes(m.id);
          return (
            <li key={m.id}>
              <button
                type="button"
                aria-pressed={off}
                onClick={() =>
                  setBlocked((cur) =>
                    cur.includes(m.id)
                      ? cur.filter((x) => x !== m.id)
                      : [...cur, m.id],
                  )
                }
                className={cn(
                  "rounded-full border px-3.5 py-2 text-[0.8125rem] font-medium transition-all",
                  off
                    ? "border-rose bg-rose/10 text-rose line-through"
                    : "border-line-strong bg-base text-ink-70 hover:border-ink/25 hover:text-ink",
                )}
              >
                {m.title}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-[0.8125rem] text-ink-45">
        {blocked.length === 0
          ? "Nothing blocked. All nine modules are available."
          : `${blocked.length} blocked, ${MODULES.length - blocked.length} available.`}
      </p>
    </Panel>
  );
}

/* -------------------------------------------------------------------- pin */

function PinPanel() {
  const [editing, setEditing] = useState(false);

  return (
    <Panel
      title="Your PIN"
      blurb="Four digits, asked for whenever someone tries to leave the child area or reach this page from a device a child uses."
    >
      {editing ? (
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            placeholder="New PIN"
            aria-label="New PIN"
            className="figure-num w-32 rounded-lg border border-line-strong bg-base px-3 py-2 tracking-[0.4em] text-ink outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/20"
          />
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-lg bg-ink px-4 py-2 text-[0.875rem] font-medium text-white hover:bg-ink/88"
          >
            Save PIN
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="text-[0.875rem] font-medium text-ink-45 hover:text-ink"
          >
            Cancel
          </button>
        </div>
      ) : (
        <Row label="PIN" hint="Last changed 3 weeks ago.">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-lg border border-line-strong bg-base px-4 py-2 text-[0.875rem] font-medium text-ink shadow-tight hover:border-ink/25"
          >
            Change PIN
          </button>
        </Row>
      )}
    </Panel>
  );
}

/* ------------------------------------------------------------------- data */

function DataPanel({ childName }: { childName: string }) {
  return (
    <Panel
      tone="warn"
      title="What we hold, and getting rid of it"
      blurb={`Transcripts and the learner profile for ${childName}. No audio, and nothing that has been used to train a model.`}
    >
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-lg border border-line-strong bg-base px-4 py-2 text-[0.875rem] font-medium text-ink shadow-tight hover:border-ink/25"
        >
          Download everything
        </button>
        <button
          type="button"
          className="rounded-lg border border-rose/40 bg-base px-4 py-2 text-[0.875rem] font-medium text-rose shadow-tight hover:bg-rose/5"
        >
          Delete {childName}&rsquo;s history
        </button>
      </div>
      <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-45">
        Deleting is immediate and cannot be undone. {childName} keeps their
        account and badges; what goes is the transcripts and everything the
        Primer had worked out about how they learn, so it starts over.
      </p>
    </Panel>
  );
}
