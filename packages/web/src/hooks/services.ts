import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { chains as configuredChains } from '@/config/chains';
import { DETAIL_REFRESH_INTERVAL, REFRESH_INTERVAL } from '@/config/site';
import { fetchMessageDetail, fetchMessages } from '@/graphql/services';
import { MESSAGE_STATUS } from '@/types/message';

import type { CHAIN } from '@/types/chains';
import type { CompositeMessage, MessageFilters, MessagePaging, MessageStats } from '@/types/messages';

function resolveChainsByKey(chainKey: string): CHAIN[] {
  if (!chainKey || chainKey === 'all') return [];
  const ids = chainKey
    .split(',')
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item));
  if (ids.length === 0) return [];

  const byId = new Map(configuredChains.map((chain) => [chain.id, chain]));
  return ids
    .map((id) => byId.get(id))
    .filter((item): item is CHAIN => Boolean(item));
}

export function buildMessagesPlaceholder(limit: number): CompositeMessage[] {
  return Array.from({ length: limit }).map((_, index) => ({
    msgId: `placeholder-${index}`,
    protocol: 'ormp',
    // `-1` is a UI-only sentinel for skeleton rows.
    status: -1,
    transactionHash: '',
    transactionFrom: null,
    fromChainId: '',
    toChainId: '',
    fromDapp: '',
    toDapp: '',
    portAddress: '',
    message: '',
    params: '',
    sentBlockTimestampSec: 0,
    sent: {
      id: '',
      blockNumber: '',
      transactionHash: '',
      blockTimestamp: '',
      transactionIndex: 0,
      logIndex: 0,
      chainId: '',
      portAddress: '',
      transactionFrom: null,
      fromChainId: '',
      msgId: `placeholder-${index}`,
      fromDapp: '',
      toChainId: '',
      toDapp: '',
      message: '',
      params: ''
    }
  }));
}

export function useMessages(
  filters: MessageFilters,
  paging: MessagePaging,
  chains: CHAIN[],
  options?: {
    enabled?: boolean;
  }
) {
  const chainKey = chains?.map((chain) => chain.id).join(',') || 'all';
  const hasStatusFilter = Boolean(filters?.statuses && filters.statuses.length > 0);
  const statuses = filters?.statuses ?? [];
  const isFinalOnly =
    statuses.length > 0 &&
    statuses.every((status) => status === MESSAGE_STATUS.FAILED || status === MESSAGE_STATUS.SUCCESS);
  const filtersKey = useMemo(() => JSON.stringify(filters ?? {}), [filters]);
  const pagingKey = useMemo(
    () =>
      JSON.stringify({
        limit: paging.limit ?? null,
        offset: paging.offset ?? null
      }),
    [paging.limit, paging.offset]
  );

  return useQuery({
    // Keep query key stable by using serialized filter/paging snapshots.
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['messages', filtersKey, pagingKey, chainKey],
    enabled: options?.enabled ?? true,
    queryFn: async ({ signal }) =>
      fetchMessages({
        filters,
        paging,
        chains: resolveChainsByKey(chainKey),
        signal
      }),
    // Status filtering triggers expensive multi-step scanning. Avoid background polling,
    // and rely on user intent (refresh/resume) instead.
    refetchInterval: hasStatusFilter ? undefined : REFRESH_INTERVAL,
    staleTime: isFinalOnly ? 10 * 60 * 1000 : 0,
    placeholderData() {
      // Keep paging/filter transitions visually explicit and avoid stale-row mismatch.
      return buildMessagesPlaceholder(paging.limit ?? 15);
    }
  });
}

const FAST_POLL_COUNT = 6;
const FINAL_MESSAGE_STALE_TIME = 6 * 60 * 60 * 1000;

export function useMessage(id: string, chains: CHAIN[]) {
  const chainKey = chains?.map((chain) => chain.id).join(',') || 'all';

  return useQuery({
    queryKey: ['message', id, chainKey],
    queryFn: async ({ signal }) => fetchMessageDetail(id, resolveChainsByKey(chainKey), signal),
    staleTime(query) {
      const status = query?.state?.data?.status;
      if (status === MESSAGE_STATUS.FAILED || status === MESSAGE_STATUS.SUCCESS) {
        return FINAL_MESSAGE_STALE_TIME;
      }
      return 0;
    },
    refetchInterval(query) {
      const status = query?.state?.data?.status;
      if (status === MESSAGE_STATUS.FAILED || status === MESSAGE_STATUS.SUCCESS) {
        return undefined;
      }
      const dataUpdateCount = query?.state?.dataUpdateCount ?? 0;
      return dataUpdateCount <= FAST_POLL_COUNT ? REFRESH_INTERVAL : DETAIL_REFRESH_INTERVAL;
    }
  });
}

export function useMessageStats(chains: CHAIN[]) {
  const chainKey = chains?.map((chain) => chain.id).join(',') || 'all';

  return useQuery({
    queryKey: ['messageStats', chainKey],
    queryFn: async (): Promise<MessageStats> => {
      const query = chainKey === 'all' ? '' : `?chainIds=${chainKey}`;
      const response = await fetch(`/api/message-stats${query}`, {
        method: 'GET',
        cache: 'no-store'
      });
      if (!response.ok) {
        throw new Error(`fetch message stats failed: ${response.status}`);
      }
      return response.json();
    },
    refetchInterval: 60_000
  });
}
