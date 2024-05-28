import { createSchema } from "@ponder/core";
import ormpSchema from "./ponder.schema.ormp";

function messageSchema(p: any) {
  return {
    Message: p.createTable({
      ///////////////////////////////
      // common fields
      ///////////////////////////////
      id: p.string(), // the msgId returned by the port's `send` function
      protocol: p.string(), // ormp, lz, ..
      payload: p.string().optional(),
      params: p.string().optional(),
      status: p.int(), // 0: inflight, 1: success, 2: failed

      // source
      sourceChainId: p.bigint().optional(),
      sourceBlockNumber: p.bigint().optional(),
      sourceBlockTimestamp: p.bigint().optional(),
      sourceTransactionHash: p.string().optional(),
      sourceTransactionIndex: p.int().optional(),
      sourceLogIndex: p.int().optional(),
      sourceDappAddress: p.string().optional(),
      sourcePortAddress: p.string().optional(),

      // target
      targetChainId: p.bigint().optional(),
      targetBlockNumber: p.bigint().optional(),
      targetBlockTimestamp: p.bigint().optional(),
      targetTransactionHash: p.string().optional(),
      targetTransactionIndex: p.int().optional(),
      targetLogIndex: p.int().optional(),
      targetDappAddress: p.string().optional(),
      targetPortAddress: p.string().optional(),

      ///////////////////////////////
      // protocol info
      ///////////////////////////////
      protocolInfoType: p.string().optional(),
      protocolInfoId: p.string().optional(),
    }, {
      sourceTransactionHashIndex: p.index("sourceTransactionHash"),
      sourceDappAddressIndex: p.index("sourceDappAddress"),
      lookup1Index: p.index(["sourceChainId", "sourceBlockNumber", "sourceTransactionIndex"]),
    })
  }
}

export default createSchema(
  (p) => ({
    ...messageSchema(p),
    ...ormpSchema(p),
  })
);
