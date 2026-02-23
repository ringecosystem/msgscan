/** @vitest-environment jsdom */

import { act, cleanup, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MESSAGE_STATUS } from '@/types/message';

import QuickInfoBar from './QuickInfoBar';

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
    ...overrides
  };
}

describe('QuickInfoBar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-14T12:00:00.000Z'));
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('renders stable timestamp during server-side render', () => {
    const message = createMessage({
      sentBlockTimestampSec: 1739534400
    });

    const markup = renderToStaticMarkup(<QuickInfoBar message={message} />);

    expect(markup).toContain('Updated');
    expect(markup).toContain('2025-02-14 12:00:00 UTC');
  });

  it('prefers dispatched timestamp over accepted timestamp', () => {
    const message = createMessage({
      accepted: {
        blockTimestamp: '1739534400000'
      } as CompositeMessage['accepted'],
      dispatched: {
        blockTimestamp: '1739620800000'
      } as CompositeMessage['dispatched']
    });

    const markup = renderToStaticMarkup(<QuickInfoBar message={message} />);

    expect(markup).toContain('2025-02-15 12:00:00 UTC');
    expect(markup).not.toContain('2025-02-14 12:00:00 UTC');
  });

  it('falls back to accepted timestamp when dispatched is unavailable', () => {
    const message = createMessage({
      accepted: {
        blockTimestamp: '1739534400000'
      } as CompositeMessage['accepted'],
      dispatched: undefined
    });

    const markup = renderToStaticMarkup(<QuickInfoBar message={message} />);

    expect(markup).toContain('2025-02-14 12:00:00 UTC');
  });

  it('upgrades stable timestamp to relative time after client mount', async () => {
    const message = createMessage({
      dispatched: {
        blockTimestamp: String(new Date('2026-02-13T12:00:00.000Z').getTime())
      } as CompositeMessage['dispatched']
    });

    render(<QuickInfoBar message={message} />);

    await act(async () => {
      vi.runOnlyPendingTimers();
      await Promise.resolve();
    });

    expect(screen.queryByText(/ago$/)).not.toBeNull();
  });

  it('does not render updated field when timestamp is unavailable', () => {
    const message = createMessage({
      sentBlockTimestampSec: 0,
      accepted: undefined,
      dispatched: undefined
    });

    render(<QuickInfoBar message={message} />);

    expect(screen.queryByText('Updated')).toBeNull();
  });
});
