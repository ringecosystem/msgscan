'use client';

import { useQuery } from '@tanstack/react-query';

import { client } from '@/graphql/client';

import type { CHAIN } from '@/types/chains';
import type { TotalCountConnection } from '@/graphql/type';

export interface ChainDistributionItem {
  chainId: number;
  chainName: string;
  iconUrl: string;
  count: number;
}

export type ChainDirection = 'source' | 'target';

export interface ChainDistributionResult {
  source: ChainDistributionItem[];
  target: ChainDistributionItem[];
}

export function buildDistributionQuery(chains: CHAIN[]) {
  const variableDefs = chains
    .map((_, index) => {
      const id = index + 1;
      return `$source${id}Where: MsgportMessageSentWhereInput\n$target${id}Where: MsgportMessageSentWhereInput`;
    })
    .join('\n');

  const fields = chains
    .map((_, index) => {
      const id = index + 1;
      return `
    source_${id}: msgportMessageSentsConnection(orderBy: [id_ASC], where: $source${id}Where) {
      totalCount
    }
    target_${id}: msgportMessageSentsConnection(orderBy: [id_ASC], where: $target${id}Where) {
      totalCount
    }`;
    })
    .join('\n');

  return `
  query GetChainDistributionBatch(
${variableDefs}
  ) {${fields}
  }
`;
}

export function buildDistributionVariables(chains: CHAIN[]) {
  const variables: Record<string, unknown> = {};
  chains.forEach((chain, index) => {
    const id = index + 1;
    variables[`source${id}Where`] = { fromChainId_eq: chain.id.toString() };
    variables[`target${id}Where`] = { toChainId_eq: chain.id.toString() };
  });
  return variables;
}

export function sortAndFilterChainDistribution(items: ChainDistributionItem[]) {
  return items.filter((item) => item.count > 0).sort((a, b) => b.count - a.count);
}

export function useChainDistribution(chains: CHAIN[]) {
  const chainKey = chains?.map((c) => c.id).join(',') ?? '';

  return useQuery<ChainDistributionResult>({
    queryKey: ['chainDistribution', chainKey, chains],
    queryFn: async ({ signal }) => {
      if (!chains.length) {
        return { source: [], target: [] };
      }
      const query = buildDistributionQuery(chains);
      const variables = buildDistributionVariables(chains);
      const response = await client.request<Record<string, TotalCountConnection>>({
        document: query,
        variables,
        signal
      });

      const source = chains.map((chain, index) => {
        const id = index + 1;
        return {
          chainId: chain.id,
          chainName: chain.name,
          iconUrl: chain.iconUrl,
          count: response?.[`source_${id}`]?.totalCount ?? 0
        };
      });
      const target = chains.map((chain, index) => {
        const id = index + 1;
        return {
          chainId: chain.id,
          chainName: chain.name,
          iconUrl: chain.iconUrl,
          count: response?.[`target_${id}`]?.totalCount ?? 0
        };
      });

      return {
        source: sortAndFilterChainDistribution(source),
        target: sortAndFilterChainDistribution(target)
      };
    },
    staleTime: 60_000,
    refetchInterval: 60_000
  });
}
