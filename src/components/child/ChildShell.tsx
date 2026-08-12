"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/components/brand/Logo";
import { RankMedal } from "@/components/child/RankCard";
import { rankFor } from "@/lib/badges";
import { cn } from "@/components/ui/cn";

/**
 * CHILD AREA chrome.
 *
 * The same idea as the parent sidebar and deliberately not the same design.
 * Differences, each one because of who is using it:
 *
 *  - Bigger. Every target is at least 48px, against the parent area's 36. A
 *    six-year-old's tap lands further from where they aimed than an adult's.
 *  - Icons are drawn, not lettered. A child navigates by shape and colour
 *    before they can read the label reliably, so the label supports the icon
 *    rather than the other way round.
 *  - No collapse on mobile behind a hamburger. Below `lg` it becomes a bottom
 *    bar, because a tablet held in two hands puts the thumbs at the bottom of
 *    the screen and a menu button in the top corner is the hardest place on
 *    the device for a small hand to reach.
 *  - It shows who they are, with their rank medallion, at the top. A child
 *    arriving here should see themselves before they see a menu.
 *
 * It is deliberately absent from the play session. That screen is one thing at
 * a time by design, and a nav rail sitting next to a question is four more
 * things to look at than a child working something out can afford.
 */

type Section = {
  href: string;
  label: string;
  /** Shorter, for the bottom bar, where five words have to fit across a phone. */
  short?: string;
  icon: keyof typeof ICONS;
  tone: string;
};

/**
 * Ordered by how often a child needs it, not by how the data is organised.
 * "My courses" is second because picking something to do is why they opened
 * this; Account is last because a seven-year-old visits it roughly never.
 *
 * The bottom bar shows the first five. Below `lg` the rest live on the
 * dashboard as cards, which is a shorter path than a nested menu on a device
 * held in two hands.
 */
function sectionsFor(childId: string): Section[] {
  const base = `/learning/${childId}`;
  return [
    { href: base, label: "My day", icon: "home", tone: "text-indigo" },
    { href: `${base}/courses`, label: "My courses", short: "Courses", icon: "courses", tone: "text-green" },
    { href: `${base}/progress`, label: "My progress", short: "Progress", icon: "progress", tone: "text-indigo" },
    { href: `${base}/achievements`, label: "My badges", short: "Badges", icon: "badges", tone: "text-amber" },
    { href: `${base}/milestones`, label: "Remember when", short: "Moments", icon: "milestones", tone: "text-rose" },
    { href: `${base}/leaderboard`, label: "Our house", icon: "house", tone: "text-green" },
    { href: `${base}/account`, label: "My account", icon: "account", tone: "text-ink-45" },
  ];
}

