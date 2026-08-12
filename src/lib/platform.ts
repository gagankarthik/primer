/**
 * PLATFORM FIXTURES
 *
 * What admin and studio read until there is a backend. Deliberately not
 * flattering: a real safety queue has one genuine escalation and four false
 * positives, and a real review queue has a submission that has been waiting
 * eleven days. A demo where everything is green teaches you nothing about
 * whether the screen works.
 */

/* ------------------------------------------------------------------ admin */

export type FlagSeverity = "escalate" | "watch" | "cleared";

export type SafetyFlag = {
  id: string;
  at: string;
  /** Never a name. The queue works on pseudonyms until an escalation opens it. */
  learnerRef: string;
  ageYears: number;
  module: string;
  /** Why the classifier stopped on it. */
  reason: string;
  /** The exchange, redacted to the matched turn. */
  excerpt: string;
  severity: FlagSeverity;
  /** Whether a human has looked at it. */
  reviewed: boolean;
};

export const SAFETY_FLAGS: SafetyFlag[] = [
  {
    id: "f-1041",
    at: "2026-08-11T18:42:00Z",
    learnerRef: "L-8842",
    ageYears: 7,
    module: "Blending into words",
    reason: "Distress language, repeated across two sessions",
    excerpt: "“im stupid i cant do it everyone at school can do it”",
    severity: "escalate",
    reviewed: false,
  },
  {
    id: "f-1040",
    at: "2026-08-11T17:05:00Z",
    learnerRef: "L-2210",
    ageYears: 9,
    module: "Times tables",
    reason: "Possible personal detail volunteered",
    excerpt: "“my mums phone is [redacted at capture]”",
    severity: "watch",
    reviewed: false,
  },
  {
    id: "f-1039",
    at: "2026-08-10T19:20:00Z",
    learnerRef: "L-5517",
    ageYears: 6,
    module: "Counting to 20",
    reason: "Off-topic question about a news event",
    excerpt: "“is the world going to end”",
    severity: "watch",
    reviewed: true,
  },
  {
    id: "f-1038",
    at: "2026-08-10T08:15:00Z",
    learnerRef: "L-9034",
    ageYears: 8,
    module: "Rhyme and pattern",
    reason: "Profanity, single instance, spelled phonetically",
    excerpt: "“this is so [word] boring”",
    severity: "cleared",
    reviewed: true,
  },
  {
    id: "f-1037",
    at: "2026-08-09T16:48:00Z",
    learnerRef: "L-1180",
    ageYears: 10,
    module: "Sharing out",
    reason: "Classifier matched on a maths word, likely false positive",
    excerpt: "“i want to kill this question”",
    severity: "cleared",
    reviewed: true,
  },
];

export type SubmissionStatus = "waiting" | "changes" | "approved" | "live";

export type Submission = {
  id: string;
  title: string;
  creator: string;
  group: "numbers" | "arithmetic" | "letters";
  ages: [number, number];
  minutes: number;
  submittedAt: string;
  /** Days it has been sitting. The number a review queue is judged on. */
  waitingDays: number;
  status: SubmissionStatus;
  lessons: number;
  checks: number;
  /** Set when a reviewer has asked for something. */
  note?: string;
};

export const SUBMISSIONS: Submission[] = [
  {
    id: "s-214",
    title: "Doubling and halving",
    creator: "Priya Nadar",
    group: "arithmetic",
    ages: [7, 9],
    minutes: 5,
    submittedAt: "2026-07-31",
    waitingDays: 11,
    status: "waiting",
    lessons: 4,
    checks: 4,
  },
  {
    id: "s-213",
    title: "Silent letters",
    creator: "Tom Ellery",
    group: "letters",
    ages: [8, 11],
    minutes: 6,
    submittedAt: "2026-08-06",
    waitingDays: 5,
    status: "waiting",
    lessons: 3,
    checks: 3,
  },
  {
    id: "s-212",
    title: "Counting in fives",
    creator: "Priya Nadar",
    group: "numbers",
    ages: [5, 7],
    minutes: 4,
    submittedAt: "2026-08-02",
    waitingDays: 9,
    status: "changes",
    lessons: 3,
    checks: 3,
    note: "Two checks give the answer away in the question. Rewrite and resubmit.",
  },
  {
    id: "s-211",
    title: "Odd and even",
    creator: "Marcus Bly",
    group: "numbers",
    ages: [6, 8],
    minutes: 4,
    submittedAt: "2026-07-28",
    waitingDays: 0,
    status: "approved",
    lessons: 4,
    checks: 4,
  },
  {
    id: "s-209",
    title: "Word endings",
    creator: "Tom Ellery",
    group: "letters",
    ages: [7, 10],
    minutes: 5,
    submittedAt: "2026-07-14",
    waitingDays: 0,
    status: "live",
    lessons: 4,
    checks: 4,
  },
];

