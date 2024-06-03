
async function getProtocolInfo(protocolInfoTypeName: string, context: any, event: any) {
  const protocolInfoType = context.db[protocolInfoTypeName];
  if (!protocolInfoType) return null;

  const protocolInfoArray = await protocolInfoType.findMany({
    where: {
      chainId: BigInt(context.network.chainId),
      blockNumber: event.block.number,
      transactionIndex: event.log.transactionIndex,
    }
  });

  if (protocolInfoArray.items.length > 0 && protocolInfoArray.items[0]) {
    return protocolInfoArray.items[0];
  } else {
    return null;
  }
}


async function getProtocolInfoPointer(protocolInfoTypeName: string, context: any, event: any) {
  const protocolInfo = await getProtocolInfo(protocolInfoTypeName, context, event);
  if (protocolInfo) {
    return {
      protocolInfoType: protocolInfoTypeName,
      protocolInfoId: protocolInfo.id,
    }
  } else {
    return {}
  }
}

async function setMsgIdInProtocolInfo(protocolInfoPointer: any, context: any, event: any, msgId: string) {
  if (protocolInfoPointer.protocolInfoType) {
    const protocolInfoType = context.db[protocolInfoPointer.protocolInfoType]
    protocolInfoType.update({
      id: protocolInfoPointer.protocolInfoId,
      data: {
        msgId: `${msgId}`,
      },
    });
  }
}

async function onMessageSent(protocol: string, event: any, context: any, protocolInfoType?: string) {
  const { Message } = context.db;
  const { msgId, fromDapp, toChainId, toDapp, message, params } = event.args;

  // Prepare fields
  // -------------------
  let fields: any = {
    protocol: protocol,
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
  if (!protocolInfoType) {
    // capitalize first letter, then add "Info". e.g. "ormp" -> "OrmpInfo"
    protocolInfoType = protocol.charAt(0).toUpperCase() + protocol.slice(1) + "Info"
  }
  const protocolInfoPointer = await getProtocolInfoPointer(protocolInfoType, context, event)
  fields = {
    ...fields,
    ...protocolInfoPointer,
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

  // Fill msgId in OrmpInfo
  // -------------------
  await setMsgIdInProtocolInfo(protocolInfoPointer, context, event, msgId);
}

async function onMessageRecv(protocol: string, event: any, context: any) {
  const { Message } = context.db;
  const { msgId, result, returnData } = event.args;

  const fields = {
    protocol: protocol,
    status: result ? 1 : 2,

    targetChainId: BigInt(context.network.chainId),
    targetBlockNumber: event.block.number,
    targetBlockTimestamp: event.block.timestamp,
    targetTransactionHash: event.transaction.hash,
    targetTransactionIndex: event.log.transactionIndex,
    targetLogIndex: event.log.logIndex,
    targetPortAddress: event.log.address,
  }

  Message.upsert({
    id: msgId,
    create: fields,
    update: fields,
  });
}

export { onMessageSent, onMessageRecv }
