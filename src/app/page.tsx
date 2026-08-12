import Link from "next/link";
import Image from "next/image";
import { SiteChrome } from "@/components/marketing/Chrome";
import { Collage } from "@/components/marketing/Collage";
import { ModuleCarousel } from "@/components/marketing/ModuleCarousel";
import { PlayableLadder } from "@/components/marketing/PlayableLadder";
import { ParentDashMock } from "@/components/marketing/ProductMock";
import { PHOTOS, photoUrl } from "@/lib/photos";
import { Squiggle, Spark, Loop, Dots, Rings, Arc } from "@/components/brand/Doodles";
import { Reveal, NumberTicker } from "@/components/ui/primitives";
import { Badge } from "@/components/Badge";
import { ModuleArt } from "@/components/modules/ModuleArt";
import { Stars } from "@/components/modules/ModuleCard";
import { IconAsk, IconTrace, IconVoice, IconShield, IconCheck } from "@/components/ui/Icons";
import { MODULES } from "@/lib/modules";
import { toneBg } from "@/lib/tone";
import { cn } from "@/components/ui/cn";

export default function Landing() {
  // padded={false}: the hero owns its own top spacing, since it sits under the
  // header rather than below it. Every other public page takes the default.
  return (
    <SiteChrome padded={false}>
      <Hero />
      <FeatureBand />
      <HowWeHelp />
      <ModuleGrid />
      <Voices />
      <Dashboard />
      <Earned />
      <CTA />
    </SiteChrome>
  );
}

/* ------------------------------------------------------- shared controls */

/**
 * The house button: label plus a circled arrow. One shape used for every
 * forward action on the page, so "this moves you onward" is learnable at a
 * glance rather than re-read each time.
 */
function ArrowCta({
  href,
  children,
  variant = "solid",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline" | "light";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-full py-2 pl-6 pr-2 text-[0.9375rem] font-semibold transition-all active:scale-[0.98]",
        variant === "solid" &&
          "bg-indigo text-white shadow-[0_4px_16px_rgba(61,78,232,0.35)] hover:bg-indigo-hi hover:shadow-[0_6px_22px_rgba(61,78,232,0.45)]",
        variant === "outline" &&
          "border border-line-strong bg-surface text-ink shadow-tight hover:border-ink/25",
        variant === "light" && "bg-white text-ink shadow-lift hover:bg-white/92",
        className,
      )}
    >
      {children}
      <span
        aria-hidden
        className={cn(
          "grid h-9 w-9 place-items-center rounded-full transition-transform group-hover:rotate-45",
          variant === "solid" ? "bg-white/20" : "bg-indigo text-white",
        )}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M3 11L11 3M11 3H4.5M11 3v6.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
}

function SectionHead({
  title,
  body,
  align = "left",
  action,
}: {
  title: string;
  body?: string;
  align?: "left" | "center";
  action?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-wrap items-end justify-between gap-6",
        align === "center" && "flex-col items-center text-center",
      )}
    >
      <div className={align === "center" ? "max-w-2xl" : "max-w-xl"}>
        <h2 className="text-[clamp(1.75rem,3.6vw,2.625rem)] font-bold leading-[1.1] tracking-[-0.03em] text-balance">
          {title}
        </h2>
        {body && (
          <p className="mt-4 text-[1.0625rem] leading-[1.6] text-ink-70">{body}</p>
        )}
      </div>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ HERO */

/*
  overflow-hidden keeps the margin doodles from producing a horizontal
  scrollbar. The bottom padding is not decorative: the collage cards sit at a
  positive y offset and lift further on hover, so without room to breathe the
  section edge crops them mid-card.
*/
function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-24">
      {/* Doodles live only in the margins, never behind copy. */}
      <Squiggle className="absolute left-[6%] top-[22%] hidden lg:block" size={78} />
      <Spark className="absolute right-[10%] top-[16%] hidden lg:block" size={26} />
      <Loop
        className="absolute right-[4%] top-[30%] hidden lg:block"
        color="var(--color-green)"
        size={72}
      />
      <Dots className="absolute left-[10%] top-[46%] hidden xl:block" />
      <Arc className="absolute right-[16%] top-[8%] hidden xl:block" size={52} />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div
          className="mx-auto max-w-3xl text-center"
          style={{ animation: "rise 600ms cubic-bezier(.22,1,.36,1) both" }}
        >
          <h1 className="text-[clamp(2.5rem,6vw,4.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-balance">
            Ask, Think, and{" "}
            <span className="relative whitespace-nowrap text-indigo">
              Work It Out
              <svg
                aria-hidden
                viewBox="0 0 200 12"
                className="absolute -bottom-1 left-0 w-full"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 8c40-6 90-8 196-3"
                  stroke="var(--color-amber)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-lg text-[1.0625rem] leading-[1.6] text-ink-70">
            A tutor for ages 5 to 11 that never hands over the answer. It asks
            the next question your child can actually answer.
          </p>

          <div className="mt-8 flex justify-center">
            <ArrowCta href="/signup">Get started</ArrowCta>
          </div>
        </div>

        <div
          className="mt-14 sm:mt-16"
          style={{ animation: "rise 700ms cubic-bezier(.22,1,.36,1) 160ms both" }}
        >
          <Collage />
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- FEATURE BAND */

