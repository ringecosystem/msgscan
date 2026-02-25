'use client';

import { useMessageTrend } from '@/hooks/use-message-trend';
import { useChainDistribution } from '@/hooks/use-chain-distribution';

import MessageTrendChart from './message-trend-chart';
import ChainDistributionChart from './chain-distribution-chart';

import type { CHAIN } from '@/types/chains';

interface ChartContainerProps {
  chains: CHAIN[];
}

export default function ChartContainer({ chains }: ChartContainerProps) {
  const { data: trendData, isLoading: trendLoading } = useMessageTrend(chains);
  const { data: distributionData, isLoading: distributionLoading } = useChainDistribution(chains);

  return (
    <div className="grid grid-cols-1 items-stretch gap-3 md:grid-cols-2 lg:gap-4">
      <MessageTrendChart data={trendData} isLoading={trendLoading} />
      <ChainDistributionChart
        data={distributionData?.source}
        targetData={distributionData?.target}
        isLoading={distributionLoading}
        isTargetLoading={distributionLoading}
      />
    </div>
  );
}
