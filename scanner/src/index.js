import { exit } from 'process';

import { checkTableExists } from './db/prepare_tables.js'
import syncMessages from './sync_messages.js'

import { PONDER_PUBLISH_SCHEMA, MESSAGE_TABLE } from './constants.js'

async function main() {
  if (!await checkTableExists(PONDER_PUBLISH_SCHEMA, MESSAGE_TABLE)) {
    throw new Error(`Table '${PONDER_PUBLISH_SCHEMA}.${MESSAGE_TABLE}' does not exist. Please check if the server is running. It needs some time if it is the first time you are running the server.`)
  }

  await syncMessages([43, 45, 421614, 11155111, 2494104990])
}

(async () => {
  try {
    await main()
    exit(0)
  } catch (error) {
    if (error.message.includes(`Table '${PONDER_PUBLISH_SCHEMA}.${MESSAGE_TABLE}' does not exist.`)) {
      console.error(error.message)
    } else {
      console.error(error)
    }

    console.log('Waiting 10 minutes to exit.')
    await new Promise((resolve) => setTimeout(resolve, 60 * 1000 * 10)) // wait 10 minutes
    exit(1)
  }
})()
