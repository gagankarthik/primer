/**
 * LEARNING MODULES
 *
 * One concept per module, sized to a single sitting. Khan Academy Kids found
 * that cutting lessons to 3–5 minutes raised completion by ~50%, and the
 * research on 5–7s is blunt: complex navigation is where they give up. So the
 * unit of the product is a small, finishable thing with its own cover, not a
 * course tree a child has to navigate.
 *
 * Ratings and review counts are parent-facing. A child never sees them, a
 * six-year-old choosing between "4.9 stars" and "4.6 stars" is a child being
 * taught to optimise, which is the exact habit this product exists to avoid.
 */

export type ModuleGroup = "numbers" | "arithmetic" | "letters";

export type ArtKey =
  | "count"
  | "bonds"
  | "add"
  | "subtract"
  | "multiply"
  | "divide"
  | "sounds"
  | "blend"
  | "rhyme";

export interface LearningModule {
  id: string;
  /** What a parent sees in the catalogue. */
  title: string;
  /** What the child hears. Plain, concrete, no jargon. */
  kidTitle: string;
  group: ModuleGroup;
  art: ArtKey;
  /** Accent used for the cover art fill and the group chip. */
  tone: "indigo" | "green" | "amber" | "rose";
  minAge: number;
  maxAge: number;
  minutes: number;
  blurb: string;
  /** The first question the module opens with. */
  opener: string;
  rating: number;
  reviews: number;
  /** Verbatim parent feedback. Specific, not testimonial-shaped. */
  feedback: { by: string; child: string; stars: number; text: string }[];
}

export const GROUPS: Record<
  ModuleGroup,
  { label: string; kidLabel: string; blurb: string }
> = {
  numbers: {
    label: "Numbers",
    kidLabel: "Numbers",
    blurb: "Counting, ordering, and what numbers actually mean.",
  },
  arithmetic: {
    label: "Arithmetic",
    kidLabel: "Sums",
    blurb: "The four operations, understood, not memorised.",
  },
  letters: {
    label: "Letters & sounds",
    kidLabel: "Words",
    blurb: "From single sounds to reading whole words alone.",
  },
};

