'use client';
import { Suspense, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useNetworkFromQuery } from '@/hooks/useNetwork';
import { NetworkMap } from '@/config/network';
import { Network } from '@/types/network';
import { Skeleton } from '@/components/ui/skeleton';

const CHAIN_FILTER_QUERY_KEYS = ['fromChainId', 'toChainId'] as const;

export function buildNetworkSwitchQuery(currentQuery: string, value: Network): string {
  const nextQuery = new URLSearchParams(currentQuery);
  // Chain ids are network-scoped. Carrying them across networks can hide valid data.
  CHAIN_FILTER_QUERY_KEYS.forEach((key) => {
    nextQuery.delete(key);
  });
  nextQuery.set('network', value);
  return nextQuery.toString();
}

const NetworkSwitcher = () => {
  const network = useNetworkFromQuery();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = useCallback(
    (value: Network | null) => {
      if (!value) return;

      const query = buildNetworkSwitchQuery(searchParams?.toString() ?? '', value);
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams]
  );

  const statusColor = network === Network.MAINNET ? 'bg-success' : 'bg-warning';

  return (
    <Select value={network} onValueChange={handleChange}>
      <SelectTrigger
        className="h-auto rounded-full border border-border px-3 py-1.5 text-xs font-medium shadow-none"
        aria-label="Switch network"
      >
        <span className={`size-2 rounded-full ${statusColor}`} />
        <SelectValue placeholder="Select a network" className="text-xs" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={Network.MAINNET} className="text-sm">
          {NetworkMap[Network.MAINNET].title}
        </SelectItem>
        <SelectItem value={Network.TESTNET} className="text-sm">
          {NetworkMap[Network.TESTNET].title}
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

const NetworkSwitcherWrapper = () => {
  return (
    <Suspense fallback={<Skeleton className="h-7 w-24 rounded-full" />}>
      <NetworkSwitcher />
    </Suspense>
  );
};

export default NetworkSwitcherWrapper;
