import * as Message from '../db/message.js'
import * as SignatureSubmittion from '../db/ormp/signature_submittion.js'

async function setOrmpSigners() {
  const messages = await Message.findMessagesWithoutOrmpSigners()

  for (const message of messages) {
    const signers = await SignatureSubmittion.findSigners(message.sourceChainId, message.ormpMsgIndex)

    if (signers.length > 0) {
      await Message.updateMessage(message, {
        ormpSigners: signers.join(','),
      })
    }
  }
}

export default setOrmpSigners
