// import { EvmBatchProcessor } from "@subsquid/evm-processor";
// import { TypeormDatabase } from "@subsquid/typeorm-store";
// import * as usdcAbi from "./abi/usdc";
// import { UsdcTransfer } from "./model";

import { EvmBatchProcessor } from "@subsquid/evm-processor";
import { TypeormDatabase } from "@subsquid/typeorm-store";
import { MsgscanIndexerEvmRunner, MsgscanIndexerTronRunner } from "./runner";
import { OrmpContractChain, ormpContractChains } from "./config";
import { TronBatchProcessor } from "@subsquid/tron-processor";
import { evmFieldSelection, tronFieldSelection } from "./types";

// const USDC_CONTRACT_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

// const processor = new EvmBatchProcessor()
//   .setGateway("https://v2.archive.subsquid.io/network/ethereum-mainnet")
//   .setRpcEndpoint("https://rpc.ankr.com/eth")
//   .setFinalityConfirmation(75)
//   .addLog({
//     range: { from: 6_082_465 },
//     address: [USDC_CONTRACT_ADDRESS],
//     topic0: [usdcAbi.events.Transfer.topic],
//   })
//   .setFields({
//     log: {
//       transactionHash: true,
//     },
//   });

// const db = new TypeormDatabase({ supportHotBlocks: true });

// processor.run(db, async (ctx) => {
//   const transfers: UsdcTransfer[] = [];

//   for (let block of ctx.blocks) {
//     for (let log of block.logs) {
//       if (
//         log.address === USDC_CONTRACT_ADDRESS &&
//         log.topics[0] === usdcAbi.events.Transfer.topic
//       ) {
//         let { from, to, value } = usdcAbi.events.Transfer.decode(log);
//         transfers.push(
//           new UsdcTransfer({
//             id: log.id,
//             block: block.header.height,
//             from,
//             to,
//             value,
//             txnHash: log.transactionHash,
//           })
//         );
//       }
//     }
//   }

//   await ctx.store.insert(transfers);
// });

interface RunProcessorOptions {
  ormpContract: OrmpContractChain;
  db: TypeormDatabase;
}

async function runProcessorEvm(options: RunProcessorOptions) {
  const { ormpContract } = options;
  const processor = new EvmBatchProcessor()
    .setRpcEndpoint(ormpContract.rpcs[0])
    .setFields(evmFieldSelection);
  if (ormpContract.gateway) {
    processor.setGateway(ormpContract.gateway);
  }
  if (ormpContract.finalityConfirmation) {
    processor.setFinalityConfirmation(ormpContract.finalityConfirmation);
  }
  processor.addLog({
    range: { from: ormpContract.startBlock ?? 0 },
    address: ormpContract.contracts.map((c) => c.address.toLowerCase()),
  });

  const runner = new MsgscanIndexerEvmRunner(processor, options.db);
  await runner.run({ ormpContract });
}

async function runProcessorTron(options: RunProcessorOptions) {
  const { ormpContract } = options;
  const processor = new TronBatchProcessor()
    .setHttpApi({
      url: ormpContract.rpcs[0],
      strideConcurrency: 1,
      strideSize: 1,
    })
    .setFields(tronFieldSelection);
  if (ormpContract.gateway) {
    processor.setGateway(ormpContract.gateway);
  }
  processor.addLog({
    range: { from: ormpContract.startBlock ?? 0 },
    where: {
      address: ormpContract.contracts.map((c) => c.address.toLowerCase()),
    },
    include: {
      transaction: true,
    },
  });
  const runner = new MsgscanIndexerTronRunner(processor, options.db);
  await runner.run({ ormpContract });
}

async function main() {
  const db = new TypeormDatabase({ supportHotBlocks: true });

  for (const ormpContract of ormpContractChains) {
    const isTron =
      ormpContract.chainId === 728126428 || ormpContract.chainId === 2494104990;
    if (isTron) {
      await runProcessorTron({ ormpContract, db });
    } else {
      await runProcessorEvm({ ormpContract, db });
    }
  }
}

main()
  .then(() => console.log("done"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
