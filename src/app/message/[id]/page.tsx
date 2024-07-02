import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import ClientPage from './components/ClientPage';
import { fetchMessage } from '@/graphql/services';
import { getChainsByNetwork } from '@/utils/network';

interface PageProps {
  params: {
    id: string;
  };
  searchParams: {
    network: string;
  };
}
export default async function Page({ params, searchParams }: PageProps) {
  const chains = getChainsByNetwork(searchParams?.network);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['message', params.id, chains],
    queryFn: async () => fetchMessage(params.id, chains)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientPage id={params?.id} chains={chains} />
    </HydrationBoundary>
  );
}
