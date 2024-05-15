import lib from 'msgscan-lib'
const sql = lib.sql
const constants = lib.constants

async function findMessageRecvByMsgId(msgId) {
  const result = await sql`
    SELECT *
    FROM ${sql(constants.PONDER_PUBLISH_SCHEMA)}."MessageRecv"
    WHERE "evMsgId"=${msgId}
  `

  return result[0] || null
}

export { findMessageRecvByMsgId }
