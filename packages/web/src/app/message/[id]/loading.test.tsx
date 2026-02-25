/** @vitest-environment jsdom */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import LoadingPage from './loading';

describe('message detail route loading', () => {
  it('renders detail skeleton layout', () => {
    render(<LoadingPage />);

    expect(document.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);
    expect(screen.queryByRole('heading', { name: 'Searching message' })).toBeNull();
    expect(screen.queryByText('Preparing detail view for this message...')).toBeNull();
  });
});
