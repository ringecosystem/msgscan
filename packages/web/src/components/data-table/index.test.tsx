/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import DataTable from './index';

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

describe('DataTable row interaction', () => {
  beforeEach(() => {
    pushMock.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it('does not trigger row navigation when Enter is pressed on nested link', () => {
    render(
      <DataTable
        loading={false}
        network="mainnet"
        dataSource={[message]}
        pageSize={15}
        offset={0}
        onPreviousPageClick={() => {}}
        onNextPageClick={() => {}}
      />
    );

    const table = screen.getByRole('table');
    const sourceTxLink = within(table).getByRole('link', { name: /0x530d/i });
    sourceTxLink.focus();
    fireEvent.keyDown(sourceTxLink, { key: 'Enter' });

    expect(pushMock).not.toHaveBeenCalled();
  });

  it('still supports row keyboard navigation when row itself is focused', () => {
    render(
      <DataTable
        loading={false}
        network="mainnet"
        dataSource={[message]}
        pageSize={15}
        offset={0}
        onPreviousPageClick={() => {}}
        onNextPageClick={() => {}}
      />
    );

    const table = screen.getByRole('table');
    const rowLink = within(table).getByRole('link', { name: /open message .* details/i });
    rowLink.focus();
    fireEvent.keyDown(rowLink, { key: 'Enter' });

    expect(pushMock).toHaveBeenCalledWith(
      '/message/0xdaf33c177c251e906a3cdf38572b049fcc49403a27deac44635bf675611899b4?network=mainnet'
    );
  });

  it('keeps table body visible while loading when real data exists', () => {
    const { container } = render(
      <DataTable
        loading
        network="mainnet"
        dataSource={[message]}
        pageSize={15}
        offset={0}
        onPreviousPageClick={() => {}}
        onNextPageClick={() => {}}
      />
    );

    const tableBody = container.querySelector('tbody');
    expect(tableBody).not.toBeNull();
    expect(tableBody?.className.includes('opacity-100')).toBe(true);
    expect(tableBody?.className.includes('opacity-0')).toBe(false);
  });

  it('renders original sender link to sender page', () => {
    const { container } = render(
      <DataTable
        loading={false}
        network="mainnet"
        dataSource={[message]}
        pageSize={15}
        offset={0}
        onPreviousPageClick={() => {}}
        onNextPageClick={() => {}}
      />
    );

    const senderLink = container.querySelector<HTMLAnchorElement>(
      `a[title="${message.transactionFrom}"]`
    );

    expect(senderLink).not.toBeNull();
    expect(senderLink?.getAttribute('href')).toBe(
      `/sender/${encodeURIComponent(message.transactionFrom)}?network=mainnet`
    );
  });
});
