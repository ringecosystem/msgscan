/** @vitest-environment jsdom */

import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import MessageProgressStats from './message-progress-stats';

const { useMessageStatsMock, useMessageTrendMock, statsContainerPropsSpy } = vi.hoisted(() => ({
  useMessageStatsMock: vi.fn(),
  useMessageTrendMock: vi.fn(),
  statsContainerPropsSpy: vi.fn()
}));

vi.mock('@/hooks/services', () => ({
  useMessageStats: useMessageStatsMock
}));

vi.mock('@/hooks/use-message-trend', () => ({
  useMessageTrend: useMessageTrendMock
}));

vi.mock('@/components/stats-container', () => ({
  default: (props: Record<string, unknown>) => {
    statsContainerPropsSpy(props);
    return <div data-testid="stats-container" />;
  }
}));

describe('MessageProgressStats', () => {
  beforeEach(() => {
    useMessageStatsMock.mockReset();
    useMessageTrendMock.mockReset();
    statsContainerPropsSpy.mockReset();
  });

  it('combines loading/error state and retries both queries', () => {
    const refetchStats = vi.fn().mockResolvedValue({ data: undefined });
    const refetchTrend = vi.fn().mockResolvedValue({ data: undefined });

    useMessageStatsMock.mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
      refetch: refetchStats
    });
    useMessageTrendMock.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
      refetch: refetchTrend
    });

    render(<MessageProgressStats chains={[]} />);

    expect(screen.queryByTestId('stats-container')).not.toBeNull();
    const props = statsContainerPropsSpy.mock.calls[0]?.[0] as
      | {
          isLoading?: boolean;
          isError?: boolean;
          onRetry?: () => void;
        }
      | undefined;
    expect(props?.isLoading).toBe(true);
    expect(props?.isError).toBe(true);

    props?.onRetry?.();

    expect(refetchStats).toHaveBeenCalledTimes(1);
    expect(refetchTrend).toHaveBeenCalledTimes(1);
  });
});
