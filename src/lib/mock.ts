import { emptyProfile, type LearnerProfile, type ScaffoldRung } from "./profile";

/**
 * UI-phase fixtures. Nothing here talks to a model or a database, every
 * screen renders from this file so the design can be reviewed without
 * credentials. See docs/BACKEND-PLAN.md for what replaces it.
 *
 * The numbers are deliberately unflattering in places. A fixture set where
 * every child is thriving hides exactly the states the UI most needs to
 * handle well: the frustrated session, the topic going backwards, the week
 * with one login.
 */

export interface MockTurn {
  id: string;
  speaker: "primer" | "child";
  text: string;
  /** Rung the Primer was operating at when it said this. */
  rung?: ScaffoldRung;
}

export interface MockSession {
  id: string;
  date: string;
  topic: string;
  minutes: number;
  /** Rung per exchange, in order. The descent trace renders this directly. */
  rungTrace: ScaffoldRung[];
  turns: MockTurn[];
}

export interface MockChild {
  profile: LearnerProfile;
  sessions: MockSession[];
  /** The single written observation that leads the parent dashboard. */
  headline: { tone: "good" | "watch"; text: string };
}

// ---------------------------------------------------------------------------
// Nell, 6, the voice-first MVP persona.
// ---------------------------------------------------------------------------

const nellProfile = emptyProfile("nell", "Nell", {
  ageYears: 6,
  gradeLabel: "Year 1",
  subjects: ["reading", "number"],
  goals: ["read a chapter book alone"],
  interests: ["dinosaurs", "her dog Biscuit", "building things"],
  confidence: "high",
});

nellProfile.cognitive = {
  topics: {
    "counting-to-20": { mastery: 0.92, bloom: "apply", attempts: 14, lastSeen: "2026-08-09", confidence: "high" },
    "letter-sounds": { mastery: 0.78, bloom: "apply", attempts: 22, lastSeen: "2026-08-11", confidence: "high" },
    "blending-cvc": { mastery: 0.41, bloom: "understand", attempts: 9, lastSeen: "2026-08-11", confidence: "medium" },
    "adding-within-10": { mastery: 0.35, bloom: "remember", attempts: 6, lastSeen: "2026-08-10", confidence: "medium" },
  },
  medianSolveRung: 2,
  confidence: "medium",
};

nellProfile.behavioral = {
  sessionsLast30d: 17,
  medianSessionMinutes: 9,
  activeHours: [17, 18, 8],
  medianTurnsPerSession: 11,
  confidence: "high",
};

nellProfile.emotional = {
  state: "struggling",
  frustrationStreak: 2,
  tenderTopics: ["blending-cvc"],
  confidence: "medium",
};

nellProfile.metacognitive = {
  style: "explorer",
  asksWhy: true,
  selfCorrects: false,
  confidence: "low",
};

nellProfile.milestones = [
  { id: "m1", at: "2026-06-14", topic: "counting-to-20", text: "the day you counted all the way to twenty without stopping once" },
  { id: "m2", at: "2026-07-02", topic: "letter-sounds", text: "when you worked out that 'sh' makes one sound, not two" },
];

export const nell: MockChild = {
  profile: nellProfile,
  headline: {
    tone: "watch",
    text: "Nell asked to just be told the answer three times this week, all of them on blending sounds into words. She got there each time, but she needed more help than usual to do it.",
  },
  sessions: [
    {
      id: "s1",
      date: "2026-08-11",
      topic: "blending-cvc",
      minutes: 11,
      rungTrace: [0, 1, 2, 3, 3, 4, 2, 1],
      turns: [
        { id: "t1", speaker: "primer", rung: 0, text: "Biscuit is sitting on something. C, A, T. What do you think it is?" },
        { id: "t2", speaker: "child", text: "um... I don't know" },
        { id: "t3", speaker: "primer", rung: 1, text: "That's alright. Let's just take the first one. What sound does C make?" },
        { id: "t4", speaker: "child", text: "kuh" },
        { id: "t5", speaker: "primer", rung: 1, text: "That's it. Now hold onto that sound and add the next one. Kuh, a." },
        { id: "t6", speaker: "child", text: "kuh a... ka?" },
        { id: "t7", speaker: "primer", rung: 2, text: "Good. Now say it slowly and let it run together like water. Ka, t." },
        { id: "t8", speaker: "child", text: "cat! Biscuit is sitting on a cat!" },
      ],
    },
    { id: "s2", date: "2026-08-10", topic: "adding-within-10", minutes: 8, rungTrace: [0, 1, 2, 2, 1, 0], turns: [] },
    { id: "s3", date: "2026-08-08", topic: "letter-sounds", minutes: 12, rungTrace: [0, 0, 1, 0, 0], turns: [] },
    { id: "s4", date: "2026-08-07", topic: "blending-cvc", minutes: 6, rungTrace: [1, 2, 3, 4, 5, 4], turns: [] },
  ],
};

