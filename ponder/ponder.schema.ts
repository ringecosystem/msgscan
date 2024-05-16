import { createSchema } from "@ponder/core";
import ormpSchema from "./ponder.schema.ormp";

function msgportSchema(p: any) {
  return {
    MessageSent: p.createTable({
      // `${chainId}-${blockNumber}-${transactionIndex}-${logIndex}`
      id: p.string(),

      protocol: p.string(),
      portAddress: p.string(),

      chainId: p.bigint(),
      blockNumber: p.bigint(),
      blockTimestamp: p.bigint(),
      transactionHash: p.string(),
      transactionIndex: p.int(),
      logIndex: p.int(),

      evMsgId: p.string(), // fields with ev prefix are from the event fields
      evFromDapp: p.string(),
      evToChainId: p.bigint(),
      evToDapp: p.string(),
      evMessage: p.string(),
      evParams: p.string(),
    }),

    MessageRecv: p.createTable({
      // `${chainId}-${blockNumber}-${transactionIndex}-${logIndex}`
      id: p.string(),

      protocol: p.string(),
      portAddress: p.string(),

      chainId: p.bigint(),
      blockNumber: p.bigint(),
      blockTimestamp: p.bigint(),
      transactionHash: p.string(),
      transactionIndex: p.int(),
      logIndex: p.int(),

      evMsgId: p.string(),
      evResult: p.boolean(),
      evReturnData: p.string(),
    }),
  }
}

function messageSchema(p: any) {
  return {
    Message: p.createTable({
      ///////////////////////////////
      // common fields
      ///////////////////////////////
      id: p.string(), // the msgId returned by the port's `send` function
      protocol: p.string(), // ormp, lz, ..
      payload: p.string(),
      params: p.string(),
      status: p.int(), // 0: pending, 1: success, 2: failed
      protocolPayload: p.string().optional(), // msgportPrefix + payload

      // source
      sourceChainId: p.bigint(),
      sourceBlockNumber: p.bigint(),
      sourceBlockTimestamp: p.bigint(),
      sourceTransactionHash: p.string(),
      sourceTransactionIndex: p.int(),
      sourceLogIndex: p.int(),
      sourceDappAddress: p.string(),
      sourcePortAddress: p.string(),

      // target
      targetChainId: p.bigint().optional(),
      targetBlockNumber: p.bigint().optional(),
      targetBlockTimestamp: p.bigint().optional(),
      targetTransactionHash: p.string().optional(),
      targetTransactionIndex: p.string().optional(),
      targetLogIndex: p.int().optional(),
      targetDappAddress: p.string().optional(),
      targetPortAddress: p.string().optional(),

      ///////////////////////////////
      // protocol fields 
      ///////////////////////////////
      // fields for ormp
      ormpMsgHash: p.string().optional(),
      ormpMsgIndex: p.int().optional(),
      ormpMessageGasLimit: p.string().optional(),
      ormpSigners: p.string().optional(),

      // fields for lz
      lzGuid: p.string().optional(),
      lzNonce: p.bigint().optional(),
      lzSrcEid: p.string().optional(),
      lzDstEid: p.string().optional(),
    }, {
      sourceTransactionHashIndex: p.index("sourceTransactionHash"),
      sourceDappAddressIndex: p.index("sourceDappAddress"),
    })
  }
}

export default createSchema(
  (p) => ({
    ...msgportSchema(p),
    ...messageSchema(p),
    ...ormpSchema(p),
  })
);
