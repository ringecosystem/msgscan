'use client';

import { Layers, ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { CodeFont } from '@/config/font';
import { toShortText } from '@/utils';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import ClipboardIconButton from '@/components/clipboard-icon-button';

import AddressInfo from '../AddressInfo';

import { SectionLabel, DetailRow } from './shared';

import type { CHAIN } from '@/types/chains';
import type { ORMPMessageAccepted } from '@/graphql/type';

interface ProtocolDetailsSectionProps {
  accepted: ORMPMessageAccepted;
  targetChain?: CHAIN;
}

export default function ProtocolDetailsSection({
  accepted,
  targetChain,
}: ProtocolDetailsSectionProps) {
  return (
    <div className="space-y-3.5">
      <SectionLabel>Protocol Details</SectionLabel>
      <Collapsible defaultOpen>
        <div className="overflow-hidden rounded-xl border border-border/50 bg-card">
          <CollapsibleTrigger className="flex w-full items-center justify-between px-6 py-[18px] text-[15px] font-semibold transition-colors hover:bg-card-elevated/50">
            <span className="flex items-center gap-2">
              <Layers className="size-4 text-muted-foreground" />
              ORMP Details
            </span>
            <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 in-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid gap-x-10 border-t border-border/50 px-6 py-4 sm:grid-cols-2 [&>*:nth-last-child(-n+2)]:border-b-0">
              <DetailRow label="Msg Hash">
                <div className="flex items-center gap-1.5">
                  <span className={cn('text-[13px]', CodeFont.className)} title={accepted.msgHash}>
                    {toShortText({ text: accepted.msgHash, frontLength: 6, backLength: 4 }) || '-'}
                  </span>
                  {accepted.msgHash && <ClipboardIconButton text={accepted.msgHash} size={14} />}
                </div>
              </DetailRow>

              <DetailRow label="Index">
                <span className={cn('text-[13px]', CodeFont.className)}>
                  {accepted.index ? Number(accepted.index).toLocaleString() : '-'}
                </span>
              </DetailRow>

              <DetailRow label="From Chain ID">
                <span className={cn('text-[13px]', CodeFont.className)}>
                  {accepted.fromChainId || '-'}
                </span>
              </DetailRow>

              <DetailRow label="To Chain ID">
                <span className={cn('text-[13px]', CodeFont.className)}>
                  {accepted.toChainId || '-'}
                </span>
              </DetailRow>

              <DetailRow label="Oracle">
                <AddressInfo address={accepted.oracle ?? undefined} chain={targetChain} />
              </DetailRow>

              <DetailRow label="Relayer">
                <AddressInfo address={accepted.relayer ?? undefined} chain={targetChain} />
              </DetailRow>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
}
