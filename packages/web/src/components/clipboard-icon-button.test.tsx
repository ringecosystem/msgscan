/** @vitest-environment jsdom */

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import ClipboardIconButton from './clipboard-icon-button';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

const { toastSuccessMock, toastErrorMock } = vi.hoisted(() => ({
  toastSuccessMock: vi.fn(),
  toastErrorMock: vi.fn()
}));

vi.mock('sonner', () => ({
  toast: {
    success: toastSuccessMock,
    error: toastErrorMock
  }
}));

vi.mock('./ui/tooltip', () => ({
  Tooltip: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  TooltipTrigger: ({
    children,
    ...props
  }: {
    children: ReactNode;
  } & ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props}>{children}</button>,
  TooltipContent: ({ children }: { children: ReactNode }) => <div>{children}</div>
}));

describe('ClipboardIconButton', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    toastSuccessMock.mockReset();
    toastErrorMock.mockReset();

    Object.defineProperty(globalThis.navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true
    });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders nothing when text is empty', () => {
    const { container } = render(<ClipboardIconButton text="" />);

    expect(container.firstChild).toBeNull();
  });

  it('copies text and resets copied state after timeout', async () => {
    render(<ClipboardIconButton text="0xabc" />);

    fireEvent.click(screen.getByRole('button', { name: 'Copy to clipboard' }));

    await act(async () => {
      await Promise.resolve();
    });

    expect(globalThis.navigator.clipboard.writeText).toHaveBeenCalledWith('0xabc');
    expect(toastSuccessMock).toHaveBeenCalledWith('Copied!');
    expect(screen.queryByText('Copied!')).not.toBeNull();

    act(() => {
      vi.advanceTimersByTime(1_000);
    });

    expect(screen.queryByText('Copy to clipboard')).not.toBeNull();
  });

  it('clears copied reset timer on unmount', async () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const { unmount } = render(<ClipboardIconButton text="0xabc" />);

    fireEvent.click(screen.getByRole('button', { name: 'Copy to clipboard' }));

    await act(async () => {
      await Promise.resolve();
    });

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