export const MODULES: LearningModule[] = [
  {
    id: "counting",
    title: "Counting to 20",
    kidTitle: "Counting things",
    group: "numbers",
    art: "count",
    tone: "indigo",
    minAge: 5,
    maxAge: 7,
    minutes: 4,
    blurb: "Counting objects one by one, and knowing when to stop.",
    opener: "There are some bricks on the table. Can you count them out loud for me?",
    rating: 4.8,
    reviews: 312,
    feedback: [
      {
        by: "Priya M.",
        child: "age 5",
        stars: 5,
        text: "She kept losing count around 13. It noticed and slowed down to just 10–15 for a week. That was the bit that stuck.",
      },
      {
        by: "Tom H.",
        child: "age 6",
        stars: 4,
        text: "Good, though he wanted to race it. It doesn't reward speed, which annoyed him for two days and then stopped mattering.",
      },
    ],
  },
  {
    id: "number-bonds",
    title: "Number pairs to 10",
    kidTitle: "Pairs that make 10",
    group: "numbers",
    art: "bonds",
    tone: "indigo",
    minAge: 5,
    maxAge: 8,
    minutes: 5,
    blurb: "Which two numbers go together to make ten, and why it helps later.",
    opener: "I have 6. How many more do I need to get to 10?",
    rating: 4.9,
    reviews: 244,
    feedback: [
      {
        by: "Sarah R.",
        child: "age 6",
        stars: 5,
        text: "This is the one that made adding click. She stopped counting on fingers about three weeks in.",
      },
    ],
  },
  {
    id: "adding",
    title: "Adding within 20",
    kidTitle: "Putting together",
    group: "arithmetic",
    art: "add",
    tone: "green",
    minAge: 5,
    maxAge: 8,
    minutes: 5,
    blurb: "Combining two groups, and checking the answer looks about right.",
    opener: "Four apples here, three apples there. Before you count, will the answer be more or less than 10?",
    rating: 4.7,
    reviews: 401,
    feedback: [
      {
        by: "Dan K.",
        child: "age 7",
        stars: 5,
        text: "It asks him to guess first, every time. He's started doing that in his head at the supermarket.",
      },
      {
        by: "Aisha N.",
        child: "age 5",
        stars: 4,
        text: "Slower than a flashcard app. That's the point, I know, but be ready for it.",
      },
    ],
  },
  {
    id: "subtracting",
    title: "Taking away",
    kidTitle: "Taking away",
    group: "arithmetic",
    art: "subtract",
    tone: "green",
    minAge: 6,
    maxAge: 9,
    minutes: 5,
    blurb: "Subtraction as removing, and as the gap between two numbers.",
    opener: "You had 9 and now you have 4. What happened in between?",
    rating: 4.6,
    reviews: 288,
    feedback: [
      {
        by: "Meera J.",
        child: "age 7",
        stars: 5,
        text: "The 'gap between two numbers' framing was new to me, never mind him. It's a better way round.",
      },
    ],
  },
  {
    id: "times-tables",
    title: "Times tables",
    kidTitle: "Lots of the same",
    group: "arithmetic",
    art: "multiply",
    tone: "green",
    minAge: 7,
    maxAge: 11,
    minutes: 6,
    blurb: "Multiplication as repeated groups, before any memorising starts.",
    opener: "Three rows, four in each row. How many altogether, and how did you work it out?",
    rating: 4.9,
    reviews: 517,
    feedback: [
      {
        by: "James O.",
        child: "age 8",
        stars: 5,
        text: "School wanted them chanted. This made her understand them first, then the chanting was easy.",
      },
      {
        by: "Rae L.",
        child: "age 9",
        stars: 5,
        text: "He asked why 4×3 and 3×4 match. It made him prove it with counters instead of just saying yes.",
      },
    ],
  },
  {
    id: "dividing",
    title: "Sharing out",
    kidTitle: "Sharing fairly",
    group: "arithmetic",
    art: "divide",
    tone: "green",
    minAge: 8,
    maxAge: 11,
    minutes: 6,
    blurb: "Division as fair sharing, including what to do with the leftovers.",
    opener: "Twelve sweets, five children. Share them out, what's left over, and what do we do with it?",
    rating: 4.7,
    reviews: 196,
    feedback: [
      {
        by: "Nina C.",
        child: "age 9",
        stars: 4,
        text: "Remainders finally made sense because it made her actually deal with the leftover sweet.",
      },
    ],
  },
  {
    id: "letter-sounds",
    title: "Letter sounds",
    kidTitle: "Sounds letters make",
    group: "letters",
    art: "sounds",
    tone: "amber",
    minAge: 5,
    maxAge: 7,
    minutes: 4,
    blurb: "Every letter's sound, including the pairs that make one sound together.",
    opener: "What sound does S make? Say it out loud and hold it.",
    rating: 4.8,
    reviews: 623,
    feedback: [
      {
        by: "Grace W.",
        child: "age 5",
        stars: 5,
        text: "It waits. However long she takes, it waits. I could not do that at bedtime.",
      },
    ],
  },
  {
    id: "blending",
    title: "Blending into words",
    kidTitle: "Making words",
    group: "letters",
    art: "blend",
    tone: "amber",
    minAge: 5,
    maxAge: 8,
    minutes: 5,
    blurb: "Running separate sounds together until a whole word appears.",
    opener: "C, A, T. Say them slowly, then let them run together like water.",
    rating: 4.9,
    reviews: 588,
    feedback: [
      {
        by: "Sarah R.",
        child: "age 6",
        stars: 5,
        text: "The week she read a whole word on her own, it told her so and then moved straight on. No fuss. She glowed for a day.",
      },
      {
        by: "Owen P.",
        child: "age 7",
        stars: 4,
        text: "Hard going at first. Stick with it, the tenth session looked nothing like the first.",
      },
    ],
  },
  {
    id: "rhyming",
    title: "Rhyme and pattern",
    kidTitle: "Words that match",
    group: "letters",
    art: "rhyme",
    tone: "rose",
    minAge: 5,
    maxAge: 8,
    minutes: 4,
    blurb: "Hearing the pattern at the end of words, the step before spelling.",
    opener: "Cat, hat, mat. What's the same about the end of all three?",
    rating: 4.6,
    reviews: 174,
    feedback: [
      {
        by: "Leila F.",
        child: "age 6",
        stars: 5,
        text: "She now makes up rhymes in the car unprompted, which is either a win or a punishment.",
      },
    ],
  },
];

export function moduleById(id: string) {
  return MODULES.find((m) => m.id === id);
}

export function modulesForAge(age: number) {
  return MODULES.filter((m) => age >= m.minAge && age <= m.maxAge);
}

export function modulesByGroup(group: ModuleGroup) {
  return MODULES.filter((m) => m.group === group);
}
