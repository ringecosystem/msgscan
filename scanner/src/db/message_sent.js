import sql from './db.js'
import { PONDER_PUBLISH_SCHEMA } from '../constants.js'

// get all MessageSent events after a given log on ${chainId}
async function getMessageSentsAfter(chainId, blockNumber, transactionIndex, logIndex) {
  const id = `${chainId}-${blockNumber}-${transactionIndex}-${logIndex}`
  const result = await sql`
    SELECT *
    FROM ${sql(PONDER_PUBLISH_SCHEMA)}."MessageSent"
    WHERE "chainId"=${chainId} and id > ${id}
  `
  return result
}

export { getMessageSentsAfter }
