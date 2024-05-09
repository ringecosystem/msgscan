import * as Message from '../db/message.js'
import * as SignatureSubmittion from '../db/ormp/signature_submittion.js'

async function setOrmpSigners() {
  const messages = await Message.findMessagesWithoutOrmpSigners()
  // console.debug(`messages without ormp signers: ${messages.length}`)

  for (const message of messages) {
    const signers = await SignatureSubmittion.findSigners(message.sourceChainId, message.ormpMsgIndex)

    if (signers.length > 0) {
      console.debug(`message ${message.id} ormp signers: ${signers}`)
      await Message.updateMessage(message, {
        ormpSigners: signers.join(','),
      })
      console.log(`message ${message.id} ormp signers set.`)
    }
  }
}

export default setOrmpSigners
