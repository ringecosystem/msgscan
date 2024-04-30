import { createMessage } from '../../db/message.js'
import { getLastMessageIndex } from '../db/message.js'
import { getMessageAcceptedsByIndexGt } from '../db/message_accepted_v2.js'

async function destructProtocolPayload(protocolPayload) {
  if (!protocolPayload.startsWith('0x394d1bca')) {
    return { sourceDappAddress: null, targetDappAddress: null, payload: null }
  }
  const sourceDappAddress = '0x' + protocolPayload.slice(34, 74)
  const targetDappAddress = '0x' + protocolPayload.slice(98, 138)
  const payload = '0x' + protocolPayload.slice(266)
  return { sourceDappAddress, targetDappAddress, payload }
}

async function doFetchMessages(chainId) {
  const lastMessageIndex = await getLastMessageIndex(chainId)
  const messageAccepteds = await getMessageAcceptedsByIndexGt(chainId, lastMessageIndex)

  // create messages
  for (const messageAccepted of messageAccepteds) {
    const id = `${messageAccepted.chainId}-${messageAccepted.blockNumber}-${messageAccepted.transactionIndex}-${messageAccepted.logIndex}`
    console.log(`creating message ${id}`)

    const { sourceDappAddress, targetDappAddress, payload } = await destructProtocolPayload(messageAccepted.messageEncoded)
    if (!payload) {
      console.log(`failed to destruct protocol payload: ${messageAccepted.messageEncoded}`)
      continue
    }

    await createMessage(
      id,
      {
        protocol: 'ormp',
        protocolPayload: messageAccepted.messageEncoded,
        payload: payload,

        // source
        sourceChainId: messageAccepted.messageFromChainId,
        sourceBlockNumber: messageAccepted.blockNumber,
        sourceBlockTimestamp: messageAccepted.blockTimestamp,
        sourceTransactionHash: messageAccepted.transactionHash,
        sourceTransactionIndex: messageAccepted.transactionIndex,
        sourceLogIndex: messageAccepted.logIndex,
        sourcePortAddress: messageAccepted.messageFrom,
        sourceDappAddress: sourceDappAddress,

        // target
        targetChainId: messageAccepted.messageToChainId,
        targetPortAddress: messageAccepted.messageTo,
        targetDappAddress: targetDappAddress,

        ormpMsgHash: messageAccepted.msgHash,
        ormpMessageIndex: messageAccepted.messageIndex,
        ormpMessageGasLimit: messageAccepted.messageGasLimit,
      },
    )
  }
}

function fetchMessages(chainId) {
  return async () => {
    await doFetchMessages(chainId)
  }
}

export default fetchMessages
