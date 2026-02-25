/** @vitest-environment jsdom */

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import MessageDetailError from './error';

vi.mock('@/components/error-display', () => ({
  default: (props: { title: string; description: string }) => (
    <div data-testid="error-display">
      <span>{props.title}</span>
      <span>{props.description}</span>
    </div>
  )
}));

describe('message detail route error boundary', () => {
  it('renders and supports retry through reset', () => {
    const reset = vi.fn();

    render(
      <MessageDetailError
        error={new Error('boom')}
        reset={reset}
      />
    );

    expect(screen.queryByTestId('error-display')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
