import sql from '../../db/db.js'
import { MESSAGE_TABLE } from '../../constants.js'

async function getLastMessageIndex(chainId) {
  const result = await sql`
    SELECT max("ormpMessageIndex") as "maxIndex" FROM indexer.${sql(MESSAGE_TABLE)} WHERE protocol='ormp' and "sourceChainId" = ${chainId}
  `

  return result[0].maxIndex || 0
}

async function findMessagesWithMissingSigners() {
  const result = await sql`
    SELECT *
    FROM indexer.${sql(MESSAGE_TABLE)}
    WHERE protocol='ormp' and status >= 1 and ("ormpSigners" is null or array_length(string_to_array("ormpSigners", ','), 1) < 5)
  `
  return result
}

export {
  getLastMessageIndex, findMessagesWithMissingSigners,
}
