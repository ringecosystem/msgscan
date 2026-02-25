'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Check, Clock, XCircle } from 'lucide-react';

import { formatTimeAgo, formatTimestampStable } from '@/utils/date';
import { MESSAGE_STATUS } from '@/types/message';

import type { CHAIN } from '@/types/chains';
import type { CompositeMessage } from '@/types/messages';

interface QuickInfoBarProps {
  message: CompositeMessage;
  sourceChain?: CHAIN;
  targetChain?: CHAIN;
}

function resolveUpdatedTimestampSec(message: CompositeMessage) {
  if (message.dispatched?.blockTimestamp) {
    return String(Math.floor(Number(message.dispatched.blockTimestamp) / 1000));
  }
  if (message.accepted?.blockTimestamp) {
    return String(Math.floor(Number(message.accepted.blockTimestamp) / 1000));
  }
  if (message.sentBlockTimestampSec) {
    return String(message.sentBlockTimestampSec);
  }
  return '';
}

function QiSeparator() {
  return <div className="hidden h-4 w-px shrink-0 bg-border sm:block" aria-hidden="true" />;
}

function QiLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
      {children}
    </span>
  );
}

/** Status badge with icon */
const statusStyles = {
  [MESSAGE_STATUS.SUCCESS]: {
    label: 'Success',
    className: 'bg-success/15 text-success',
    Icon: Check,
  },
  [MESSAGE_STATUS.PENDING]: {
    label: 'Pending',
    className: 'bg-info/15 text-info',
    Icon: Clock,
  },
  [MESSAGE_STATUS.FAILED]: {
    label: 'Failed',
    className: 'bg-failure/15 text-failure',
    Icon: XCircle,
  },
} as const;

export default function QuickInfoBar({ message, sourceChain, targetChain }: QuickInfoBarProps) {
  const [hydrated, setHydrated] = useState(false);
  const updatedTimestampSec = resolveUpdatedTimestampSec(message);
  const stableUpdated = updatedTimestampSec ? formatTimestampStable(updatedTimestampSec) : '';
  const relativeUpdated = hydrated && updatedTimestampSec ? formatTimeAgo(updatedTimestampSec) : '';
  const updatedDisplay = relativeUpdated || stableUpdated;

  useEffect(() => {
    setHydrated(true);
  }, []);

  const statusCfg =
    typeof message.status !== 'undefined' && message.status !== -1
      ? statusStyles[message.status as MESSAGE_STATUS]
      : null;

  return (
    <div className="flex flex-wrap items-center gap-3 gap-y-1.5 text-sm">
      {/* Chain route capsule — flex-1 pushes remaining items to the right */}
      <div className="flex flex-1 items-center">
      <div className="flex items-center gap-2 rounded-full border border-border bg-card-elevated/60 px-3 py-1.5">
        {sourceChain?.iconUrl && (
          <Image
            src={sourceChain.iconUrl}
            alt={sourceChain.name}
            width={14}
            height={14}
            className="size-3.5 rounded-full"
          />
        )}
        <span className="text-sm font-semibold">{sourceChain?.name ?? 'Unknown'}</span>
        <span className="text-lg leading-none text-muted-foreground/70">&rarr;</span>
        {targetChain?.iconUrl && (
          <Image
            src={targetChain.iconUrl}
            alt={targetChain.name}
            width={14}
            height={14}
            className="size-3.5 rounded-full"
          />
        )}
        <span className="text-sm font-semibold">{targetChain?.name ?? 'Unknown'}</span>
      </div>
      </div>

      <QiSeparator />

      {/* Status */}
      <div className="flex items-center gap-2">
        <QiLabel>Status</QiLabel>
        {statusCfg && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${statusCfg.className}`}
          >
            <statusCfg.Icon className="size-3" strokeWidth={2.5} aria-hidden />
            {statusCfg.label}
          </span>
        )}
      </div>

      {updatedDisplay ? (
        <>
          <QiSeparator />
          {/* Updated */}
          <div className="flex items-center gap-2">
            <QiLabel>Updated</QiLabel>
            <span className="text-sm font-semibold">{updatedDisplay}</span>
          </div>
          <QiSeparator />
        </>
      ) : (
        <QiSeparator />
      )}

      {/* Protocol */}
      <div className="flex items-center gap-2">
        <QiLabel>Protocol</QiLabel>
        <span className="text-sm font-bold">{message.protocol?.toUpperCase() ?? '-'}</span>
      </div>
    </div>
  );
}

