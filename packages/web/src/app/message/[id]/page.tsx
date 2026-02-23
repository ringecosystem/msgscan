import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

import { fetchMessageDetail } from '@/graphql/services';
import { Network } from '@/types/network';
import { defaultNetwork } from '@/config/network';
import { getChainsByNetwork } from '@/utils/network';

import ClientPage from './components/ClientPage';
import { resolveDetailNetworkPolicy } from './network-policy';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    network?: string;
  }>;
}
export default async function Page({ params, searchParams }: PageProps) {
  const [{ id }, { network }] = await Promise.all([params, searchParams]);
  const { hasNetworkParam, isValidNetworkParam, effectiveNetwork } = resolveDetailNetworkPolicy(network);

  if (hasNetworkParam && !isValidNetworkParam) {
    redirect(`/message/${encodeURIComponent(id)}?network=${defaultNetwork}`);
  }

  const testnetChains = getChainsByNetwork('testnet');
  const scopedChains = getChainsByNetwork(effectiveNetwork);

  const queryClient = new QueryClient();
  const message = await fetchMessageDetail(id, scopedChains);

  // Keep default-network behavior (mainnet first), but fallback to testnet when
  // network param is absent and the message is not found on mainnet.
  if (!hasNetworkParam && effectiveNetwork === Network.MAINNET && !message) {
    const fallbackMessage = await fetchMessageDetail(id, testnetChains);
    if (fallbackMessage) {
      redirect(`/message/${encodeURIComponent(id)}?network=${Network.TESTNET}`);
    }
  }

  const chainKey = scopedChains.map((chain) => chain.id).join(',') || 'all';
  queryClient.setQueryData(['message', id, chainKey], message);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientPage id={id} chains={scopedChains} />
    </HydrationBoundary>
  );
}
