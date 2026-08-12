import { cn } from "./cn";

/**
 * Skeletons.
 *
 * Shaped like the content they stand in for, not generic grey bars, a
 * skeleton whose proportions match the real card means nothing jumps when the
 * data lands, which is the entire point of showing one.
 *
 * The shimmer is a slow background sweep rather than a pulsing opacity: pulsing
 * reads as "broken/retrying", sweeping reads as "loading". Both stop under
 * prefers-reduced-motion via the global rule in globals.css.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "block rounded-lg bg-line/70",
        "relative overflow-hidden",
        "after:absolute after:inset-0 after:-translate-x-full after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent after:content-['']",
        "after:animate-[shimmer_1.6s_infinite]",
        className,
      )}
    />
  );
}

/** Matches ModuleCard's proportions exactly so nothing shifts on load. */
export function ModuleCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-tight">
      <Skeleton className="h-32 w-full rounded-none" />
      <div className="p-5">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="mt-3 h-3 w-full" />
        <Skeleton className="mt-2 h-3 w-4/5" />
        <Skeleton className="mt-5 h-3 w-1/2" />
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="rounded-2xl border border-line bg-surface px-5 py-5 shadow-tight">
      <Skeleton className="h-8 w-16" />
      <Skeleton className="mt-3 h-3 w-24" />
      <Skeleton className="mt-2 h-3 w-20" />
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div className="flex-1">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-2 h-3 w-24" />
      </div>
      <Skeleton className="h-10 w-48" />
    </div>
  );
}
