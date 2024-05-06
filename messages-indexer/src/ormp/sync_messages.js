import fetchMessages from './sync_messages/fetch_messages.js'
import setDispatched from './sync_messages/set_dispatched.js'
import setSigners from './sync_messages/set_signers.js'
import { loop } from '../utils.js'

async function syncMessages(chainIds) {
  const promises = chainIds.map((chainId) => {
    return [
      loop(fetchMessages(chainId)),
      loop(setDispatched(chainId))
    ]
  }).concat([
    loop(setSigners, 5000)
  ]).flat()

  await Promise.all(promises)
}

export default syncMessages
