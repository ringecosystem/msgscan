import sql from './db.js'
import { MESSAGE_STATUS, MESSAGE_TABLE } from '../constants.js'

async function getLastMessageOf(sourceChainId) {
  const result = await sql`
    SELECT * 
    FROM indexer.${sql(MESSAGE_TABLE)} 
    WHERE "sourceChainId" = ${sourceChainId} 
    ORDER BY "sourceBlockNumber" DESC, "sourceTransactionIndex" DESC, "sourceLogIndex" DESC 
    LIMIT 1
  `

  return result[0] || null
}

// async function main() {
//   const lastMessage = await getLastMessageOf('ormp', 11155111)
//   console.log(lastMessage)
// }
//
// main().catch(console.error)

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
    INSERT INTO indexer.${sql(MESSAGE_TABLE)} ${sql(allProps, columnNames)}
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
  getLastMessageOf, 
  findMessagesByStatus, findMessagesByStatuses,
  updateMessageStatus, updateMessage, createMessage
}
