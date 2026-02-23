/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getNetwork } from '@/utils/network';

import MessageCard from './message-card';

import type { CompositeMessage } from '@/types/messages';

const { pushMock } = vi.hoisted(() => ({
  pushMock: vi.fn()
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock
  })
}));

vi.mock('next/font/google', () => ({
  Geist: () => ({
    className: '',
    variable: ''
  }),
  JetBrains_Mono: () => ({
    className: '',
    variable: ''
  })
}));

const message = {
  msgId: '0xdaf33c177c251e906a3cdf38572b049fcc49403a27deac44635bf675611899b4',
  protocol: 'ormp',
  status: 3,
  transactionHash: '0x530d7d7273781f2fd9a6afea43bbcdc4db1824794f730d6b631cf567e44feef9',
  targetTransactionHash: '0x18a9251d1989b4f12953f8aab32311f273737c1386a78135c5e16771eb823bbf',
  transactionFrom: '0xebd9a48ed1128375eb4383ed4d53478b4fd85a8d',
  fromChainId: '46',
  toChainId: '1',
  fromDapp: '0x682294d1c00a9ca13290b53b7544b8f734d6501f',
  toDapp: '0x02e5c0a36fb0c83ccebcd4d6177a7e223d6f0b7c',
  portAddress: '0x2cd1867fb8016f93710b6386f7f9f1d540a60812',
  message: '0x',
  params: '0x',
  sentBlockTimestampSec: 1700000000,
  sent: {}
} as unknown as CompositeMessage;

beforeEach(() => {
  pushMock.mockReset();
});

afterEach(() => {
  cleanup();
});

describe('MessageCard', () => {
  it('navigates to message detail when card is clicked', () => {
    render(<MessageCard message={message} network="mainnet" />);

    const card = screen.getByLabelText(/open message .* details/i);
    const normalizedNetwork = getNetwork('mainnet');
    fireEvent.click(card);

    expect(pushMock).toHaveBeenCalledWith(
      `/message/0xdaf33c177c251e906a3cdf38572b049fcc49403a27deac44635bf675611899b4?network=${normalizedNetwork}`
    );
  });

  it('renders sender link to sender page and does not trigger card navigation', () => {
    render(<MessageCard message={message} network="mainnet" />);

    const senderLink = screen.getByTitle(message.transactionFrom as string);
    const normalizedNetwork = getNetwork('mainnet');
    const messageDetailUrl = `/message/0xdaf33c177c251e906a3cdf38572b049fcc49403a27deac44635bf675611899b4?network=${normalizedNetwork}`;

    expect(senderLink.getAttribute('href')).toBe(
      `/sender/${encodeURIComponent(message.transactionFrom as string)}?network=${normalizedNetwork}`
    );

    fireEvent.click(senderLink);
    expect(pushMock).not.toHaveBeenCalledWith(messageDetailUrl);
  });

  it('shows placeholder when sender is missing', () => {
    const withoutSender = {
      ...message,
      transactionFrom: null
    } as unknown as CompositeMessage;

    render(<MessageCard message={withoutSender} network="mainnet" />);

    expect(screen.getByText('--')).toBeDefined();
  });
});
