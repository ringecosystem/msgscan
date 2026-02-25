'use client';

import { useMessageStats } from '@/hooks/services';
import { useMessageTrend } from '@/hooks/use-message-trend';
import StatsContainer from '@/components/stats-container';

import type { CHAIN } from '@/types/chains';

interface MessageProgressStatsProps {
  chains: CHAIN[];
}
const MessageProgressStats = ({ chains }: MessageProgressStatsProps) => {
  const {
    data: messageStats,
    isPending: isStatsPending,
    isError: isStatsError,
    refetch: refetchStats
  } = useMessageStats(chains);
  const {
    data: trendData,
    isPending: isTrendPending,
    isError: isTrendError,
    refetch: refetchTrend
  } = useMessageTrend(chains);

  return (
    <StatsContainer
      chains={chains}
      data={messageStats}
      trendData={trendData}
      isLoading={isStatsPending || isTrendPending}
      isError={isStatsError || isTrendError}
      onRetry={() => {
        void Promise.allSettled([refetchStats(), refetchTrend()]);
      }}
    />
  );
};

export default MessageProgressStats;
