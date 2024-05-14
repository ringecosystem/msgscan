import * as Message from '../db/message.js'
import * as MessageSent from '../db/message_sent.js'
import { MESSAGE_STATUS } from '../constants.js'

async function doGetNewMessages(chainId) {
  const lastMessage = await Message.getLastMessageOf(chainId)

  let messageSents
  if (!lastMessage) {
    messageSents = await MessageSent.getMessageSentsAfter(chainId, 0, 0, 0)
  } else {
    messageSents = await MessageSent.getMessageSentsAfter(chainId, lastMessage.sourceBlockNumber, lastMessage.sourceTransactionIndex, lastMessage.sourceLogIndex)
  }

  // create messages
  for (const messageSent of messageSents) {
    await Message.createMessage(
      messageSent.evMsgId,
      {
        protocol: messageSent.protocol,
        payload: messageSent.evMessage,
        params: messageSent.evParams,
        status: MESSAGE_STATUS.PENDING,

        // source
        sourceChainId: messageSent.chainId,
        sourceBlockNumber: messageSent.blockNumber,
        sourceBlockTimestamp: messageSent.blockTimestamp,
        sourceTransactionHash: messageSent.transactionHash,
        sourceTransactionIndex: messageSent.transactionIndex,
        sourceLogIndex: messageSent.logIndex,
        sourcePortAddress: messageSent.portAddress,
        sourceDappAddress: messageSent.evFromDapp,

        // target
        targetChainId: messageSent.evToChainId,
        targetDappAddress: messageSent.evToDapp,
      },
      console.log(`message ${messageSent.evMsgId} created.`)
    )
  }
}

function getNewMessages(protocol, chainId) {
  return async () => {
    await doGetNewMessages(protocol, chainId)
  }
}

export default getNewMessages
