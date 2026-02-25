import { describe, expect, it } from 'vitest';

import { Network } from '@/types/network';

import { resolveDetailNetworkPolicy } from './network-policy';

describe('resolveDetailNetworkPolicy', () => {
  it('treats missing network as default mainnet and missing param', () => {
    const result = resolveDetailNetworkPolicy(undefined);

    expect(result).toEqual({
      hasNetworkParam: false,
      isValidNetworkParam: false,
      effectiveNetwork: Network.MAINNET
    });
  });

  it('accepts normalized valid network', () => {
    const result = resolveDetailNetworkPolicy(' testnet ');

    expect(result).toEqual({
      hasNetworkParam: true,
      isValidNetworkParam: true,
      effectiveNetwork: Network.TESTNET
    });
  });

  it('treats invalid network as explicit invalid and fallback to mainnet', () => {
    const result = resolveDetailNetworkPolicy('foo');

    expect(result).toEqual({
      hasNetworkParam: true,
      isValidNetworkParam: false,
      effectiveNetwork: Network.MAINNET
    });
  });

  it('treats empty network value as invalid explicit parameter', () => {
    const result = resolveDetailNetworkPolicy('');

    expect(result).toEqual({
      hasNetworkParam: true,
      isValidNetworkParam: false,
      effectiveNetwork: Network.MAINNET
    });
  });
});

