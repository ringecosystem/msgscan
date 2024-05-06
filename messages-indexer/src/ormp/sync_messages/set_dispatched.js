import { findMessagesByStatuses, updateMessage } from '../../db/message.js'
import { findTransactionByHash } from '../../db/transaction.js'
import { findMessageDispatchedByMsgHash } from '../db/message_dispatched_v2.js'
import { MESSAGE_STATUS } from '../../constants.js'

async function doSetDispatched(messageFromChainId) {
  const messages = await findMessagesByStatuses(messageFromChainId, [MESSAGE_STATUS.PENDING])

  for (const message of messages) {
    const dispatched = await findMessageDispatchedByMsgHash(message.targetChainId, message.ormpMsgHash)
    if (!dispatched) {
      continue
    }

    const transaction = await findTransactionByHash(message.targetChainId, dispatched.transactionHash)

    await updateMessage(message, {
      targetBlockNumber: dispatched.blockNumber,
      targetBlockTimestamp: dispatched.blockTimestamp,
      targetTransactionHash: dispatched.transactionHash,
      targetTransactionIndex: dispatched.transactionIndex,
      targetLogIndex: dispatched.logIndex,
      status: dispatched.dispatchResult ? MESSAGE_STATUS.SUCCESS : MESSAGE_STATUS.FAILED,
    })
    console.log(`message ${message.id} dispatched ${dispatched.dispatchResult ? 'success' : 'failed'}`)
  }
}

function setDispatched(chainId) {
  return async () => {
    await doSetDispatched(chainId)
  }
}

export default setDispatched
