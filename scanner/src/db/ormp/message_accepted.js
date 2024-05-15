import lib from 'msgscan-lib'
const sql = lib.sql
const constants = lib.constants

async function findByTxHashAndPortAddress(transactionHash, sourcePortAddress) {
  const result = await sql`
    SELECT *
    FROM ${sql(constants.PONDER_PUBLISH_SCHEMA)}."MessageAccepted"
    WHERE "transactionHash"=${transactionHash} AND "evMessageFrom"=${sourcePortAddress}
  `

  return result[0] || null
}

export { findByTxHashAndPortAddress }
