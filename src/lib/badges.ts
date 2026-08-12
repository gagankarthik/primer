/**
 * BADGES, the data.
 *
 * Every one of these is earned for a *behaviour*, never for volume. There is
 * no badge for minutes spent, questions answered, or days in a row of merely
 * showing up, those reward farming, and a child who learns to farm a streak
 * has learned the wrong lesson from a product whose entire thesis is that
 * shortcuts hollow you out.
 *
 * So: kept going after being stuck, asked why without being prompted, caught
 * their own mistake. These are the habits that transfer, and a child cannot
 * fake them without accidentally doing the real thing.
 *
 * Names are written to be read aloud to a six-year-old. "Stuck, then unstuck"
 * beats "Resilience Milestone", a child understands the first one, and it
 * describes something they can remember doing.
 *
 * WHY THIS IS ITS OWN FILE, and must stay that way:
 *
 * This used to live in components/Badge.tsx, which is `"use client"` because
 * the tile animates. Every export from a "use client" module becomes a client
 * *reference* when a server component imports it, not the value, so the parent
 * dashboard read `BADGES[kind].name` off a stub and threw
 * "Cannot read properties of undefined". The dashboard rendered as a 500 and
 * the cause was invisible, because the import looked completely ordinary.
 *
 * Data that both server and client components need cannot live in a client
 * module. Keep the objects here and the components there.
 */

export type BadgeKind =
  | "first-word"
  | "asked-why"
  | "climbed-back"
  | "own-mistake"
  | "no-help"
  | "long-haul";

export const BADGES: Record<
  BadgeKind,
  { name: string; earnedFor: string; blurb: string }
> = {
  "first-word": {
    name: "First word read",
    earnedFor: "Blending sounds into a whole word without help",
    blurb: "You put the sounds together and made a word.",
  },
  "asked-why": {
    name: "Wanted to know why",
    earnedFor: "Asking why something works, unprompted",
    blurb: "Nobody asked you to ask. You asked anyway.",
  },
  "climbed-back": {
    name: "Stuck, then unstuck",
    earnedFor: "Solving it after needing help down to rung 4",
    blurb: "It got hard and you stayed anyway.",
  },
  "own-mistake": {
    name: "Caught it yourself",
    earnedFor: "Spotting your own error before being told",
    blurb: "You checked your work and found the wobble.",
  },
  "no-help": {
    name: "Did it on your own",
    earnedFor: "Solving at rung 0, a bare question, nothing more",
    blurb: "One question was all you needed.",
  },
  "long-haul": {
    name: "Came back to a hard one",
    earnedFor: "Returning to a topic that frustrated you before",
    blurb: "You came back to the thing that beat you.",
  },
};

/** Tile colours, kept next to the data they describe. */
export const BADGE_TONE: Record<BadgeKind, { fg: string; bg: string }> = {
  "first-word": { fg: "#3D4EE8", bg: "#EEF1FE" },
  "asked-why": { fg: "#3D4EE8", bg: "#EEF1FE" },
  "climbed-back": { fg: "#12B981", bg: "#E6F7F1" },
  "long-haul": { fg: "#12B981", bg: "#E6F7F1" },
  "own-mistake": { fg: "#B26A00", bg: "#FDF3E3" },
  "no-help": { fg: "#0B1220", bg: "#F2F4F7" },
};

/* ------------------------------------------------------------------ ranks */

/**
 * RANKS
 *
 * Five rungs a child climbs by earning badges. Badges say what you did once;
 * a rank says who you have become by doing it repeatedly, and that is the part
 * a six-year-old repeats out loud to a parent.
 *
 * Two rules keep this from becoming the streak mechanic the whole product
 * exists to avoid:
 *
 *  1. Ranks are earned only from badges, and every badge is behavioural. There
 *     is no rank for minutes, sessions, days in a row, or questions answered.
 *     A child cannot climb this ladder by turning up; they can only climb it
 *     by getting stuck and carrying on, asking why, or catching their own
 *     mistake.
 *  2. A rank can never be lost. Nothing here decays, expires, or resets on a
 *     missed day. A ladder you can fall down teaches a child to protect a
 *     number instead of to think, and it punishes the week they were ill.
 *
 * The artwork is from public/badges: flat vector medallions that hold up at
 * 72px, which the earlier hand-drawn gradient medallions did not. The shapes
 * escalate deliberately, plain shield through to rosette, so a child can see
 * the ladder is a ladder without being able to read the names.
 */
export type Rank = {
  level: number;
  /** Said out loud to a parent, so it names a person rather than a tier. */
  title: string;
  /** Badges needed to reach it. */
  needs: number;
  /** File in /public/badges, without the extension. */
  art: string;
  /**
   * Ink for the level numeral drawn over the medallion. The artwork is a
   * blank shape, so it needs a value that has contrast against that specific
   * shape's centre; a single colour would vanish on two of the five.
   */
  ink: string;
  /** What earning it says about them. Written to be read to a five-year-old. */
  says: string;
};

export const RANKS: Rank[] = [
  {
    level: 1,
    title: "Have-a-go",
    needs: 0,
    art: "18",
    ink: "#3D4EE8",
    says: "You started. That is the hard bit.",
  },
  {
    level: 2,
    title: "Keeps Going",
    needs: 2,
    art: "29",
    ink: "#FFFFFF",
    says: "Things got tricky and you stayed anyway.",
  },
  {
    level: 3,
    title: "Own Checker",
    needs: 4,
    art: "42",
    ink: "#7A5400",
    says: "You look back at your work and find your own wobbles.",
  },
  {
    level: 4,
    title: "Why Asker",
    needs: 6,
    art: "49",
    ink: "#FFFFFF",
    says: "You want to know why things work, not just what to write.",
  },
  {
    level: 5,
    title: "Works It Out",
    needs: 9,
    art: "51",
    ink: "#6B4A00",
    says: "You get there on your own, from one question.",
  },
];

/** The rank a child currently holds. Never returns null: everyone starts at 1. */
export function rankFor(badgeCount: number): Rank {
  let current = RANKS[0];
  for (const r of RANKS) if (badgeCount >= r.needs) current = r;
  return current;
}

/** The next rung, and how many badges away it is. Null at the top. */
export function nextRank(
  badgeCount: number,
): { rank: Rank; remaining: number } | null {
  const next = RANKS.find((r) => badgeCount < r.needs);
  return next ? { rank: next, remaining: next.needs - badgeCount } : null;
}
