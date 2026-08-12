import { Skeleton } from "@/components/ui/Skeleton";

export default function ChildLoading() {
  return (
    <div className="min-h-dvh bg-base">
      <div className="mx-auto max-w-3xl px-6 py-6">
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <div className="mx-auto max-w-3xl px-6 pt-6">
        <Skeleton className="h-11 w-64" />
        <div className="mt-10 space-y-4">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="flex items-center gap-5 rounded-3xl border border-line bg-surface p-5"
            >
              <Skeleton className="h-20 w-20 rounded-2xl" />
              <div className="flex-1">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="mt-2 h-4 w-56" />
              </div>
              <Skeleton className="h-11 w-11 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