export type AccountRow = {
  id: string;
  name: string;
  email: string;
  role: "parent" | "creator" | "admin";
  learners: number;
  plan: "Free" | "Family" | "Household" | "—";
  joined: string;
  status: "active" | "suspended" | "invited";
};

export const ACCOUNTS: AccountRow[] = [
  { id: "a-1", name: "Sarah Reid", email: "sarah@example.com", role: "parent", learners: 2, plan: "Family", joined: "2026-05-02", status: "active" },
  { id: "a-2", name: "Priya Nadar", email: "priya@example.com", role: "creator", learners: 0, plan: "—", joined: "2026-03-19", status: "active" },
  { id: "a-3", name: "Tom Ellery", email: "tom@example.com", role: "creator", learners: 0, plan: "—", joined: "2026-04-08", status: "active" },
  { id: "a-4", name: "Dan Okafor", email: "dan@example.com", role: "parent", learners: 4, plan: "Household", joined: "2026-06-11", status: "active" },
  { id: "a-5", name: "Marcus Bly", email: "marcus@example.com", role: "creator", learners: 0, plan: "—", joined: "2026-02-27", status: "suspended" },
  { id: "a-6", name: "Ana Ruiz", email: "ana@example.com", role: "parent", learners: 1, plan: "Free", joined: "2026-08-04", status: "active" },
  { id: "a-7", name: "J. Whitfield", email: "jw@example.com", role: "admin", learners: 0, plan: "—", joined: "2026-01-15", status: "active" },
  { id: "a-8", name: "Leah Cross", email: "leah@example.com", role: "parent", learners: 2, plan: "Family", joined: "2026-07-22", status: "invited" },
];

export const PLATFORM = {
  households: 1284,
  learners: 2117,
  sessionsThisWeek: 9432,
  /** The one number that decides whether the product works at all. */
  medianHelpRung: 2.1,
  medianHelpRungLastMonth: 2.6,
  mrr: 18_640,
  mrrLastMonth: 16_980,
  liveModules: 9,
  /** Minutes. A safety queue is judged on how fast a human gets there. */
  medianTimeToReviewFlag: 34,
};

/* ----------------------------------------------------------------- studio */

export type DraftStatus = "draft" | "waiting" | "changes" | "live";

export type CreatorCourse = {
  id: string;
  title: string;
  kidTitle: string;
  group: "numbers" | "arithmetic" | "letters";
  tone: "indigo" | "green" | "amber" | "rose";
  ages: [number, number];
  minutes: number;
  status: DraftStatus;
  lessons: number;
  checks: number;
  updatedAt: string;
  /** Live only. Aggregated across every household, never per child. */
  stats?: {
    learners: number;
    /** Average help rung. The number a creator should be optimising. */
    medianHelpRung: number;
    /** Share who finish without dropping to rung 4 or worse. */
    independentPct: number;
    /** The check most children get wrong first time. The thing to fix. */
    stickiestCheck: string;
    stickiestWrongPct: number;
  };
  note?: string;
};

