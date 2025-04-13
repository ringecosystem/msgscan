import { setTimeout } from "timers/promises";
import { Service } from "typedi";
import { GripperRunnerOptions } from "../types";
// @ts-ignore
import { gql, request } from "graphql-request";
import fastify from "fastify";

@Service({})
export class IndexerTask {
  private readonly indexEndpoints: PonderEndpoint[] = [
    {
      chain: "polygon",
      endpoint: "https://ormponder.darwinia.network/polygon",
    },
    {
      chain: "moonbeam",
      endpoint: "https://ormponder.darwinia.network/moonbeam",
    },
    {
      chain: "ethereum",
      endpoint: "https://ormponder.darwinia.network/ethereum",
    },
    {
      chain: "arbitrum",
      endpoint: "https://ormponder.darwinia.network/arbitrum",
    },
    { chain: "blast", endpoint: "https://ormponder.darwinia.network/blast" },
    { chain: "crab", endpoint: "https://ormponder.darwinia.network/crab" },
    {
      chain: "darwinia",
      endpoint: "https://ormponder.darwinia.network/darwinia",
    },
    {
      chain: "arbitrum-sepolia",
      endpoint: "https://ormponder.darwinia.network/arbitrum-sepolia",
    },
    {
      chain: "sepolia",
      endpoint: "https://ormponder.darwinia.network/sepolia",
    },
    { chain: "morph", endpoint: "https://ormponder.darwinia.network/morph" },
    {
      chain: "tron-shasta",
      endpoint: "https://ormponder.darwinia.network/tron-shasta",
    },
    { chain: "tron", endpoint: "https://ormponder.darwinia.network/tron" },
  ];

  private readonly skipCounter: Record<string, number> = {};

  constructor() {}

  async start(options: GripperRunnerOptions) {
    const { fastify } = options;
    let times = 0;
    while (true) {
      times += 1;
      if (times > 10000000) {
        times = 0;
      }
      fastify.log.info(`====== round ${times} =======`);
      const messages = [];
      for (const ie of this.indexEndpoints) {
        const { chain, endpoint } = ie;
        if (this.skipCounter[chain] && this.skipCounter[chain] > 0) {
          this.skipCounter[chain] -= 1;
          if (this.skipCounter[chain] % 5 == 0) {
            fastify.log.info(
              `[${chain}]-+ skip ${this.skipCounter[chain]} round left`
            );
          }
          continue;
        }
        try {
          const crt = await this.crawl({
            runnerOptions: options,
            ponderEndpoint: { chain, endpoint },
          });
          if (
            !crt ||
            (crt.messageAcceptedV2s?.items.length === 0 &&
              crt.messageDispatchedV2s?.items.length === 0)
          ) {
            fastify.log.info(`[${chain}]-- not have messages skip 25 round`);
            this.skipCounter[chain] = 25;
            continue;
          }
          messages.push(crt);
        } catch (e) {
          fastify.log.error(`[${chain}]xx error in crawl: `, endpoint, e);
        }
      }
      await this.storeMessages({
        runnerOptions: options,
        messages,
      });
      await setTimeout(3000);
    }
  }

  private syncPostionId(options: { chain: string; model: string }) {
    const id = `${options.chain}-${options.model}`;
    return id.toLowerCase();
  }

