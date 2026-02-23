'use client';

import { Check, CircleDashed, HelpCircle, X } from 'lucide-react';

import { cn } from '@/lib/utils';

import { OBSERVED_EVENT_STATE_META, buildObservedEvents } from './observed-events-model';

import type { CompositeMessage } from '@/types/messages';

export { buildObservedEvents, computeObservedSummary } from './observed-events-model';

interface StepProgressBarProps {
  message: CompositeMessage;
}

const UNKNOWN_STATE_META = {
  label: 'Unknown',
  stepDotClass: 'bg-step-incomplete text-muted-foreground'
};

export default function StepProgressBar({ message }: StepProgressBarProps) {
  const events = buildObservedEvents(message);

  return (
    <div role="list" aria-label="Observed events" className="flex w-full flex-nowrap items-center gap-0 overflow-x-auto pb-1">
      {events.map((event, index) => {
        const isFailed = event.state === 'failed';
        const isSuccess = event.state === 'success';
        const isObserved = event.state === 'observed';
        const isInferred = event.state === 'inferred';
        const isPending = event.state === 'pending';
        const stateMeta =
          OBSERVED_EVENT_STATE_META[
            event.state as keyof typeof OBSERVED_EVENT_STATE_META
          ] ?? UNKNOWN_STATE_META;
        const stateLabel = stateMeta.label;

        return (
          <div key={event.id} className="flex items-center">
            {index > 0 && (
              <div aria-hidden className="h-px w-4 min-w-[1rem] shrink-0 self-center bg-border/50" />
            )}
            <div
              role="listitem"
              className={cn(
                'inline-flex items-center gap-2 rounded-full border border-border/40 bg-card-elevated/40 px-2.5 py-1.5'
              )}
            >
              <div
                className={cn(
                  'flex size-4 shrink-0 items-center justify-center rounded-full',
                  stateMeta.stepDotClass
                )}
              >
                {(isSuccess || isObserved) && (
                  <Check aria-hidden className="size-2.5" strokeWidth={3} />
                )}
                {isFailed && <X aria-hidden className="size-2.5" strokeWidth={3} />}
                {isInferred && <HelpCircle aria-hidden className="size-2.5" strokeWidth={2.5} />}
                {isPending && <CircleDashed aria-hidden className="size-2.5" strokeWidth={2.5} />}
              </div>
              <span
                className={cn(
                  'text-[13px] font-semibold whitespace-nowrap',
                  isFailed && 'text-step-4-failed',
                  isSuccess && 'text-success',
                  !isFailed && !isSuccess && 'text-foreground'
                )}
              >
                {event.label}
              </span>
              <span className="whitespace-nowrap text-[11px] text-muted-foreground">{stateLabel}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
