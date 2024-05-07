import sql from '../../db/db.js'
import { MESSAGE_TABLE } from '../../constants.js'

    // id: p.string(), // the msgId returned by the port's `send` function
    // protocol: p.string(), // ormp, lz, ..
    // payload: p.string(),
    // protocolPayload: p.string(), // msgportPrefix + payload
    // status: p.int(), // 0: pending, 1: success, 2: failed
    //
    // // source
    // sourceChainId: p.bigint(),
    // sourceBlockNumber: p.bigint(),
    // sourceBlockTimestamp: p.bigint(),
    // sourceTransactionHash: p.string(),
    // sourceTransactionIndex: p.int(),
    // sourceLogIndex: p.int(),
    // sourceDappAddress: p.string(),
    // sourcePortAddress: p.string(),
//
  // MessageSent: p.createTable({
  //   // `${chainId}-${blockNumber}-${transactionIndex}-${logIndex}`
  //   id: p.string(),
  //
  //   chainId: p.bigint(),
  //   blockNumber: p.bigint(),
  //   blockTimestamp: p.bigint(),
  //   transactionHash: p.string(),
  //   transactionIndex: p.int(),
  //   logIndex: p.int(),
  //
  //   evMsgId: p.string(), // fields with ev prefix are from the event fields
  //   evFromDapp: p.string(),
  //   evToChainId: p.bigint(),
  //   evToDapp: p.string(),
  //   evMessage: p.string(),
  //   evParams: p.string(),
  // }),

async function findMessagesWithMissingSigners() {
  const result = await sql`
    SELECT *
    FROM indexer.${sql(MESSAGE_TABLE)}
    WHERE protocol='ormp' and status >= 1 and ("ormpSigners" is null or array_length(string_to_array("ormpSigners", ','), 1) < 5)
  `
  return result
}

export {
  getLastMessage, findMessagesWithMissingSigners,
}
