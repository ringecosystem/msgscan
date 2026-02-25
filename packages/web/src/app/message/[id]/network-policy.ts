import { defaultNetwork, networkList } from '@/config/network';
import { normalizeNetwork } from '@/utils/network';

import type { Network } from '@/types/network';

export interface DetailNetworkPolicy {
  hasNetworkParam: boolean;
  isValidNetworkParam: boolean;
  effectiveNetwork: Network;
}

export function resolveDetailNetworkPolicy(network?: string): DetailNetworkPolicy {
  const normalizedNetwork = normalizeNetwork(network);
  const hasNetworkParam = typeof network !== 'undefined';
  const isValidNetworkParam =
    typeof normalizedNetwork !== 'undefined' && networkList.includes(normalizedNetwork as Network);

  return {
    hasNetworkParam,
    isValidNetworkParam,
    effectiveNetwork: isValidNetworkParam ? (normalizedNetwork as Network) : defaultNetwork
  };
}
