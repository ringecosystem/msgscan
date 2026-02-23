import { beforeEach, describe, expect, it, vi } from 'vitest';

import { chains } from '@/config/chains';

const { fetchMessageStatsMock } = vi.hoisted(() => ({
  fetchMessageStatsMock: vi.fn()
}));

vi.mock('@/graphql/services', () => ({
  fetchMessageStats: fetchMessageStatsMock
}));

import {
  GET,
  MAX_CHAIN_IDS_TOKENS,
  exceedsChainIdsTokenLimit,
  parseChainIds,
  readRawChainIds,
  validateChainIds
} from './route';

beforeEach(() => {
  fetchMessageStatsMock.mockReset();
});

describe('parseChainIds', () => {
  it('returns empty result for missing query', () => {
    expect(parseChainIds(null)).toEqual({
      chainIds: [],
      invalidTokens: []
    });
  });

  it('deduplicates valid ids', () => {
    expect(parseChainIds('1,2,2')).toEqual({
      chainIds: [1, 2],
      invalidTokens: []
    });
  });

  it('marks empty tokens as invalid', () => {
    expect(parseChainIds('1,,2')).toEqual({
      chainIds: [1, 2],
      invalidTokens: ['(empty)']
    });
  });

  it('marks non-number token as invalid', () => {
    expect(parseChainIds('1,abc')).toEqual({
      chainIds: [1],
      invalidTokens: ['abc']
    });
  });
});

describe('validateChainIds', () => {
  it('returns invalid ids when chain list contains unknown ids', () => {
    expect(validateChainIds('1,999', [1, 2])).toEqual({
      chainIds: [1, 999],
      invalidTokens: [],
      invalidIds: [999]
    });
  });

  it('keeps valid ids only when no invalid token and id found', () => {
    expect(validateChainIds('1,2', [1, 2, 3])).toEqual({
      chainIds: [1, 2],
      invalidTokens: [],
      invalidIds: []
    });
  });
});

describe('readRawChainIds', () => {
  it('merges multiple chainIds query params', () => {
    const searchParams = new URLSearchParams('chainIds=1&chainIds=abc');

    expect(readRawChainIds(searchParams)).toBe('1,abc');
  });
});

describe('exceedsChainIdsTokenLimit', () => {
  it('returns true when token count exceeds limit', () => {
    const raw = Array.from({ length: MAX_CHAIN_IDS_TOKENS + 1 }, (_, index) => `${index + 1}`).join(',');
    expect(exceedsChainIdsTokenLimit(raw, MAX_CHAIN_IDS_TOKENS)).toBe(true);
  });

  it('returns false when token count equals limit', () => {
    const raw = Array.from({ length: MAX_CHAIN_IDS_TOKENS }, (_, index) => `${index + 1}`).join(',');
    expect(exceedsChainIdsTokenLimit(raw, MAX_CHAIN_IDS_TOKENS)).toBe(false);
  });
});

describe('GET /api/message-stats', () => {
  it('returns 400 when duplicated chainIds include invalid token', async () => {
    const response = await GET(new Request('http://localhost/api/message-stats?chainIds=1&chainIds=abc'));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'Invalid chainIds query parameter',
      invalidTokens: ['abc']
    });
    expect(fetchMessageStatsMock).not.toHaveBeenCalled();
  });

  it('returns 400 when chainIds include unknown chain id', async () => {
    const response = await GET(new Request('http://localhost/api/message-stats?chainIds=999999999'));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'Invalid chainIds query parameter',
      invalidIds: [999999999]
    });
    expect(fetchMessageStatsMock).not.toHaveBeenCalled();
  });

  it('returns 400 when chainIds value is empty', async () => {
    const response = await GET(new Request('http://localhost/api/message-stats?chainIds='));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'Invalid chainIds query parameter',
      invalidTokens: ['(empty)']
    });
    expect(fetchMessageStatsMock).not.toHaveBeenCalled();
  });

  it('returns 400 when chainIds token count exceeds upper limit', async () => {
    const oversized = Array.from(
      { length: MAX_CHAIN_IDS_TOKENS + 1 },
      () => `${chains[0]?.id ?? 1}`
    ).join(',');
    const response = await GET(
      new Request(`http://localhost/api/message-stats?chainIds=${oversized}`)
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'Invalid chainIds query parameter',
      invalidTokens: ['(too_many_values)'],
      maxAllowedValues: MAX_CHAIN_IDS_TOKENS
    });
    expect(fetchMessageStatsMock).not.toHaveBeenCalled();
  });

  it('returns both invalidTokens and invalidIds for mixed invalid query', async () => {
    const validChainId = chains[0]?.id;
    const response = await GET(
      new Request(`http://localhost/api/message-stats?chainIds=${validChainId},abc,999999999`)
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'Invalid chainIds query parameter',
      invalidTokens: ['abc'],
      invalidIds: [999999999]
    });
    expect(fetchMessageStatsMock).not.toHaveBeenCalled();
  });

  it('calls fetchMessageStats with configured chains when request is valid', async () => {
    const expectedStats = {
      total: 1,
      success: 1,
      failed: 0,
      inflight: 0
    };
    fetchMessageStatsMock.mockResolvedValueOnce(expectedStats);

    const chainId = chains[0]?.id;
    const response = await GET(
      new Request(`http://localhost/api/message-stats?chainIds=${chainId}`)
    );

    expect(response.status).toBe(200);
    expect(fetchMessageStatsMock).toHaveBeenCalledTimes(1);
    expect(fetchMessageStatsMock).toHaveBeenCalledWith(
      chains.filter((chain) => chain.id === chainId)
    );
    await expect(response.json()).resolves.toEqual(expectedStats);
  });

  it('supports repeated chainIds query params for valid multi-value requests', async () => {
    const expectedStats = {
      total: 2,
      success: 1,
      failed: 1,
      inflight: 0
    };
    fetchMessageStatsMock.mockResolvedValueOnce(expectedStats);

    const mainnetId = chains.find((chain) => !chain.testnet)?.id;
    const testnetId = chains.find((chain) => chain.testnet)?.id;
    expect(mainnetId).toBeDefined();
    expect(testnetId).toBeDefined();

    const response = await GET(
      new Request(
        `http://localhost/api/message-stats?chainIds=${mainnetId}&chainIds=${testnetId}`
      )
    );

    expect(response.status).toBe(200);
    expect(fetchMessageStatsMock).toHaveBeenCalledWith(
      chains.filter((chain) => [mainnetId, testnetId].includes(chain.id))
    );
    await expect(response.json()).resolves.toEqual(expectedStats);
  });

  it('uses non-testnet chains when chainIds is absent', async () => {
    const expectedStats = {
      total: 3,
      success: 2,
      failed: 1,
      inflight: 0
    };
    fetchMessageStatsMock.mockResolvedValueOnce(expectedStats);

    const response = await GET(new Request('http://localhost/api/message-stats'));

    expect(response.status).toBe(200);
    expect(fetchMessageStatsMock).toHaveBeenCalledTimes(1);
    expect(fetchMessageStatsMock).toHaveBeenCalledWith(chains.filter((chain) => !chain.testnet));
    await expect(response.json()).resolves.toEqual(expectedStats);
  });

  it('returns 500 when fetchMessageStats throws', async () => {
    fetchMessageStatsMock.mockRejectedValueOnce(new Error('backend unavailable'));

    const response = await GET(new Request('http://localhost/api/message-stats'));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      message: 'Failed to fetch message stats'
    });
  });
});
