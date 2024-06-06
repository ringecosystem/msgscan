import { createConfig } from "@ponder/core";
import { http } from "viem";

import { IMessagePort } from "./abis/IMessagePort";
import { ORMP } from "./abis/ORMP";
import { SignaturePub } from "./abis/SignaturePub";

export default createConfig({
  database: {
    kind: "postgres",
    connectionString: process.env.DATABASE_URL || "postgres://postgres:password@pg:5432/postgres",
    publishSchema: "publish",
    // schema: process.env.DEPLOYMENT_ID ? `indexer-${process.env.DEPLOYMENT_ID}` : "indexer",
    schema: "indexer",
  },
  networks: {
    // mainnets
    arbitrum: {
      chainId: 42161,
      transport: http(process.env.PONDER_RPC_URL_ARBITRUM),
      maxRequestsPerSecond: 5,
    },
    blast: {
      chainId: 81457,
      transport: http(process.env.PONDER_RPC_URL_BLAST),
      maxRequestsPerSecond: 5,
    },
    crab: {
      chainId: 44,
      transport: http(process.env.PONDER_RPC_URL_CRAB),
      maxRequestsPerSecond: 5,
    },
    darwinia: {
      chainId: 46,
      transport: http(process.env.PONDER_RPC_URL_DARWINIA),
      maxRequestsPerSecond: 5,
    },
    ethereum: {
      chainId: 1,
      transport: http(process.env.PONDER_RPC_URL_ETHEREUM),
      maxRequestsPerSecond: 5,
    },
    polygon: {
      chainId: 137,
      transport: http(process.env.PONDER_RPC_URL_POLYGON),
      maxRequestsPerSecond: 5,
    },
    moonbeam: {
      chainId: 1284,
      transport: http(process.env.PONDER_RPC_URL_MOONBEAM),
      maxRequestsPerSecond: 5,
    },
    tron: {
      chainId: 728126428,
      transport: http(process.env.PONDER_RPC_URL_TRON),
      maxRequestsPerSecond: 5,
    },
    
    // testnets
    arbitrum_sepolia: {
      chainId: 421614,
      transport: http(process.env.PONDER_RPC_URL_ARBITRUM_SEPOLIA),
      maxRequestsPerSecond: 5,
    },
    sepolia: {
      chainId: 11155111,
      transport: http(process.env.PONDER_RPC_URL_SEPOLIA),
      maxRequestsPerSecond: 1,
    },
    // pangolin: {
    //   chainId: 43,
    //   transport: http(process.env.PONDER_RPC_URL_PANGOLIN),
    //   maxRequestsPerSecond: 1,
    // },
    pangoro: { // https://evmexplorer.tanssi-chains.network/?rpcUrl=https://fraa-flashbox-2871-rpc.a.stagenet.tanssi.network
      chainId: 45,
      transport: http(process.env.PONDER_RPC_URL_PANGORO),
      maxRequestsPerSecond: process.env.PANGORO_MAX_REQUESTS_PER_SECOND ? parseInt(process.env.PANGORO_MAX_REQUESTS_PER_SECOND) : 1
    },
    taiko_hekla: {
      chainId: 167009,
      transport: http(process.env.PONDER_RPC_URL_TAIKO_HEKLA),
      maxRequestsPerSecond: 10,
    },
    tron_shasta: {
      chainId: 2494104990,
      transport: http(process.env.PONDER_RPC_URL_TRON_SHASTA),
      maxRequestsPerSecond: 1,
    },
  },
  contracts: {
    ORMPUpgradeablePort: {
      abi: IMessagePort,
      address: "0x2cd1867Fb8016f93710B6386f7f9F1D540A60812",
      network: {
        // arbitrum: {
        //   startBlock: 217896912,
        // },
        blast: {
          startBlock: 4294668,
        },
        crab: {
          startBlock: 2900650,
        },
        darwinia: {
          startBlock: 2830148,
        },
        ethereum: {
          startBlock: 20009590,
        },
        // polygon: {
        //   startBlock: 57711531,
        // },
        moonbeam: {
          startBlock: 6294321,
        },
        tron: {
          startBlock: 62251634,
          address: "0x3bc5362ec3a3dbc07292aed4ef18be18de02da3a",
        },

        // testnets
        arbitrum_sepolia: {
          startBlock: 46922296,
        },
        sepolia: {
          startBlock: 5958523,
        },
        // pangolin: {
        //   startBlock: 2915877,
        // },
        pangoro: {
          startBlock: 229000,
        },
        taiko_hekla: {
          startBlock: 195443,
        },
        tron_shasta: {
          startBlock: 44337583,
          address: "0x9a80b8a27ea73bd584336c9c200bb97190865482", 
        },
      },
      filter: {
        event: [
          "MessageSent",
          "MessageRecv",
        ],
      },
    },
    ORMP: {
      abi: ORMP,
      address: "0x13b2211a7cA45Db2808F6dB05557ce5347e3634e",
      network: {
        // arbitrum: {
        //   startBlock: 215479884,
        // },
        blast: {
          startBlock: 3990955,
        },
        crab: {
          startBlock: 2860619,
        },
        darwinia: {
          startBlock: 2781584,
        },
        ethereum: {
          startBlock: 19959316,
        },
        // polygon: {
        //   startBlock: 57441039,
        // },
        moonbeam: {
          startBlock: 6244360,
        },
        tron: {
          startBlock: 62251392,
          address: "0x5c5c383febe62f377f8c0ea1de97f2a2ba102e98",
        },

        // testnets
        arbitrum_sepolia: {
          startBlock: 46920328,
        },
        sepolia: {
          startBlock: 5958523,
        },
        // pangolin: {
        //   startBlock: 2915869,
        // },
        pangoro: {
          startBlock: 229000,
        },
        taiko_hekla: {
          startBlock: 195443,
        },
        tron_shasta: {
          startBlock: 44337374,
          address: "0x841b6b2f3148131ac161d88edfb2c11f146e189f", 
        },
      },
      filter: {
        event: [
          "MessageAccepted",
        ],
      },
    },
    SignaturePub: {
      abi: SignaturePub,
      address: "0x57aa601a0377f5ab313c5a955ee874f5d495fc92",
      network: {
        darwinia: {
          startBlock: 2795207,
        },
      },
    },
  },
});
