import { createConfig } from "@ponder/core";
import { http } from "viem";

import { IMessagePort } from "./abis/IMessagePort";
import { ORMP } from "./abis/ORMP";
import { SignaturePub } from "./abis/SignaturePub";

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
    pangoro: { // https://evmexplorer.tanssi-chains.network/?rpcUrl=https://fraa-flashbox-2871-rpc.a.stagenet.tanssi.network
      chainId: 45,
      transport: http(process.env.PONDER_RPC_URL_PANGORO),
      maxRequestsPerSecond: 5,
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
        tron_shasta: {
          startBlock: 43881710,
          address: "0x0b159252e7a9d603e7aB1Fa264987efC78e8D538", // TAypGzHxfGZchPkSMBiiNH8aotxhzCudpS
        },
        pangoro: {
          startBlock: 118897,
          address: "0x64672778785c84a18Ec6e4858505E86D7F383774"
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
      address: "0x9BEc71b9C646653C6C73Af8D4B7E5f84a5420005",
      network: {
        pangolin: {
          startBlock: 2701388,
        },
        sepolia: {
          startBlock: 5728578,
        },
        taiko_katla: {
          startBlock: 890471,
        },
        arbitrum_sepolia: {
          startBlock: 35145606,
        },
        tron_shasta: {
          startBlock: 43536767,
          address: "0x13c991C5BEf30c0E8600D95B8554B4DeDa4853b8", // TBmqJzYEQXJLBU4ycvMLPuqxMfEkVMeDQ8
        },
        pangoro: {
          startBlock: 47065,
          address: "0xE46ed7594fFa6AD7c3b5232827EC2AF8f94beb38",
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
      address: "0xb2aa34fde97ffdb6197dd5a2be23c2121405cc12",
      network: {
        darwinia: {
          startBlock: 2562642,
        },
      },
    },
  },
});
