/**
 * PARENT NAV ICONS
 *
 * Drawn for these seven destinations rather than pulled from a general set,
 * so each one depicts its actual subject: Learners is two figures at different
 * heights (the product covers 5 to 11 and the size difference is the point),
 * Courses is a stack of short things rather than a book, because a module is
 * four minutes and not a chapter.
 *
 * One weight, one join style, 18px default, all on a 24 grid so they line up
 * optically in a vertical list.
 */

type P = { size?: number; className?: string };

function S({ size = 18, className, children }: P & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

/** One big number and the smaller things under it: the dashboard's own shape. */
function Dashboard(p: P) {
  return (
    <S {...p}>
      <rect x="3" y="3" width="8" height="10" rx="2" />
      <rect x="13" y="3" width="8" height="6" rx="2" />
      <rect x="3" y="15" width="8" height="6" rx="2" />
      <rect x="13" y="11" width="8" height="10" rx="2" />
    </S>
  );
}

/** Two figures at different heights. The age range is the product. */
function Learners(p: P) {
  return (
    <S {...p}>
      <circle cx="8" cy="7" r="2.6" />
      <path d="M3.5 20v-1.5A3.5 3.5 0 0 1 7 15h2a3.5 3.5 0 0 1 3.5 3.5V20" />
      <circle cx="17" cy="10" r="2" />
      <path d="M13.8 20v-1a3.2 3.2 0 0 1 3.2-3.2h.4a3.2 3.2 0 0 1 3.1 3.2v1" />
    </S>
  );
}

/** A stack of short things, not a book. A module is four minutes. */
function Courses(p: P) {
  return (
    <S {...p}>
      <rect x="3" y="4" width="18" height="4.5" rx="1.6" />
      <rect x="3" y="10.75" width="18" height="4.5" rx="1.6" />
      <rect x="3" y="17.5" width="11" height="3" rx="1.5" />
    </S>
  );
}

function Profile(p: P) {
  return (
    <S {...p}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 20v-1a4.5 4.5 0 0 1 4.5-4.5h5A4.5 4.5 0 0 1 19 19v1" />
    </S>
  );
}

/** A card with the strip, rather than a currency symbol tied to one market. */
function Payments(p: P) {
  return (
    <S {...p}>
      <rect x="2.5" y="5" width="19" height="14" rx="2.6" />
      <path d="M2.5 10h19" />
      <path d="M6.5 14.5h3" />
    </S>
  );
}

function Settings(p: P) {
  return (
    <S {...p}>
      <circle cx="12" cy="12" r="2.8" />
      <path d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2 5.5 5.5" />
    </S>
  );
}

/** A question mark in a speech bubble: help is a conversation, not a manual. */
function Help(p: P) {
  return (
    <S {...p}>
      <path d="M20.5 12.5A7.5 7.5 0 0 1 13 20H7l-3 2.2V17a7.5 7.5 0 0 1 5-9.3" />
      <path d="M10 8.6a2.4 2.4 0 1 1 3.2 2.3c-.7.3-1.2.9-1.2 1.7v.4" />
      <path d="M12 16.2h.01" />
    </S>
  );
}

export const PARENT_ICONS = {
  dashboard: Dashboard,
  learners: Learners,
  courses: Courses,
  profile: Profile,
  payments: Payments,
  settings: Settings,
  help: Help,
};
