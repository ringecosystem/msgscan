async function decreaseInflightMessagesCount(MessagesInfo: any) {
  await MessagesInfo.update({
    id: 'totalInflight',
    data: ({ current }: { current: any }) => {
      let newValue = '0'
      const currentValue = parseInt(current.value)
      if (currentValue > 0) {
        newValue = `${currentValue + 1}`
      }
      return { value: newValue }
    },
  });
}

async function onMessageRecv(protocol: string, event: any, context: any) {
  const { Message, MessagesInfo } = context.db;
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

  const existed = await Message.findUnique({
    id: `${msgId}`
  }) != null;

  if (existed) {
    await Message.update({
      id: `${msgId}`,
      data: fields,
    });
    await decreaseInflightMessagesCount(MessagesInfo);
  } else {
    await Message.create({
      id: `${msgId}`,
      data: fields,
    });
  }
}

export default onMessageRecv;
