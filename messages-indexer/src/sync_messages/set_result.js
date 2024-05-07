import * as Message from '../db/message.js'
import * as MessageRecv from '../db/message_recv.js'
import * as Transaction from '../db/transaction.js'

import { MESSAGE_STATUS } from '../constants.js'

async function doSetRecv(sourceChainId) {
  const messages = await Message.findMessagesByStatuses(sourceChainId, [MESSAGE_STATUS.PENDING])

  for (const message of messages) {
    const messageRecv = await MessageRecv.findMessageRecvByMsgId(message.id)
    if (!messageRecv) {
      continue
    }

    const transaction = await Transaction.findTransactionByHash(messageRecv.chainId, messageRecv.transactionHash)

    await Message.updateMessage(message, {
      targetBlockNumber: messageRecv.blockNumber,
      targetBlockTimestamp: messageRecv.blockTimestamp,
      targetTransactionHash: messageRecv.transactionHash,
      targetTransactionIndex: messageRecv.transactionIndex,
      targetLogIndex: messageRecv.logIndex,
      targetPortAddress: messageRecv.portAddress,
      status: messageRecv.evResult ? MESSAGE_STATUS.SUCCESS : MESSAGE_STATUS.FAILED,
    })
    console.log(`message ${message.id} dispatched ${messageRecv.evResult ? 'success' : 'failed'}`)
  }
}

function setRecv(chainId) {
  return async () => {
    await doSetRecv(chainId)
  }
}

export default setRecv
