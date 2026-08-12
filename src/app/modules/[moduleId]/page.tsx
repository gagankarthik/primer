import Link from "next/link";
import { notFound } from "next/navigation";
import { Cta } from "@/components/marketing/Chrome";
import { BackButton } from "@/components/ui/BackButton";
import { ModuleArt } from "@/components/modules/ModuleArt";
import { ModuleCard, Stars } from "@/components/modules/ModuleCard";
import { Reveal } from "@/components/ui/primitives";
import { MODULES, moduleById, GROUPS } from "@/lib/modules";
import { cn } from "@/components/ui/cn";

const TINT: Record<string, string> = {
  indigo: "bg-indigo-tint",
  green: "bg-green-tint",
  amber: "bg-amber/10",
  rose: "bg-rose/8",
};

export async function generateStaticParams() {
  return MODULES.map((m) => ({ moduleId: m.id }));
}

/**
 * MODULE DETAIL, the parent-facing page.
 *
 * Ratings and written feedback live here, not on the child's screen. The
 * feedback shown is deliberately mixed: a four-star review saying "slower than
 * a flashcard app" does more for trust than five identical five-star quotes,
 * and it sets the expectation that makes the first week survivable.
 */
export default async function ModuleDetail({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const m = moduleById(moduleId);
  if (!m) notFound();

  const related = MODULES.filter(
    (x) => x.group === m.group && x.id !== m.id,
  ).slice(0, 3);

  // Distribution is derived from the rating so the bars can't contradict it.
  const dist = [5, 4, 3, 2, 1].map((star) => {
    const weight =
      star === 5
        ? m.rating - 3.6
        : star === 4
          ? 1.3 - (m.rating - 4.5)
          : star === 3
            ? 0.28
            : star === 2
              ? 0.12
              : 0.06;
    return { star, pct: Math.max(2, Math.round(weight * 62)) };
  });

  return (
    <>
      <section className="pt-8 sm:pt-12">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">
          {/*
            A real button, not a text link. This page is the most common landing
            point from search, so for a lot of visitors "back" has nowhere to go
            and the control has to be an obvious, tappable way into the
            catalogue rather than a whisper above the title.
          */}
          <BackButton fallbackHref="/modules" label="All modules" />

          <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <Reveal>
              <p className="eyebrow mb-4 text-indigo">
                {GROUPS[m.group].label}
              </p>
              <h1 className="text-[clamp(2rem,4.4vw,3rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-balance">
                {m.title}
              </h1>
              <p className="mt-5 max-w-lg text-[1.0625rem] leading-[1.65] text-ink-70">
                {m.blurb}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-[0.875rem] text-ink-45">
                <span className="flex items-center gap-2">
                  <Stars value={m.rating} />
                  <span className="figure-num font-medium text-ink">
                    {m.rating}
                  </span>
                  <span className="figure-num">({m.reviews})</span>
                </span>
                <span aria-hidden className="h-1 w-1 rounded-full bg-line-strong" />
                <span className="figure-num">
                  ages {m.minAge}&ndash;{m.maxAge}
                </span>
                <span aria-hidden className="h-1 w-1 rounded-full bg-line-strong" />
                <span className="figure-num">{m.minutes} min a session</span>
              </div>

              <div className="mt-9 flex flex-wrap gap-3">
                <Cta href="/signup">Start free</Cta>
                <Cta href="/learning" variant="outline">
                  Try it now
                </Cta>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div
                className={cn(
                  "overflow-hidden rounded-3xl border border-line shadow-lift",
                  TINT[m.tone],
                )}
              >
                <ModuleArt art={m.art} tone={m.tone} className="h-56 w-full" />
                <div className="border-t border-line bg-surface p-6">
                  <p className="eyebrow mb-2.5 text-ink-45">it opens with</p>
                  <p className="font-[family-name:var(--font-read)] text-[1.0625rem] leading-[1.6] text-ink">
                    &ldquo;{m.opener}&rdquo;
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- feedback */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-[-0.025em]">
              What parents said
            </h2>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="figure-num text-5xl font-semibold text-ink">
                {m.rating}
              </span>
              <span className="text-[0.9375rem] text-ink-45">
                out of 5 &middot; {m.reviews} reviews
              </span>
            </div>
            <Stars value={m.rating} size={18} />

            <ul className="mt-7 space-y-2">
              {dist.map((d) => (
                <li key={d.star} className="flex items-center gap-3">
                  <span className="figure-num w-3 text-xs text-ink-45">
                    {d.star}
                  </span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                    <span
                      className="block h-full rounded-full bg-amber"
                      style={{ width: `${d.pct}%` }}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="space-y-4">
            {m.feedback.map((f, i) => (
              <Reveal key={f.by} delay={i * 0.06}>
                <figure className="rounded-2xl border border-line bg-surface p-6 shadow-tight">
                  <Stars value={f.stars} />
                  <blockquote className="mt-4 text-[1.0625rem] leading-[1.6] text-ink">
                    {f.text}
                  </blockquote>
                  <figcaption className="mt-4 flex items-center gap-2.5 text-[0.875rem] text-ink-45">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-grey-tint text-[0.75rem] font-semibold text-ink">
                      {f.by[0]}
                    </span>
                    {f.by} &middot; parent of a child {f.child}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- related */}
      {related.length > 0 && (
        <section className="border-t border-line bg-surface">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
            <h2 className="mb-6 text-lg font-semibold tracking-[-0.02em]">
              More {GROUPS[m.group].label.toLowerCase()}
            </h2>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.id} className="h-full">
                  <ModuleCard module={r} href={`/modules/${r.id}`} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <div className="h-8" />
    </>
  );
}
