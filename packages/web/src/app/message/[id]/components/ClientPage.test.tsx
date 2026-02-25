/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import ClientPage from './ClientPage';

import type { CHAIN } from '@/types/chains';

const { useMessageMock, pendingPropsSpy, refetchMock, detailPropsSpy } = vi.hoisted(() => ({
  useMessageMock: vi.fn(),
  pendingPropsSpy: vi.fn(),
  refetchMock: vi.fn(),
  detailPropsSpy: vi.fn()
}));

vi.mock('@/hooks/services', () => ({
  useMessage: useMessageMock
}));

vi.mock('./Pending', () => ({
  default: (props: { onRetry?: () => Promise<unknown> | unknown }) => {
    pendingPropsSpy(props);
    return <div data-testid="pending-view">pending</div>;
  }
}));

vi.mock('./TxDetail', () => ({
  default: (props: Record<string, unknown>) => {
    detailPropsSpy(props);
    return <div data-testid="detail-view">detail</div>;
  }
}));

vi.mock('./NotFound', () => ({
  default: () => <div data-testid="not-found-view">not-found</div>
}));

const emptyChains: CHAIN[] = [];

describe('ClientPage', () => {
  beforeEach(() => {
    useMessageMock.mockReset();
    pendingPropsSpy.mockReset();
    refetchMock.mockReset();
    detailPropsSpy.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it('passes retry handler to Pending and delegates to refetch', async () => {
    refetchMock.mockResolvedValue({ data: null });
    useMessageMock.mockReturnValue({
      data: null,
      isPending: true,
      isSuccess: false,
      isError: false,
      refetch: refetchMock
    });

    render(<ClientPage id="0xabc" chains={emptyChains} />);

    expect(screen.queryByTestId('pending-view')).not.toBeNull();
    const onRetry = pendingPropsSpy.mock.calls[0]?.[0]?.onRetry as (() => Promise<unknown>) | undefined;
    expect(typeof onRetry).toBe('function');
    await onRetry?.();
    expect(refetchMock).toHaveBeenCalledTimes(1);
  });

  it('renders not-found view when query resolves empty with terminal status', () => {
    useMessageMock.mockReturnValue({
      data: null,
      isPending: false,
      isSuccess: true,
      isError: false,
      refetch: refetchMock
    });

    render(<ClientPage id="0xabc" chains={emptyChains} />);

    expect(screen.queryByTestId('not-found-view')).not.toBeNull();
  });

  it('renders detail when message data exists', () => {
    const chains = [
      { id: 1, name: 'Ethereum', iconUrl: '/eth.svg' },
      { id: 42161, name: 'Arbitrum', iconUrl: '/arb.svg' }
    ] as CHAIN[];
    const message = {
      fromChainId: '1',
      toChainId: '42161',
      accepted: {
        toChainId: '42161'
      }
    };
    useMessageMock.mockReturnValue({
      data: message,
      isPending: false,
      isSuccess: true,
      isError: false,
      refetch: refetchMock
    });

    render(<ClientPage id="0xabc" chains={chains} />);

    expect(screen.queryByTestId('detail-view')).not.toBeNull();
    expect(detailPropsSpy).toHaveBeenCalledTimes(1);
    const props = detailPropsSpy.mock.calls[0]?.[0] as Record<string, unknown> | undefined;
    expect(props?.sourceChain).toBe(chains[0]);
    expect(props?.targetChain).toBe(chains[1]);
    expect(props?.acceptedTargetChain).toBe(chains[1]);
    expect(props?.message).toBe(message);
  });

  it('shows stale-data error banner when refresh fails but cached data exists', () => {
    const message = {
      fromChainId: '1',
      toChainId: '42161',
      accepted: {
        toChainId: '42161'
      }
    };
    useMessageMock.mockReturnValue({
      data: message,
      isPending: false,
      isSuccess: false,
      isError: true,
      refetch: refetchMock
    });

    render(<ClientPage id="0xabc" chains={emptyChains} />);

    expect(
      screen.queryByText('Failed to refresh latest message data. Showing the last known result.')
    ).not.toBeNull();
    expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeNull();
    expect(screen.queryByTestId('detail-view')).not.toBeNull();
  });

  it('retries from stale-data banner', () => {
    refetchMock.mockResolvedValue({ data: null });
    const message = {
      fromChainId: '1',
      toChainId: '42161'
    };
    useMessageMock.mockReturnValue({
      data: message,
      isPending: false,
      isSuccess: false,
      isError: true,
      refetch: refetchMock
    });

    render(<ClientPage id="0xabc" chains={emptyChains} />);
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));

    expect(refetchMock).toHaveBeenCalledTimes(1);
  });
});
