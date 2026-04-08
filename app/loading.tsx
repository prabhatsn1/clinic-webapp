import { Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero skeleton */}
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-64 mx-auto rounded-2xl" />
          <Skeleton className="h-6 w-96 mx-auto rounded-xl" />
          <Skeleton className="h-6 w-80 mx-auto rounded-xl" />
        </div>
        {/* Card grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-100 p-6 space-y-4"
            >
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-5 w-3/4 rounded-lg" />
              <Skeleton className="h-4 w-full rounded-lg" />
              <Skeleton className="h-4 w-5/6 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
