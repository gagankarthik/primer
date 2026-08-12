import { Skeleton, ModuleCardSkeleton } from "@/components/ui/Skeleton";

export default function ModulesLoading() {
  return (
    <div className="min-h-dvh bg-base">
      <div className="mx-auto max-w-6xl px-5 pt-32 sm:px-8 sm:pt-40">
        <Skeleton className="mb-4 h-3 w-20" />
        <Skeleton className="h-12 w-full max-w-2xl" />
        <Skeleton className="mt-3 h-12 w-3/4 max-w-xl" />
        <Skeleton className="mt-6 h-4 w-full max-w-lg" />

        {[0, 1].map((g) => (
          <section key={g} className="py-14">
            <div className="mb-6 flex items-baseline justify-between border-b border-line pb-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <ModuleCardSkeleton />
              <ModuleCardSkeleton />
              <ModuleCardSkeleton />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
