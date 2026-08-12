import Link from "next/link";
import { WorkPage, Card } from "@/components/app/Page";

export const metadata = { title: "Writing guide" };

/**
 * THE WRITING GUIDE.
 *
 * The same checklist reviewers apply, written out. A review standard that only
 * exists on the reviewer's screen is a standard creators can only learn by
 * being rejected, which is a slow and demoralising way to teach anything.
 *
 * Ordered by how often each one sends a module back.
 */

const RULES = [
  {
    n: 1,
    t: "Never put the answer in the question",
    b: "The commonest reason a module comes back. It is easy to do when you already know the material: “Which ending, -s, makes it mean more than one?” has answered itself. Ask what the child has to work out, not what they have to spot.",
    bad: "Six and four make ten. What do six and four make?",
    good: "Six spaces are full. How many are empty?",
  },
  {
    n: 2,
    t: "The re-teach must be genuinely different",
    b: "When a child gets it wrong they come back to your lesson, taught again from your retry text. If the retry paraphrases the original, you are repeating words that have already failed. Change the angle: swap the abstraction for something they can count or touch.",
    bad: "Remember, the last number you say is how many there are.",
    good: "One… two… three… four… FIVE. That last word is how many. The others were steps to get there.",
  },
  {
    n: 3,
    t: "One idea per lesson",
    b: "If a lesson teaches two things, a wrong answer cannot tell you which one is missing, and neither can the child. Split it.",
  },
  {
    n: 4,
    t: "Wrong answers should be tempting",
    b: "A joke option is a free guess. The wrong answers should be what a child would genuinely think: the right operation on the wrong numbers, the letter name instead of the letter sound.",
    bad: "4 numbers / 1 number / a banana",
    good: "4 numbers / 1 number / 8 numbers",
  },
  {
    n: 5,
    t: "Write for the youngest child in your range",
    b: "Not the average one. If you have said ages 5 to 7, a five-year-old has to be able to follow it read aloud, without seeing the words.",
  },
  {
    n: 6,
    t: "Never reward speed, and never say easy",
    b: "No timers, no “quick”, no “simple”. To a child who is stuck, “this one is easy” is an accusation. Say “this one is tricky” instead: it is true more often, and it costs a stuck child nothing.",
  },
  {
    n: 7,
    t: "Name what they did, don't praise them",
    b: "“Well done” is about you approving. “You added five three times without doing a sum” tells them what they are now able to do, which is the thing they will still have next week.",
  },
];

export default function WritingGuide() {
  return (
    <WorkPage
      title="Writing guide"
      blurb="The same checklist a reviewer reads your module against. Nothing here is a secret standard."
    >
      <div className="max-w-3xl space-y-5">
        <Card title="The shape">
          <p className="text-[0.9375rem] leading-relaxed text-ink-70">
            A module is one loop, run three or four times:{" "}
            <span className="font-medium text-ink">
              teach one idea, check it, and on a wrong answer re-teach that same
              idea a different way and ask again.
            </span>{" "}
            Four to six minutes end to end. A wrong answer never restarts the
            module and never ends it.
          </p>
          <Link
            href="/studio/courses/new"
            className="mt-4 inline-block rounded-xl bg-ink px-5 py-3 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-ink/88"
          >
            Start one
          </Link>
        </Card>

        {RULES.map((r) => (
          <Card key={r.n}>
            <div className="flex gap-4">
              <span
                aria-hidden
                className="figure-num grid h-8 w-8 shrink-0 place-items-center rounded-full bg-grey-tint text-[0.875rem] font-bold text-ink-45"
              >
                {r.n}
              </span>
              <div className="min-w-0">
                <h2 className="text-[1.0625rem] font-semibold text-ink">{r.t}</h2>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-70">
                  {r.b}
                </p>

                {r.bad && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-rose/[0.06] px-4 py-3">
                      <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-rose">
                        not this
                      </p>
                      <p className="mt-1.5 text-[0.9375rem] leading-snug text-ink">
                        {r.bad}
                      </p>
                    </div>
                    <div className="rounded-xl bg-green-tint px-4 py-3">
                      <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green">
                        this
                      </p>
                      <p className="mt-1.5 text-[0.9375rem] leading-snug text-ink">
                        {r.good}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </WorkPage>
  );
}
