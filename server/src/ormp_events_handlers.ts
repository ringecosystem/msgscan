import { ponder } from "@/generated";

ponder.on("ORMP:MessageAccepted", async ({ event, context }) => {
  const { MessageAccepted } = context.db;
  const message = event.args.message;
  console.log(message)

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
