// How to link this event with port's `MessageSent` event?
// 1. both events are in the same transaction
// 2. port's address is the same as the event's `evMessageFrom`
function ormpSchema(p) {
  return  {
    MessageAccepted: p.createTable({
      id: p.string(),

      chainId: p.bigint(),
      blockNumber: p.bigint(),
      blockTimestamp: p.bigint(),
      transactionHash: p.string(),
      transactionIndex: p.int(),
      logIndex: p.int(),

      evMsgHash: p.string(),
      evMessageChannel: p.string(),
      evMessageIndex: p.bigint(),
      evMessageFromChainId: p.bigint(),
      evMessageFrom: p.string(), // source port address
      evMessageToChainId: p.bigint(),
      evMessageTo: p.string(), // target port address
      evMessageGasLimit: p.bigint(),
      evMessageEncoded: p.string(),
    }),
    SignatureSubmittion: p.createTable({ // event only on darwinia
      id: p.string(),

      chainId: p.bigint(),
      blockNumber: p.bigint(),
      blockTimestamp: p.bigint(),
      transactionHash: p.string(),
      transactionIndex: p.int(),
      logIndex: p.int(),

      srcChainId: p.bigint(), // the message sent from this chain
      channel: p.hex(),
      msgIndex: p.bigint(),
      signer: p.hex(),
      signature: p.string(),
      data: p.string(), // msg related data used to sign, (msghash, encodedParams, expiration);
    }),
  }
}

export default ormpSchema;
