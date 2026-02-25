/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import StatsContainer from './stats-container';

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

describe('StatsContainer', () => {
  afterEach(() => {
    cleanup();
  });

  it('shows error banner and retries when stats refresh fails', () => {
    const onRetry = vi.fn();

    render(<StatsContainer chains={[]} isError onRetry={onRetry} />);

    expect(screen.queryByRole('alert')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('hides error banner when there is no refresh error', () => {
    render(<StatsContainer chains={[]} isError={false} />);

    expect(screen.queryByRole('alert')).toBeNull();
  });
});
