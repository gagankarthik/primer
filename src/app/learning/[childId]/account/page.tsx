import Link from "next/link";
import { notFound } from "next/navigation";
import { getChild } from "@/lib/mock";
import { factsFor } from "@/lib/learner";
import { RankMedal } from "@/components/child/RankCard";
import { LearnerPage } from "@/components/child/Page";

/**
 * MY ACCOUNT, the child's version.
 *
 * Cut back to three things: who you are, what we keep, and the way out.
 *
 * It used to also list interests, goals, and three separate privacy cards, and
 * it was the longest page in the child area for the screen a child visits
 * least. Interests and goals are read-only here anyway (they are a parent's to
 * change), so they were four hundred pixels telling a seven-year-old about
 * something they cannot act on. They live on the parent's settings page, where
 * someone can actually edit them.
 *
 * Everything remaining is read-only too, and that is deliberate: a child
 * cannot change their own hours, cap or blocks, because a screen that lets
 * them negotiate turns every evening into a negotiation. The one real action
 * is leaving, which genuinely is theirs.
 */
export default async function LearnerAccount({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const child = getChild(childId);
  if (!child) notFound();

  const f = factsFor(child);
  const c = f.child.profile.contextual;

  return (
    <LearnerPage title="My account" blurb="Who you are here, and what we keep.">
      <div className="max-w-2xl space-y-6">
        <div className="flex flex-wrap items-center gap-5 rounded-[1.75rem] border border-line bg-surface p-5 shadow-tight sm:p-6">
          <RankMedal rank={f.rank} size={72} />
          <div className="min-w-0">
            <p className="text-[1.5rem] font-bold text-ink">{f.name}</p>
            <p className="mt-0.5 text-[1.0625rem] text-indigo">
              the {f.rank.title}
            </p>
            <p className="mt-1 text-[0.9375rem] text-ink-45">
              {c.ageYears} years old · {c.gradeLabel}
            </p>
          </div>
        </div>

        {/* One card, three sentences. A child old enough to use this is old
            enough to be told what happens to what they say, and telling them
            is a better lesson in what to expect from software than not. */}
        <section className="rounded-2xl border border-line bg-surface p-5 shadow-tight sm:p-6">
          <h2 className="text-[1.0625rem] font-bold text-ink">What we keep</h2>
          <ul
            className="mt-3 space-y-2.5 text-[1rem] leading-[1.5] text-ink-70"
            style={{ fontFamily: "var(--font-read)" }}
          >
            <li>
              We don&rsquo;t record your voice. Your words become writing and
              the sound is thrown away.
            </li>
            <li>Nothing you say teaches a computer. It&rsquo;s only used to help you.</li>
            <li>
              Whoever set up your account can read what you and the Primer said.
              That&rsquo;s on purpose, and you should know it.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-[1.0625rem] font-bold text-ink">
            Finished for today?
          </h2>
          <p className="mt-1 text-[0.9375rem] text-ink-45">
            Everything you&rsquo;ve done is saved.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-2xl bg-rose px-7 py-4 text-[1.0625rem] font-bold text-white shadow-tight transition-all hover:brightness-95 active:scale-[0.99]"
            >
              All done for today
            </Link>
            <Link
              href="/learning"
              className="rounded-2xl border border-line-strong bg-surface px-7 py-4 text-[1.0625rem] font-semibold text-ink shadow-tight transition-colors hover:border-ink/25"
            >
              Someone else&rsquo;s turn
            </Link>
          </div>
        </section>
      </div>
    </LearnerPage>
  );
}
