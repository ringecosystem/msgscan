async function decreaseInflightMessagesCount() {
  await MessagesInfo.update({
    id: 'totalInflight',
    data: ({ current }) => {
      let newValue = '0'
      if (parseInt(current.value) > 0) {
        newValue = `${parseInt(current.value) + 1}` 
      }
      return { value: newValue }
    },
  });
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

  const existed = await Message.findUnique({
    id: `${msgId}`
  }) != null;

  if (existed) {
    await Message.update({
      id: `${msgId}`,
      data: fields,
    });
    await decreaseInflightMessagesCount();
  } else {
    await Message.create({
      id: `${msgId}`,
      data: fields,
    });
  }
}

export default onMessageRecv;