const BAND = [
  {
    Icon: IconAsk,
    t: "Socratic questions",
    d: "It answers a question with a better question, until they get there themselves.",
  },
  {
    Icon: IconVoice,
    t: "Reads aloud",
    d: "Voice-first for under-eights. One button, no menus, nothing to read first.",
  },
  {
    Icon: IconTrace,
    t: "Honest progress",
    d: "You see how much help each session took, not a streak they learn to farm.",
  },
  {
    Icon: IconShield,
    t: "Safe by default",
    d: "No voice kept, nothing trains a model, and you set the hours.",
  },
];

/** One solid colour band. It gives the page a spine and breaks the white. */
function FeatureBand() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-indigo px-7 py-9 text-white sm:px-10 sm:py-11">
          <Rings
            className="absolute -right-6 -top-6 opacity-20"
            color="#fff"
            size={140}
          />
          {/*
            The heading sits above rather than in the row. It used to be the
            first cell of a four-column grid holding five things, so the fourth
            feature wrapped onto a second line on its own and the band read as
            three features plus an orphan. Four equal columns, one line.
          */}
          <div className="relative">
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-white/20 pb-6">
              <h2 className="text-2xl font-bold tracking-[-0.02em]">
                What it does
              </h2>
              <p className="text-[0.9375rem] text-white/70">
                Four things, and it does them the same way every evening.
              </p>
            </div>

            <div className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {BAND.map((b) => (
                <div key={b.t}>
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15">
                    <b.Icon size={20} className="text-white" />
                  </span>
                  <h3 className="mt-4 text-[1.0625rem] font-semibold">{b.t}</h3>
                  <p className="mt-1.5 text-[0.875rem] leading-relaxed text-white/70">
                    {b.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------ HOW WE HELP */

const HELP_POINTS = [
  "Adapts to your child's age, not a year group average",
  "Remembers what they beat months later",
  "Tells you the one thing worth knowing each week",
];

function HowWeHelp() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-grey-tint">
            <Image
              src={photoUrl("writing", { w: 900, h: 700, q: 78 })}
              alt={PHOTOS.writing.alt}
              fill
              sizes="(max-width: 1024px) 92vw, 520px"
              className="object-cover"
            />

            {/* Floating stat card, lifted off the photograph. */}
            <div className="absolute bottom-6 left-6 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-pop">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo text-white">
                <IconTrace size={20} />
              </span>
              <span>
                <span className="block text-xl font-bold leading-none text-ink">
                  <NumberTicker value={9} suffix=" min" />
                </span>
                <span className="mt-1 block text-[0.75rem] text-ink-45">
                  a typical sitting
                </span>
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="text-[clamp(1.75rem,3.6vw,2.625rem)] font-bold leading-[1.1] tracking-[-0.03em] text-balance">
            The ways we can help
          </h2>
          <p className="mt-4 text-[1.0625rem] leading-[1.6] text-ink-70">
            One-to-one teaching has been the best education available since
            Aristotle, for almost nobody. This is an honest attempt at
            closing some of that gap.
          </p>

          <ul className="mt-7 space-y-4">
            {HELP_POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-indigo text-white">
                  <IconCheck size={14} />
                </span>
                <span className="text-[0.9375rem] leading-relaxed text-ink-70">
                  {p}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <ArrowCta href="/features">See how it works</ArrowCta>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ MODULE GRID */

/** All nine, on a track you can push through, with a way out to the catalogue. */
function ModuleGrid() {
  return (
    <section className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <Spark
        className="absolute right-[8%] top-8 hidden lg:block"
        color="var(--color-rose)"
        size={22}
      />
      <SectionHead
        title="Discover the things they'll have a go at"
        body="Nine modules across numbers, sums and words. Four minutes each."
        action={<ArrowCta href="/modules" variant="outline">View all</ArrowCta>}
      />

      <ModuleCarousel />
    </section>
  );
}

/* ---------------------------------------------------------------- VOICES */

const VOICES = [
  {
    by: "Sarah R.",
    role: "Parent of Nell, 6",
    stars: 5,
    text: "She used to ask me for the answer and I'd just give it to her, because it was nine o'clock and we were both tired. Now she argues with it.",
    tone: "bg-indigo-tint",
  },
  {
    by: "James O.",
    role: "Parent of Ada, 8",
    stars: 5,
    text: "School wanted the times tables chanted. This made her understand them first, and then the chanting was easy.",
    tone: "bg-green-tint",
  },
  {
    by: "Aisha N.",
    role: "Parent of Kofi, 5",
    stars: 4,
    text: "Slower than a flashcard app, and that's the point, but be ready for the first week. It got much better by the tenth session.",
    tone: "bg-amber/10",
  },
];

function Voices() {
  return (
    <section>
      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <Loop
          className="absolute left-[4%] top-10 hidden lg:block"
          color="var(--color-indigo)"
          size={56}
        />
        <SectionHead
          title="What parents actually said"
          body="Including the four-star ones. A wall of five stars tells you nothing."
        />

        <ul className="grid gap-5 md:grid-cols-3">
          {VOICES.map((v, i) => (
            <Reveal key={v.by} delay={i * 0.07}>
              <li className={cn("h-full rounded-3xl p-6", v.tone)}>
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-[0.875rem] font-semibold text-white">
                    {v.by[0]}
                  </span>
                  <span>
                    <span className="block text-[0.9375rem] font-semibold text-ink">
                      {v.by}
                    </span>
                    <span className="block text-[0.8125rem] text-ink-45">
                      {v.role}
                    </span>
                  </span>
                </div>
                <div className="mt-3">
                  <Stars value={v.stars} size={14} />
                </div>
                <p className="mt-4 text-[0.9375rem] leading-[1.6] text-ink-70">
                  {v.text}
                </p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- DASHBOARD */

function Dashboard() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <h2 className="text-[clamp(1.75rem,3.6vw,2.625rem)] font-bold leading-[1.1] tracking-[-0.03em] text-balance">
            You see how much help it took
          </h2>
          <p className="mt-4 text-[1.0625rem] leading-[1.6] text-ink-70">
            The line drops when they got stuck and rises when they found their
            footing. A dip that recovers is a good evening.
          </p>
          <div className="mt-8">
            <ArrowCta href="/parent" variant="outline">
              Open a real dashboard
            </ArrowCta>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="rounded-[2rem] bg-indigo-tint p-6 sm:p-8">
            <ParentDashMock compact />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- EARNED */

const BADGE_ROW = [
  { k: "climbed-back" as const, l: "Stuck, then unstuck" },
  { k: "asked-why" as const, l: "Wanted to know why" },
  { k: "own-mistake" as const, l: "Caught it yourself" },
  { k: "no-help" as const, l: "Did it on your own" },
];

function Earned() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal>
            <h2 className="text-[clamp(1.75rem,3.6vw,2.625rem)] font-bold leading-[1.1] tracking-[-0.03em] text-balance">
              No badge for showing up
            </h2>
            <p className="mt-4 text-[1.0625rem] leading-[1.6] text-ink-70">
              Nothing here is earned for minutes or streaks. Every one is for a
              habit that transfers, and a child can&rsquo;t fake them
              without accidentally doing the real thing.
            </p>
            <div className="mt-8">
              <PlayableLadderLink />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <ul className="grid grid-cols-2 gap-4 sm:gap-5">
              {BADGE_ROW.map((b) => (
                <li
                  key={b.k}
                  className="flex flex-col items-center rounded-3xl border border-line bg-base p-6 text-center shadow-tight"
                >
                  <Badge kind={b.k} size={64} />
                  <span className="mt-4 text-[0.875rem] font-semibold leading-snug text-ink">
                    {b.l}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** The demo is worth a second entrance, low on the page, for slow readers. */
function PlayableLadderLink() {
  return (
    <div className="max-w-md">
      <PlayableLadder />
    </div>
  );
}

/* ------------------------------------------------------------------- CTA */

/**
 * One CTA, not three cards.
 *
 * The previous version split the close across three tiles, one of which led
 * with a software licence. Nobody has ever subscribed to a tutoring product
 * because of its licence, and putting it in the last thing a visitor reads
 * spent the strongest position on the page on the weakest argument.
 */
function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-indigo px-8 py-16 text-center sm:px-16 sm:py-20">
          <Rings
            className="absolute -left-10 -top-10 opacity-20"
            color="#fff"
            size={160}
          />
          <Squiggle
            className="absolute right-[8%] top-[18%] hidden opacity-40 lg:block"
            color="#fff"
            size={72}
          />

          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-[clamp(2rem,4.6vw,3.25rem)] font-bold leading-[1.06] tracking-[-0.035em] text-balance text-white">
              Give them something that waits.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-[1.0625rem] leading-[1.6] text-white/75">
              Two weeks free, every child in the house. No card, and the free
              tier stays free.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <ArrowCta href="/signup" variant="light">
                Get started
              </ArrowCta>
              <Link
                href="/modules"
                className="rounded-full border border-white/25 px-7 py-3.5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-white/10"
              >
                See what it teaches
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
