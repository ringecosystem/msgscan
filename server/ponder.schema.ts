import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  // === V2
  MessageAcceptedV2: p.createTable({
    id: p.string(),

    chainId: p.bigint(),
    blockNumber: p.bigint(),
    blockTimestamp: p.bigint(),
    transactionHash: p.string(),
    transactionIndex: p.int(),
    logIndex: p.int(),

    msgHash: p.string(),
    root: p.string(),
    // message struct
    messageChannel: p.string(),
    messageIndex: p.bigint(),
    messageFromChainId: p.bigint(),
    messageFrom: p.string(),
    messageToChainId: p.bigint(),
    messageTo: p.string(),
    messageGasLimit: p.bigint(),
    messageEncoded: p.string(),
    // extra
    oracle: p.hex().optional(),
    oracleAssigned: p.boolean().optional(),
    oracleAssignedFee: p.bigint().optional(),
    oracleLogIndex: p.int().optional(),
    relayer: p.hex().optional(),
    relayerAssigned: p.boolean().optional(),
    relayerAssignedFee: p.bigint().optional(),
    relayerLogIndex: p.int().optional(),
  }),
  MessageDispatchedV2: p.createTable({
    id: p.string(),

    chainId: p.bigint(),
    blockNumber: p.bigint(),
    blockTimestamp: p.bigint(),
    transactionHash: p.string(),
    transactionIndex: p.int(),
    logIndex: p.int(),

    msgHash: p.string(),
    dispatchResult: p.boolean(),
  }),
  MessageAssignedV2: p.createTable({
    id: p.string(),

    chainId: p.bigint(),
    blockNumber: p.bigint(),
    blockTimestamp: p.bigint(),
    transactionHash: p.string(),
    transactionIndex: p.int(),
    logIndex: p.int(),

    msgHash: p.string(),
    oracle: p.hex(),
    relayer: p.hex(),
    oracleFee: p.bigint(),
    relayerFee: p.bigint(),
  }),
  HashImportedV2: p.createTable({
    id: p.string(),

    chainId: p.bigint(),
    blockNumber: p.bigint(),
    blockTimestamp: p.bigint(),
    transactionHash: p.string(),
    transactionIndex: p.int(),
    logIndex: p.int(),

    srcChainId: p.bigint(),
    oracle: p.hex(),
    lookupKey: p.string(),
    srcBlockNumber: p.bigint(),
    hash: p.string(), // msgRoot
  }),
  SignatureSubmittion: p.createTable({
    id: p.string(),

    chainId: p.bigint(),
    blockNumber: p.bigint(),
    blockTimestamp: p.bigint(),
    transactionHash: p.string(),
    transactionIndex: p.int(),
    logIndex: p.int(),

    srcChainId: p.bigint(),
    channel: p.hex(),
    msgIndex: p.bigint(),
    signer: p.hex(),
    signature: p.string(),
    data: p.string(),
  }),

  Message: p.createTable({
    ///////////////////////////////
    // common fields
    ///////////////////////////////
    // global id
    // ormp: ormp-sourceChainId-messageIndex, 
    // lz: lz-sourceChainId-nonce, is it unique?
    id: p.string(), 
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
    sourceMsgportAddress: p.string(),

    // target
    targetChainId: p.bigint().optional(),
    targetBlockNumber: p.bigint().optional(),
    targetBlockTimestamp: p.bigint().optional(),
    targetTransactionHash: p.string().optional(),
    targetTransactionIndex: p.string().optional(),
    targetLogIndex: p.int().optional(),
    targetDappAddress: p.string().optional(),
    targetMsgportAddress: p.string().optional(),

    ///////////////////////////////
    // protocol fields
    ///////////////////////////////
    // fields for ormp
    ormpMsgHash: p.string(),
    ormpRoot: p.string(),
    ormpMessageChannel: p.string(),
    ormpMessageIndex: p.int(),
    ormpMessageGasLimit: p.string(),
    ormpMessageEncoded: p.string(),
    ormpSigners: p.string().optional(),
    ormpLatestSignaturesUpdatedAt: p.bigint().optional(),

    // fields for lz
    lzGuid: p.string().optional(),
    lzNonce: p.bigint().optional(),
    lzSrcEid: p.string().optional(),
    lzDstEid: p.string().optional(),
  })
}));
