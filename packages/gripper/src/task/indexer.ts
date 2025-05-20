import { setTimeout } from "timers/promises";
import { Service } from "typedi";
import { GripperRunnerOptions } from "../types";
// @ts-ignore
import { gql, request } from "graphql-request";

@Service({})
export class IndexerTask {
  private readonly indexerEndpoint: IndexerEndpoint = {
    endpoint: "https://ormpindexer.vercel.app/graphql",
  };

  private skipCounter: number = 0;

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
      if (this.skipCounter > 0) {
        this.skipCounter -= 1;
        if (this.skipCounter % 5 == 0) {
          fastify.log.info(`-+ skip ${this.skipCounter} round left`);
        }
        await setTimeout(3000);
        continue;
      }

      let messageScanInfo: CrawlResult;
      try {
        const crawResult = await this.crawl({
          runnerOptions: options,
          indexerEndpoint: this.indexerEndpoint,
        });
        if (
          !crawResult ||
          (crawResult.ormpMessageAccepteds.length === 0 &&
            crawResult.ormpMessageDispatcheds.length === 0)
        ) {
          fastify.log.info(`-- not have messages skip 25 round`);
          this.skipCounter = 25;
          continue;
        }
        messageScanInfo = crawResult;
      } catch (e) {
        fastify.log.error(`xx error in crawl: ${e}`);
        this.skipCounter = 5;
        continue;
      }

