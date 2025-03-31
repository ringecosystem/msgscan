import { chains } from '@/config/chains';
import { networkList } from '@/config/network';
import { Network } from '@/types/network';

export const getNetwork = (network?: string) => {
  return network && networkList.includes(network as Network)
    ? (network as Network)
    : Network.MAINNET;
};
export const getChainsByNetwork = (network?: string) => {
  const effectiveNetwork = getNetwork(network);

  if (effectiveNetwork === Network.MAINNET) {
    return chains.filter((chain) => !chain.testnet);
  }
  return chains.filter((chain) => !!chain.testnet);
};
