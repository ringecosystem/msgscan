function ormpSchema(p: any) {
  return {
    OrmpInfo: p.createTable({
      id: p.string(),

      chainId: p.bigint(),
      blockNumber: p.bigint(),
      blockTimestamp: p.bigint(),
      transactionHash: p.string(),
      transactionIndex: p.int(),
      logIndex: p.int(),

      msgHash: p.string(),
      messageChannel: p.string(),
      messageIndex: p.bigint(),
      messageFromChainId: p.bigint(),
      messageFrom: p.string(), // source port address
      messageToChainId: p.bigint(),
      messageTo: p.string(), // target port address
      messageGasLimit: p.bigint(),
      messageEncoded: p.string(),

      msgId: p.string().optional(),
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
