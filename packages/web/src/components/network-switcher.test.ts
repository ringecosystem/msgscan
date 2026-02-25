import { describe, expect, it } from 'vitest';

import { Network } from '@/types/network';

import { buildNetworkSwitchQuery } from './network-switcher';

describe('buildNetworkSwitchQuery', () => {
  it('clears chain filters when switching network and preserves unrelated params', () => {
    const query = buildNetworkSwitchQuery(
      'network=mainnet&fromChainId=1&fromChainId=42161&toChainId=46&status=2&dateFrom=2026-02-01',
      Network.TESTNET
    );
    const params = new URLSearchParams(query);

    expect(params.get('network')).toBe(Network.TESTNET);
    expect(params.getAll('fromChainId')).toEqual([]);
    expect(params.getAll('toChainId')).toEqual([]);
    expect(params.get('status')).toBe('2');
    expect(params.get('dateFrom')).toBe('2026-02-01');
  });

  it('sets network when query is initially empty', () => {
    const query = buildNetworkSwitchQuery('', Network.MAINNET);
    const params = new URLSearchParams(query);

    expect(params.get('network')).toBe(Network.MAINNET);
  });
});
