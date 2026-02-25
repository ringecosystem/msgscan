import { describe, expect, it } from 'vitest';

import { MESSAGE_STATUS } from '@/types/message';

import { buildObservedEvents, computeObservedSummary } from './StepProgressBar';

import type { CompositeMessage } from '@/types/messages';

function createMessage(overrides: Partial<CompositeMessage> = {}): CompositeMessage {
  return {
    msgId: '0xmsg',
    protocol: 'ormp',
    status: MESSAGE_STATUS.PENDING,
    transactionHash: '0xtx',
    targetTransactionHash: undefined,
    transactionFrom: '0xfrom',
    fromChainId: '1',
    toChainId: '2',
    fromDapp: 'from',
    toDapp: 'to',
    portAddress: '0xport',
    message: '0xdata',
    params: '0x',
    sentBlockTimestampSec: 1700000000,
    dispatchedBlockTimestampSec: undefined,
    accepted: undefined,
    dispatched: undefined,
    sent: {} as CompositeMessage['sent'],
    ...overrides,
  };
}

describe('buildObservedEvents', () => {
  it('keeps outcome pending when dispatched exists but final status is not success', () => {
    const message = createMessage({
      dispatched: {} as CompositeMessage['dispatched'],
      status: MESSAGE_STATUS.PENDING,
    });

    const events = buildObservedEvents(message);

    expect(events[3]?.label).toBe('Outcome');
    expect(events[3]?.state).toBe('pending');
  });

  it('marks outcome success only when final status is success', () => {
    const message = createMessage({
      dispatched: {} as CompositeMessage['dispatched'],
      status: MESSAGE_STATUS.SUCCESS,
    });

    const events = buildObservedEvents(message);

    expect(events[3]?.state).toBe('success');
  });

  it('marks accepted as inferred when accepted event is missing but dispatched exists', () => {
    const message = createMessage({
      dispatched: {} as CompositeMessage['dispatched'],
      accepted: undefined,
      status: MESSAGE_STATUS.PENDING,
    });

    const events = buildObservedEvents(message);

    expect(events[1]?.label).toBe('Accepted');
    expect(events[1]?.state).toBe('inferred');
  });
});

describe('computeObservedSummary', () => {
  it('returns success summary when message status is success', () => {
    const message = createMessage({
      status: MESSAGE_STATUS.SUCCESS,
      dispatched: {} as CompositeMessage['dispatched'],
    });

    const summary = computeObservedSummary(message);

    expect(summary.tone).toBe('success');
  });

  it('returns failure summary when message status is failed', () => {
    const message = createMessage({
      dispatched: {} as CompositeMessage['dispatched'],
      status: MESSAGE_STATUS.FAILED,
    });

    const summary = computeObservedSummary(message);

    expect(summary.tone).toBe('failure');
  });
});
