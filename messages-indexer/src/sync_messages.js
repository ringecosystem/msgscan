import getNewMessages from './sync_messages/get_new_messages.js'
import setResult from './sync_messages/set_result.js'
import { loop } from './utils.js'

async function syncMessages(chainIds) {
  const promises = chainIds.map((chainId) => {
    return [
      loop(getNewMessages(chainId)),
      loop(setResult(chainId))
    ]
  }).flat()

  await Promise.all(promises)
}

export default syncMessages
