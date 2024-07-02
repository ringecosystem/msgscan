import { Network } from '@/types/network';

export const NetworkMap = {
  [Network.TESTNET]: {
    title: 'Testnet'
  },
  [Network.MAINNET]: {
    title: 'Mainnet'
  }
};

export const networkList = [Network.MAINNET, Network.TESTNET];
export const defaultNetwork = Network.MAINNET;
