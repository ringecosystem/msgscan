import { formatTimeAgo } from '@/utils/date';
import { MESSAGE_STATUS } from '@/types/message';

import type { CHAIN } from '@/types/chains';
import type { CompositeMessage } from '@/types/messages';

export type ObservedEventState = 'observed' | 'inferred' | 'pending' | 'success' | 'failed';
export type ObservedEventId = 'sent' | 'accepted' | 'dispatched' | 'outcome';

interface ObservedEventStateMeta {
  label: string;
  stepDotClass: string;
  evidencePillClass: string;
}

export const OBSERVED_EVENT_STATE_META: Record<ObservedEventState, ObservedEventStateMeta> = {
  observed: {
    label: 'Observed',
    stepDotClass: 'bg-step-1 text-white',
    evidencePillClass: 'bg-step-1/15 text-step-1',
  },
  inferred: {
    label: 'Inferred',
    stepDotClass: 'bg-step-3 text-white',
    evidencePillClass: 'bg-step-3/15 text-step-3',
  },
  pending: {
    label: 'Pending',
    stepDotClass: 'bg-step-incomplete text-muted-foreground',
    evidencePillClass: 'bg-muted text-muted-foreground',
  },
  success: {
    label: 'Success',
    stepDotClass: 'bg-step-4-success text-white',
    evidencePillClass: 'bg-success/15 text-success',
  },
  failed: {
    label: 'Failed',
    stepDotClass: 'bg-step-4-failed text-white',
    evidencePillClass: 'bg-failure/15 text-failure',
  },
};

export interface ObservedEvent {
  id: ObservedEventId;
  label: string;
  subLabel: string;
  state: ObservedEventState;
}

export type OverviewTone = 'neutral' | 'success' | 'failure';

export interface EventEvidenceItem {
  id: ObservedEventId;
  label: string;
  tone: ObservedEventState;
  time: string;
  hash?: string;
  chain?: CHAIN;
  rule: string;
}

interface ObservedSnapshot {
  hasSent: boolean;
  hasAccepted: boolean;
  hasDispatched: boolean;
  isFailed: boolean;
  isSuccess: boolean;
}

function deriveObservedSnapshot(message: CompositeMessage): ObservedSnapshot {
  return {
    hasSent: Boolean(message.sent),
    hasAccepted: Boolean(message.accepted),
    hasDispatched: Boolean(message.dispatched),
    isFailed: message.status === MESSAGE_STATUS.FAILED,
    isSuccess: message.status === MESSAGE_STATUS.SUCCESS,
  };
}

function msTimestampToAgo(timestamp?: string): string {
  if (!timestamp) return 'Not observed';
  const ms = Number(timestamp);
  if (!Number.isFinite(ms)) return 'Not observed';
  return formatTimeAgo(String(Math.floor(ms / 1000))) || 'Not observed';
}

function secTimestampToAgo(timestampSec?: number): string {
  if (!timestampSec) return 'Not observed';
  return formatTimeAgo(String(timestampSec)) || 'Not observed';
}

export function buildObservedEvents(message: CompositeMessage): ObservedEvent[] {
  const { hasSent, hasAccepted, hasDispatched, isFailed, isSuccess } = deriveObservedSnapshot(message);

  const acceptedState: ObservedEventState = hasAccepted
    ? 'observed'
    : hasDispatched
      ? 'inferred'
      : 'pending';
  const acceptedSubLabel = hasAccepted
    ? 'Accepted event observed'
    : hasDispatched
      ? 'Inferred from dispatched event'
      : 'Waiting for accepted event';

  const outcomeState: ObservedEventState = isSuccess ? 'success' : isFailed ? 'failed' : 'pending';
  const outcomeSubLabel = isSuccess
    ? 'Execution succeeded'
    : isFailed
      ? 'Execution failed'
      : hasDispatched
        ? 'Waiting for final result'
        : 'Waiting for dispatch event';

  return [
    {
      id: 'sent',
      label: 'Sent',
      subLabel: hasSent ? 'Sent event observed' : 'Waiting for sent event',
      state: hasSent ? 'observed' : 'pending',
    },
    {
      id: 'accepted',
      label: 'Accepted',
      subLabel: acceptedSubLabel,
      state: acceptedState,
    },
    {
      id: 'dispatched',
      label: 'Dispatched',
      subLabel: hasDispatched ? 'Dispatched event observed' : 'Waiting for dispatched event',
      state: hasDispatched ? 'observed' : 'pending',
    },
    {
      id: 'outcome',
      label: 'Outcome',
      subLabel: outcomeSubLabel,
      state: outcomeState,
    },
  ];
}

