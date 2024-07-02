'use client';

import { useMessageProgress } from '@/hooks/services';

import StatsContainer from '@/components/stats-container';
import { CHAIN } from '@/types/chains';

interface MessageProgressStatsProps {
  chains: CHAIN[];
}
const MessageProgressStats = ({ chains }: MessageProgressStatsProps) => {
  const { data: messageProgress } = useMessageProgress();

  return (
    <div className="py-[2.5rem] lg:py-0">
      <StatsContainer
        networkTotal={chains?.length}
        data={
          Array.isArray(messageProgress?.MessageProgress) ? messageProgress?.MessageProgress : []
        }
      />
    </div>
  );
};

export default MessageProgressStats;