      fastify.log.info(
        `messageScanInfo: accepteds: ${messageScanInfo.ormpMessageAccepteds.length} dispatcheds: ${messageScanInfo.ormpMessageDispatcheds.length} sents: ${messageScanInfo.msgportMessageSents.length} recvs: ${messageScanInfo.msgportMessageRecvs.length}`
      );
      await this.storeMessages({
        runnerOptions: options,
        message: messageScanInfo,
      });
      await setTimeout(3000);
    }
  }

  private syncPostionId(options: { model: string }) {
    const id = `${options.model}`;
    return id.toLowerCase();
  }

  private async crawl(options: CrawlOptions): Promise<CrawlResult | undefined> {
    const { runnerOptions, indexerEndpoint } = options;
    const { fastify } = runnerOptions;
    const prisma = fastify.prisma;
    const syncPostionIds = [
      this.syncPostionId({
        model: "ormpMessageAccepteds",
      }),
      this.syncPostionId({
        model: "ormpMessageDispatcheds",
      }),
      this.syncPostionId({
        model: "msgportMessageSents",
      }),
      this.syncPostionId({
        model: "msgportMessageRecvs",
      }),
    ];
    const storedPostions = await prisma.sync_position.findMany({
      where: {
        id: {
          in: syncPostionIds,
        },
      },
    });
    const ormpMessageAcceptedsPosition = storedPostions.find(
      (item) => item.id === syncPostionIds[0]
    );
    const ormpMessageDispatchedsPosition = storedPostions.find(
      (item) => item.id === syncPostionIds[1]
    );
    const msgportMessageSentsPosition = storedPostions.find(
      (item) => item.id === syncPostionIds[2]
    );
    const msgportMessageRecvsPosition = storedPostions.find(
      (item) => item.id === syncPostionIds[3]
    );

    const gqlMessageScanInfo = gql`
      query MessageScanInfo(
        $messageAcceptedOffset: Int!
        $messageDispatchedOffset: Int!
        $msgportSentOffset: Int!
        $msgportRecvOffset: Int!
      ) {
        ormpMessageAccepteds(
          orderBy: blockNumber_ASC
          limit: 10
          offset: $messageAcceptedOffset
        ) {
          id
          chainId
          blockNumber
          blockTimestamp
          transactionHash
          logIndex
          msgHash
          channel
          index
          fromChainId
          from
          toChainId
          to
          gasLimit
          encoded
          oracle
          oracleAssigned
          oracleAssignedFee
          relayer
          relayerAssigned
          relayerAssignedFee
        }
        ormpMessageDispatcheds(
          orderBy: blockNumber_ASC
          limit: 10
          offset: $messageDispatchedOffset
        ) {
          id
          chainId
          targetChainId
          blockNumber
          blockTimestamp
          transactionHash
          msgHash
          dispatchResult
        }
        msgportMessageSents(
          orderBy: blockNumber_ASC
          limit: 10
          offset: $msgportSentOffset
        ) {
          id
          chainId
          blockNumber
          blockTimestamp
          transactionHash
          transactionFrom
          transactionIndex
          logIndex
          msgId
          fromChainId
          fromDapp
          toChainId
          toDapp
          message
          params
          portAddress
        }
        msgportMessageRecvs(
          orderBy: blockNumber_ASC
          limit: 10
          offset: $msgportRecvOffset
        ) {
          id
          chainId
          blockNumber
          blockTimestamp
          transactionHash
          transactionIndex
          logIndex
          msgId
          portAddress
          result
          returnData
        }
      }
    `;

    const position = {
      messageAcceptedOffset: +(ormpMessageAcceptedsPosition?.cursor ?? 0),
      messageDispatchedOffset: +(ormpMessageDispatchedsPosition?.cursor ?? 0),
      msgportSentOffset: +(msgportMessageSentsPosition?.cursor ?? 0),
      msgportRecvOffset: +(msgportMessageRecvsPosition?.cursor ?? 0),
    };
    const responseMessageScanInfo: GraphqlResponse | IndexerError =
      await request({
        url: indexerEndpoint.endpoint,
        document: gqlMessageScanInfo,
        variables: {
          ...position,
        },
      });
    if (!responseMessageScanInfo) {
      return;
    }
    if (responseMessageScanInfo["errors"]) {
      fastify.log.error(responseMessageScanInfo["errors"]);
      return;
    }
    const ormpMessageAccepteds = responseMessageScanInfo[
      "ormpMessageAccepteds"
    ] as unknown as OrmpMessageAccepted[];
    const ormpMessageDispatcheds = responseMessageScanInfo[
      "ormpMessageDispatcheds"
    ] as unknown as OrmpMessageDispatched[];
    const msgportMessageSents = responseMessageScanInfo[
      "msgportMessageSents"
    ] as unknown as MsgportMessageSent[];
    const msgportMessageRecvs = responseMessageScanInfo[
      "msgportMessageRecvs"
    ] as unknown as MsgportMessageRecv[];
    return {
      ormpMessageAccepteds,
      ormpMessageDispatcheds,
      msgportMessageSents,
      msgportMessageRecvs,
      position,
    };
  }

  private async storeMessages(options: StoreOptions) {
    const { runnerOptions, message } = options;
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

    const {
      ormpMessageAccepteds,
      ormpMessageDispatcheds,
      msgportMessageSents,
      msgportMessageRecvs,
      position,
    } = message;

    if (ormpMessageAccepteds.length) {
      for (const item of ormpMessageAccepteds) {
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
          source_chain_id: +item.fromChainId,
          source_block_number: +item.blockNumber,
          source_block_timestamp: new Date(+item.blockTimestamp),
          source_transaction_hash: item.transactionHash,
          source_log_index: +item.logIndex,
          target_chain_id: +item.toChainId,
        };
        if (storedMessagePort) {
          await prisma.message_port.update({
            where: { id: messagePortInput.id },
            data: messagePortInput,
          });
          fastify.log.debug(`[message-accepted] updated msgport: ${msgId}`);
        } else {
          await prisma.message_port.create({ data: messagePortInput });
          fastify.log.debug(`[message-accepted] stored msgport: ${msgId}`);
        }
        currentMessageProgress.total += 1;
        currentMessageProgress.inflight += 1;

        const messageOrmp = {
          id: msgId,
          block_number: +item.blockNumber,
          block_timestamp: new Date(+item.blockTimestamp),
          transaction_hash: item.transactionHash,

          msg_hash: item.msgHash,
          channel: item.channel,
          index: +item.index,
          from_chain_id: +item.fromChainId,
          from: item.from,
          to_chain_id: +item.toChainId,
          to: item.to,
          gas_limit: item.gasLimit,
          encoded: item.encoded,

          oracle: item.oracle,
          oracle_assigned: item.oracleAssigned,
          oracle_assigned_fee: item.oracleAssignedFee,

          relayer: item.relayer,
          relayer_assigned: item.relayerAssigned,
          relayer_assigned_fee: item.relayerAssignedFee,
        };
        await prisma.message_ormp.create({ data: messageOrmp });
        fastify.log.debug(`[message-accepted] stored message ormp: ${msgId}`);
      }
    }

    if (ormpMessageDispatcheds.length) {
      for (const item of ormpMessageDispatcheds) {
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
          fastify.log.debug(`[message-dispatch] update msgport: ${msgId}`);
        } else {
          await prisma.message_port.create({ data: messagePortInput });
          fastify.log.debug(`[message-dispatch] stored msgport: ${msgId}`);
        }
        currentMessageProgress.inflight -= 1;
        if (!item.dispatchResult) {
          currentMessageProgress.failed += 1;
        }
      }
    }

    if (msgportMessageSents.length) {
      for (const item of msgportMessageSents) {
        const msgId = item.msgId;
        const storedMessagePort = await prisma.message_port.findFirst({
          where: { msg_id: msgId },
        });
        const messagePortInput = {
          ...storedMessagePort,
          id: msgId,
          msg_id: msgId,
          protocol: "ormp",
          source_dapp_address: item.fromDapp,
          target_dapp_address: item.toDapp,
          payload: item.message,
          params: item.params,
          sender: item.transactionFrom,
          source_port_address: item.portAddress,
        };
        if (storedMessagePort) {
          await prisma.message_port.update({
            where: { id: messagePortInput.id },
            data: messagePortInput,
          });
          fastify.log.debug(`[msgport-sent] update msgport: ${msgId}`);
        } else {
          await prisma.message_port.create({ data: messagePortInput });
          fastify.log.debug(`[msgport-sent] stored msgport: ${msgId}`);
        }
      }
    }

    if (msgportMessageRecvs.length) {
      for (const item of msgportMessageRecvs) {
        const msgId = item.msgId;
        const storedMessagePort = await prisma.message_port.findFirst({
          where: { msg_id: msgId },
        });
        const messagePortInput = {
          ...storedMessagePort,
          id: msgId,
          msg_id: msgId,
          protocol: "ormp",
          target_port_address: item.portAddress,
        };
        if (storedMessagePort) {
          await prisma.message_port.update({
            where: { id: messagePortInput.id },
            data: messagePortInput,
          });
          fastify.log.debug(`[msgport-recv] update msgport: ${msgId}`);
        } else {
          await prisma.message_port.create({ data: messagePortInput });
          fastify.log.debug(`[msgport-recv] update msgport: ${msgId}`);
        }
      }
    }

    const nextMessageAcceptedOffset =
      position.messageAcceptedOffset + ormpMessageAccepteds.length;
    const nextMessageDispatchedOffset =
      position.messageDispatchedOffset + ormpMessageDispatcheds.length;
    const nextMsgportSentOffset =
      position.msgportSentOffset + msgportMessageSents.length;
    const nextMsgportRecvOffset =
      position.msgportRecvOffset + msgportMessageRecvs.length;

    await prisma.sync_position.upsert({
      where: {
        id: this.syncPostionId({ model: "ormpMessageAccepteds" }),
      },
      update: { cursor: nextMessageAcceptedOffset.toString() },
      create: {
        id: this.syncPostionId({ model: "ormpMessageAccepteds" }),
        cursor: nextMessageAcceptedOffset.toString(),
      },
    });
    await prisma.sync_position.upsert({
      where: {
        id: this.syncPostionId({ model: "ormpMessageDispatcheds" }),
      },
      update: { cursor: nextMessageDispatchedOffset.toString() },
      create: {
        id: this.syncPostionId({ model: "ormpMessageDispatcheds" }),
        cursor: nextMessageDispatchedOffset.toString(),
      },
    });
    await prisma.sync_position.upsert({
      where: {
        id: this.syncPostionId({ model: "msgportMessageSents" }),
      },
      update: { cursor: nextMsgportSentOffset.toString() },
      create: {
        id: this.syncPostionId({ model: "msgportMessageSents" }),
        cursor: nextMsgportSentOffset.toString(),
      },
    });
    await prisma.sync_position.upsert({
      where: {
        id: this.syncPostionId({ model: "msgportMessageRecvs" }),
      },
      update: { cursor: nextMsgportRecvOffset.toString() },
      create: {
        id: this.syncPostionId({ model: "msgportMessageRecvs" }),
        cursor: nextMsgportRecvOffset.toString(),
      },
    });
    fastify.log.debug(
      `update position: { accepted: ${nextMessageAcceptedOffset}, dispatched: ${nextMessageDispatchedOffset}, sent: ${nextMsgportSentOffset}, recv: ${nextMsgportRecvOffset} }`
    );

    await prisma.message_progress.upsert({
      where: { id: "global" },
      update: currentMessageProgress,
      create: currentMessageProgress,
    });
    fastify.log.info(
      `update message progress: { total: ${currentMessageProgress.total}, inflight: ${currentMessageProgress.inflight}, failed: ${currentMessageProgress.failed} }`
    );
  }
}