  private async crawl(options: CrawlOptions): Promise<CrawlResult | undefined> {
    const { runnerOptions, ponderEndpoint } = options;
    const { fastify } = runnerOptions;
    const prisma = fastify.prisma;
    const syncPostionIds = [
      this.syncPostionId({
        chain: ponderEndpoint.chain,
        model: "messageAcceptedV2s",
      }),
      this.syncPostionId({
        chain: ponderEndpoint.chain,
        model: "messageDispatchedV2s",
      }),
    ];
    const storedPostions = await prisma.sync_position.findMany({
      where: {
        id: {
          in: syncPostionIds,
        },
      },
    });
    const messageAccepetedV2sPosition = storedPostions.find(
      (item) => item.id === syncPostionIds[0]
    );
    const messageDispatchedV2sPosition = storedPostions.find(
      (item) => item.id === syncPostionIds[1]
    );

    const gqlMessageScanInfo = gql`
      query MessageScanInfo($afterAccepted: String, $afterDispatched: String) {
        messageAcceptedV2s(
          orderDirection: "asc"
          orderBy: "blockTimestamp"
          limit: 50
          after: $afterAccepted
        ) {
          items {
            id
            blockNumber
            blockTimestamp
            transactionHash
            logIndex
            msgHash
            messageChannel
            messageIndex
            messageFromChainId
            messageFrom
            messageToChainId
            messageTo
            messageGasLimit
            messageEncoded
            oracle
            oracleAssigned
            oracleAssignedFee
            oracleLogIndex
            relayer
            relayerAssigned
            relayerAssignedFee
            relayerLogIndex
          }
          pageInfo {
            startCursor
            endCursor
          }
        }

        messageDispatchedV2s(
          orderDirection: "asc"
          orderBy: "blockTimestamp"
          limit: 50
          after: $afterDispatched
        ) {
          items {
            id
            targetChainId
            blockNumber
            blockTimestamp
            transactionHash
            msgHash
            dispatchResult
          }
          pageInfo {
            startCursor
            endCursor
          }
        }
      }
    `;
    const responseMessageScanInfo: GraphqlResponse | PonderError =
      await request({
        url: ponderEndpoint.endpoint,
        document: gqlMessageScanInfo,
        variables: {
          afterAccepted: messageAccepetedV2sPosition?.cursor ?? null,
          afterDispatched: messageDispatchedV2sPosition?.cursor ?? null,
        },
      });
    if (!responseMessageScanInfo) {
      return;
    }
    if (responseMessageScanInfo["errors"]) {
      fastify.log.error(responseMessageScanInfo["errors"]);
      return;
    }
    const messageAcceptedV2s = responseMessageScanInfo[
      "messageAcceptedV2s"
    ] as unknown as PonderPage<MessageAcceptedV2>;
    const messageDispatchedV2s = responseMessageScanInfo[
      "messageDispatchedV2s"
    ] as unknown as PonderPage<messageDispatchedV2s>;
    return {
      chain: ponderEndpoint.chain,
      messageAcceptedV2s,
      messageDispatchedV2s,
    };
  }

