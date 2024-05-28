import { ponder } from "@/generated";

// example: https://sepolia.etherscan.io/tx/0xe7cc24f809754f65f999d8e96f028427f81c41d30b5eb02930b20fb5bfb2d7e9#eventlog
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

  // console.log("--------------------------");
  // const { msgHash } = event.args;
  // const { fromChainId } = event.args.message;
  //
  // const { Message } = context.db;
  // console.log("chain id", fromChainId)
  // console.log("tx: ", event.log.transactionHash)
  // const messages = await Message.findMany({
  //   where: {
  //     sourceChainId: BigInt(fromChainId),
  //     sourceBlockNumber: event.block.number,
  //     sourceTransactionIndex: event.log.transactionIndex
  //   }
  // });
  // console.log(messages.items.length)
  //
  // if (messages.items.length > 0 && messages.items[0]) {
  //   const message = messages.items[0];
  //
  //   console.log(message)
  //   await Message.update({
  //     id: message.id,
  //     data: {
  //       protocalFields: {
  //         msgHash: msgHash,
  //         message: event.args.message,
  //       }
  //     }
  //   });
  //
  //   console.log("MessageAccepted", msgHash);
  // }
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
