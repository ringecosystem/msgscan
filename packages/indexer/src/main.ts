import { EvmBatchProcessor } from "@subsquid/evm-processor";
import { MsgscanIndexerEvmRunner, MsgscanIndexerTronRunner } from "./runner";
import { OrmpContractChain, ormpContractChains } from "./config";
import { TronBatchProcessor } from "@subsquid/tron-processor";
import { evmFieldSelection, tronFieldSelection } from "./types";

interface RunProcessorOptions {
  ormpContract: OrmpContractChain;
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
    transaction: true,
  });

  const runner = new MsgscanIndexerEvmRunner(processor);
  await runner.run({ ormpContractChain: ormpContract });
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
  const runner = new MsgscanIndexerTronRunner(processor);
  await runner.run({ ormpContractChain: ormpContract });
}

async function main() {
  for (const ormpContract of ormpContractChains) {
    const isTron =
      ormpContract.chainId === 728126428 || ormpContract.chainId === 2494104990;
    if (isTron) {
      await runProcessorTron({ ormpContract });
    } else {
      await runProcessorEvm({ ormpContract });
    }
  }
}

main()
  .then(() => console.log("done"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
