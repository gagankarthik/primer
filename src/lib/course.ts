import { MODULES, type LearningModule } from "@/lib/modules";

/**
 * THE COURSE MODEL
 *
 * A module is not a video with a test bolted on the end. It is a short loop,
 * run three or four times:
 *
 *     teach a single idea  ->  check it  ->  right: next idea
 *                                        ->  wrong: re-teach THAT idea
 *                                                   a different way, then ask
 *                                                   the same thing again
 *
 * The structure follows the standard training-module shape (objective, chunked
 * lessons, a knowledge check after each chunk, remediation on failure, a
 * summary) with three changes that matter for five-to-eleven-year-olds:
 *
 *  1. A wrong answer never advances and never ends the module. It rewinds to
 *     the lesson it came from, which is then re-taught with different words
 *     and a concrete prop. Being sent back to the start of a whole module for
 *     one wrong answer is a punishment, and children read it as one.
 *  2. There is no score. Nothing counts how many they got wrong, and nothing
 *     is shown at the end except what they can now do. A score turns the
 *     second attempt into a worse outcome than the first, which teaches
 *     children to guess safely rather than think.
 *  3. Every check is answerable by tapping. Typing is not the skill being
 *     assessed and a six-year-old's typing speed would dominate the result.
 *
 * `retry` is the whole reason this file exists. Re-showing the same words to a
 * child who just failed on them is the single most common mistake in
 * children's courseware: if the explanation had worked, they would not be here.
 */

export type Lesson = {
  kind: "lesson";
  id: string;
  /** The one idea. Written to be read aloud. */
  title: string;
  body: string;
  /** Shown as a manipulable prop rather than decoration. */
  visual: Visual;
};

export type Check = {
  kind: "check";
  id: string;
  /** The lesson this check tests, and the one it rewinds to. */
  teaches: string;
  question: string;
  options: { label: string; correct?: boolean }[];
  /** Said when they get it right. Names what they did, never "well done". */
  onCorrect: string;
  /**
   * Said when they get it wrong, then the lesson is re-taught using `retry`.
   * Never says "wrong", and never says "try again" without saying what to
   * try differently.
   */
  onWrong: string;
  /** The second explanation. Must not be a paraphrase of the first. */
  retry: { title: string; body: string; visual: Visual };
};

export type Step = Lesson | Check;

/** What the card draws. Kept as data so the child view stays declarative. */
export type Visual =
  | { type: "count"; total: number; filled: number }
  | { type: "groups"; left: number; right: number }
  | { type: "sounds"; parts: string[]; word?: string }
  | { type: "bar"; segments: number; filled: number };

export type Course = {
  moduleId: string;
  /** One sentence, in the child's words, of what they'll be able to do. */
  objective: string;
  steps: Step[];
  /** Shown on the completion card. Concrete, never a score. */
  canNowDo: string[];
};

/* ------------------------------------------------------------------ data */

