import { useSearchParams } from 'next/navigation';
import { Network } from '@/types/network';
import { getNetwork } from '@/utils';

export const useNetworkFromQuery = (): Network => {
  const queryNetwork = useSearchParams()?.get('network') ?? Network.MAINNET;
  return getNetwork(queryNetwork);
};
