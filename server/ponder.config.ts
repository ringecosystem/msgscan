import { createConfig } from "@ponder/core";
import { http } from "viem";

import { ORMPAbi as ORMPAbiV2 } from "./abis/v2/ORMPAbi";
import { SignaturePubAbi } from "./abis/v2/SignaturePubAbi";

const MAX_REQUESTS_PER_SECOND = 1;

export default createConfig({
  database: {
    kind: "postgres",
    publishSchema: "indexer",
  },
  networks: {
    // testnets
    arbitrum_sepolia: {
      chainId: 421614,
      transport: http(process.env.PONDER_RPC_URL_ARBITRUM_SEPOLIA),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
    sepolia: {
      chainId: 11155111,
      transport: http(process.env.PONDER_RPC_URL_SEPOLIA),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
    takio_katla: {
      chainId: 167008,
      transport: http("https://rpc.katla.taiko.xyz"),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
    // tron_shasta: {
    //   chainId: 2494104990,
    //   transport: http("https://api.shasta.trongrid.io/jsonrpc"),
    //   maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    // },
    // // mainnets
    // arbitrum: {
    //   chainId: 42161,
    //   transport: http(process.env.PONDER_RPC_URL_ARBITRUM),
    //   maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    // },
    // blast: {
    //   chainId: 81457,
    //   transport: http(process.env.PONDER_RPC_URL_BLAST),
    //   maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    // },
    // crab: {
    //   chainId: 44,
    //   transport: http(process.env.PONDER_RPC_URL_CRAB),      
    //   maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    // },
    darwinia: {
      chainId: 46,
      transport: http(process.env.PONDER_RPC_URL_DARWINIA),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
    // ethereum: {
    //   chainId: 1,
    //   transport: http(process.env.PONDER_RPC_URL_ETHEREUM),
    //   maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    // },
    // polygon: {
    //   chainId: 137,
    //   transport: http(process.env.PONDER_RPC_URL_POLYGON),
    //   maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
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
        //   startBlock: 2658409,
        // },
        sepolia: {
          startBlock: 5579141,
        },
        arbitrum_sepolia: {
          startBlock: 31200402,
        },
        takio_katla: {
          startBlock: 772664,
        },
        // tron_shasta: {
        //   startBlock: 42281878,
        //   address: "0x4a7C839b0a32c90ad3b397875df73B905b1Bf0CA", // TGm4AeM42R9ocbbN3ibrDtf5kkQVTTFMYS
        // },
        // mainnets
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
          startBlock: 2474362,
        },
      },
    },
  },
});
