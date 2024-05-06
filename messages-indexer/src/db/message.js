import sql from './db.js'
import { MESSAGE_STATUS, MESSAGE_TABLE } from '../constants.js'

async function createMessage(id, properties) {
  // check if message already exists
  const exists = await sql`
    SELECT EXISTS (
      SELECT * FROM indexer.${sql(MESSAGE_TABLE)} WHERE id=${id}
    );
  `
  if (exists[0].exists) {
    console.log(`message ${id} already exists`)
    return
  }

  // check if protocol and protocolPayload provided
  if (!properties.protocol || !properties.protocolPayload) {
    throw new Error(`protocol and protocolPayload are required`)
  }

  // check if status is null or undefined
  if (properties.status != null || properties.status != undefined) {
    throw new Error(`status should be null or undefined`)
  }

  let allProps = {
    id,
    status: MESSAGE_STATUS.PENDING,
    ...properties
  }
  let columns = Object.keys(allProps)

  // if not, create message
  await sql`
    INSERT INTO indexer.${sql(MESSAGE_TABLE)} ${sql(allProps, columns)}
  `
}

async function findMessagesByStatuses(sourceChainId, statuses) {
  const result = await sql`
  SELECT *
    FROM indexer.${sql(MESSAGE_TABLE)}
    WHERE "sourceChainId" = ${sourceChainId} and "status" IN ${sql(statuses)}
  `
  return result
}

async function findMessagesByStatus(sourceChainId, status) {
  const result = await sql`
  SELECT *
    FROM indexer.${sql(MESSAGE_TABLE)}
    WHERE "sourceChainId" = ${sourceChainId} and "status" = ${status}
  `
  return result
}

async function updateMessageStatus(message, status) {
  await sql`
    UPDATE indexer.${sql(MESSAGE_TABLE)}
    SET status = ${status}
    WHERE id = ${message.id}
  `
}

async function updateMessage(message, fields) {
  await sql`
    UPDATE indexer.${sql(MESSAGE_TABLE)}
    SET ${sql(fields)}
    WHERE id = ${message.id}
  `
}

export {
  findMessagesByStatus, findMessagesByStatuses,
  updateMessageStatus, updateMessage, createMessage
}
