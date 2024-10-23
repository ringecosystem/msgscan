/**
 * Chain types.
 */
export enum ChAIN_ID {
  ETHEREUM = 1,
  ETHEREUM_SEPOLIA = 11155111,
  ARBITRUM = 42161,
  ARBITRUM_SEPOLIA = 421614,
  DARWINIA = 46,
  CRAB = 44,
  PANGOLIN = 43,
  POLYGON = 137,
  BLAST = 81457,
  TRON = 728126428,
  TRON_SHASTA = 2494104990,
  MOONBEAM = 1284,
  TAIKO_HEKLA = 167009,
  PANGORO = 45,
  KOI = 701,
  MORPH = 2818
}

export type CHAIN = {
  id: ChAIN_ID;
  name: string;
  iconUrl: string;
  testnet?: boolean;
  blockExplorers?: {
    default: {
      name: string;
      url: string;
      apiUrl?: string;
    };
  };
};
