import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  MessageSent: p.createTable({
    // `${chainId}-${blockNumber}-${transactionIndex}-${logIndex}`
    id: p.string(),

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

  Message: p.createTable({
    ///////////////////////////////
    // common fields
    ///////////////////////////////
    id: p.string(), // the msgId returned by the port's `send` function
    protocol: p.string(), // ormp, lz, ..
    payload: p.string(),
    protocolPayload: p.string(), // msgportPrefix + payload
    status: p.int(), // 0: pending, 1: success, 2: failed

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

    //////////////////////////////////////////////////////////////////////
    // protocol fields 
    //////////////////////////////////////////////////////////////////////
    // fields for ormp
    ormpMsgHash: p.string().optional(),
    ormpProof: p.string().optional(),
    ormpMessageIndex: p.int().optional(),
    ormpMessageGasLimit: p.string().optional(),
    ormpSigners: p.string().optional(),
    ormpLatestSignaturesUpdatedAt: p.bigint().optional(),

    // fields for lz
    lzGuid: p.string().optional(),
    lzNonce: p.bigint().optional(),
    lzSrcEid: p.string().optional(),
    lzDstEid: p.string().optional(),
  })
}));