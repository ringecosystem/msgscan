import sql from './db.js'
import { PONDER_PUBLISH_SCHEMA } from '../constants.js'

async function findMessageRecvByMsgId(msgId) {
  const result = await sql`
    SELECT *
    FROM ${sql(PONDER_PUBLISH_SCHEMA)}."MessageRecv"
    WHERE "evMsgId"=${msgId}
  `

  return result[0] || null
}

export { findMessageRecvByMsgId }
