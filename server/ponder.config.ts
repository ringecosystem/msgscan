import { createConfig } from "@ponder/core";
import { http } from "viem";

import { IMessagePort } from "./abis/IMessagePort";

export default createConfig({
  database: {
    kind: "postgres",
    connectionString: process.env.DATABASE_URL || "postgres://postgres:password@pg:5432/postgres",
    publishSchema: "indexer"
  },
  networks: {
    // testnets
    arbitrum_sepolia: {
      chainId: 421614,
      transport: http(process.env.PONDER_RPC_URL_ARBITRUM_SEPOLIA),
      maxRequestsPerSecond: 5,
    },
    pangolin: {
      chainId: 43,
      transport: http(process.env.PONDER_RPC_URL_PANGOLIN),
      maxRequestsPerSecond: 1,
    },
    pangoro: {
      chainId: 45,
      transport: http(process.env.PONDER_RPC_URL_PANGORO),
      maxRequestsPerSecond: 1,
    },
    sepolia: {
      chainId: 11155111,
      transport: http(process.env.PONDER_RPC_URL_SEPOLIA),
      maxRequestsPerSecond: 1,
    },
    taiko_katla: {
      chainId: 167008,
      transport: http(process.env.PONDER_RPC_URL_TAIKO_KATLA),
      maxRequestsPerSecond: 5,
    },
    tron_shasta: {
      chainId: 2494104990,
      transport: http(process.env.PONDER_RPC_URL_TRON_SHASTA),
      maxRequestsPerSecond: 1,
    },
    // mainnets
    darwinia: {
      chainId: 46,
      transport: http(process.env.PONDER_RPC_URL_DARWINIA),
      maxRequestsPerSecond: 5,
    },

  },
  contracts: {
    ORMPUpgradeablePort: {
      abi: IMessagePort,
      address: "0x305fcc849d81b9E972f4AD8E03c4B22e773A8c21",
      network: {
        pangolin: {
          startBlock: 2808745,
        },
        sepolia: {
          startBlock: 5847359,
        },
        taiko_katla: {
          startBlock: 1054482,
        },
        arbitrum_sepolia: {
          startBlock: 41129456,
        },
      },
      filter: {
        event: [
          "MessageSent",
          "MessageRecv",
        ],
      },
    },
  },
});