const COURSES: Record<string, Course> = {
  counting: {
    moduleId: "counting",
    objective: "Count things one at a time, and know when to stop.",
    canNowDo: [
      "Point at each thing once as you count it",
      "Say the number you land on is how many there are",
      "Notice when you have counted one thing twice",
    ],
    steps: [
      {
        kind: "lesson",
        id: "one-at-a-time",
        title: "One touch, one number",
        body: "When you count, touch each thing once and say one number. Touch, say. Touch, say. Never two numbers for one thing.",
        visual: { type: "count", total: 5, filled: 5 },
      },
      {
        kind: "check",
        id: "check-one-at-a-time",
        teaches: "one-at-a-time",
        question: "There are 4 bricks. How many numbers do you say?",
        options: [
          { label: "4 numbers", correct: true },
          { label: "1 number" },
          { label: "8 numbers" },
        ],
        onCorrect: "Yes. One number for each brick, so four bricks means four numbers.",
        onWrong: "Not quite, and it's a fair mistake. Let's do it with your finger instead of in your head.",
        retry: {
          title: "Try it with your finger",
          body: "Put your finger on the first brick and say ONE. Move to the next and say TWO. Keep going. Every brick gets a finger, and every finger gets a number.",
          visual: { type: "count", total: 4, filled: 4 },
        },
      },
      {
        kind: "lesson",
        id: "last-number",
        title: "The last number is the answer",
        body: "When you run out of things to touch, the number you just said is how many there are. You don't have to count again.",
        visual: { type: "count", total: 6, filled: 6 },
      },
      {
        kind: "check",
        id: "check-last-number",
        teaches: "last-number",
        question: "You counted: one, two, three, four, five. How many are there?",
        options: [
          { label: "5", correct: true },
          { label: "1" },
          { label: "I need to count again" },
        ],
        onCorrect: "That's it. The last number you said is the whole answer.",
        onWrong: "Let's listen to the counting again, and stop on the last word.",
        retry: {
          title: "Stop on the last word",
          body: "One… two… three… four… FIVE. That last word, five, is how many. The other numbers were just steps to get there.",
          visual: { type: "count", total: 5, filled: 5 },
        },
      },
    ],
  },

  "number-bonds": {
    moduleId: "number-bonds",
    objective: "Find the two numbers that go together to make ten.",
    canNowDo: [
      "Say what goes with a number to make ten",
      "Use ten as a stopping point when adding",
      "Spot a pair that makes ten inside a bigger sum",
    ],
    steps: [
      {
        kind: "lesson",
        id: "ten-frame",
        title: "Ten has ten spaces",
        body: "Imagine a box with ten spaces. If you fill six of them, the empty ones tell you what's missing.",
        visual: { type: "bar", segments: 10, filled: 6 },
      },
      {
        kind: "check",
        id: "check-ten-frame",
        teaches: "ten-frame",
        question: "Six spaces are full. How many are empty?",
        options: [
          { label: "4", correct: true },
          { label: "6" },
          { label: "16" },
        ],
        onCorrect: "Six and four. That's a pair that makes ten.",
        onWrong: "Let's count the empty spaces out loud instead of working it out.",
        retry: {
          title: "Count the gaps",
          body: "Don't do a sum. Just look at the empty spaces and count them: one, two, three, four. Four spaces are waiting. So six needs four.",
          visual: { type: "bar", segments: 10, filled: 6 },
        },
      },
      {
        kind: "lesson",
        id: "pairs-flip",
        title: "Pairs work both ways",
        body: "If six and four make ten, then four and six make ten too. Turning it round doesn't change the answer.",
        visual: { type: "groups", left: 6, right: 4 },
      },
      {
        kind: "check",
        id: "check-pairs-flip",
        teaches: "pairs-flip",
        question: "Seven and three make ten. What do three and seven make?",
        options: [
          { label: "10", correct: true },
          { label: "37" },
          { label: "4" },
        ],
        onCorrect: "Same ten. Swapping the order never changes how many there are altogether.",
        onWrong: "Let's move them around and see that nothing actually changes.",
        retry: {
          title: "Nothing left, nothing added",
          body: "Put seven counters here and three there. Now swap the piles over. Did any counter leave the table? No. So there are still ten.",
          visual: { type: "groups", left: 3, right: 7 },
        },
      },
    ],
  },

  blending: {
    moduleId: "blending",
    objective: "Push sounds together until they turn into a word.",
    canNowDo: [
      "Say each sound in a short word",
      "Push the sounds together without stopping",
      "Hear the word you made",
    ],
    steps: [
      {
        kind: "lesson",
        id: "stretch",
        title: "Stretch the sounds",
        body: "Say each sound slowly, like pulling a rubber band. c… a… t. Don't say the letter names, just the sounds they make.",
        visual: { type: "sounds", parts: ["c", "a", "t"] },
      },
      {
        kind: "check",
        id: "check-stretch",
        teaches: "stretch",
        question: "Which one is the SOUND that 's' makes?",
        options: [
          { label: "sss", correct: true },
          { label: "ess" },
          { label: "suh-ee" },
        ],
        onCorrect: "That's the one. Sounds, not names, are what push together into words.",
        onWrong: "That's the letter's name. Its sound is different, listen.",
        retry: {
          title: "Names and sounds are different",
          body: "The letter is called ess. But when it's inside a word it says sss, like a snake. When you blend, you always use the sound.",
          visual: { type: "sounds", parts: ["s", "u", "n"], word: "sun" },
        },
      },
      {
        kind: "lesson",
        id: "push",
        title: "Push them together",
        body: "Now say them again with no gaps. c-a-t. Faster. cat. The word appears when the gaps disappear.",
        visual: { type: "sounds", parts: ["c", "a", "t"], word: "cat" },
      },
      {
        kind: "check",
        id: "check-push",
        teaches: "push",
        question: "Push these together: m… a… p",
        options: [
          { label: "map", correct: true },
          { label: "pam" },
          { label: "mat" },
        ],
        onCorrect: "Map. You built a whole word out of three sounds.",
        onWrong: "Close. Let's keep the sounds in the order they came in.",
        retry: {
          title: "Left to right, every time",
          body: "The sounds go in the order you hear them. First m, then a, then p. Start at the left and don't jump about: mmm-aaa-p. Map.",
          visual: { type: "sounds", parts: ["m", "a", "p"], word: "map" },
        },
      },
    ],
  },
};

/* -------------------------------------------------------------- fallback */

/**
 * Modules without hand-written content still get a working course rather than
 * an empty screen. Generic, and deliberately obvious as generic, so it reads
 * as "not written yet" to us and still works for a child.
 */
function fallback(m: LearningModule): Course {
  return {
    moduleId: m.id,
    objective: m.blurb,
    canNowDo: [`Have a go at ${m.kidTitle.toLowerCase()} on your own`],
    steps: [
      {
        kind: "lesson",
        id: `${m.id}-intro`,
        title: m.kidTitle,
        body: m.opener,
        visual: { type: "count", total: 5, filled: 3 },
      },
      {
        kind: "check",
        id: `${m.id}-check`,
        teaches: `${m.id}-intro`,
        question: "Ready to have a go?",
        options: [
          { label: "Yes, let's go", correct: true },
          { label: "Read it to me again" },
        ],
        onCorrect: "Good. Here we go.",
        onWrong: "Of course. Here it is again, a bit slower.",
        retry: {
          title: "Once more, slower",
          body: m.opener,
          visual: { type: "count", total: 5, filled: 3 },
        },
      },
    ],
  };
}

export function courseFor(moduleId: string): Course | null {
  const m = MODULES.find((x) => x.id === moduleId);
  if (!m) return null;
  return COURSES[moduleId] ?? fallback(m);
}

/** Lessons only. Drives the progress track, since checks aren't destinations. */
export function lessonCount(course: Course): number {
  return course.steps.filter((s) => s.kind === "lesson").length;
}
