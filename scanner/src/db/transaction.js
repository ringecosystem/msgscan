import sql from './db.js'

async function findTransactionByHash(chainId, transactionHash) {
  const result = await sql`
    SELECT *
    FROM ponder_sync."transactions"
    WHERE "chainId" = ${chainId} and "hash" = ${transactionHash}
  `
  return result[0] || null
}

export { findTransactionByHash }
