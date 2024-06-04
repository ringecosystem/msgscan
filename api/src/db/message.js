import sql from './db.js'
import { PONDER_PUBLISH_SCHEMA, MESSAGE_TABLE } from '../constants.js'

async function queryAll() {
  const result = await sql`
    SELECT *
    FROM ${sql(PONDER_PUBLISH_SCHEMA)}.${sql(MESSAGE_TABLE)}
    ORDER BY "sourceBlockTimestamp" DESC
  `
  return result
}

async function findBySrcTxHash(sourceTransactionHash) {
  const result = await sql`
    SELECT *
    FROM ${sql(PONDER_PUBLISH_SCHEMA)}.${sql(MESSAGE_TABLE)}
    WHERE "sourceTransactionHash" = ${sourceTransactionHash}
    ORDER BY "sourceBlockTimestamp" DESC
    LIMIT 1
  `
  return result[0] || null
}

async function findByMsgId(msgId) {
  const result = await sql`
    SELECT *
    FROM ${sql(PONDER_PUBLISH_SCHEMA)}.${sql(MESSAGE_TABLE)}
    WHERE "id" = ${msgId}
    ORDER BY "sourceBlockTimestamp" DESC
    LIMIT 1
  `
  return result[0] || null
}

async function queryBySrcDappAddress(sourceDappAddress) {
  const result = await sql`
    SELECT *
    FROM ${sql(PONDER_PUBLISH_SCHEMA)}.${sql(MESSAGE_TABLE)}
    WHERE "sourceDappAddress" = ${sourceDappAddress}
    ORDER BY "sourceBlockTimestamp" DESC
  `
  return result
}

// op: gt|lt
// unit: seconds|minutes|hours|days
// status: list of inflight, success, failed
async function queryByTimeSpent(op, n, unit, status) {
  const timestampsql = `EXTRACT(EPOCH FROM (NOW() - interval '${n} ${unit}'))`
  const result = await sql`
    SELECT *
    FROM ${sql(PONDER_PUBLISH_SCHEMA)}.${sql(MESSAGE_TABLE)}
    WHERE "status" IN ${sql(status)} AND "sourceBlockTimestamp" > ${sql.unsafe(timestampsql)}
    ORDER BY "sourceBlockTimestamp" DESC
  `

  return result
}

export {
  queryAll, findBySrcTxHash, findByMsgId, queryBySrcDappAddress, queryByTimeSpent
}
