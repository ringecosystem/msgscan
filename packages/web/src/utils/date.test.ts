import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { formatTimeAgoShort, formatTimestampStable } from './date';

describe('formatTimeAgoShort', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-14T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns empty string for invalid timestamp', () => {
    expect(formatTimeAgoShort('invalid')).toBe('');
  });

  it('formats seconds', () => {
    const timestamp = String(Math.floor(Date.now() / 1000) - 45);
    expect(formatTimeAgoShort(timestamp)).toBe('45s ago');
  });

  it('formats minutes', () => {
    const timestamp = String(Math.floor(Date.now() / 1000) - 2 * 60);
    expect(formatTimeAgoShort(timestamp)).toBe('2m ago');
  });

  it('formats hours', () => {
    const timestamp = String(Math.floor(Date.now() / 1000) - 3 * 60 * 60);
    expect(formatTimeAgoShort(timestamp)).toBe('3h ago');
  });

  it('formats days', () => {
    const timestamp = String(Math.floor(Date.now() / 1000) - 10 * 24 * 60 * 60);
    expect(formatTimeAgoShort(timestamp)).toBe('10d ago');
  });

  it('formats months', () => {
    const timestamp = String(Math.floor(Date.now() / 1000) - 60 * 24 * 60 * 60);
    expect(formatTimeAgoShort(timestamp)).toBe('2mo ago');
  });

  it('formats years', () => {
    const timestamp = String(Math.floor(Date.now() / 1000) - 730 * 24 * 60 * 60);
    expect(formatTimeAgoShort(timestamp)).toBe('2y ago');
  });
});

describe('formatTimestampStable', () => {
  it('returns empty string for invalid timestamp', () => {
    expect(formatTimestampStable('invalid')).toBe('');
  });

  it('formats timestamp with stable utc output', () => {
    expect(formatTimestampStable('1739534400')).toBe('2025-02-14 12:00:00 UTC');
  });
});
