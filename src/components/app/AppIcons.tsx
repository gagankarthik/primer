import { cn } from "@/components/ui/cn";

/**
 * Icons for the admin and studio rails.
 *
 * One weight, one join, 24 grid, drawn for these destinations rather than
 * pulled from a general set. The two that matter most:
 *
 *   flag    a pennant, not a warning triangle. The safety queue is a list of
 *           things a human should look at, not a list of alarms; a triangle
 *           in the rail would read as "something is broken" every day.
 *   review  an eye over a document. It is a reading queue, and drawing it as
 *           a tick would imply the default is approval.
 */

export type AppIconName =
  | "dashboard"
  | "flag"
  | "review"
  | "people"
  | "modules"
  | "money"
  | "settings"
  | "write"
  | "insights"
  | "profile"
  | "help";

function S({
  size = 20,
  className,
  children,
}: {
  size?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      {children}
    </svg>
  );
}

const PATHS: Record<AppIconName, React.ReactNode> = {
  dashboard: (
    <>
      <rect x="3" y="3" width="8" height="10" rx="2" />
      <rect x="13" y="3" width="8" height="6" rx="2" />
      <rect x="3" y="15" width="8" height="6" rx="2" />
      <rect x="13" y="11" width="8" height="10" rx="2" />
    </>
  ),
  flag: (
    <>
      <path d="M6 3v18" />
      <path d="M6 4.5h11l-2.4 4 2.4 4H6" />
    </>
  ),
  review: (
    <>
      <path d="M5 3.5h9.5L19 8v12.5H5z" />
      <path d="M14 3.5V8h5" />
      <circle cx="12" cy="14.5" r="2.2" />
      <path d="M8 14.5c1.3-2 2.6-3 4-3s2.7 1 4 3c-1.3 2-2.6 3-4 3s-2.7-1-4-3Z" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20v-1.2A3.8 3.8 0 0 1 7.3 15h3.4a3.8 3.8 0 0 1 3.8 3.8V20" />
      <path d="M16.5 5.6a3.2 3.2 0 0 1 0 5.8" />
      <path d="M17.5 15h.7a3.3 3.3 0 0 1 3.3 3.3V20" />
    </>
  ),
  modules: (
    <>
      <rect x="3" y="4.5" width="18" height="5" rx="1.8" />
      <rect x="3" y="12" width="18" height="5" rx="1.8" />
      <path d="M6 20h9" />
    </>
  ),
  money: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.6" />
      <path d="M2.5 10h19" />
      <path d="M6.5 14.5h3" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="2.8" />
      <path d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2 5.5 5.5" />
    </>
  ),
  /** A nib over a line: authoring, not editing a spreadsheet. */
  write: (
    <>
      <path d="M15.5 4.5 19.5 8.5 9 19H5v-4z" />
      <path d="M13.5 6.5 17.5 10.5" />
    </>
  ),
  insights: (
    <>
      <path d="M3.5 19.5h17" />
      <rect x="5" y="11" width="3.6" height="6" rx="1.2" />
      <rect x="10.2" y="7" width="3.6" height="10" rx="1.2" />
      <rect x="15.4" y="13" width="3.6" height="4" rx="1.2" />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20v-1a4.6 4.6 0 0 1 4.6-4.6h4.8A4.6 4.6 0 0 1 19 19v1" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.6 9.4a2.5 2.5 0 1 1 3.3 2.4c-.7.3-1.2.9-1.2 1.7v.4" />
      <path d="M11.7 17.2h.01" />
    </>
  ),
};

export function AppIcon({
  name,
  size = 20,
  className,
}: {
  name: AppIconName;
  size?: number;
  className?: string;
}) {
  return (
    <S size={size} className={className}>
      {PATHS[name]}
    </S>
  );
}
