import { createConfig } from "@ponder/core";
import { http } from "viem";

import { ORMPAbi as ORMPAbiV2 } from "./abis/v2/ORMPAbi";
import { SignaturePubAbi } from "./abis/v2/SignaturePubAbi";

// sync from https://github.com/darwinia-network/ormponder/blob/main/ponder.config.ts
export default createConfig({
  database: {
    kind: "postgres",
    publishSchema: "indexer",
  },
  networks: {
    darwinia: {
      chainId: 46,
      transport: http(process.env.PONDER_RPC_URL_DARWINIA),
      maxRequestsPerSecond: 5,
    },
    // testnets
    // pangolin: {
    //   chainId: 43,
    //   transport: http(process.env.PONDER_RPC_URL_PANGOLIN),
    //   maxRequestsPerSecond: 1,
    // },
    sepolia: {
      chainId: 11155111,
      transport: http(process.env.PONDER_RPC_URL_SEPOLIA),
      maxRequestsPerSecond: 10,
    },
    arbitrum_sepolia: {
      chainId: 421614,
      transport: http(process.env.PONDER_RPC_URL_ARBITRUM_SEPOLIA),
      maxRequestsPerSecond: 10,
    },
    // takio_katla: {
    //   chainId: 167008,
    //   transport: http(process.env.PONDER_RPC_URL_TAKIO_KATLA),
    //   maxRequestsPerSecond: 1,
    // },
    // tron_shasta: {
    //   chainId: 2494104990,
    //   transport: http(process.env.PONDER_RPC_URL_TRON_SHASTA),
    //   maxRequestsPerSecond: 1,
    // },
  },
  contracts: {
    // === V2
    ORMPV2: {
      abi: ORMPAbiV2,
      address: "0x42165Ce95b51D1B845C190C96fB30c4FeF6Abce4",
      network: {
        // testnets
        // pangolin: {
        //   startBlock: 2686802,
        // },
        sepolia: {
          startBlock: 5707420,
        },
        arbitrum_sepolia: {
          startBlock: 34110000,
        },
        // takio_katla: {
        //   startBlock: 843300,
        // },
        // tron_shasta: {
        //   startBlock: 43245627,
        //   address: "0x4a7C839b0a32c90ad3b397875df73B905b1Bf0CA", // TGm4AeM42R9ocbbN3ibrDtf5kkQVTTFMYS
        // },
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
          startBlock: 2492391,
        },
        // arbitrum_sepolia: {
        //   address: "0x2828c0223e6435365a3b977e87f12aefb7cbcbab",
        //   startBlock: 34545993,
        // }
      },
    },
  },
});
