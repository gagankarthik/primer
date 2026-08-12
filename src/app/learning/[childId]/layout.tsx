import { notFound } from "next/navigation";
import Link from "next/link";
import { getChild } from "@/lib/mock";
import { badgesFor } from "@/lib/learner";
import { rankFor } from "@/lib/badges";
import { ChildShell } from "@/components/child/ChildShell";
import { RankMedal } from "@/components/child/RankCard";
import { LogoMark } from "@/components/brand/Logo";

/**
 * Every learner page gets the same rail from here, so a child never sees the
 * furniture change when they move between their own screens.
 *
 * The play session is deliberately outside this: it lives at
 * /learning/[childId]/play/[moduleId] and renders its own full-screen frame,
 * because a nav rail beside a question is four more things to look at than a
 * child working something out can afford.
 */
export default async function LearnerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const child = getChild(childId);
  if (!child) notFound();

  const badges = badgesFor(childId);
  const rank = rankFor(badges.length);

  return (
    <ChildShell
      childId={childId}
      childName={child.profile.displayName}
      badgeCount={badges.length}
    >
      {/*
        Mobile header. Brand on the leading edge, identity on the trailing
        edge: rank medallion, then the account.

        There is no "Not me" here. Switching child is a rare, adult-initiated
        action, and on a phone it was occupying the most valuable target on
        the screen while the thing a child actually looks for, their own
        badge, was not on the screen at all. Switching lives on the account
        page, one tap away, which is the right cost for something you do when
        somebody hands the device over.
      */}
      <header className="flex items-center justify-between gap-4 px-5 py-4 lg:hidden">
        <Link href="/" aria-label="Leave the Primer" className="shrink-0">
          <LogoMark size={28} />
        </Link>

        <Link
          href={`/learning/${childId}/account`}
          className="flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-3 shadow-tight"
        >
          <RankMedal rank={rank} size={32} priority />
          <span className="max-w-[7rem] truncate text-[0.875rem] font-semibold text-ink">
            {child.profile.displayName}
          </span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 text-ink-45"
            aria-hidden
          >
            <circle cx="12" cy="8.5" r="3.6" />
            <path d="M4.5 20v-1a4.8 4.8 0 0 1 4.8-4.8h5.4A4.8 4.8 0 0 1 19.5 19v1" />
          </svg>
          <span className="sr-only">Your account</span>
        </Link>
      </header>

      {children}
    </ChildShell>
  );
}
