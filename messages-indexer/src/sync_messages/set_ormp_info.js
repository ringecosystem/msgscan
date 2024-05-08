import * as Message from '../db/message.js'
import * as MessageAccepted from '../db/ormp/message_accepted.js'

async function setOrmpInfo() {
  const messages = await Message.findMessagesWithoutOrmpInfo()

  for (const message of messages) {
    const messageAccepted = await MessageAccepted.findByTxHashAndPortAddress(message.sourceTransactionHash, message.sourcePortAddress)
    if (!messageAccepted) throw new Error(`MessageAccepted not found for message ${message.id}`)

    await Message.updateMessage(message, {
      ormpMsgHash: messageAccepted.evMsgHash,
      ormpMsgIndex: messageAccepted.evMessageIndex,
      ormpMessageGasLimit: messageAccepted.evMessageGasLimit,
      protocolPayload: messageAccepted.evMessageEncoded,
    })
  }
}

export default setOrmpInfo
