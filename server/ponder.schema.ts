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
    id: p.string(), // messageFromChainId-messageIndex

    // fields from MessageAcceptedV2
    msgHash: p.string(),
    root: p.string(),
    messageChannel: p.string(),
    messageIndex: p.int(),
    messageFromChainId: p.bigint(),
    messageFrom: p.string(),
    messageToChainId: p.bigint(),
    messageTo: p.string(),
    messageGasLimit: p.string(),
    messageEncoded: p.string(),

    // MessageAcceptedV2
    // extra fields
    acceptedBlockNumber: p.bigint(),
    acceptedBlockTimestamp: p.bigint(),
    acceptedTransactionHash: p.string(),
    acceptedTransactionIndex: p.int(),
    acceptedLogIndex: p.int(),

    // status
    status: p.int(),

    // MessageDispatchedV2 event & transaction
    // extra fields
    dispatchBlockNumber: p.bigint().optional(),
    dispatchBlockTimestamp: p.bigint().optional(),
    dispatchTransactionHash: p.string().optional(),
    dispatchTransactionIndex: p.string().optional(),
    dispatchLogIndex: p.int().optional(),
    proof: p.string().list().optional(), // from transaction of MessageDispatchedV2

    //
    msgportPayload: p.string().optional(),
    msgportFrom: p.string().optional(),
    msgportTo: p.string().optional(),
    signers: p.string().list().optional(),
    latestSignaturesUpdatedAt: p.bigint().optional(),
  })
}));
