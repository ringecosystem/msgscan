/** @vitest-environment jsdom */

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import ExplorerLinkButton from './explorer-link-button';

describe('ExplorerLinkButton', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders accessible explorer link', () => {
    render(<ExplorerLinkButton url="https://example.com/tx/0xabc" />);

    const link = screen.getByRole('link', {
      name: 'Open transaction in block explorer'
    });
    expect(link).not.toBeNull();
    expect(link.getAttribute('href')).toBe('https://example.com/tx/0xabc');
  });

  it('renders nothing without url', () => {
    render(<ExplorerLinkButton />);

    expect(screen.queryByRole('link')).toBeNull();
  });
});
