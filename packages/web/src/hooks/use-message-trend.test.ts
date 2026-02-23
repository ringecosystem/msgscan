import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { buildMessageTrendVariables } from './use-message-trend';

describe('buildMessageTrendVariables', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-14T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('uses toChainId_in when chainIds are provided', () => {
    const variables = buildMessageTrendVariables(['1', '2']);

    for (let i = 0; i < 7; i += 1) {
      const where = variables[`day${i}Where`] as Record<string, unknown>;

      expect(where.toChainId_in).toEqual(['1', '2']);
      expect(where.fromChainId_in).toBeUndefined();

      expect(Number.isFinite(Number(where.blockTimestamp_gte))).toBe(true);
      expect(Number.isFinite(Number(where.blockTimestamp_lte))).toBe(true);
    }
  });

  it('omits chain filter when chainIds are empty', () => {
    const variables = buildMessageTrendVariables([]);

    for (let i = 0; i < 7; i += 1) {
      const where = variables[`day${i}Where`] as Record<string, unknown>;

      expect(where.toChainId_in).toBeUndefined();
      expect(where.fromChainId_in).toBeUndefined();
    }
  });
});
