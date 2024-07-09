'use client';

import SearchBar from '@/components/search-bar';

import { Separator } from '@/components/ui/separator';
import { FlipWords } from '@/components/ui/flip-words';
import { getChainsByNetwork } from '@/utils/network';
import MessagePortTable from '@/components/message-port-table';
import AddressDisplayFilterDappRemark from '@/components/address-display-filter-dapp-remark';
import { CodeFont } from '@/config/font';
import { cn } from '@/lib/utils';
import { getDAppInfo } from '@/utils';

interface PageProps {
  params: {
    address: string;
  };
  searchParams: {
    network: string;
  };
}
export default function Page({ params, searchParams }: PageProps) {
  const chains = getChainsByNetwork(searchParams?.network);
  const { dappName } = getDAppInfo(params?.address);

  const words = [params?.address];
  return (
    <>
      <div className="block lg:hidden">
        <SearchBar />
      </div>
      <div className="py-4">
        <span className="text-sm text-muted-foreground">{dappName ? 'Dapp' : 'Address'}</span>
        <header className={cn('text-base font-light text-foreground', CodeFont.className)}>
          {dappName ? (
            <AddressDisplayFilterDappRemark address={params?.address} className="gap-2" />
          ) : (
            <FlipWords words={words} />
          )}
        </header>
      </div>
      <Separator className="hidden lg:block" />
      <MessagePortTable
        network={searchParams?.network}
        sourceAddress={params?.address}
        chains={chains}
      />
    </>
  );
}
