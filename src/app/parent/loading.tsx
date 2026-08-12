import {
  Skeleton,
  StatSkeleton,
  ModuleCardSkeleton,
  RowSkeleton,
} from "@/components/ui/Skeleton";

/**
 * Parent overview skeleton. Mirrors the real layout, headline card, three
 * stats, three module cards, a session list, so nothing jumps when the data
 * arrives.
 */
export default function ParentLoading() {
  return (
    <div className="min-h-dvh bg-base">
      <div className="border-b border-line bg-base/80 px-5 py-3 sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-7 w-48" />
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-12">
        <Skeleton className="mb-3 h-3 w-20" />
        <Skeleton className="mb-8 h-28 w-full rounded-2xl" />

        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <StatSkeleton />
          <StatSkeleton />
          <StatSkeleton />
        </div>

        <Skeleton className="mb-4 h-5 w-56" />
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ModuleCardSkeleton />
          <ModuleCardSkeleton />
          <ModuleCardSkeleton />
        </div>

        <Skeleton className="mb-4 h-5 w-64" />
        <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
          <RowSkeleton />
          <RowSkeleton />
          <RowSkeleton />
        </div>
      </main>
    </div>
  );
}
