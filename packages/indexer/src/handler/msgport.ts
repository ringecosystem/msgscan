import {
  DataHandlerContext as EvmTronDataHandlerContext,
  Log as EvmLog,
} from "@subsquid/evm-processor";
import { Store } from "@subsquid/typeorm-store";
import { EvmFieldSelection, ProgressId, TronFieldSelection } from "../types";
import {
  DataHandlerContext as TronDataHandlerContext,
  Log as TronLog,
} from "@subsquid/tron-processor";
import { OrmpContractChain, OrmpContractConfig } from "../config";
import * as msgportAbi from "../abi/ormpupgradeableport";
import {
  MessagePort,
  MessageProgress,
  ORMPMessageAccepted,
  ORMPUpgradeablePortMessageRecv,
  ORMPUpgradeablePortMessageSent,
} from "../model";

export class MsgportEvmHandler {
  private readonly msgportHandler: MsgportHandler;

  constructor(
    private readonly ctx: EvmTronDataHandlerContext<Store, EvmFieldSelection>,
    private readonly ormpContractChain: OrmpContractChain,
    private readonly ormpContractConfig: OrmpContractConfig
  ) {
    this.msgportHandler = new MsgportHandler(this.ctx.store);
  }

  async handle(eventLog: EvmLog<EvmFieldSelection>) {
    const isMessageRecv =
      eventLog.topics.findIndex(
        (item) => item === msgportAbi.events.MessageRecv.topic
      ) !== -1;
    const isMessageSend =
      eventLog.topics.findIndex(
        (item) => item === msgportAbi.events.MessageSent.topic
      ) !== -1;
    const eventInfo: EventInfo = {
      logIndex: eventLog.logIndex,
      address: eventLog.address,
      transactionIndex: eventLog.getTransaction().transactionIndex,
      transactionFrom: eventLog.getTransaction().from,
    };
    if (isMessageRecv) {
      const event = msgportAbi.events.MessageRecv.decode(eventLog);
      eventLog.logIndex;
      const entity = new ORMPUpgradeablePortMessageRecv({
        id: eventLog.id,
        chainId: BigInt(this.ormpContractChain.chainId),
        msgId: event.msgId,
        result: event.result,
        returnData: event.returnData,
        blockNumber: BigInt(eventLog.block.height),
        blockTimestamp: BigInt(eventLog.block.timestamp),
        transactionHash: eventLog.transactionHash,
      });
      this.msgportHandler.storeMessageRecv(entity, eventInfo);
    }
    if (isMessageSend) {
      const event = msgportAbi.events.MessageSent.decode(eventLog);
      const entity = new ORMPUpgradeablePortMessageSent({
        id: eventLog.id,
        chainId: BigInt(this.ormpContractChain.chainId),
        msgId: event.msgId,
        fromDapp: event.fromDapp,
        toChainId: event.toChainId,
        toDapp: event.toDapp,
        message: event.message,
        params: event.params,
        blockNumber: BigInt(eventLog.block.height),
        blockTimestamp: BigInt(eventLog.block.timestamp),
        transactionHash: eventLog.transactionHash,
      });
      this.msgportHandler.storeMessageSent(entity, eventInfo);
    }
  }
}

export class MsgportTronHandler {
  private readonly msgportHandler: MsgportHandler;

  constructor(
    private readonly ctx: TronDataHandlerContext<Store, TronFieldSelection>,
    private readonly ormpContractChain: OrmpContractChain,
    private readonly ormpContractConfig: OrmpContractConfig
  ) {
    this.msgportHandler = new MsgportHandler(this.ctx.store);
  }

