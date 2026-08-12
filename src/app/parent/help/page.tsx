import type { Metadata } from "next";
import Link from "next/link";
import { CHILD_LIST } from "@/lib/mock";
import { ParentShell } from "@/components/parent/ParentShell";
import { PageHead, Panel } from "@/components/parent/Layout";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { PARENT_ICONS } from "@/components/parent/ParentIcons";

export const metadata: Metadata = {
  title: "Help & support",
  robots: { index: false, follow: false },
};

/**
 * HELP.
 *
 * The questions here are the ones people actually ask once they are already
 * paying, which are different from the ones on the pricing page. Nobody inside
 * the product is still asking "is this worth it"; they are asking "why is it
 * doing that", and the honest answers are mostly "on purpose, here's why".
 */

const HELP_FAQ = [
  {
    q: "My child says it won't just tell them the answer. Is it broken?",
    a: "No, that is the product. It walks down a ladder of six increasingly direct hints, and it will get to a worked example if it has to, but it will not open with one. The first fortnight is the hard part. Most children stop asking around the tenth session, and the dashboard will show you the point where that happened.",
  },
  {
    q: "The questions look too easy. Why isn't it moving faster?",
    a: "It works one rung above where your child is solid, not where they could get to on a good day with you sitting next to them. If a topic looks too easy for more than a week, tell us on the session and it will recalibrate faster than it would on its own.",
  },
  {
    q: "Can I read what my child actually said?",
    a: "Yes. Every session on the dashboard opens into the full transcript, both sides, in order, with the help level marked at each turn. Nothing is summarised away.",
  },
  {
    q: "Is my child's voice recorded?",
    a: "No. Speech is converted to text as it arrives and the audio is destroyed in the same request. No voiceprint is ever created or stored. This is a contract term, not a setting, so it cannot be switched on by an update.",
  },
  {
    q: "Does anything my child says train a model?",
    a: "No, and there is no setting that changes this. Sessions are used to teach your child and to bill you, and for nothing else.",
  },
  {
    q: "It flagged something my child said. What happens now?",
    a: "You get an email straight away with the exact exchange and nothing filtered out. The Primer responds gently in the moment and does not carry the topic forward. If it is urgent, write to safeguarding@theprimer.app rather than using the form, and a person reads it the same day.",
  },
  {
    q: "How do I move it to a different tablet?",
    a: "Learners, then the binding code. Open primer.app on the new device and enter the four characters. The code lasts ten minutes and works once.",
  },
  {
    q: "Can two children share one login?",
    a: "They shouldn't. Each learner gets their own profile because the whole thing depends on knowing who it is talking to; two children in one profile produces an average that fits neither. Adding a second learner is free on Household.",
  },
];

const ROUTES = [
  {
    icon: "help" as const,
    title: "Ask us anything",
    body: "A person replies within one working day.",
    href: "/contact",
    cta: "Open the contact form",
  },
  {
    icon: "profile" as const,
    title: "Something your child said",
    body: "Read the same day, not queued behind billing questions.",
    href: "mailto:safeguarding@theprimer.app",
    cta: "safeguarding@theprimer.app",
  },
  {
    icon: "payments" as const,
    title: "Billing",
    body: "Refunds, plan changes, closing an account.",
    href: "mailto:accounts@theprimer.app",
    cta: "accounts@theprimer.app",
  },
];

export default function Help() {
  return (
    <ParentShell
      childId={CHILD_LIST[0].profile.childId}
      showChildSwitcher={false}
    >
      <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-12">
        <PageHead
          title="Help & support"
          blurb="The questions parents ask once they are actually using it. If yours isn't here, ask us directly."
        />

        <ul className="mb-10 grid gap-3 sm:grid-cols-3">
          {ROUTES.map((r) => {
            const Icon = PARENT_ICONS[r.icon];
            const external = r.href.startsWith("mailto:");
            const inner = (
              <>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-tint text-indigo">
                  <Icon size={20} />
                </span>
                <span className="mt-3.5 block text-[0.9375rem] font-semibold text-ink">
                  {r.title}
                </span>
                <span className="mt-1 block text-[0.8125rem] leading-snug text-ink-45">
                  {r.body}
                </span>
                <span className="mt-3 block break-all text-[0.8125rem] font-medium text-indigo">
                  {r.cta}
                </span>
              </>
            );
            return (
              <li key={r.title}>
                {external ? (
                  <a
                    href={r.href}
                    className="block h-full rounded-2xl border border-line bg-surface p-5 shadow-tight transition-all hover:-translate-y-0.5 hover:shadow-lift"
                  >
                    {inner}
                  </a>
                ) : (
                  <Link
                    href={r.href}
                    className="block h-full rounded-2xl border border-line bg-surface p-5 shadow-tight transition-all hover:-translate-y-0.5 hover:shadow-lift"
                  >
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <Panel title="Questions people actually ask">
          <FaqAccordion items={HELP_FAQ} />
        </Panel>

        <p className="mt-6 text-[0.875rem] leading-relaxed text-ink-45">
          Looking for how the scaffolding works in detail, or exactly what we
          keep and for how long? That is written up on{" "}
          <Link
            href="/features"
            className="font-medium text-indigo underline underline-offset-4"
          >
            how it works
          </Link>
          .
        </p>
      </main>
    </ParentShell>
  );
}
