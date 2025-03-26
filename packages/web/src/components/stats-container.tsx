import { StatCard } from './stat-card';

import type { MessageProgress } from '@/graphql/type';

interface StatsContainerProps {
  data?: MessageProgress[];
  networkTotal: number;
}
const StatsContainer = ({ data, networkTotal }: StatsContainerProps) => {
  const totalMessageValue = data?.find((item) => item.id === 'total')?.amount ?? 0;
  const inflightMessageValue = data?.find((item) => item.id === 'inflight')?.amount ?? 0;
  //  networkTotal is the total number of networks
  const networkValue = networkTotal ?? 0;
  // only ormp protocol is supported
  const protocolValue = 1;

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
      <StatCard title="Total Messages" value={totalMessageValue} />
      <StatCard title="Inflight Messages" value={inflightMessageValue} />
      <StatCard title="Networks" value={networkValue} />
      <StatCard title="Protocols" value={protocolValue} />
    </div>
  );
};
export default StatsContainer;
