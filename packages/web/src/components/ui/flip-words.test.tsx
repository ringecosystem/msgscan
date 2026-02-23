/** @vitest-environment jsdom */

import { act, cleanup, render } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { FlipWords } from './flip-words';

vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
    } & Record<string, unknown>) => (
      <div {...(props as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>
    ),
    span: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
    } & Record<string, unknown>) => (
      <span {...(props as React.HTMLAttributes<HTMLSpanElement>)}>{children}</span>
    )
  }
}));

describe('FlipWords', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders null when words is empty', () => {
    const { container } = render(<FlipWords words={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it('clears animation timer on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const { unmount } = render(<FlipWords words={['hello', 'world']} duration={2_000} />);

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();

    act(() => {
      vi.runOnlyPendingTimers();
    });
  });
});
