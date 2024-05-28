import { ponder } from "@/generated";

async function getMessageAccepted(context: any, event: any) {
  const { MessageAccepted } = context.db;

  const messageAccepteds = await MessageAccepted.findMany({
    where: {
      chainId: BigInt(context.network.chainId),
      blockNumber: event.block.number,
      transactionIndex: event.log.transactionIndex,
    }
  });

  if (messageAccepteds.items.length > 0 && messageAccepteds.items[0]) {
    return messageAccepteds.items[0];
  } else {
    return null;
  }
}

ponder.on("ORMPUpgradeablePort:MessageSent", async ({ event, context }) => {
  const { Message } = context.db;

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


  // Link ormp info 
  const messageAccepted = await getMessageAccepted(context, event);
  if (messageAccepted) {
    fields = {
      ...fields,
      protocolInfoType: 'MessageAccepted',
      protocolInfoId: messageAccepted.id,
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
