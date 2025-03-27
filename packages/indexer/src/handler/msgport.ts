import {
  DataHandlerContext as EvmTronDataHandlerContext,
  Log as EvmLog,
} from "@subsquid/evm-processor";
import { Store } from "@subsquid/typeorm-store";
import { EvmFieldSelection, TronFieldSelection } from "../types";
import {
  DataHandlerContext as TronDataHandlerContext,
  Log as TronLog,
} from "@subsquid/tron-processor";
import { OrmpContractChain, OrmpContractConfig } from "../config";
import * as msgportAbi from "../abi/ormpupgradeableport";

export class MsgportEvmHandler {
  constructor(
    private readonly ctx: EvmTronDataHandlerContext<Store, EvmFieldSelection>,
    private readonly ormpContractChain: OrmpContractChain,
    private readonly ormpContractConfig: OrmpContractConfig
  ) {}

  async handle(eventLog: EvmLog<EvmFieldSelection>) {
    const isMessageRecv =
      eventLog.topics.findIndex(
        (item) => item === msgportAbi.events.MessageRecv.topic
      ) !== -1;
    const isMessageSend =
      eventLog.topics.findIndex(
        (item) => item === msgportAbi.events.MessageSent.topic
      ) !== -1;
  }
}

export class MsgportTronHandler {
  constructor(
    private readonly ctx: TronDataHandlerContext<Store, TronFieldSelection>,
    private readonly ormpContractChain: OrmpContractChain,
    private readonly ormpContractConfig: OrmpContractConfig
  ) {}

  async handle(eventLog: TronLog<TronFieldSelection>) {
    const isMessageRecv =
      eventLog.topics?.findIndex(
        (item) => item === msgportAbi.events.MessageRecv.topic
      ) !== -1;
    const isMessageSend =
      eventLog.topics?.findIndex(
        (item) => item === msgportAbi.events.MessageSent.topic
      ) !== -1;
  }
}

class MsgportHandler {}
