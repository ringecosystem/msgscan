export const IMessagePort = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "msgId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "fromDapp",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "toChainId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "toDapp",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "message",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "params",
        type: "bytes",
      },
    ],
    name: "MessageSent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "msgId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "result",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "returnData",
        type: "bytes",
      },
    ],
    name: "MessageRecv",
    type: "event",
  },
] as const;