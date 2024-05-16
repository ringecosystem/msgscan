import sql from '../db.js'
import { PONDER_PUBLISH_SCHEMA } from '../../constants.js'

async function findByTxHashAndPortAddress(transactionHash, sourcePortAddress) {
  const result = await sql`
    SELECT *
    FROM ${sql(PONDER_PUBLISH_SCHEMA)}."MessageAccepted"
    WHERE "transactionHash"=${transactionHash} AND "evMessageFrom"=${sourcePortAddress}
  `

  return result[0] || null
}

export { findByTxHashAndPortAddress }
