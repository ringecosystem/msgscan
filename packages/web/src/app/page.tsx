import { getChainsByNetwork, getNetwork } from '@/utils/network';
import MessagePortTable from '@/components/message-port-table';
import MessageProgressStats from '@/components/message-progress-stats';
import ChartContainer from '@/components/charts/chart-container';

interface PageProps {
  searchParams: Promise<{
    network?: string;
  }>;
}
export default async function Page({ searchParams }: PageProps) {
  const { network } = await searchParams;
  const effectiveNetwork = getNetwork(network);
  const chains = getChainsByNetwork(effectiveNetwork);
  return (
    <div className="py-3 space-y-3">
      <MessageProgressStats chains={chains} />
      <ChartContainer chains={chains} />
      <MessagePortTable network={effectiveNetwork} chains={chains} />
    </div>
  );
}
