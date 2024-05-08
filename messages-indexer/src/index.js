import { exit } from 'process';

import { checkTableExists } from './db/prepare_tables.js'
import syncMessages from './sync_messages.js'

async function main() {
  try {
    if (!await checkTableExists('indexer', 'Message')) { // schema from server/ponder.config.js -> database.publishSchema
      throw new Error("'indexer.Message' table does not exist. Please check if the server is running. It needs some time if it is the first time you are running the server.")
    }

    await syncMessages([421614, 11155111])
  } catch (error) {
    await new Promise((resolve) => setTimeout(resolve, 10000)) // wait 10 seconds before retrying by docker-compose
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
