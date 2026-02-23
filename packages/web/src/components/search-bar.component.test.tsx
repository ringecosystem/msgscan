/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ChAIN_ID } from '@/types/chains';
import { Network } from '@/types/network';

const { pushMock, useQueryMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  useQueryMock: vi.fn()
}));
const { toastErrorMock } = vi.hoisted(() => ({
  toastErrorMock: vi.fn()
}));
const { toastInfoMock } = vi.hoisted(() => ({
  toastInfoMock: vi.fn()
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock
  })
}));

vi.mock('@/hooks/useNetwork', () => ({
  useNetworkFromQuery: () => Network.MAINNET
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: useQueryMock
}));

vi.mock('sonner', () => ({
  toast: {
    error: toastErrorMock,
    info: toastInfoMock
  }
}));

import { SearchBar } from './search-bar';

const VALID_MSG_KEYWORD = '0xaaaaaaaaaa';
const VALID_NO_RESULT_KEYWORD = '0xbbbbbbbbbb';
const VALID_TIMEOUT_KEYWORD = '0xcccccccccc';

beforeEach(() => {
  pushMock.mockReset();
  useQueryMock.mockReset();
  toastErrorMock.mockReset();
  toastInfoMock.mockReset();
  useQueryMock.mockImplementation((options: { queryKey: unknown[]; enabled?: boolean }) => {
    const keyword = String(options.queryKey?.[1] ?? '');
    const enabled = Boolean(options.enabled);
    if (enabled && keyword === VALID_MSG_KEYWORD) {
      return {
        data: {
          msgId: VALID_MSG_KEYWORD,
          fromChainId: String(ChAIN_ID.ETHEREUM_SEPOLIA)
        },
        isFetching: false
      };
    }
    if (enabled && keyword === VALID_NO_RESULT_KEYWORD) {
      return {
        data: {
          fromChainId: String(ChAIN_ID.ETHEREUM_SEPOLIA)
        },
        isFetching: false
      };
    }

    return {
      data: null,
      isFetching: false
    };
  });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe('SearchBar component', () => {
  it('shows toast validation feedback when search keyword is invalid', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    const input = screen.getByPlaceholderText('Search by Msg ID or Tx Hash');
    await user.type(input, 'abc{enter}');

    const alert = await screen.findByRole('alert');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe(alert.id);
    expect(alert.textContent).toContain('Please enter a valid Msg ID');
    expect(toastErrorMock).toHaveBeenCalledWith('Please enter a valid Msg ID or Tx Hash.');
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('navigates to resolved network when valid message is found', async () => {
    const user = userEvent.setup();
    const onNavigateMock = vi.fn();
    render(<SearchBar onNavigate={onNavigateMock} />);

    const input = screen.getByPlaceholderText('Search by Msg ID or Tx Hash');
    await user.type(input, `${VALID_MSG_KEYWORD}{enter}`);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(`/message/${VALID_MSG_KEYWORD}?network=testnet`);
      expect(onNavigateMock).toHaveBeenCalledTimes(1);
    });
  });

  it('does not navigate when query result has no msgId', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    const input = screen.getByPlaceholderText('Search by Msg ID or Tx Hash');
    await user.type(input, `${VALID_NO_RESULT_KEYWORD}{enter}`);

    await waitFor(() => {
      expect(pushMock).not.toHaveBeenCalled();
    });
  });

  it('shows timeout feedback when search exceeds deadline', async () => {
    vi.useFakeTimers();
    render(<SearchBar />);

    const input = screen.getByPlaceholderText('Search by Msg ID or Tx Hash');
    fireEvent.change(input, { target: { value: VALID_TIMEOUT_KEYWORD } });
    fireEvent.submit(input.closest('form')!);

    await vi.advanceTimersByTimeAsync(60_000);

    expect(toastInfoMock).toHaveBeenCalledWith('Search timed out. Please try again later.');
    expect(pushMock).not.toHaveBeenCalled();
  });
});
