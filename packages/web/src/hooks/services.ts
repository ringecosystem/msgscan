import { useQuery } from '@tanstack/react-query';

import { REFRESH_INTERVAL } from '@/config/site';
import { fetchMessage, fetchMessagePort, fetchMessageProgress } from '@/graphql/services';
import { MESSAGE_STATUS } from '@/types/message';

import type { MessagePortQueryParams } from '@/graphql/type';
import type { CHAIN } from '@/types/chains';

export function useMessagePort(variables: MessagePortQueryParams = {}, chains: CHAIN[]) {
  return useQuery({
    queryKey: ['messagePort', variables, chains],
    queryFn: async ({ signal }) => fetchMessagePort(variables, chains, signal),
    refetchInterval: REFRESH_INTERVAL,
    placeholderData(prevData) {
      const hasRealData = prevData?.MessagePort?.some((item) => item.status !== -1);
      return hasRealData
        ? prevData
        : {
            MessagePort: Array.from({ length: variables.limit || 10 }).map((_, index) => ({
              id: index.toString(),
              protocol: 'ormp',
              status: -1
            }))
          };
    }
  });
}

export function useMessage(id: string, chains: CHAIN[]) {
  return useQuery({
    queryKey: ['message', id, chains],
    queryFn: async () => fetchMessage(id, chains),
    refetchInterval(query) {
      const status = query?.state?.data?.status;
      return status !== MESSAGE_STATUS.FAILED && status !== MESSAGE_STATUS.SUCCESS
        ? REFRESH_INTERVAL
        : undefined;
    }
  });
}

export function useMessageProgress() {
  return useQuery({
    queryKey: ['messageProgress'],
    queryFn: async () => fetchMessageProgress(),
    refetchInterval: REFRESH_INTERVAL
  });
}
