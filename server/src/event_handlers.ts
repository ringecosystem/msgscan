import { ponder } from "@/generated";

ponder.on("ORMPUpgradeablePort:MessageSent", async ({ event, context }) => {
  const { MessageSent } = context.db;
  await MessageSent.create({
    id: `${context.network.chainId}-${event.block.number}-${event.log.transactionIndex}-${event.log.logIndex}`,
    data: {
      protocol: "ormp",
      portAddress: event.log.address,

      chainId: BigInt(context.network.chainId),
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      transactionIndex: event.log.transactionIndex,
      logIndex: event.log.logIndex,

      evMsgId: event.args.msgId,
      evFromDapp: event.args.fromDapp,
      evToChainId: BigInt(event.args.toChainId),
      evToDapp: event.args.toDapp,
      evMessage: event.args.message,
      evParams: event.args.params,
    },
  });
})

ponder.on("ORMPUpgradeablePort:MessageRecv", async ({ event, context }) => {
  const { MessageRecv } = context.db;
  await MessageRecv.create({
    id: `${context.network.chainId}-${event.block.number}-${event.log.transactionIndex}-${event.log.logIndex}`,
    data: {
      protocol: "ormp",
      portAddress: event.log.address,

      chainId: BigInt(context.network.chainId),
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      transactionIndex: event.log.transactionIndex,
      logIndex: event.log.logIndex,

      evMsgId: event.args.msgId,
      evResult: event.args.result,
      evReturnData: event.args.returnData,
    },
  });
})
