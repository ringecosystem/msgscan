import { createConfig } from "@ponder/core";
import { http } from "viem";

import { ORMPAbi as ORMPAbiV2 } from "./abis/v2/ORMPAbi";
import { SignaturePubAbi } from "./abis/v2/SignaturePubAbi";

// sync from https://github.com/darwinia-network/ormponder/blob/main/ponder.config.ts
export default createConfig({
  database: {
    kind: "postgres",
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
      transport: http("https://fraa-flashbox-2871-rpc.a.stagenet.tanssi.network"),
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
    // === V2
    ORMPV2: {
      abi: ORMPAbiV2,
      address: "0x9BEc71b9C646653C6C73Af8D4B7E5f84a5420005",
      network: {
        // testnets
        pangolin: {
          startBlock: 2701388,
        },
        pangoro: {
          startBlock: 47065,
          address: "0xE46ed7594fFa6AD7c3b5232827EC2AF8f94beb38",
        },
        sepolia: {
          startBlock: 5728578,
        },
        arbitrum_sepolia: {
          startBlock: 35145606,
        },
        taiko_katla: {
          startBlock: 890471,
        },
        tron_shasta: {
          startBlock: 43536767,
          address: "0x13c991C5BEf30c0E8600D95B8554B4DeDa4853b8", // TBmqJzYEQXJLBU4ycvMLPuqxMfEkVMeDQ8
        },
      },
      filter: {
        event: [
          "MessageAccepted",
          "MessageDispatched",
          "MessageAssigned",
          "HashImported",
        ],
      },
    },
    SignaturePub: {
      abi: SignaturePubAbi,
      address: "0xb2aa34fde97ffdb6197dd5a2be23c2121405cc12",
      network: {
        darwinia: {
          startBlock: 2562642,
        },
      },
    },
  },
});
