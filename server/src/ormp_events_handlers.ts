import { ponder } from "@/generated";

ponder.on("ORMP:MessageAccepted", async ({ event, context }) => {
  const { MessageAccepted } = context.db;
  const message = event.args.message;

  await MessageAccepted.create({
    id: `${context.network.chainId}-${event.block.number}-${event.log.transactionIndex}-${event.log.logIndex}`,
    data: {
      chainId: BigInt(context.network.chainId),
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      transactionIndex: event.log.transactionIndex,
      logIndex: event.log.logIndex,

      evMsgHash: event.args.msgHash,
      evMessageChannel: message.channel,
      evMessageIndex: message.index,
      evMessageFromChainId: message.fromChainId,
      evMessageFrom: message.from,
      evMessageToChainId: message.toChainId,
      evMessageTo: message.to,
      evMessageGasLimit: message.gasLimit,
      evMessageEncoded: message.encoded,
    },
  });
})

ponder.on("SignaturePub:SignatureSubmittion" as any, async ({ event, context }) => {
  const { SignatureSubmittion } = context.db;

  await SignatureSubmittion.create({
    id: `${context.network.chainId}-${event.block.number}-${event.log.transactionIndex}-${event.log.logIndex}`,
    data: {
      chainId: BigInt(context.network.chainId),
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      transactionIndex: event.log.transactionIndex,
      logIndex: event.log.logIndex,

      srcChainId: event.args.chainId,
      channel: event.args.channel,
      msgIndex: event.args.msgIndex,
      signer: event.args.signer,
      signature: event.args.signature,
      data: event.args.data,
    },
  });
})
