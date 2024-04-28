import sql from '../../db/db.js'

async function getMessageAcceptedsByIndexGt(chainId, messageIndex) {
  const result = await sql`
    SELECT *
    FROM indexer."MessageAcceptedV2"
    WHERE "chainId" = ${chainId} and "messageIndex" > ${messageIndex}
  `
  return result
}

export { getMessageAcceptedsByIndexGt }
