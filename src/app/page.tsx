import { getChainsByNetwork } from '@/utils/network';
import SearchBar from '@/components/search-bar';
import { Separator } from '@/components/ui/separator';
import MessagePortTable from '@/components/message-port-table';
import MessageProgressStats from '@/components/message-progress-stats';

interface PageProps {
  searchParams: {
    network: string;
  };
}
export default function Page({ searchParams }: PageProps) {
  const chains = getChainsByNetwork(searchParams?.network);
  return (
    <>
      <div className="mt-4 block lg:hidden">
        <SearchBar />
      </div>
      <MessageProgressStats chains={chains} />
      <Separator className="hidden lg:block" />
      <MessagePortTable network={searchParams?.network} chains={chains} />
    </>
  );
}
