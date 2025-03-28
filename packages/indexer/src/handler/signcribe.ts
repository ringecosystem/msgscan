import { DataHandlerContext, Log } from "@subsquid/evm-processor";
import { Store } from "@subsquid/typeorm-store";
import { EvmFieldSelection } from "../types";
import { OrmpContractChain, OrmpContractConfig } from "../config";
import * as signcribeAbi from "../abi/signaturepub";
import { SignaturePubSignatureSubmittion } from "../model";

export class SigncribeEvmHandler {
  private readonly signcribeHandler: SigncribeHandler;
  constructor(
    private readonly ctx: DataHandlerContext<Store, EvmFieldSelection>,
    private readonly ormpContractChain: OrmpContractChain,
    private readonly ormpContractConfig: OrmpContractConfig
  ) {
    this.signcribeHandler = new SigncribeHandler(this.ctx.store);
  }

  async handle(eventLog: Log<EvmFieldSelection>) {
    const isSignatureSubmittion =
      eventLog.topics.findIndex(
        (item) => item === signcribeAbi.events.SignatureSubmittion.topic
      ) !== -1;
    if (isSignatureSubmittion) {
      const event = signcribeAbi.events.SignatureSubmittion.decode(eventLog);
      const entity = new SignaturePubSignatureSubmittion({
        id: eventLog.id,
        blockNumber: BigInt(eventLog.block.height),
        blockTimestamp: BigInt(eventLog.block.timestamp),
        transactionHash: eventLog.transactionHash,

        chainId: event.chainId,
        channel: event.channel,
        signer: event.signer,
        msgIndex: event.msgIndex,
        signature: event.signature,
        data: event.data,
      });
      this.signcribeHandler.storeSignatureSubmittion(entity);
    }
  }
}

class SigncribeHandler {
  constructor(private readonly store: Store) {}

  storeSignatureSubmittion(entity: SignaturePubSignatureSubmittion) {
    this.store.insert(entity);
  }
}
