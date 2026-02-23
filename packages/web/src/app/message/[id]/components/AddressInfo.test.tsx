/** @vitest-environment jsdom */

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import AddressInfo from './AddressInfo';

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

vi.mock('@/components/clipboard-icon-button', () => ({
  default: () => <span data-testid="clipboard-btn" />
}));

vi.mock('@/components/explorer-link-button', () => ({
  default: () => <span data-testid="explorer-btn" />
}));

describe('AddressInfo sender link', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders internal sender link when href is provided', () => {
    const address = '0xebd9a48ed1128375eb4383ed4d53478b4fd85a8d';
    const href = `/sender/${address}?network=mainnet`;

    render(<AddressInfo address={address} href={href} />);

    const link = screen.getByRole('link', { name: /0xebd9/i });
    expect(link).not.toBeNull();
    expect(link.getAttribute('href')).toBe(href);
  });

  it('renders plain text when href is not provided', () => {
    render(<AddressInfo address="0xebd9a48ed1128375eb4383ed4d53478b4fd85a8d" />);

    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.queryByTestId('clipboard-btn')).not.toBeNull();
  });
});
