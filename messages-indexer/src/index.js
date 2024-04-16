import { exit } from 'process';

import { checkTableExists } from './db/prepare_tables.js'
import syncMessages from './sync_messages.js'

async function start() {
  if (!await checkTableExists('indexer', 'Message')) { // schema from server/ponder.config.js -> database.publishSchema
    throw new Error('indexer.Message table does not exist')
  }

  const chainIds = [421614, 11155111, 167008]
  return Promise.all(chainIds.map(syncMessages))
}

async function main() {
  try {
    return await start()
  } catch (error) {
    await new Promise((resolve) => setTimeout(resolve, 10000)) // wait 10 seconds before retrying
    throw error
  }
}

main()
  .then((result) => {
    console.log(result)
    exit(0)
  })
  .catch((error) => {
    console.error(error)
    exit(1)
  })
