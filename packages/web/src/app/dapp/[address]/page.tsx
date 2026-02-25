import { Separator } from '@/components/ui/separator';
import { getChainsByNetwork, getNetwork } from '@/utils/network';
import MessagePortTable from '@/components/message-port-table';
import { getDAppInfo } from '@/utils';

import DappAddressHeader from './DappAddressHeader';

interface PageProps {
  params: Promise<{
    address: string;
  }>;
  searchParams: Promise<{
    network?: string;
  }>;
}
export default async function Page({ params, searchParams }: PageProps) {
  const [{ address }, { network }] = await Promise.all([params, searchParams]);
  const effectiveNetwork = getNetwork(network);
  const chains = getChainsByNetwork(effectiveNetwork);
  const { dappName } = getDAppInfo(address);

  return (
    <>
      <DappAddressHeader address={address} dappName={dappName} effectiveNetwork={effectiveNetwork} />

      <Separator />

      <MessagePortTable network={effectiveNetwork} sourceAddress={address} chains={chains} />
    </>
  );
}
