import { Skeleton } from '@/components/ui/skeleton';

const Page = () => {
  return (
    <div className="py-3 space-y-3">
      {/* Stats row: 4 cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-border/50 bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="size-4 rounded" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>

      {/* Charts: 2 columns */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-xl border border-border/50 bg-card p-4">
            <Skeleton className="mb-3 h-4 w-32" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
        <div className="border-b border-border/50 p-4">
          <Skeleton className="h-9 w-56" />
        </div>
        <div className="divide-y divide-border/30">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3.5">
              <Skeleton className="size-4 shrink-0 rounded-full" />
              <Skeleton className="h-4 w-32 shrink-0" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-20 shrink-0" />
              <Skeleton className="h-4 w-20 shrink-0" />
              <Skeleton className="h-5 w-16 shrink-0 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