  async handle(eventLog: TronLog<TronFieldSelection>) {
    if (!eventLog.topics) {
      this.ctx.log.warn(`no topics in event log: ${eventLog}`);
      return;
    }
    const isMessageRecv =
      eventLog.topics.findIndex(
        (item) => item === msgportAbi.events.MessageRecv.topic
      ) !== -1;
    const isMessageSend =
      eventLog.topics.findIndex(
        (item) => item === msgportAbi.events.MessageSent.topic
      ) !== -1;

    let tx = eventLog.getTransaction();
    let eventEvm = {
      topics: eventLog.topics.map((t) => "0x" + t),
      data: "0x" + eventLog.data,
    };
    const eventInfo: EventInfo = {
      logIndex: eventLog.logIndex,
      address: eventLog.address,
      transactionIndex: tx.transactionIndex,
      transactionFrom: "FAKE-TRON-TRANSACTION-FROM",
    };
    if (isMessageRecv) {
      const event = msgportAbi.events.MessageRecv.decode(eventEvm);
      const entity = new ORMPUpgradeablePortMessageRecv({
        id: eventLog.id,
        chainId: BigInt(this.ormpContractChain.chainId),
        msgId: event.msgId,
        result: event.result,
        returnData: event.returnData,
        blockNumber: BigInt(eventLog.block.height),
        blockTimestamp: BigInt(eventLog.block.timestamp),
        transactionHash: tx.hash,
      });
      this.msgportHandler.storeMessageRecv(entity, eventInfo);
    }
    if (isMessageSend) {
      const event = msgportAbi.events.MessageSent.decode(eventEvm);
      const entity = new ORMPUpgradeablePortMessageSent({
        id: eventLog.id,
        chainId: BigInt(this.ormpContractChain.chainId),
        msgId: event.msgId,
        fromDapp: event.fromDapp,
        toChainId: event.toChainId,
        toDapp: event.toDapp,
        message: event.message,
        params: event.params,
        blockNumber: BigInt(eventLog.block.height),
        blockTimestamp: BigInt(eventLog.block.timestamp),
        transactionHash: tx.hash,
      });
      this.msgportHandler.storeMessageSent(entity, eventInfo);
    }
  }
}

class MsgportHandler {
  constructor(private readonly store: Store) {}
  async storeMessageRecv(
    event: ORMPUpgradeablePortMessageRecv,
    eventInfo: EventInfo
  ) {
    this.store.insert(event);

    // msgport
    const storedMessagePort = await this.store.findOne(MessagePort, {
      where: { id: event.msgId },
    });
    const storedMessageAccept = await this.store.findOne(ORMPMessageAccepted, {
      where: { id: event.msgId },
    });
    const currentMessagePort = new MessagePort({
      ...storedMessagePort,
      id: event.msgId,
      ormp: storedMessageAccept,
      protocol: "ormp",
      status: storedMessagePort?.status ?? (event.result ? 1 : 2),
      targetBlockNumber: event.blockNumber,
      targetBlockTimestamp: event.blockTimestamp,
      targetChainId: event.chainId,
      targetLogIndex: eventInfo.logIndex,
      targetPortAddress: eventInfo.address,
      targetTransactionHash: event.transactionHash,
      targetTransactionIndex: eventInfo.transactionIndex,
    });
    if (storedMessagePort) {
      this.store.save(currentMessagePort);
    } else {
      this.store.insert(currentMessagePort);
    }
  }

  async storeMessageSent(
    event: ORMPUpgradeablePortMessageSent,
    eventInfo: EventInfo
  ) {
    this.store.insert(event);

    // msgport
    const storedMessagePort = await this.store.findOne(MessagePort, {
      where: { id: event.msgId },
    });
    const storedMessageAccept = await this.store.findOne(ORMPMessageAccepted, {
      where: { id: event.msgId },
    });
    const currentMessagePort = new MessagePort({
      ...storedMessagePort,
      id: event.msgId,
      ormp: storedMessageAccept,
      protocol: "ormp",
      payload: event.message,
      params: event.params,

      sender: eventInfo.transactionFrom,

      sourceChainId: event.chainId,
      sourceBlockNumber: event.blockNumber,
      sourceBlockTimestamp: event.blockTimestamp,
      sourceTransactionHash: event.transactionHash,
      sourceTransactionIndex: eventInfo.transactionIndex,
      sourceLogIndex: eventInfo.logIndex,
      sourceDappAddress: event.fromDapp,
      sourcePortAddress: eventInfo.address,

      targetChainId: event.toChainId,
      targetDappAddress: event.toDapp,
    });
    if (storedMessagePort) {
      this.store.save(currentMessagePort);
    } else {
      this.store.insert(currentMessagePort);
    }

    // store progress
    const storedProgressTotal = await this.store.findOne(MessageProgress, {
      where: { id: ProgressId.total },
    });
    const storedProgressInflight = await this.store.findOne(MessageProgress, {
      where: { id: ProgressId.inflight },
    });
    const currentProgressTotal =
      storedProgressTotal ??
      new MessageProgress({
        id: ProgressId.total,
        amount: 0n,
      });
    const currentProgressInflight =
      storedProgressInflight ??
      new MessageProgress({
        id: ProgressId.inflight,
        amount: 0n,
      });
    currentProgressTotal.amount += 1n;
    currentProgressInflight.amount += 1n;
    if (storedProgressTotal) {
      this.store.save(currentProgressTotal);
    } else {
      this.store.insert(currentProgressTotal);
    }
    if (storedProgressInflight) {
      this.store.save(currentProgressInflight);
    } else {
      this.store.insert(currentProgressInflight);
    }
  }
}

interface EventInfo {
  logIndex: number;
  address: string;
  transactionIndex: number;
  transactionFrom: string;
}
