/** @vitest-environment jsdom */

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Network } from '@/types/network';

import Pending, {
  PENDING_ACTIONABLE_PHASE_MS,
  PENDING_INDEXING_PHASE_MS
} from './Pending';

vi.mock('@/hooks/useNetwork', () => ({
  useNetworkFromQuery: () => Network.MAINNET
}));

describe('Pending', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('shows phased feedback and actions after timeout window', async () => {
    render(<Pending onRetry={() => Promise.resolve()} />);

    expect(screen.queryByText('Looking up the message on mainnet network…')).not.toBeNull();
    expect(screen.queryByRole('button', { name: 'Retry' })).toBeNull();

    act(() => {
      vi.advanceTimersByTime(PENDING_INDEXING_PHASE_MS + 1);
    });
    expect(screen.queryByText('Messages may take up to a minute to be indexed.')).not.toBeNull();
    expect(screen.queryByRole('button', { name: 'Retry' })).toBeNull();

    act(() => {
      vi.advanceTimersByTime(PENDING_ACTIONABLE_PHASE_MS - PENDING_INDEXING_PHASE_MS + 1);
    });
    expect(screen.queryByText('Still not found. You can retry or go back.')).not.toBeNull();
    expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeNull();
    const backHomeLink = screen.getByRole('link', { name: 'Back Home' });
    expect(backHomeLink.getAttribute('href')).toBe('/?network=mainnet');
  });

  it('shows back-home action only when retry callback is missing', () => {
    render(<Pending />);

    act(() => {
      vi.advanceTimersByTime(PENDING_ACTIONABLE_PHASE_MS + 1);
    });

    expect(screen.queryByText('Still not found. Go back and try again later.')).not.toBeNull();
    expect(screen.queryByRole('button', { name: 'Retry' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Back Home' })).not.toBeNull();
  });

  it('runs retry callback and restores button state', async () => {
    let resolveRetry: (() => void) | null = null;
    const onRetry = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveRetry = resolve;
        })
    );
    render(<Pending onRetry={onRetry} />);

    act(() => {
      vi.advanceTimersByTime(PENDING_ACTIONABLE_PHASE_MS);
    });

    const retryButton = screen.getByRole('button', { name: 'Retry' });
    fireEvent.click(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
    expect((screen.getByRole('button', { name: 'Retrying...' }) as HTMLButtonElement).disabled).toBe(
      true
    );

    await act(async () => {
      resolveRetry?.();
      await Promise.resolve();
    });
    expect(screen.queryByText('Looking up the message on mainnet network…')).not.toBeNull();
    expect(screen.queryByRole('button', { name: 'Retry' })).toBeNull();

    act(() => {
      vi.advanceTimersByTime(PENDING_ACTIONABLE_PHASE_MS + 1);
    });
    expect((screen.getByRole('button', { name: 'Retry' }) as HTMLButtonElement).disabled).toBe(false);
  });
});
