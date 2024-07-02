import { MessageProgress } from '@/graphql/type';
import { StatCard } from './stat-card';

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
      <StatCard title="Total Messages" value={totalMessageValue} percentageChange={20.1} />
      <StatCard title="Inflight Messages" value={inflightMessageValue} percentageChange={20.1} />
      <StatCard title="Networks" value={networkValue} percentageChange={20.1} />
      <StatCard title="Protocols" value={protocolValue} percentageChange={20.1} />
    </div>
  );
};
export default StatsContainer;
