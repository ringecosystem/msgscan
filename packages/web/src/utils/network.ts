import { chains } from '@/config/chains';
import { defaultNetwork, networkList } from '@/config/network';
import { Network } from '@/types/network';

export const normalizeNetwork = (network?: string): string | undefined => {
  if (typeof network !== 'string') return undefined;
  const normalized = network.trim().toLowerCase();
  return normalized.length > 0 ? normalized : undefined;
};

export const getNetwork = (network?: string) => {
  const normalized = normalizeNetwork(network);
  return normalized && networkList.includes(normalized as Network)
    ? (normalized as Network)
    : defaultNetwork;
};
export const getChainsByNetwork = (network?: string) => {
  const effectiveNetwork = getNetwork(network);

  if (effectiveNetwork === Network.MAINNET) {
    return chains.filter((chain) => !chain.testnet);
  }
  return chains.filter((chain) => !!chain.testnet);
};