interface CrawlOptions {
  runnerOptions: GripperRunnerOptions;
  indexerEndpoint: IndexerEndpoint;
}

interface StoreOptions {
  runnerOptions: GripperRunnerOptions;
  message: CrawlResult;
}

interface GraphqlResponse {
  data: Record<string, any>;
}

interface CrawlResult {
  ormpMessageAccepteds: OrmpMessageAccepted[];
  ormpMessageDispatcheds: OrmpMessageDispatched[];
  msgportMessageSents: MsgportMessageSent[];
  msgportMessageRecvs: MsgportMessageRecv[];
  position: MessageScanQueryPosition;
}

interface MessageScanQueryPosition {
  messageAcceptedOffset: number;
  messageDispatchedOffset: number;
  msgportSentOffset: number;
  msgportRecvOffset: number;
}

interface MsgportMessageSent {
  id: string;
  chainId: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  transactionFrom: string;
  transactionIndex: number;
  logIndex: number;
  msgId: string;
  fromChainId: string;
  fromDapp: string;
  toChainId: string;
  toDapp: string;
  message: string;
  params: string;
  portAddress: string;
}

interface MsgportMessageRecv {
  id: string;
  chainId: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  transactionIndex: number;
  logIndex: number;
  msgId: string;
  portAddress: string;
  result: boolean;
  returnData: string;
}

interface OrmpMessageDispatched {
  id: string;
  chainId: string;
  targetChainId: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  msgHash: string;
  dispatchResult: boolean;
}

interface OrmpMessageAccepted {
  id: string;
  chainId: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  logIndex: number;
  msgHash: string;
  channel: string;
  index: string;
  fromChainId: string;
  from: string;
  toChainId: string;
  to: string;
  gasLimit: string;
  encoded: string;
  oracle?: string;
  oracleAssigned: boolean;
  oracleAssignedFee?: string;
  relayer?: string;
  relayerAssigned: boolean;
  relayerAssignedFee?: string;
}

interface IndexerError {
  errors: IndexerErrorInfo[];
}

interface IndexerErrorInfo {
  message: string;
  locations: {
    line: number;
    column: number;
  }[];
}

interface IndexerEndpoint {
  endpoint: string;
}
