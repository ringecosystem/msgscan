import lib from 'msgscan-lib'
const sql = lib.sql

async function findTransactionByHash(chainId, transactionHash) {
  const result = await sql`
    SELECT *
    FROM ponder_sync."transactions"
    WHERE "chainId" = ${chainId} and "hash" = ${transactionHash}
  `
  return result[0] || null
}

export { findTransactionByHash }
