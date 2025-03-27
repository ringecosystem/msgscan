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

export class OrmpEvmHandler {
  constructor(
    private readonly ctx: EvmTronDataHandlerContext<Store, EvmFieldSelection>,
    private readonly ormpContractChain: OrmpContractChain,
    private readonly ormpContractConfig: OrmpContractConfig,
  ) {}

  async handle(eventLog: EvmLog<EvmFieldSelection>) {}
}

export class OrmpTronHandler {
  constructor(
    private readonly ctx: TronDataHandlerContext<Store, TronFieldSelection>,
    private readonly ormpContractChain: OrmpContractChain,
    private readonly ormpContractConfig: OrmpContractConfig,
  ) {}

  async handle(eventLog: TronLog<TronFieldSelection>) {}
}