export function computeObservedSummary(message: CompositeMessage): { label: string; tone: OverviewTone } {
  const { hasSent, hasAccepted, hasDispatched, isFailed, isSuccess } = deriveObservedSnapshot(message);

  if (isSuccess) {
    return { label: 'Observed · Success', tone: 'success' };
  }
  if (isFailed) {
    return { label: 'Observed · Failed', tone: 'failure' };
  }
  if (hasDispatched) {
    return { label: 'Observed · Pending final result', tone: 'neutral' };
  }
  if (hasAccepted) {
    return { label: 'Observed · In transit', tone: 'neutral' };
  }
  if (hasSent) {
    return { label: 'Observed · Submitted', tone: 'neutral' };
  }

  return { label: 'Observed · Awaiting data', tone: 'neutral' };
}

export function buildObservedEvidence(
  message: CompositeMessage,
  sourceChain?: CHAIN,
  targetChain?: CHAIN
): EventEvidenceItem[] {
  const { hasSent, hasAccepted, hasDispatched, isFailed, isSuccess } = deriveObservedSnapshot(message);
  const inferredAcceptedHash = message.targetTransactionHash ?? message.dispatched?.transactionHash;

  return [
    {
      id: 'sent',
      label: 'Sent',
      tone: hasSent ? 'observed' : 'pending',
      time: secTimestampToAgo(message.sentBlockTimestampSec),
      hash: message.transactionHash,
      chain: sourceChain,
      rule: hasSent ? 'Observed from MsgportMessageSent' : 'Awaiting MsgportMessageSent event',
    },
    {
      id: 'accepted',
      label: 'Accepted',
      tone: hasAccepted ? 'observed' : hasDispatched ? 'inferred' : 'pending',
      time: hasAccepted
        ? msTimestampToAgo(message.accepted?.blockTimestamp)
        : hasDispatched
          ? msTimestampToAgo(message.dispatched?.blockTimestamp)
          : 'Not observed',
      hash: hasAccepted ? message.accepted?.transactionHash : inferredAcceptedHash,
      chain: targetChain,
      rule: hasAccepted
        ? 'Observed from ORMPMessageAccepted'
        : hasDispatched
          ? 'Inferred from ORMPMessageDispatched (accepted event not indexed)'
          : 'Awaiting ORMPMessageAccepted event',
    },
    {
      id: 'dispatched',
      label: 'Dispatched',
      tone: hasDispatched ? 'observed' : 'pending',
      time: msTimestampToAgo(message.dispatched?.blockTimestamp),
      hash: message.targetTransactionHash ?? message.dispatched?.transactionHash,
      chain: targetChain,
      rule: hasDispatched
        ? 'Observed from ORMPMessageDispatched'
        : 'Awaiting ORMPMessageDispatched event',
    },
    {
      id: 'outcome',
      label: 'Outcome',
      tone: isSuccess ? 'success' : isFailed ? 'failed' : 'pending',
      time: hasDispatched ? msTimestampToAgo(message.dispatched?.blockTimestamp) : 'Not observed',
      hash: message.targetTransactionHash ?? message.dispatched?.transactionHash,
      chain: targetChain,
      rule: hasDispatched
        ? 'Derived from dispatchResult on ORMPMessageDispatched'
        : 'Awaiting dispatchResult from ORMPMessageDispatched',
    },
  ];
}
