import * as Message from '../db/message.js'
import * as OrmpMessageAccepted from '../db/ormp/message_accepted.js'

async function doSetProtocolInfo(sourceChainId) {
  const messages = await Message.findMessagesWithoutProtocolInfo(sourceChainId)

  for (const message of messages) {
    if (message.protocol === 'ormp') {
      await _setOrmpInfo(message)
    } else {
      throw new Error(`Set protocol info of ${message.protocol} has not been implemented yet`)
    }
  }
}

async function _setOrmpInfo(message) {
  const ormpMessageAccepted = await OrmpMessageAccepted.findByTxHashAndPortAddress(message.sourceTransactionHash, message.sourcePortAddress)
  if (!ormpMessageAccepted) throw new Error(`MessageAccepted not found for message ${message.id}`)

  await Message.updateMessage(message, {
    ormpMsgHash: ormpMessageAccepted.evMsgHash,
    ormpMessageIndex: ormpMessageAccepted.evMessageIndex,
    ormpMessageGasLimit: ormpMessageAccepted.evMessageGasLimit,
    protocolPayload: ormpMessageAccepted.evMessageEncoded,
  })
}

function setProtocolInfo(sourceChainId) {
  return async () => {
    await doSetProtocolInfo(sourceChainId)
  }
}

export default setProtocolInfo
