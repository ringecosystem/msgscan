import { EvmBatchProcessor } from "@subsquid/evm-processor";
import { TypeormDatabase } from "@subsquid/typeorm-store";
import { OrmpContractChain } from "./config";
import { TronBatchProcessor } from "@subsquid/tron-processor";
import {
  EvmFieldSelection,
  HandlerLifecycle,
  MessageProgressCount,
  ProgressType,
  TronFieldSelection,
} from "./types";
import { MsgportEvmHandler, MsgportTronHandler } from "./handler/msgport";
import { OrmpEvmHandler, OrmpTronHandler } from "./handler/ormp";
import { SigncribeEvmHandler } from "./handler/signcribe";
import { MessageProgress } from "./model";

export interface RunnterOptions {
  ormpContractChain: OrmpContractChain;
}

export class MsgscanIndexerTronRunner {
  private readonly processedMetrics: Record<number, RunnerProgress> = {};

  constructor(
    private readonly processor: TronBatchProcessor<TronFieldSelection>
  ) {}

  async run(options: RunnterOptions) {
    const { ormpContractChain } = options;
    const db = new TypeormDatabase({
      supportHotBlocks: true,
      stateSchema: `chain_${ormpContractChain.chainId}_processor`,
      isolationLevel: 'READ COMMITTED',
    });
    this.processor.run(db, async (ctx) => {
      const storedProgressTotal = await ctx.store.findOne(MessageProgress, {
        where: { id: ProgressType.total },
      });
      const storedProgressInflight = await ctx.store.findOne(MessageProgress, {
        where: { id: ProgressType.inflight },
      });
      const storedProgressFailed = await ctx.store.findOne(MessageProgress, {
        where: { id: ProgressType.failed },
      });
      const messageProgressCount: MessageProgressCount = {
        total: storedProgressTotal?.amount ?? 0n,
        inflight: storedProgressInflight?.amount ?? 0n,
        failed: storedProgressFailed?.amount ?? 0n,
      };

      for (const block of ctx.blocks) {
        for (const event of block.logs) {
          const ormpContractConfig = ormpContractChain.contracts.find(
            (item) => item.address.toLowerCase() === event.address.toLowerCase()
          );

          if (!ormpContractConfig) {
            continue;
          }
          const lifecycle: HandlerLifecycle = {
            ormpContractChain,
            ormpContractConfig,
            messageProgressCount,
          };

          try {
            switch (ormpContractConfig.name.toLowerCase()) {
              case "ormpupgradeableport":
                await new MsgportTronHandler(ctx, lifecycle).handle(event);
                break;
              case "ormp":
                await new OrmpTronHandler(ctx, lifecycle).handle(event);
                break;
            }
          } catch (e) {
            ctx.log.warn(
              `(tron) unhandled contract ${ormpContractConfig.name} at ${
                event.block.height
              } ${event.getTransaction().id}, reason: ${e}`
            );
            throw e;
          } finally {
          }
        }
      }

      const cachedProgressRunnerProgress =
        this.processedMetrics[ormpContractChain.chainId];
      const lastHeight = ctx.blocks[ctx.blocks.length - 1].header.height;
      const currentRunnerProgress: RunnerProgress = {
        fromHeight: cachedProgressRunnerProgress
          ? cachedProgressRunnerProgress.fromHeight
          : lastHeight - ctx.blocks.length,
        lastHeight,
        lastPrintTime:
          cachedProgressRunnerProgress?.lastPrintTime ?? new Date(),
      };
      const showProgressLog =
        !cachedProgressRunnerProgress ||
        +new Date() - +currentRunnerProgress.lastPrintTime > 1000 * 10;
      if (showProgressLog) {
        ctx.log.info(
          `[${ormpContractChain.chainId}] processed ${
            currentRunnerProgress.lastHeight - currentRunnerProgress.fromHeight
          } blocks from ${currentRunnerProgress.fromHeight} to ${
            currentRunnerProgress.lastHeight
          } block`
        );
        currentRunnerProgress.lastPrintTime = new Date();
        currentRunnerProgress.fromHeight = lastHeight;
      }
      this.processedMetrics[ormpContractChain.chainId] = currentRunnerProgress;
    });
  }
}

