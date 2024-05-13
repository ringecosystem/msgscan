import sql from './db.js'

async function findMessageRecvByMsgId(msgId) {
  const result = await sql`
    SELECT *
    FROM indexer."MessageRecv"
    WHERE "evMsgId"=${msgId}
  `

  return result[0] || null
}

export { findMessageRecvByMsgId }
