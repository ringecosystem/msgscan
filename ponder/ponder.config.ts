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
    schema: process.env.DEPLOYMENT_ID ? `indexer-${process.env.DEPLOYMENT_ID}` : "indexer",
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
      maxRequestsPerSecond: process.env.PANGORO_MAX_REQUESTS_PER_SECOND ? parseInt(process.env.PANGORO_MAX_REQUESTS_PER_SECOND) : 1
    },
    sepolia: {
      chainId: 11155111,
      transport: http(process.env.PONDER_RPC_URL_SEPOLIA),
      maxRequestsPerSecond: 1,
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
      address: "0x2632B7BEd9Ec2665B85F6A9b79E350b81440EA13",
      network: {
        pangolin: {
          startBlock: 2817846,
        },
        sepolia: {
          startBlock: 5859881,
        },
        arbitrum_sepolia: {
          startBlock: 41809966,
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
      address: "0x56F423Db036F2eDD05567b1211122E0B17C3bfF4",
      network: {
        // testnets
        pangolin: {
          startBlock: 2836100,
        },
        pangoro: {
          startBlock: 127804,
          address: "0xE46ed7594fFa6AD7c3b5232827EC2AF8f94beb38",
        },
        sepolia: {
          startBlock: 5877944,
        },
        arbitrum_sepolia: {
          startBlock: 42771116,
        },
        tron_shasta: {
          startBlock: 43958393,
          address: "0x13c991C5BEf30c0E8600D95B8554B4DeDa4853b8", // TBmqJzYEQXJLBU4ycvMLPuqxMfEkVMeDQ8
        },
        // mainnets
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
          startBlock: 2667533,
        },
      },
    },
  },
});
// https://sepolia.etherscan.io/address/0x56F423Db036F2eDD05567b1211122E0B17C3bfF4
// https://sepolia.arbiscan.io/address/0x56F423Db036F2eDD05567b1211122E0B17C3bfF4
// https://pangolin.subscan.io/address/0x56F423Db036F2eDD05567b1211122E0B17C3bfF4
// https://shasta.tronscan.org/#/contract/TBmqJzYEQXJLBU4ycvMLPuqxMfEkVMeDQ8
