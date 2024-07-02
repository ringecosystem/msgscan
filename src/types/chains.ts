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
  BLAST = 81457
}

export type CHAIN = {
  id: ChAIN_ID;
  name: string;
  shortName: string;
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
