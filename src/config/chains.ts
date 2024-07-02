import { ChAIN_ID, CHAIN } from '@/types/chains';

export const chains: CHAIN[] = [
  {
    id: ChAIN_ID.ETHEREUM,
    name: 'Ethereum',
    iconUrl: '/images/chains/ethereum.svg',
    blockExplorers: {
      default: {
        name: 'Etherscan',
        url: 'https://etherscan.io',
        apiUrl: 'https://api.etherscan.io/api'
      }
    }
  },
  {
    id: ChAIN_ID.ETHEREUM_SEPOLIA,
    name: 'Sepolia',
    iconUrl: '/images/chains/ethereum.svg',
    blockExplorers: {
      default: {
        name: 'Etherscan',
        url: 'https://sepolia.etherscan.io',
        apiUrl: 'https://api-sepolia.etherscan.io/api'
      }
    },
    testnet: true
  },
  {
    id: ChAIN_ID.ARBITRUM,
    name: 'Arbitrum',
    iconUrl: '/images/chains/arbitrum.svg',
    blockExplorers: {
      default: {
        name: 'Arbiscan',
        url: 'https://arbiscan.io',
        apiUrl: 'https://api.arbiscan.io/api'
      }
    }
  },
  {
    id: ChAIN_ID.ARBITRUM_SEPOLIA,
    name: 'Arbitrum Sepolia',
    iconUrl: '/images/chains/arbitrum.svg',
    blockExplorers: {
      default: {
        name: 'Arbiscan',
        url: 'https://sepolia.arbiscan.io',
        apiUrl: 'https://api-sepolia.arbiscan.io/api'
      }
    },
    testnet: true
  },
  {
    id: ChAIN_ID.DARWINIA,
    name: 'Darwinia',
    iconUrl: '/images/chains/darwinia.png',
    blockExplorers: {
      default: {
        name: 'Subscan',
        url: 'https://darwinia.subscan.io'
      }
    }
  },
  {
    id: ChAIN_ID.CRAB,
    name: 'Crab',
    iconUrl: '/images/chains/crab.svg',
    blockExplorers: {
      default: {
        name: 'Subscan',
        url: 'https://crab-scan.darwinia.network'
      }
    }
  },
  {
    id: ChAIN_ID.POLYGON,
    name: 'Polygon',
    iconUrl: '/images/chains/polygon.svg',
    blockExplorers: {
      default: {
        name: 'PolygonScan',
        url: 'https://polygonscan.com',
        apiUrl: 'https://api.polygonscan.com/api'
      }
    }
  },
  {
    id: ChAIN_ID.BLAST,
    name: 'Blast',
    iconUrl: '/images/chains/blast.svg',
    blockExplorers: {
      default: {
        name: 'Blastscan',
        url: 'https://blastscan.io/'
      }
    }
  },
  // new
  {
    id: ChAIN_ID.TRON,
    name: 'Tron',
    iconUrl: '/images/chains/tron.svg',
    blockExplorers: {
      default: {
        name: 'Tronscan',
        url: 'https://tronscan.org'
      }
    }
  },
  {
    id: ChAIN_ID.TRON_SHASTA,
    name: 'Tron Shasta',
    iconUrl: '/images/chains/tron.svg',
    blockExplorers: {
      default: {
        name: 'Tronscan',
        url: 'https://shasta.tronscan.org'
      }
    },
    testnet: true
  },
  {
    id: ChAIN_ID.MOONBEAM,
    name: 'Moonbeam',
    iconUrl: '/images/chains/moonbeam.svg',
    blockExplorers: {
      default: {
        name: 'Moonbeam',
        url: 'https://moonscan.io'
      }
    }
  },
  {
    id: ChAIN_ID.TAIKO_HEKLA,
    name: 'Taiko Hekla',
    iconUrl: '/images/chains/taiko.svg',
    blockExplorers: {
      default: {
        name: 'Taiko Hekla',
        url: 'https://taiko.socialscan.io'
      }
    },
    testnet: true
  },
  {
    id: ChAIN_ID.PANGORO,
    name: 'Pangoro',
    iconUrl: '/images/chains/pangoro.svg',
    blockExplorers: {
      default: {
        name: 'Pangoro',
        url: 'https://evmexplorer.tanssi-chains.network'
      }
    },
    testnet: true
  },
  {
    id: ChAIN_ID.KOI,
    name: 'Koi',
    iconUrl: '/images/chains/koi.svg',
    blockExplorers: {
      default: {
        name: 'Koi explorer',
        url: 'https://koi-scan.darwinia.network'
      }
    },
    testnet: true
  }
];
