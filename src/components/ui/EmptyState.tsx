import Link from "next/link";
import { IconSpark } from "./Icons";
import { cn } from "./cn";

/**
 * Empty state.
 *
 * An empty screen is an invitation to act, not an apology. So: say what will
 * appear here, and give exactly one way to make that happen. No shrugging
 * illustrations, no "Nothing to see!", a parent looking at an empty dashboard
 * wants to know whether something is broken or simply hasn't started yet, and
 * the copy answers that directly.
 */
export function EmptyState({
  title,
  body,
  actionLabel,
  actionHref,
  icon,
  className,
}: {
  title: string;
  body: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-12 text-center",
        className,
      )}
    >
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-tint text-indigo">
        {icon ?? <IconSpark size={22} />}
      </span>
      <h3 className="mt-4 text-[1.0625rem] font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 max-w-sm text-[0.9375rem] leading-relaxed text-ink-45">
        {body}
      </p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-6 rounded-xl bg-ink px-5 py-2.5 text-[0.875rem] font-medium text-white shadow-tight transition-colors hover:bg-ink/88"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