  private async storeMessages(options: StoreOptions) {
    const { runnerOptions, messages } = options;
    const { fastify } = runnerOptions;
    const prisma = fastify.prisma;

    const storedMessageProgress = await prisma.message_progress.findFirst({
      where: { id: "global" },
    });
    const currentMessageProgress = {
      id: "global",
      total: storedMessageProgress?.total ?? 0,
      inflight: storedMessageProgress?.inflight ?? 0,
      failed: storedMessageProgress?.failed ?? 0,
    };

    for (const message of messages) {
      const { chain, messageAcceptedV2s, messageDispatchedV2s } = message;
      fastify.log.info(
        `[${chain}]:: crawled {accepted: ${messageAcceptedV2s?.items.length}, dispatched: ${messageDispatchedV2s?.items.length}}`
      );
      if (messageAcceptedV2s) {
        for (const item of messageAcceptedV2s.items) {
          const msgId = item.msgHash;
          const storedMessagePort = await prisma.message_port.findFirst({
            where: { msg_id: msgId },
          });
          const messagePortInput = {
            ...storedMessagePort,
            id: msgId,
            msg_id: msgId,
            protocol: "ormp",
            status: storedMessagePort?.status ?? 0,
            source_chain_id: item.messageFromChainId,
            source_block_number: +item.blockNumber,
            source_block_timestamp: new Date(+item.blockTimestamp),
            source_transaction_hash: item.transactionHash,
            // source_transaction_index : -0,
            source_log_index: +item.logIndex,
            // source_port_address      : -0,
            source_dapp_address: item.messageFrom,
            target_chain_id: +item.messageToChainId,
            target_dapp_address: item.messageTo,
            // payload
            // params
            message_encoded: item.messageEncoded,
            sender: item.messageFrom,
          };
          if (storedMessagePort) {
            await prisma.message_port.update({
              where: { id: messagePortInput.id },
              data: messagePortInput,
            });
          } else {
            await prisma.message_port.create({ data: messagePortInput });
          }
          currentMessageProgress.total += 1;
          currentMessageProgress.inflight += 1;
        }
      }
      if (messageDispatchedV2s) {
        for (const item of messageDispatchedV2s.items) {
          const msgId = item.msgHash;
          const storedMessagePort = await prisma.message_port.findFirst({
            where: { msg_id: msgId },
          });

          const messagePortInput = {
            ...storedMessagePort,
            id: msgId,
            msg_id: msgId,
            protocol: "ormp",
            target_block_number: +item.blockNumber,
            target_block_timestamp: new Date(+item.blockTimestamp),
            target_transaction_hash: item.transactionHash,
            status: item.dispatchResult ? 1 : 2,
          };
          if (storedMessagePort) {
            await prisma.message_port.update({
              where: { id: messagePortInput.id },
              data: messagePortInput,
            });
          } else {
            await prisma.message_port.create({ data: messagePortInput });
          }
          currentMessageProgress.inflight -= 1;
          if (!item.dispatchResult) {
            currentMessageProgress.failed += 1;
          }
        }
      }

      const nextAcceptedCursor = messageAcceptedV2s.pageInfo.endCursor;
      const nextDispatchedCursor = messageDispatchedV2s.pageInfo.endCursor;
      if (nextAcceptedCursor) {
        await prisma.sync_position.upsert({
          where: {
            id: this.syncPostionId({ chain, model: "messageAcceptedV2s" }),
          },
          update: { cursor: nextAcceptedCursor },
          create: {
            id: this.syncPostionId({ chain, model: "messageAcceptedV2s" }),
            cursor: nextAcceptedCursor,
          },
        });
      }
      if (nextDispatchedCursor) {
        await prisma.sync_position.upsert({
          where: {
            id: this.syncPostionId({ chain, model: "messageDispatchedV2s" }),
          },
          update: { cursor: nextDispatchedCursor },
          create: {
            id: this.syncPostionId({ chain, model: "messageDispatchedV2s" }),
            cursor: nextDispatchedCursor,
          },
        });
      }
    }

    if (storedMessageProgress) {
      await prisma.message_progress.update({
        where: { id: storedMessageProgress.id },
        data: currentMessageProgress,
      });
    } else {
      await prisma.message_progress.create({
        data: currentMessageProgress,
      });
    }
  }
}

interface CrawlOptions {
  runnerOptions: GripperRunnerOptions;
  ponderEndpoint: PonderEndpoint;
}

interface StoreOptions {
  runnerOptions: GripperRunnerOptions;
  messages: CrawlResult[];
}

interface GraphqlResponse {
  data: Record<string, any>;
}

interface CrawlResult {
  chain: string;
  messageAcceptedV2s?: PonderPage<MessageAcceptedV2>;
  messageDispatchedV2s?: PonderPage<messageDispatchedV2s>;
}

interface messageDispatchedV2s {
  id: string;
  targetChainId: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  msgHash: string;
  dispatchResult: boolean;
}

interface MessageAcceptedV2 {
  id: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  logIndex: number;
  msgHash: string;
  messageChannel: string;
  messageIndex: string;
  messageFromChainId: string;
  messageFrom: string;
  messageToChainId: string;
  messageTo: string;
  messageGasLimit: string;
  messageEncoded: string;
  oracle?: string;
  oracleAssigned: boolean;
  oracleAssignedFee?: string;
  oracleLogIndex?: number;
  relayer?: string;
  relayerAssigned: boolean;
  relayerAssignedFee?: string;
  relayerLogIndex?: number;
}

interface PonderPage<T> {
  items: T[];
  pageInfo: PageInfo;
}

interface PageInfo {
  startCursor: string;
  endCursor: string;
}

interface PonderError {
  errors: PErrorInfo[];
}

interface PErrorInfo {
  message: string;
  locations: {
    line: number;
    column: number;
  }[];
}

interface PonderEndpoint {
  chain: string;
  endpoint: string;
}
