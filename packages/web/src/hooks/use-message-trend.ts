'use client';

import { useQuery } from '@tanstack/react-query';

import { client } from '@/graphql/client';
import { GET_MESSAGE_TREND } from '@/graphql/queries';

import type { CHAIN } from '@/types/chains';
import type { TotalCountConnection } from '@/graphql/type';

interface TrendResponse {
  day0: TotalCountConnection;
  day1: TotalCountConnection;
  day2: TotalCountConnection;
  day3: TotalCountConnection;
  day4: TotalCountConnection;
  day5: TotalCountConnection;
  day6: TotalCountConnection;
}

export interface TrendDataPoint {
  date: string;
  label: string;
  count: number;
}

function buildDayRange(daysAgo: number): { gte: string; lte: string } {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - daysAgo);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  end.setMilliseconds(-1);

  return {
    gte: start.getTime().toString(),
    lte: end.getTime().toString()
  };
}

function buildDayWhere(daysAgo: number, chainIds?: string[]) {
  const { gte, lte } = buildDayRange(daysAgo);
  const where: Record<string, unknown> = {
    blockTimestamp_gte: gte,
    blockTimestamp_lte: lte
  };
  if (chainIds && chainIds.length > 0) {
    // Keep trend scope aligned with message stats cards (destination chain scope).
    where.toChainId_in = chainIds;
  }
  return where;
}

function formatLabel(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

export function buildMessageTrendVariables(chainIds: string[]) {
  const selected = chainIds?.filter(Boolean) ?? [];
  const variables: Record<string, unknown> = {};
  for (let i = 0; i < 7; i++) {
    variables[`day${i}Where`] = buildDayWhere(
      6 - i,
      selected.length > 0 ? selected : undefined
    );
  }
  return variables;
}

export function useMessageTrend(chains: CHAIN[]) {
  const chainIds = chains?.map((c) => c.id.toString()) ?? [];

  return useQuery<TrendDataPoint[]>({
    queryKey: ['messageTrend', chainIds.join(','), chainIds],
    queryFn: async () => {
      const variables = buildMessageTrendVariables(chainIds);

      const response = await client.request<TrendResponse>(GET_MESSAGE_TREND, variables);

      return Array.from({ length: 7 }, (_, i) => {
        const daysAgo = 6 - i;
        const key = `day${i}` as keyof TrendResponse;
        return {
          date: formatDate(daysAgo),
          label: formatLabel(daysAgo),
          count: response?.[key]?.totalCount ?? 0
        };
      });
    },
    staleTime: 60_000,
    refetchInterval: 60_000
  });
}