export class MsgscanIndexerEvmRunner {
  private readonly processedMetrics: Record<number, RunnerProgress> = {};

  constructor(
    private readonly processor: EvmBatchProcessor<EvmFieldSelection>
  ) {}

  async run(options: RunnterOptions) {
    const { ormpContractChain } = options;
    const db = new TypeormDatabase({
      supportHotBlocks: true,
      stateSchema: `chain_${ormpContractChain.chainId}_processor`,
      isolationLevel: 'READ COMMITTED',
    });
    this.processor.run(db, async (ctx) => {
      const storedProgressTotal = await ctx.store.findOne(MessageProgress, {
        where: { id: ProgressType.total },
      });
      const storedProgressInflight = await ctx.store.findOne(MessageProgress, {
        where: { id: ProgressType.inflight },
      });
      const storedProgressFailed = await ctx.store.findOne(MessageProgress, {
        where: { id: ProgressType.failed },
      });
      const messageProgressCount: MessageProgressCount = {
        total: storedProgressTotal?.amount ?? 0n,
        inflight: storedProgressInflight?.amount ?? 0n,
        failed: storedProgressFailed?.amount ?? 0n,
      };

      for (const block of ctx.blocks) {
        for (const event of block.logs) {
          const ormpContractConfig = ormpContractChain.contracts.find(
            (item) => item.address.toLowerCase() === event.address.toLowerCase()
          );

          if (!ormpContractConfig) {
            continue;
          }
          const lifecycle: HandlerLifecycle = {
            ormpContractChain,
            ormpContractConfig,
            messageProgressCount,
          };

          try {
            switch (ormpContractConfig.name.toLowerCase()) {
              case "ormpupgradeableport":
                await new MsgportEvmHandler(ctx, lifecycle).handle(event);
                break;
              case "ormp":
                await new OrmpEvmHandler(ctx, lifecycle).handle(event);
                break;
              case "signaturepub":
                await new SigncribeEvmHandler(ctx, lifecycle).handle(event);
                break;
            }
          } catch (e) {
            ctx.log.warn(
              `(evm) unhandled contract ${ormpContractConfig.name} at ${event.block.height} ${event.transactionHash}, reason: ${e}`
            );
            console.log(e);
            throw e;
          }
        }
      }
      // if (!storedProgressTotal || storedProgressTotal.amount != messageProgressCount.total) {
      //   ctx.store.save(new MessageProgress({id: ProgressType.total, amount: messageProgressCount.total})); 
      // }
      // if (!storedProgressInflight || storedProgressInflight.amount != messageProgressCount.inflight) {
      //   ctx.store.save(new MessageProgress({id: ProgressType.inflight, amount: messageProgressCount.inflight})); 
      // }
      // if (!storedProgressFailed || storedProgressFailed.amount != messageProgressCount.failed) {
      //   ctx.store.save(new MessageProgress({id: ProgressType.failed, amount: messageProgressCount.failed})); 
      // }

      const cachedProgressRunnerProgress =
        this.processedMetrics[ormpContractChain.chainId];
      const lastHeight = ctx.blocks[ctx.blocks.length - 1].header.height;
      const currentRunnerProgress: RunnerProgress = {
        fromHeight: cachedProgressRunnerProgress
          ? cachedProgressRunnerProgress.fromHeight
          : lastHeight - ctx.blocks.length,
        lastHeight,
        lastPrintTime:
          cachedProgressRunnerProgress?.lastPrintTime ?? new Date(),
      };
      const showProgressLog =
        !cachedProgressRunnerProgress ||
        +new Date() - +currentRunnerProgress.lastPrintTime > 1000 * 10;
      if (showProgressLog) {
        ctx.log.info(
          `[${ormpContractChain.chainId}] processed ${
            currentRunnerProgress.lastHeight - currentRunnerProgress.fromHeight
          } blocks from ${currentRunnerProgress.fromHeight} to ${
            currentRunnerProgress.lastHeight
          } block`
        );
        currentRunnerProgress.lastPrintTime = new Date();
        currentRunnerProgress.fromHeight = lastHeight;
      }
      this.processedMetrics[ormpContractChain.chainId] = currentRunnerProgress;
    });
  }
}

interface RunnerProgress {
  fromHeight: number;
  lastHeight: number;
  lastPrintTime: Date;
}