export function ChildShell({
  childId,
  childName,
  badgeCount,
  children,
}: {
  childId: string;
  childName: string;
  badgeCount: number;
  children: React.ReactNode;
}) {
  const sections = sectionsFor(childId);
  const rank = rankFor(badgeCount);
  const path = usePathname();
  const home = `/learning/${childId}`;

  const isActive = (href: string) =>
    href === home ? path === home : path.startsWith(href);

  return (
    <div className="min-h-dvh bg-base lg:flex">
      {/* ------------------------------------------------------ desktop rail */}
      <aside className="sticky top-0 hidden h-dvh w-[15rem] shrink-0 flex-col border-r border-line px-4 py-6 lg:flex">
        {/* The brand is not a nav item and should not read as the first one,
            so it gets a rule and its own breathing room rather than the
            list's gap. Same treatment as the identity block at the foot: the
            rail is three regions, and each boundary is drawn. */}
        <div className="mb-6 shrink-0 border-b border-line pb-5">
          <div className="flex items-center gap-2.5 px-2">
            <LogoMark size={26} />
            <span className="text-[0.9375rem] font-semibold text-ink">Primer</span>
          </div>
        </div>

        <nav aria-label="Where to go" className="min-h-0 flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {sections.map((s) => {
              const Icon = ICONS[s.icon];
              const on = isActive(s.href);
              return (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    aria-current={on ? "page" : undefined}
                    className={cn(
                      "flex min-h-[3rem] items-center gap-3 rounded-2xl px-3 text-[1.0625rem] font-semibold transition-colors",
                      on
                        ? "bg-ink text-white"
                        : "text-ink-70 hover:bg-grey-tint hover:text-ink",
                    )}
                  >
                    <Icon size={24} className={on ? "text-white" : s.tone} />
                    {s.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/*
          Signing out is a real control, not hidden in an account page. A shared
          family tablet gets handed between children constantly, and the fix for
          "my brother did my lesson" has to be one obvious tap.

          It is worded as leaving rather than as "sign out", because a
          five-year-old knows what going home means and does not necessarily
          know what being signed in was.
        */}
        {/*
          Who they are, sitting directly above the way out. Two things that
          belong together: this is the "you are signed in as" block, and the
          thing next to it is how you stop being signed in as that. It used to
          sit under the logo at the top, where it read as a page heading rather
          than as an identity.
        */}
        {/*
          Who you are, then a rule, then the way out. The identity sits with
          the nav it belongs to; the rule separates it from the one control
          that ends the session, so that control cannot be hit while aiming
          for the account card above it.

          The rule is red rather than neutral. This is the only destructive-ish
          action in the child area, and on a shared tablet a mis-tap costs
          somebody their session.
        */}
        <div className="mt-6 shrink-0">
          <Link
            href={`/learning/${childId}/account`}
            className="flex items-center gap-3 rounded-2xl bg-indigo-tint px-3 py-3 transition-colors hover:bg-indigo/15"
          >
            <RankMedal rank={rank} size={40} />
            <div className="min-w-0">
              <p className="truncate text-[0.9375rem] font-bold text-ink">
                {childName}
              </p>
              <p className="truncate text-[0.75rem] text-indigo">
                the {rank.title}
              </p>
            </div>
          </Link>

          <div className="mt-4 border-t border-line pt-4">
            <Link
              href="/"
              className="flex min-h-[3rem] items-center justify-center gap-2.5 rounded-2xl bg-rose px-3 text-[0.9375rem] font-bold text-white shadow-tight transition-all hover:brightness-95 active:scale-[0.98]"
            >
              <ICONS.signout size={20} />
              All done for today
            </Link>
          </div>
        </div>
      </aside>

      {/* pb on mobile clears the bottom bar so nothing hides behind it. */}
      <div className="min-w-0 flex-1 pb-24 lg:pb-0">{children}</div>

      {/* ------------------------------------------------------- bottom bar */}
      <nav
        aria-label="Where to go"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-base/95 backdrop-blur-xl lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="flex items-stretch justify-around">
          {sections.slice(0, 5).map((s) => {
            const Icon = ICONS[s.icon];
            const on = isActive(s.href);
            return (
              <li key={s.href} className="flex-1">
                <Link
                  href={s.href}
                  aria-current={on ? "page" : undefined}
                  className="flex min-h-[3.75rem] flex-col items-center justify-center gap-1 px-1 py-2"
                >
                  <Icon size={24} className={on ? "text-ink" : s.tone} />
                  <span
                    className={cn(
                      "text-[0.6875rem] leading-none",
                      on ? "font-bold text-ink" : "font-medium text-ink-45",
                    )}
                  >
                    {s.short ?? s.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

/* ----------------------------------------------------------------- icons */

type P = { size?: number; className?: string };

function S({ size = 24, className, children }: P & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      {children}
    </svg>
  );
}

/** Thicker than the parent set: a 1.7 stroke disappears at arm's length. */
const ICONS = {
  home: (p: P) => (
    <S {...p}>
      <path d="M3.5 10.5 12 3.5l8.5 7" />
      <path d="M5.5 9.8V20h13V9.8" />
      <path d="M9.75 20v-5.5h4.5V20" />
    </S>
  ),
  /** A stack of short things. A module is four minutes, not a chapter. */
  courses: (p: P) => (
    <S {...p}>
      <rect x="3" y="4.5" width="18" height="5" rx="1.8" />
      <rect x="3" y="12" width="18" height="5" rx="1.8" />
      <path d="M6 20h9" />
    </S>
  ),
  /** A line that dips and climbs back: the shape the trace actually makes. */
  progress: (p: P) => (
    <S {...p}>
      <path d="M3.5 8.5 8 14l3.5-3.5L15 15l5.5-9" />
      <path d="M3.5 19.5h17" />
    </S>
  ),
  badges: (p: P) => (
    <S {...p}>
      <circle cx="12" cy="9.5" r="5.5" />
      <path d="M8.5 14.2 7 21l5-2.6L17 21l-1.5-6.8" />
    </S>
  ),
  /** A pin on a path: a moment, at a place along the way. */
  milestones: (p: P) => (
    <S {...p}>
      <path d="M12 21s6.5-6.1 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 14.9 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.4" />
    </S>
  ),
  /** A house, not a podium. The board is the family, not the world. */
  house: (p: P) => (
    <S {...p}>
      <path d="M3.5 10.5 12 3.5l8.5 7V20h-17v-9.5Z" />
      <circle cx="8.5" cy="14.5" r="1.6" />
      <circle cx="15.5" cy="14.5" r="1.6" />
    </S>
  ),
  account: (p: P) => (
    <S {...p}>
      <circle cx="12" cy="8.5" r="3.6" />
      <path d="M4.5 20v-1a4.8 4.8 0 0 1 4.8-4.8h5.4A4.8 4.8 0 0 1 19.5 19v1" />
    </S>
  ),
  signout: (p: P) => (
    <S {...p}>
      <path d="M14.5 4.5h4a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5h-4" />
      <path d="M10 8.5 6.5 12 10 15.5" />
      <path d="M6.5 12h9" />
    </S>
  ),
};
