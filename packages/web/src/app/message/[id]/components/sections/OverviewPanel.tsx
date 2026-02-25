'use client';

import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

import StepProgressBar, { computeObservedSummary } from './StepProgressBar';
import QuickInfoBar from './QuickInfoBar';
import EventEvidencePanel from './EventEvidencePanel';

import type { CHAIN } from '@/types/chains';
import type { CompositeMessage } from '@/types/messages';

interface OverviewPanelProps {
  message: CompositeMessage;
  sourceChain?: CHAIN;
  targetChain?: CHAIN;
}

const summaryPillStyles = {
  neutral: 'border-info/20 bg-info/15 text-info',
  success: 'border-success/20 bg-success/15 text-success',
  failure: 'border-failure/20 bg-failure/15 text-failure',
} as const;

export default function OverviewPanel({ message, sourceChain, targetChain }: OverviewPanelProps) {
  const summary = computeObservedSummary(message);
  const [showEvidence, setShowEvidence] = useState(false);
  const evidencePanelId = useId();

  return (
    <div
      data-panel-status={summary.tone}
      className="rounded-xl border border-border/50 bg-linear-to-b from-card to-card/80 px-5 pt-[18px] pb-3.5 shadow-sm dark:shadow-md sm:px-6"
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
          Observed Events
        </span>
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide whitespace-nowrap ${summaryPillStyles[summary.tone]}`}
        >
          {summary.label}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-3.5 border-b border-border/30 pb-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Indexed event evidence
          </div>
          <button
            type="button"
            onClick={() => setShowEvidence((prev) => !prev)}
            aria-expanded={showEvidence}
            aria-controls={evidencePanelId}
            className="inline-flex items-center gap-1 rounded-md border border-border/50 bg-muted/60 px-2 py-1 text-xs font-medium text-foreground transition-colors hover:border-border hover:bg-muted"
          >
            {showEvidence ? 'Hide evidence' : 'View evidence'}
            <ChevronDown
              className={cn('size-3 transition-transform', showEvidence && 'rotate-180')}
              strokeWidth={2}
            />
          </button>
        </div>
        <StepProgressBar message={message} />
        {showEvidence && (
          <div id={evidencePanelId} className="mt-3">
            <EventEvidencePanel message={message} sourceChain={sourceChain} targetChain={targetChain} />
          </div>
        )}
      </div>

      {/* Quick info */}
      <div className="pt-3.5">
        <QuickInfoBar message={message} sourceChain={sourceChain} targetChain={targetChain} />
      </div>
    </div>
  );
}
