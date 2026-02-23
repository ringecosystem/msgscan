import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ChAIN_ID } from '@/types/chains';
import { Network } from '@/types/network';

import {
  buildMessageDetailHref,
  fetchMessageWithDelay,
  resolveMessageNetworkByChain,
  sleep
} from './search-bar';

import type { CompositeMessage } from '@/types/messages';
import type { CHAIN } from '@/types/chains';

const { fetchMessageDetailMock, getChainsByNetworkMock } = vi.hoisted(() => ({
  fetchMessageDetailMock: vi.fn(),
  getChainsByNetworkMock: vi.fn()
}));

vi.mock('@/graphql/services', () => ({
  fetchMessageDetail: fetchMessageDetailMock
}));

vi.mock('@/utils/network', async () => {
  const actual = await vi.importActual('@/utils/network');
  return {
    ...actual,
    getChainsByNetwork: getChainsByNetworkMock
  };
});

const mainChains: CHAIN[] = [
  {
    id: ChAIN_ID.ETHEREUM,
    name: 'Ethereum',
    iconUrl: '',
    testnet: false
  }
];

const testnetChains: CHAIN[] = [
  {
    id: ChAIN_ID.ETHEREUM_SEPOLIA,
    name: 'Sepolia',
    iconUrl: '',
    testnet: true
  }
];

describe('fetchMessageWithDelay', () => {
  beforeEach(() => {
    fetchMessageDetailMock.mockReset();
    getChainsByNetworkMock.mockReset();
    getChainsByNetworkMock.mockImplementation((network?: string) =>
      network === Network.TESTNET ? testnetChains : mainChains
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('falls back to opposite network when first query misses', async () => {
    const message = {
      msgId: '0xabc',
      fromChainId: String(ChAIN_ID.ETHEREUM_SEPOLIA)
    } as unknown as CompositeMessage;
    fetchMessageDetailMock.mockResolvedValueOnce(null).mockResolvedValueOnce(message);

    const result = await fetchMessageWithDelay('0xabc', mainChains);

    expect(fetchMessageDetailMock).toHaveBeenNthCalledWith(1, '0xabc', mainChains, undefined);
    expect(fetchMessageDetailMock).toHaveBeenNthCalledWith(2, '0xabc', testnetChains, undefined);
    expect(result).toBe(message);
  });

  it('falls back to mainnet when initial chains are testnet', async () => {
    const message = {
      msgId: '0xabc',
      fromChainId: String(ChAIN_ID.ETHEREUM)
    } as unknown as CompositeMessage;
    fetchMessageDetailMock.mockResolvedValueOnce(null).mockResolvedValueOnce(message);

    const result = await fetchMessageWithDelay('0xabc', testnetChains);

    expect(fetchMessageDetailMock).toHaveBeenNthCalledWith(1, '0xabc', testnetChains, undefined);
    expect(fetchMessageDetailMock).toHaveBeenNthCalledWith(2, '0xabc', mainChains, undefined);
    expect(result).toBe(message);
  });

  it('returns null when request is aborted', async () => {
    fetchMessageDetailMock.mockRejectedValueOnce(
      new DOMException('The operation was aborted.', 'AbortError')
    );

    const result = await fetchMessageWithDelay('0xabc', mainChains);

    expect(result).toBeNull();
  });

  it('returns resolved result even if aborted after request completes', async () => {
    const message = {
      msgId: '0xabc',
      fromChainId: String(ChAIN_ID.ETHEREUM)
    } as unknown as CompositeMessage;
    fetchMessageDetailMock.mockResolvedValueOnce(message);

    const controller = new AbortController();
    const pending = fetchMessageWithDelay('0xabc', mainChains, controller.signal);
    controller.abort();

    await expect(pending).resolves.toBe(message);
  });

  it('returns null when both primary and fallback queries miss', async () => {
    fetchMessageDetailMock.mockResolvedValueOnce(null).mockResolvedValueOnce(null);

    const result = await fetchMessageWithDelay('0xabc', mainChains);

    expect(fetchMessageDetailMock).toHaveBeenCalledTimes(2);
    expect(result).toBeNull();
  });

  it('returns immediately when request resolves', async () => {
    const message = {
      msgId: '0xabc',
      fromChainId: String(ChAIN_ID.ETHEREUM)
    } as unknown as CompositeMessage;
    fetchMessageDetailMock.mockResolvedValueOnce(message);

    await expect(fetchMessageWithDelay('0xabc', mainChains)).resolves.toBe(message);
  });
});

describe('sleep', () => {
  it('resolves when timer completes', async () => {
    vi.useFakeTimers();
    const pending = sleep(100);
    await vi.advanceTimersByTimeAsync(100);
    await expect(pending).resolves.toBeUndefined();
  });

  it('rejects when signal aborts', async () => {
    vi.useFakeTimers();
    const controller = new AbortController();
    const pending = sleep(1000, controller.signal);
    controller.abort();

    await expect(pending).rejects.toMatchObject({ name: 'AbortError' });
  });
});

describe('resolveMessageNetworkByChain', () => {
  it('infers testnet for known testnet chain', () => {
    expect(
      resolveMessageNetworkByChain(String(ChAIN_ID.ETHEREUM_SEPOLIA), Network.MAINNET)
    ).toBe(Network.TESTNET);
  });

  it('falls back to current network when chain is unknown', () => {
    expect(resolveMessageNetworkByChain('999999999', Network.TESTNET)).toBe(Network.TESTNET);
  });
});

describe('buildMessageDetailHref', () => {
  it('builds detail route with resolved network query', () => {
    expect(
      buildMessageDetailHref('0xabc', String(ChAIN_ID.ETHEREUM_SEPOLIA), Network.MAINNET)
    ).toBe('/message/0xabc?network=testnet');
  });
});
