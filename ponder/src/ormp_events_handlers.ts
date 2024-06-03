import { ponder } from "@/generated";

// example: https://sepolia.etherscan.io/tx/0xe7cc24f809754f65f999d8e96f028427f81c41d30b5eb02930b20fb5bfb2d7e9#eventlog
ponder.on("ORMP:MessageAccepted", async ({ event, context }) => {
  const { OrmpInfo } = context.db;
  const message = event.args.message;

  await OrmpInfo.create({
    id: `${context.network.chainId}-${event.block.number}-${event.log.transactionIndex}-${event.log.logIndex}`,
    data: {
      chainId: BigInt(context.network.chainId),
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      transactionIndex: event.log.transactionIndex,
      logIndex: event.log.logIndex,

      msgHash: event.args.msgHash,
      messageChannel: message.channel,
      messageIndex: message.index,
      messageFromChainId: message.fromChainId,
      messageFrom: message.from,
      messageToChainId: message.toChainId,
      messageTo: message.to,
      messageGasLimit: message.gasLimit,
      messageEncoded: message.encoded,
    },
  });
})

ponder.on("SignaturePub:SignatureSubmittion", async ({ event, context }) => {
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
