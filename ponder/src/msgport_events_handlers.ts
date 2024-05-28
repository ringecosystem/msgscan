import { ponder } from "@/generated";

ponder.on("ORMPUpgradeablePort:MessageSent", async ({ event, context }) => {
  const { Message, MessageAccepted } = context.db;

  const { msgId, fromDapp, toChainId, toDapp, message, params } = event.args;

  // Prepare fields
  // -------------------
  let fields: any = {
    protocol: "ormp",
    payload: message,
    params: params,

    sourceChainId: BigInt(context.network.chainId),
    sourceBlockNumber: event.block.number,
    sourceBlockTimestamp: event.block.timestamp,
    sourceTransactionHash: event.transaction.hash,
    sourceTransactionIndex: event.log.transactionIndex,
    sourceLogIndex: event.log.logIndex,
    sourceDappAddress: fromDapp,
    sourcePortAddress: event.log.address,

    targetChainId: BigInt(toChainId),
    targetDappAddress: toDapp,
  }


  // Add ormp fields
  const messageAccepteds = await MessageAccepted.findMany({
    where: {
      chainId: BigInt(context.network.chainId),
      blockNumber: event.block.number,
      transactionIndex: event.log.transactionIndex,
    }
  });
  if (messageAccepteds.items.length > 0 && messageAccepteds.items[0]) {
    const messageAccepted = messageAccepteds.items[0];
    fields = {
      ...fields,
      protocolFields: {
        msgHash: `${messageAccepted.evMsgHash}`,
        message: {
          channel: `${messageAccepted.evMessageChannel}`,
          index: `${messageAccepted.evMessageIndex}`,
          fromChainId: `${messageAccepted.evMessageFromChainId}`,
          from: `${messageAccepted.evMessageFrom}`,
          toChainId: `${messageAccepted.evMessageToChainId}`,
          to: `${messageAccepted.evMessageTo}`,
          gasLimit: `${messageAccepted.evMessageGasLimit}`,
          encoded: `${messageAccepted.evMessageEncoded}`,
        }
      }
    }
  }

  // Update or insert
  // -------------------
  Message.upsert({
    id: `${msgId}`,
    create: {
      ...fields,
      status: 0,
    },
    update: fields,
  });
})

ponder.on("ORMPUpgradeablePort:MessageRecv", async ({ event, context }) => {
  const { msgId, result, returnData } = event.args;

  const fields = {
    protocol: "ormp",
    status: result ? 1 : 2,

    targetChainId: BigInt(context.network.chainId),
    targetBlockNumber: event.block.number,
    targetBlockTimestamp: event.block.timestamp,
    targetTransactionHash: event.transaction.hash,
    targetTransactionIndex: event.log.transactionIndex,
    targetLogIndex: event.log.logIndex,
    targetPortAddress: event.log.address,
  }

  const { Message } = context.db;
  // console.log("MessageRecv", msgId, fields);
  Message.upsert({
    id: msgId,
    create: fields,
    update: fields,
  });
})
