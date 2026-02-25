import { describe, expect, it } from 'vitest';

import {
  buildDistributionQuery,
  buildDistributionVariables,
  sortAndFilterChainDistribution
} from './use-chain-distribution';

import type { CHAIN } from '@/types/chains';

const CHAINS = [
  { id: 1, name: 'Ethereum', iconUrl: '/images/chains/ethereum.svg' },
  { id: 42161, name: 'Arbitrum', iconUrl: '/images/chains/arbitrum.svg' }
] satisfies CHAIN[];

describe('use-chain-distribution helpers', () => {
  it('builds one batched query that includes source and target aliases', () => {
    const query = buildDistributionQuery(CHAINS);

    expect(query).toContain('query GetChainDistributionBatch(');
    expect(query).toContain('$source1Where: MsgportMessageSentWhereInput');
    expect(query).toContain('$target1Where: MsgportMessageSentWhereInput');
    expect(query).toContain('$source2Where: MsgportMessageSentWhereInput');
    expect(query).toContain('$target2Where: MsgportMessageSentWhereInput');
    expect(query).toContain('source_1: msgportMessageSentsConnection');
    expect(query).toContain('target_1: msgportMessageSentsConnection');
    expect(query).toContain('source_2: msgportMessageSentsConnection');
    expect(query).toContain('target_2: msgportMessageSentsConnection');
  });

  it('builds variables for both source and target scopes', () => {
    const variables = buildDistributionVariables(CHAINS);

    expect(variables).toEqual({
      source1Where: { fromChainId_eq: '1' },
      target1Where: { toChainId_eq: '1' },
      source2Where: { fromChainId_eq: '42161' },
      target2Where: { toChainId_eq: '42161' }
    });
  });

  it('sorts by count descending and filters out zero values', () => {
    const result = sortAndFilterChainDistribution([
      { chainId: 1, chainName: 'Ethereum', iconUrl: 'a', count: 0 },
      { chainId: 2, chainName: 'Arbitrum', iconUrl: 'b', count: 12 },
      { chainId: 3, chainName: 'Darwinia', iconUrl: 'c', count: 7 }
    ]);

    expect(result).toEqual([
      { chainId: 2, chainName: 'Arbitrum', iconUrl: 'b', count: 12 },
      { chainId: 3, chainName: 'Darwinia', iconUrl: 'c', count: 7 }
    ]);
  });
});

