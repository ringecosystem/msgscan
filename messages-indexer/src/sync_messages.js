import getNewMessages from './sync_messages/get_new_messages.js'
import setResult from './sync_messages/set_result.js'
import { loop } from './utils.js'

async function syncMessages(chainIds) {
  await Promise.all(
    chainIds.map((chainId) => [
      loop(getNewMessages(chainId)),
      loop(setResult(chainId))
    ]).flat()
  )
}

export default syncMessages
