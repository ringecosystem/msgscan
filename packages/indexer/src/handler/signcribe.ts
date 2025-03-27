import { DataHandlerContext, Log } from "@subsquid/evm-processor";
import { Store } from "@subsquid/typeorm-store";
import { EvmFieldSelection } from "../types";
import { OrmpContractChain, OrmpContractConfig } from "../config";

export class SigncribeEvmHandler {
  constructor(
    private readonly ctx: DataHandlerContext<Store, EvmFieldSelection>,
    private readonly ormpContractChain: OrmpContractChain,
    private readonly ormpContractConfig: OrmpContractConfig
  ) {}

  async handle(eventLog: Log<EvmFieldSelection>) {}
}