export const CREATOR_COURSES: CreatorCourse[] = [
  {
    id: "c-word-endings",
    title: "Word endings",
    kidTitle: "How words finish",
    group: "letters",
    tone: "amber",
    ages: [7, 10],
    minutes: 5,
    status: "live",
    lessons: 4,
    checks: 4,
    updatedAt: "2026-07-14",
    stats: {
      learners: 412,
      medianHelpRung: 1.8,
      independentPct: 71,
      stickiestCheck: "Which ending makes it mean more than one?",
      stickiestWrongPct: 46,
    },
  },
  {
    id: "c-silent-letters",
    title: "Silent letters",
    kidTitle: "Letters that hide",
    group: "letters",
    tone: "rose",
    ages: [8, 11],
    minutes: 6,
    status: "waiting",
    lessons: 3,
    checks: 3,
    updatedAt: "2026-08-06",
  },
  {
    id: "c-counting-fives",
    title: "Counting in fives",
    kidTitle: "Counting in fives",
    group: "numbers",
    tone: "indigo",
    ages: [5, 7],
    minutes: 4,
    status: "changes",
    lessons: 3,
    checks: 3,
    updatedAt: "2026-08-02",
    note: "Two checks give the answer away in the question. Rewrite and resubmit.",
  },
  {
    id: "c-number-lines",
    title: "Jumping on a number line",
    kidTitle: "Jumping along",
    group: "numbers",
    tone: "green",
    ages: [6, 8],
    minutes: 5,
    status: "draft",
    lessons: 2,
    checks: 1,
    updatedAt: "2026-08-10",
  },
];

export const PAYOUTS = {
  /** Paid per completed session, not per install or per minute. */
  ratePerSession: 0.04,
  sessionsThisMonth: 3_180,
  thisMonth: 127.2,
  lastMonth: 96.4,
  lifetime: 1_842.6,
  nextPayoutOn: "1 September 2026",
  history: [
    { month: "July 2026", sessions: 2410, amount: 96.4, status: "Paid" },
    { month: "June 2026", sessions: 1980, amount: 79.2, status: "Paid" },
    { month: "May 2026", sessions: 1355, amount: 54.2, status: "Paid" },
  ],
};

export function courseById(id: string) {
  return CREATOR_COURSES.find((c) => c.id === id);
}

/* ------------------------------------------------------------- timeseries */

/** Six months. Enough to see a trend, short enough to fit without a scrollbar. */
export const TRENDS = {
  learners: [
    { label: "Mar", value: 940 },
    { label: "Apr", value: 1180 },
    { label: "May", value: 1425 },
    { label: "Jun", value: 1690 },
    { label: "Jul", value: 1908 },
    { label: "Aug", value: 2117 },
  ],
  mrr: [
    { label: "Mar", value: 7420 },
    { label: "Apr", value: 9860 },
    { label: "May", value: 12_300 },
    { label: "Jun", value: 14_880 },
    { label: "Jul", value: 16_980 },
    { label: "Aug", value: 18_640 },
  ],
  /** The one that decides whether any of the above is durable. Lower is better. */
  helpRung: [
    { label: "Mar", value: 2.9 },
    { label: "Apr", value: 2.8 },
    { label: "May", value: 2.6 },
    { label: "Jun", value: 2.4 },
    { label: "Jul", value: 2.6 },
    { label: "Aug", value: 2.1 },
  ],
};

/**
 * Where sessions land on the scaffold ladder. The shape matters more than the
 * mean: a healthy platform is weighted to the left with a thin tail at 4 and 5.
 */
export const RUNG_SPREAD = [
  { rung: 0, label: "solved cold", sessions: 1840 },
  { rung: 1, label: "one nudge", sessions: 2960 },
  { rung: 2, label: "smaller bite", sessions: 2410 },
  { rung: 3, label: "worked part", sessions: 1290 },
  { rung: 4, label: "walked through", sessions: 640 },
  { rung: 5, label: "told", sessions: 292 },
];

/** Plan mix across households. */
export const PLAN_MIX = [
  { label: "Free", value: 712, tone: "grey" as const },
  { label: "Family, $15", value: 431, tone: "indigo" as const },
  { label: "Household, $29", value: 141, tone: "green" as const },
];
