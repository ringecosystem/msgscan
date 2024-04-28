import { findMessagesWithMissingSigners } from '../db/message.js'
import { updateMessage } from '../../db/message.js'

import { findSigners } from '../db/signature_submittion.js'

async function setSigners() {
  const messages = await findMessagesWithMissingSigners()

  console.log(`found ${messages.length} messages with missing signers`);
  for (const message of messages) {
    const signers = await findSigners(message.sourceChainId, message.ormpMessageIndex)
    if (signers.length === 0) {
      continue
    }

    updateMessage(message, { ormpSigners: signers.join(','), ormpLatestSignaturesUpdatedAt: Math.floor(new Date().getTime() / 1000) })
    console.log(`updated signers of message ${message.id}`)
  }
}

export default setSigners
