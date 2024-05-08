import getNewMessages from './sync_messages/get_new_messages.js'
import setDispatchResult from './sync_messages/set_dispatch_result.js'
import setProtocolInfo from './sync_messages/set_protocol_info.js'

import { loop } from './utils.js'

async function syncMessages(chainIds) {
  await Promise.all(
    chainIds.map((chainId) => [
      loop(getNewMessages(chainId)),
      loop(setDispatchResult(chainId)),
      loop(setProtocolInfo(chainId)),
    ]).flat()
  )
}

export default syncMessages
