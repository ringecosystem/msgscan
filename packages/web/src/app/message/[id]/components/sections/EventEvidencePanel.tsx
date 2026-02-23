import { cn } from '@/lib/utils';

import TransactionHashInfo from '../TransactionHashInfo';

import { OBSERVED_EVENT_STATE_META, buildObservedEvidence } from './observed-events-model';

import type { CHAIN } from '@/types/chains';
import type { CompositeMessage } from '@/types/messages';

interface EventEvidencePanelProps {
  message: CompositeMessage;
  sourceChain?: CHAIN;
  targetChain?: CHAIN;
}

const UNKNOWN_TONE_META = {
  label: 'Unknown',
  evidencePillClass: 'bg-muted text-muted-foreground'
};

export default function EventEvidencePanel({
  message,
  sourceChain,
  targetChain,
}: EventEvidencePanelProps) {
  const items = buildObservedEvidence(message, sourceChain, targetChain);

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {items.map((item) => {
        const toneMeta =
          OBSERVED_EVENT_STATE_META[
            item.tone as keyof typeof OBSERVED_EVENT_STATE_META
          ] ?? UNKNOWN_TONE_META;

        return (
          <div
            key={item.id}
            className="rounded-lg border border-border/40 bg-card-elevated/40 px-3 py-2"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[13px] font-semibold text-foreground">{item.label}</span>
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold',
                  toneMeta.evidencePillClass
                )}
              >
                {toneMeta.label}
              </span>
            </div>
            <div className="mt-2 space-y-1 text-[11px]">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-muted-foreground">Time</span>
                <span className="text-foreground">{item.time}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-muted-foreground">Tx</span>
                <div className="min-w-0">
                  {item.hash ? (
                    <TransactionHashInfo chain={item.chain} hash={item.hash} />
                  ) : (
                    <span className="text-muted-foreground">Not observed</span>
                  )}
                </div>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium text-muted-foreground">Rule</span>
                <span className="max-w-[70%] text-right text-muted-foreground">{item.rule}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
