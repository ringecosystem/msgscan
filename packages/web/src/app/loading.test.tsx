/** @vitest-environment jsdom */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import LoadingPage from './loading';

describe('app loading', () => {
  it('renders global skeleton layout', () => {
    render(<LoadingPage />);

    expect(document.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);
    expect(screen.queryByRole('heading', { name: 'Loading page' })).toBeNull();
    expect(screen.queryByText('Preparing data and network context...')).toBeNull();
  });
});