// ---------------------------------------------------------------------------
// Harv, 12, the text-first older band. Same product, different surface.
// ---------------------------------------------------------------------------

const harvProfile = emptyProfile("harv", "Harv", {
  ageYears: 12,
  gradeLabel: "Year 7",
  subjects: ["algebra", "physical science", "ethics"],
  goals: ["stop panicking in tests"],
  interests: ["taking things apart", "cycling", "arguing"],
  confidence: "high",
});

harvProfile.cognitive = {
  topics: {
    "linear-equations": { mastery: 0.81, bloom: "analyze", attempts: 31, lastSeen: "2026-08-11", confidence: "high" },
    "fractions-to-decimals": { mastery: 0.88, bloom: "apply", attempts: 19, lastSeen: "2026-08-05", confidence: "high" },
    "negative-numbers": { mastery: 0.52, bloom: "understand", attempts: 12, lastSeen: "2026-08-11", confidence: "high" },
  },
  medianSolveRung: 1,
  confidence: "high",
};

harvProfile.behavioral = {
  sessionsLast30d: 9,
  medianSessionMinutes: 24,
  activeHours: [20, 21],
  medianTurnsPerSession: 19,
  confidence: "high",
};

harvProfile.emotional = { state: "energised", frustrationStreak: 0, tenderTopics: [], confidence: "high" };
harvProfile.metacognitive = { style: "systematic", asksWhy: true, selfCorrects: true, confidence: "medium" };
harvProfile.milestones = [
  { id: "m3", at: "2026-05-20", topic: "fractions-to-decimals", text: "the week fractions stopped being frightening" },
];

export const harv: MockChild = {
  profile: harvProfile,
  headline: {
    tone: "good",
    text: "Harv is now solving linear equations at the first hint, a year ago he needed the problem set up for him. He has started asking why the method works, which is new.",
  },
  sessions: [
    {
      id: "h1",
      date: "2026-08-11",
      topic: "negative-numbers",
      minutes: 26,
      rungTrace: [0, 1, 1, 2, 1, 0, 0, 1, 0],
      turns: [
        { id: "u1", speaker: "primer", rung: 0, text: "You said subtracting a negative feels like a trick. Say more about that, what makes it feel like a trick rather than a rule?" },
        { id: "u2", speaker: "child", text: "because taking something away should make it smaller. but it gets bigger. so someone just decided that" },
        { id: "u3", speaker: "primer", rung: 1, text: "That's a fair objection, and it's the right one to press on. You owe me £5. I tear up the note. What happened to what you have?" },
        { id: "u4", speaker: "child", text: "i have more. because the debt went away" },
        { id: "u5", speaker: "primer", rung: 1, text: "So what did I take away, and which direction did it move you?" },
        { id: "u6", speaker: "child", text: "you took away a negative and it moved me up. ok. so it's not a trick, the thing being removed was already pointing down" },
      ],
    },
    { id: "h2", date: "2026-08-09", topic: "linear-equations", minutes: 22, rungTrace: [0, 0, 1, 0, 0, 0], turns: [] },
    { id: "h3", date: "2026-08-04", topic: "negative-numbers", minutes: 31, rungTrace: [1, 2, 3, 2, 3, 2, 1], turns: [] },
  ],
};

export const CHILDREN: Record<string, MockChild> = { nell, harv };
export const CHILD_LIST = [nell, harv];

export function getChild(id: string): MockChild | undefined {
  return CHILDREN[id];
}
