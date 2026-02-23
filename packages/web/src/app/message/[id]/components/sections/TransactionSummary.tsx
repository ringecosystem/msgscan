'use client';

import { isValid } from 'date-fns';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { CodeFont } from '@/config/font';
import { MESSAGE_STATUS } from '@/types/message';
import { Badge } from '@/components/ui/badge';
import { formatTimeAgo } from '@/utils/date';
import { useNetworkFromQuery } from '@/hooks/useNetwork';

import TransactionHashInfo from '../TransactionHashInfo';
import AddressInfo from '../AddressInfo';

import { SectionLabel, DetailRow } from './shared';

import type { CHAIN } from '@/types/chains';
import type { CompositeMessage } from '@/types/messages';

interface TransactionSummaryProps {
  message: CompositeMessage;
  sourceChain?: CHAIN;
  targetChain?: CHAIN;
}

function blockTimestampMsToString(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const ms = Number(value);
    if (!Number.isFinite(ms)) return null;
    const d = new Date(ms);
    if (!isValid(d)) return null;
    // Format as YYYY-MM-DD HH:mm:ss UTC
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    const hh = String(d.getUTCHours()).padStart(2, '0');
    const min = String(d.getUTCMinutes()).padStart(2, '0');
    const ss = String(d.getUTCSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss} UTC`;
  } catch {
    return null;
  }
}

function blockTimestampMsToSecString(value: string | undefined): string | null {
  if (!value) return null;
  const ms = Number(value);
  if (!Number.isFinite(ms)) return null;
  return String(Math.floor(ms / 1000));
}

export default function TransactionSummary({
  message,
  sourceChain,
  targetChain,
}: TransactionSummaryProps) {
  const [hydrated, setHydrated] = useState(false);
  const network = useNetworkFromQuery();

  useEffect(() => {
    setHydrated(true);
  }, []);

  const isPending =
    message.status !== MESSAGE_STATUS.SUCCESS && message.status !== MESSAGE_STATUS.FAILED;
  const isFailed = message.status === MESSAGE_STATUS.FAILED;

  const sourceAbsoluteTime = blockTimestampMsToString(message.sent?.blockTimestamp);
  const targetAbsoluteTime = blockTimestampMsToString(message.dispatched?.blockTimestamp);

  const sourceSec = blockTimestampMsToSecString(message.sent?.blockTimestamp);
  const targetSec = blockTimestampMsToSecString(message.dispatched?.blockTimestamp);

  const sourceRelativeTime = hydrated && sourceSec ? formatTimeAgo(sourceSec) : null;
  const targetRelativeTime = hydrated && targetSec ? formatTimeAgo(targetSec) : null;
  const senderAddress = message.transactionFrom ?? undefined;
  const senderHref = senderAddress
    ? `/sender/${encodeURIComponent(senderAddress)}?network=${network}`
    : undefined;

  return (
    <div className="space-y-3.5">
      <SectionLabel>Transaction Summary</SectionLabel>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Source card */}
        <div className="rounded-xl border border-border/50 bg-card p-4 sm:p-6">
          <div className="mb-3 flex items-center gap-2.5 border-b border-border/50 pb-2.5 sm:mb-5 sm:pb-3.5">
            <span className="rounded bg-info/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-info">
              Source
            </span>
            <span className="text-[15px] font-semibold">{sourceChain?.name ?? 'Unknown'}</span>
          </div>
          <div>
            <DetailRow label="Tx Hash">
              <TransactionHashInfo chain={sourceChain} hash={message.transactionHash} />
            </DetailRow>
            <DetailRow label="Block">
              <span className={cn('text-[13px]', CodeFont.className)}>
                {message.sent?.blockNumber ? Number(message.sent.blockNumber).toLocaleString() : '-'}
              </span>
            </DetailRow>
            {sourceAbsoluteTime && (
              <DetailRow label="Timestamp">
                <span className="text-[13px]" title={sourceAbsoluteTime}>
                  {sourceRelativeTime ?? sourceAbsoluteTime}
                </span>
              </DetailRow>
            )}
            <DetailRow label="Sender">
              <AddressInfo address={senderAddress} chain={sourceChain} href={senderHref} />
            </DetailRow>
          </div>
        </div>

        {/* Target card */}
        <div
          className={cn(
            'rounded-xl border bg-card p-4 sm:p-6',
            isFailed ? 'border-failure/30' : 'border-border/50',
          )}
        >
          <div className={cn('mb-3 flex items-center gap-2.5 border-b border-border/50 pb-2.5 sm:mb-5 sm:pb-3.5', isPending && 'opacity-60')}>
            <span className="rounded bg-step-2/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-step-2">
              Target
            </span>
            <span className="text-[15px] font-semibold">{targetChain?.name ?? 'Unknown'}</span>
            {isFailed && (
              <Badge variant="destructive" className="ml-auto text-[11px]">Reverted</Badge>
            )}
          </div>
          {isPending ? (
            <div className="flex items-center justify-center py-10 text-center">
              <p className="text-sm text-muted-foreground">
                Waiting for message dispatch
              </p>
            </div>
          ) : (
            <div>
              <DetailRow label="Tx Hash">
                <TransactionHashInfo
                  chain={targetChain}
                  hash={message.targetTransactionHash}
                />
              </DetailRow>
              <DetailRow label="Block">
                <span className={cn('text-[13px]', CodeFont.className)}>
                  {message.dispatched?.blockNumber ? Number(message.dispatched.blockNumber).toLocaleString() : '-'}
                </span>
              </DetailRow>
              {targetAbsoluteTime && (
                <DetailRow label="Timestamp">
                  <span className="text-[13px]" title={targetAbsoluteTime}>
                    {targetRelativeTime ?? targetAbsoluteTime}
                  </span>
                </DetailRow>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
