import { Skeleton } from '@/components/ui/skeleton';

const Page = () => {
  return (
    <div className="py-6 pb-12 md:py-8 md:pb-16">
      {/* DetailHeader */}
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-36" />
      </div>

      {/* OverviewPanel */}
      <div className="mb-6 rounded-xl border border-border/50 bg-card px-5 pt-[18px] pb-3.5 shadow-sm sm:px-6 md:mb-8">
        <div className="mb-3 flex items-center justify-between">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="mb-3.5 border-b border-border/30 pb-4">
          <div className="mb-3 flex items-center justify-between">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-20" />
          </div>
          {/* StepProgressBar skeleton — matches flex-nowrap with connector lines */}
          <div className="flex flex-nowrap items-center gap-0">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                {i > 0 && <div className="h-px w-4 min-w-[1rem] shrink-0 bg-border/30" />}
                <Skeleton className="h-7 w-24 rounded-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-3.5">
          <Skeleton className="h-10 rounded-lg" />
          <Skeleton className="h-10 rounded-lg" />
          <Skeleton className="h-10 rounded-lg" />
        </div>
      </div>

      {/* TransactionSummary */}
      <div className="mb-6 space-y-3.5 md:mb-8">
        <Skeleton className="h-4 w-44" />
        <div className="grid gap-5 md:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="rounded-xl border border-border/50 bg-card p-6">
              <div className="mb-5 flex items-center gap-2.5 border-b border-border/50 pb-3.5">
                <Skeleton className="h-5 w-14 rounded" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="space-y-4">
                {[0, 1, 2].map((j) => (
                  <div key={j} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MessageInfoSection */}
      <div className="space-y-3.5">
        <Skeleton className="h-4 w-40" />
        <div className="rounded-xl border border-border/50 bg-card p-6">
          {/* Grid matching sm:grid-cols-2 — Message ID full width, then pairs */}
          <div className="grid gap-x-10 sm:grid-cols-2">
            {/* Message ID — full width */}
            <div className="flex items-center justify-between border-b border-border/30 py-2.5 sm:col-span-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-48" />
            </div>
            {/* Source Dapp / Target Dapp */}
            {[0, 1].map((i) => (
              <div key={`dapp-${i}`} className="flex items-center justify-between border-b border-border/30 py-2.5">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-36" />
              </div>
            ))}
            {/* Source Port / Target Port */}
            {[0, 1].map((i) => (
              <div key={`port-${i}`} className="flex items-center justify-between py-2.5">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-36" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
