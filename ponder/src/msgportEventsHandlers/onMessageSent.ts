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
        msgId: `${msgId}`, // msgId of msgport message
      },
    });
  }
}

async function increaseMessagesCount(MessagesInfo: any) {
  await MessagesInfo.upsert({
    id: 'total',
    create: { value: '1' },
    update: ({ current }: { current: any }) => ({
      value: `${parseInt(current.value) + 1}`
    }),
  });
  await MessagesInfo.upsert({
    id: 'totalInflight',
    create: { value: '1' },
    update: ({ current }: { current: any }) => ({
      value: `${parseInt(current.value) + 1}`
    }),
  });
}

async function onMessageSent(protocol: string, event: any, context: any, protocolInfoType?: `${string}Info`) {
  const { Message, MessagesInfo } = context.db;
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


  // Link protocol info 
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
  const existed = await Message.findUnique({
    id: `${msgId}`
  }) != null;

  if (existed) {
    await Message.update({
      id: `${msgId}`,
      data: fields,
    });
  } else {
    await Message.create({
      id: `${msgId}`,
      data: {
        ...fields,
        status: 0,
      }
    });
    await increaseMessagesCount(MessagesInfo);
  }

  // Fill msgId in OrmpInfo
  // -------------------
  await setMsgIdInProtocolInfo(protocolInfoPointer, context, event, msgId);
}

export default onMessageSent;
