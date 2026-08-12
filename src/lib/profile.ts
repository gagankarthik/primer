/**
 * The 5-dimensional learner profile.
 *
 * Design note: only two of these five dimensions carry trustworthy signal from
 * day one, cognitive and contextual. Behavioral needs ~2 weeks of sessions
 * before its numbers mean anything, emotional is inferred from text and is the
 * noisiest of the five, and metacognitive needs ~20 sessions. We store all five
 * so the model can use whatever is real, and every field carries a `confidence`
 * so neither the tutor prompt nor the parent dashboard presents a guess as a
 * measurement. See docs/ANALYSIS.md § "The 5D profile is three dimensions of
 * marketing wearing two dimensions of signal".
 */

export type Confidence = "none" | "low" | "medium" | "high";

/** Bloom's taxonomy, ordered. The tutor aims one rung above current level. */
export const BLOOM_LEVELS = [
  "remember",
  "understand",
  "apply",
  "analyze",
  "evaluate",
  "create",
] as const;
export type BloomLevel = (typeof BLOOM_LEVELS)[number];

/**
 * The scaffold ladder. This is the heart of the Socratic engine.
 *
 * "Never give the answer" is a purity test, not a pedagogy. A child who is
 * genuinely stuck and gets a fourth question instead of help learns that the
 * Primer is a thing that withholds. They stop asking. Churn follows.
 *
 * So: descend the ladder rather than refusing. Every rung still ends in the
 * child doing the thinking; the rungs differ in how much structure we hand
 * over first. Rung 5 tells them outright, and then immediately hands back a
 * twin problem, so the telling is a loan, not a gift.
 */
export const SCAFFOLD_RUNGS = [
  {
    rung: 0,
    name: "open",
    intent: "Find out what they already know. Ask one open question.",
  },
  {
    rung: 1,
    name: "narrow",
    intent:
      "Narrow to the specific step they are stuck on. Ask about that step only.",
  },
  {
    rung: 2,
    name: "concretize",
    intent:
      "Swap the abstraction for something physical they can picture or count.",
  },
  {
    rung: 3,
    name: "structure",
    intent:
      "Set up the problem for them, state the parts, and let them do the final move.",
  },
  {
    rung: 4,
    name: "parallel",
    intent:
      "Fully work a DIFFERENT but structurally identical problem, then hand theirs back.",
  },
  {
    rung: 5,
    name: "tell",
    intent:
      "Explain the answer plainly and warmly. Then immediately pose a twin problem so they use it.",
  },
] as const;

export type ScaffoldRung = 0 | 1 | 2 | 3 | 4 | 5;

/** What the child knows, and how deeply. */
export interface CognitiveProfile {
  /** topic slug -> mastery estimate */
  topics: Record<
    string,
    {
      mastery: number; // 0..1
      bloom: BloomLevel;
      attempts: number;
      lastSeen: string; // ISO
      confidence: Confidence;
    }
  >;
  /**
   * Median scaffold rung reached before the child solves it. THIS is the
   * headline cognitive metric, not mastery%. A child who solves at rung 1 is
   * reasoning; a child who solves the same topic at rung 4 is pattern-matching.
   * Mastery% cannot tell those apart. This can.
   */
  medianSolveRung: number | null;
  confidence: Confidence;
}

/** When and how they show up. Needs ~2 weeks of data to mean anything. */
export interface BehavioralProfile {
  sessionsLast30d: number;
  medianSessionMinutes: number | null;
  /** 0-23 local hours, most frequent first */
  activeHours: number[];
  /** Turns before the child disengages, our attention-span estimate. */
  medianTurnsPerSession: number | null;
  confidence: Confidence;
}

/**
 * Inferred from language, latency and give-up rate. The noisiest dimension,
 * we deliberately keep it coarse. A 3-bucket signal we can defend beats a
 * 0-100 "confidence score" we cannot.
 */
export interface EmotionalProfile {
  state: "struggling" | "steady" | "energised";
  /** Consecutive turns showing frustration markers. Drives the escape hatch. */
  frustrationStreak: number;
  /** Topics where frustration has repeatedly appeared. */
  tenderTopics: string[];
  confidence: Confidence;
}

/** How they prefer to learn. Slowest dimension to earn, ~20 sessions. */
export interface MetacognitiveProfile {
  style: "explorer" | "systematic" | "unknown";
  /** Do they ask "why" unprompted? Strong predictor of transfer. */
  asksWhy: boolean;
  /** Do they self-correct without being told they're wrong? */
  selfCorrects: boolean;
  confidence: Confidence;
}

/** Ground truth supplied by the parent. Always high confidence. */
export interface ContextualProfile {
  ageYears: number;
  gradeLabel: string;
  subjects: string[];
  goals: string[];
  /** Free text from the parent: interests, characters, what lights them up. */
  interests: string[];
  confidence: Confidence;
}

export interface LearnerProfile {
  childId: string;
  displayName: string;
  cognitive: CognitiveProfile;
  behavioral: BehavioralProfile;
  emotional: EmotionalProfile;
  metacognitive: MetacognitiveProfile;
  contextual: ContextualProfile;
  /** Durable, human-readable milestones. Powers the "remember when" moment. */
  milestones: Milestone[];
  updatedAt: string;
}

export interface Milestone {
  id: string;
  at: string; // ISO
  topic: string;
  /** Written for the CHILD to hear read back to them months later. */
  text: string;
}

export function emptyProfile(
  childId: string,
  displayName: string,
  contextual: ContextualProfile,
): LearnerProfile {
  return {
    childId,
    displayName,
    cognitive: { topics: {}, medianSolveRung: null, confidence: "none" },
    behavioral: {
      sessionsLast30d: 0,
      medianSessionMinutes: null,
      activeHours: [],
      medianTurnsPerSession: null,
      confidence: "none",
    },
    emotional: {
      state: "steady",
      frustrationStreak: 0,
      tenderTopics: [],
      confidence: "none",
    },
    metacognitive: {
      style: "unknown",
      asksWhy: false,
      selfCorrects: false,
      confidence: "none",
    },
    contextual,
    milestones: [],
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Confidence is earned by observation count, not asserted. Every dimension
 * uses the same ladder so "medium" means the same thing everywhere.
 */
export function confidenceFor(observations: number): Confidence {
  if (observations === 0) return "none";
  if (observations < 5) return "low";
  if (observations < 20) return "medium";
  return "high";
}

/**
 * Age band drives voice-vs-text, session length and vocabulary ceiling.
 *
 * The product is built for 5–11. Three bands rather than a per-year table
 * because the real differences cluster: whether they can read the question
 * themselves, whether they can hold a multi-step problem, and whether they can
 * be asked to justify an answer.
 */
export function ageBand(age: number): "5-7" | "8-9" | "10-11" {
  if (age <= 7) return "5-7";
  if (age <= 9) return "8-9";
  return "10-11";
}
