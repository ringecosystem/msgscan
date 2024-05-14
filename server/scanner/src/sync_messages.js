import getNewMessages from './sync_messages/get_new_messages.js'
import setDispatchResult from './sync_messages/set_dispatch_result.js'
import setOrmpInfo from './sync_messages/set_ormp_info.js'
import setOrmpSigners from './sync_messages/set_ormp_signers.js'

import { loopDo } from './utils.js'

async function syncMessages(chainIds) {
  const tasks = []

  // msgport tasks
  for (const chainId of chainIds) {
    tasks.push(loopDo(getNewMessages(chainId)))
    tasks.push(loopDo(setDispatchResult(chainId)))
  }

  // tasks for protocol info
  tasks.push(loopDo(setOrmpInfo))
  tasks.push(loopDo(setOrmpSigners))

  await Promise.all(tasks)
}

export default syncMessages
