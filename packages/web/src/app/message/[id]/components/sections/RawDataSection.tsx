'use client';

import { Code, ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { CodeFont } from '@/config/font';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import ClipboardIconButton from '@/components/clipboard-icon-button';

import { SectionLabel } from './shared';

interface RawDataSectionProps {
  message?: string;
  params?: string;
}

function RawField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[12px] font-semibold uppercase tracking-[0.04em] text-muted-foreground">
          {label}
        </span>
        <ClipboardIconButton text={value} size={14} />
      </div>
      <div
        className={cn(
          'break-all max-h-[300px] overflow-auto rounded-xl border border-border/50 bg-background p-4 text-xs leading-[1.7]',
          CodeFont.className
        )}
        style={{ overflowWrap: 'anywhere' }}
      >
        {value}
      </div>
    </div>
  );
}

export default function RawDataSection({ message, params }: RawDataSectionProps) {
  if (!message && !params) return null;

  return (
    <div className="space-y-3.5">
      <SectionLabel>Raw Data</SectionLabel>
      <Collapsible defaultOpen>
        <div className="overflow-hidden rounded-xl border border-border/50 bg-card">
          <CollapsibleTrigger className="flex w-full items-center justify-between px-6 py-[18px] text-[15px] font-semibold transition-colors hover:bg-card-elevated/50">
            <span className="flex items-center gap-2">
              <Code className="size-4 text-muted-foreground" />
              Payload &amp; Params
            </span>
            <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 in-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-4 border-t border-border/50 px-6 py-4">
              {message && <RawField label="Payload" value={message} />}
              {params && <RawField label="Params" value={params} />}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
}
