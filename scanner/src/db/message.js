import lib from 'msgscan-lib'
const sql = lib.sql
const { MESSAGE_STATUS, MESSAGE_TABLE, PONDER_PUBLISH_SCHEMA } = lib.constants

async function getLastMessageOf(sourceChainId) {
  const result = await sql`
    SELECT * 
    FROM ${sql(PONDER_PUBLISH_SCHEMA)}.${sql(MESSAGE_TABLE)} 
    WHERE "sourceChainId" = ${sourceChainId} 
    ORDER BY "sourceBlockNumber" DESC, "sourceTransactionIndex" DESC, "sourceLogIndex" DESC 
    LIMIT 1
  `

  return result[0] || null
}

async function createMessage(id, properties) {
  // check if message already exists
  const exists = await sql`
    SELECT EXISTS (
      SELECT * FROM ${sql(PONDER_PUBLISH_SCHEMA)}.${sql(MESSAGE_TABLE)} WHERE id=${id}
    );
  `
  if (exists[0].exists) {
    console.log(`message ${id} already exists`)
    return
  }

  if (!properties.protocol) {
    throw new Error(`protocol is required`)
  }

  let allProps = {
    id,
    ...properties
  }
  let columnNames = Object.keys(allProps)

  // if not, create message
  await sql`
    INSERT INTO ${sql(PONDER_PUBLISH_SCHEMA)}.${sql(MESSAGE_TABLE)} ${sql(allProps, columnNames)}
  `
}

async function findMessagesByStatuses(sourceChainId, statuses) {
  const result = await sql`
  SELECT *
    FROM ${sql(PONDER_PUBLISH_SCHEMA)}.${sql(MESSAGE_TABLE)}
    WHERE "sourceChainId" = ${sourceChainId} and "status" IN ${sql(statuses)}
  `
  return result
}

async function findMessagesByStatus(sourceChainId, status) {
  const result = await sql`
  SELECT *
    FROM ${sql(PONDER_PUBLISH_SCHEMA)}.${sql(MESSAGE_TABLE)}
    WHERE "sourceChainId" = ${sourceChainId} and "status" = ${status}
  `
  return result
}

async function updateMessageStatus(message, status) {
  await sql`
    UPDATE ${sql(PONDER_PUBLISH_SCHEMA)}.${sql(MESSAGE_TABLE)}
    SET status = ${status}
    WHERE id = ${message.id}
  `
}

async function updateMessage(message, fields) {
  await sql`
    UPDATE ${sql(PONDER_PUBLISH_SCHEMA)}.${sql(MESSAGE_TABLE)}
    SET ${sql(fields)}
    WHERE id = ${message.id}
  `
}

async function findMessagesWithoutOrmpInfo() {
  return await sql`
    SELECT *
    FROM ${sql(PONDER_PUBLISH_SCHEMA)}.${sql(MESSAGE_TABLE)}
    WHERE 
      "protocol"='ormp' AND
      "ormpMsgHash" IS NULL
  `
}

async function findMessagesWithoutOrmpSigners() {
  const result = await sql`
    SELECT *
    FROM ${sql(PONDER_PUBLISH_SCHEMA)}.${sql(MESSAGE_TABLE)}
    WHERE 
      "protocol"='ormp' AND
      "ormpMsgIndex" IS NOT NULL AND
      "status" >= 1 AND
      to_timestamp("sourceBlockTimestamp") > NOW() - INTERVAL '6 hours' AND
      ("ormpSigners" is null OR array_length(string_to_array("ormpSigners", ','), 1) < 4)
  `
  return result
}

export {
  getLastMessageOf,
  findMessagesByStatus, findMessagesByStatuses,
  updateMessageStatus, updateMessage, createMessage,
  findMessagesWithoutOrmpInfo, findMessagesWithoutOrmpSigners
}
