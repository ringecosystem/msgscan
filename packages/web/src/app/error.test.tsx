/** @vitest-environment jsdom */

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ErrorComponent from './error';

vi.mock('@/components/error-display', () => ({
  default: (props: { title: string; description: string }) => (
    <div data-testid="error-display">
      <span>{props.title}</span>
      <span>{props.description}</span>
    </div>
  )
}));

describe('global error boundary', () => {
  it('renders retry action and calls reset', () => {
    const reset = vi.fn();

    render(
      <ErrorComponent
        error={new Error('server error')}
        reset={reset}
      />
    );

    expect(screen.queryByTestId('error-display')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
