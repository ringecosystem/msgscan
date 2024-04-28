import sql from '../../db/db.js'

async function findMessageDispatchedByMsgHash(chainId, msgHash) {
  const result = await sql`
    SELECT *
    FROM indexer."MessageDispatchedV2"
    WHERE "chainId" = ${chainId} and "msgHash" = ${msgHash}
  `
  return result.length == 0 ? null : result[0]
}

export { findMessageDispatchedByMsgHash }

