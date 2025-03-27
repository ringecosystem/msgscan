import { EvmBatchProcessor } from "@subsquid/evm-processor";
import { TypeormDatabase } from "@subsquid/typeorm-store";
import { OrmpContractChain } from "./config";
import { TronBatchProcessor } from "@subsquid/tron-processor";
import { EvmFieldSelection, TronFieldSelection } from "./types";
import { MsgportEvmHandler, MsgportTronHandler } from "./handler/msgport";
import { OrmpEvmHandler, OrmpTronHandler } from "./handler/ormp";
import { SigncribeEvmHandler } from "./handler/signcribe";

export interface RunnterOptions {
  ormpContract: OrmpContractChain;
}

export class MsgscanIndexerTronRunner {
  constructor(
    private readonly processor: TronBatchProcessor<TronFieldSelection>,
    private readonly db: TypeormDatabase
  ) {}

  async run(options: RunnterOptions) {
    const { ormpContract } = options;
    this.processor.run(this.db, async (ctx) => {
      for (const block of ctx.blocks) {
        for (const event of block.logs) {
          const indexContract = ormpContract.contracts.find(
            (item) => item.address.toLowerCase() === event.address.toLowerCase()
          );

          if (!indexContract) {
            continue;
          }

          try {
            switch (indexContract.name.toLowerCase()) {
              case "ormpupgradeableport":
                await new MsgportTronHandler(
                  ctx,
                  ormpContract,
                  indexContract
                ).handle(event);
                break;
              case "ormp":
                await new OrmpTronHandler(
                  ctx,
                  ormpContract,
                  indexContract
                ).handle(event);
                break;
            }
          } finally {
            ctx.log.warn(
              `(tron) unhandled contract ${indexContract.name} at ${
                event.block.height
              } ${event.getTransaction().id}`
            );
          }
        }
      }
    });
  }
}

export class MsgscanIndexerEvmRunner {
  constructor(
    private readonly processor: EvmBatchProcessor<EvmFieldSelection>,
    private readonly db: TypeormDatabase
  ) {}

  async run(options: RunnterOptions) {
    const { ormpContract } = options;
    this.processor.run(this.db, async (ctx) => {
      for (const block of ctx.blocks) {
        for (const event of block.logs) {
          const indexContract = ormpContract.contracts.find(
            (item) => item.address.toLowerCase() === event.address.toLowerCase()
          );

          if (!indexContract) {
            continue;
          }

          try {
            switch (indexContract.name.toLowerCase()) {
              case "ormpupgradeableport":
                await new MsgportEvmHandler(
                  ctx,
                  ormpContract,
                  indexContract
                ).handle(event);
                break;
              case "ormp":
                await new OrmpEvmHandler(
                  ctx,
                  ormpContract,
                  indexContract
                ).handle(event);
                break;
              case "signaturepub":
                await new SigncribeEvmHandler(
                  ctx,
                  ormpContract,
                  indexContract
                ).handle(event);
                break;
            }
          } finally {
            ctx.log.warn(
              `(evm) unhandled contract ${indexContract.name} at ${event.block.height} ${event.transactionHash}`
            );
          }
        }
      }
    });
  }
}
