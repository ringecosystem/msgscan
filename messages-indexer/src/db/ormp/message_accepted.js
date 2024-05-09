import sql from '../db.js'

async function findByTxHashAndPortAddress(transactionHash, sourcePortAddress) {
  const result = await sql`
    SELECT *
    FROM indexer."MessageAccepted"
    WHERE "transactionHash"=${transactionHash} AND "evMessageFrom"=${sourcePortAddress}
  `

  return result[0] || null
}

export { findByTxHashAndPortAddress }
