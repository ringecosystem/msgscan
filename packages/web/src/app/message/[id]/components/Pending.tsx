'use client';

import Link from 'next/link';
import { Loader2, RotateCcw, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { buttonVariants } from '@/components/ui/button-variants';
import { Button } from '@/components/ui/button';
import { useNetworkFromQuery } from '@/hooks/useNetwork';
import { cn } from '@/lib/utils';

type PendingPhase = 'initial' | 'indexing' | 'actionable';

export const PENDING_INDEXING_PHASE_MS = 3_000;
export const PENDING_ACTIONABLE_PHASE_MS = 10_000;

interface PendingProps {
  onRetry?: () => Promise<unknown> | unknown;
}

const Pending = ({ onRetry }: PendingProps) => {
  const network = useNetworkFromQuery();
  const [phase, setPhase] = useState<PendingPhase>('initial');
  const [isRetrying, setIsRetrying] = useState(false);
  const indexingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const actionableTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);
  const canRetry = Boolean(onRetry);

  const phaseCopy: Record<PendingPhase, string> = {
    initial: `Looking up the message on ${network} network…`,
    indexing: 'Messages may take up to a minute to be indexed.',
    actionable: 'Still not found. You can retry or go back.'
  };

  const phaseCopyWithoutRetry: Record<PendingPhase, string> = {
    initial: `Looking up the message on ${network} network…`,
    indexing: 'Messages may take up to a minute to be indexed.',
    actionable: 'Still not found. Go back and try again later.'
  };

  const clearPhaseTimers = useCallback(() => {
    if (indexingTimerRef.current) {
      clearTimeout(indexingTimerRef.current);
      indexingTimerRef.current = null;
    }
    if (actionableTimerRef.current) {
      clearTimeout(actionableTimerRef.current);
      actionableTimerRef.current = null;
    }
  }, []);

  const restartPhaseTimers = useCallback(() => {
    clearPhaseTimers();
    setPhase('initial');
    indexingTimerRef.current = setTimeout(() => setPhase('indexing'), PENDING_INDEXING_PHASE_MS);
    actionableTimerRef.current = setTimeout(() => setPhase('actionable'), PENDING_ACTIONABLE_PHASE_MS);
  }, [clearPhaseTimers]);

  useEffect(() => {
    isMountedRef.current = true;
    restartPhaseTimers();
    return () => {
      isMountedRef.current = false;
      clearPhaseTimers();
    };
  }, [clearPhaseTimers, restartPhaseTimers]);

  const handleRetry = useCallback(async () => {
    if (!onRetry || isRetrying) return;
    try {
      restartPhaseTimers();
      if (isMountedRef.current) {
        setIsRetrying(true);
      }
      await onRetry();
    } finally {
      if (isMountedRef.current) {
        setIsRetrying(false);
      }
    }
  }, [isRetrying, onRetry, restartPhaseTimers]);

  const statusText = (canRetry ? phaseCopy : phaseCopyWithoutRetry)[phase];
  const isActionable = phase === 'actionable' || isRetrying;
  const backHomeHref = useMemo(() => `/?network=${network}`, [network]);

  return (
    <div
      className="flex w-full items-center justify-center px-4"
      style={{ minHeight: 'calc(100vh - var(--header-height) - var(--footer-height))' }}
    >
      <div className="w-full max-w-xl rounded-2xl border border-border/60 bg-card/50 px-6 py-8 shadow-lg backdrop-blur-sm sm:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative size-16" aria-hidden="true">
            <span className="absolute inset-0 rounded-full border border-info/30 animate-ping motion-reduce:animate-none" />
            <span className="absolute inset-1 rounded-full border border-info/50 animate-pulse motion-reduce:animate-none" />
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-info/10">
              <Search className="size-5 text-info animate-pulse motion-reduce:animate-none" />
            </span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Searching message</h1>

          <p role="status" aria-live="polite" className="text-sm text-muted-foreground">
            {statusText}
          </p>

          {phase !== 'initial' ? (
            <p className="text-xs text-muted-foreground/90">You can stay on this page while indexing catches up.</p>
          ) : null}

          <div className="mt-2 min-h-[44px] flex w-full flex-col items-center justify-center gap-2 sm:flex-row">
            {isActionable ? (
              <>
                {canRetry ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      void handleRetry();
                    }}
                    disabled={isRetrying}
                    className="animate-in fade-in duration-300"
                  >
                    {isRetrying ? (
                      <>
                        <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
                        Retrying...
                      </>
                    ) : (
                      <>
                        <RotateCcw className="size-4" />
                        Retry
                      </>
                    )}
                  </Button>
                ) : null}
                <Link href={backHomeHref} className={cn(buttonVariants(), 'animate-in fade-in duration-300 px-4')}>
                  Back Home
                </Link>
              </>
            ) : (
              <span aria-hidden className="invisible h-9" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Pending;
