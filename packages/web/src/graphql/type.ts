// Minimal TypeScript types for the Subsquid-style indexer schema.
// Keep this file focused on indexer entities + request/response shapes used by `src/graphql/*`.

export interface ORMPMessageAccepted {
  id: string;
  blockNumber: string;
  transactionHash: string;
  blockTimestamp: string;
  chainId: string;
  logIndex: number;
  msgHash: string;
  channel: string;
  index: string;
  fromChainId: string;
  from: string;
  toChainId: string;
  to: string;
  gasLimit: string;
  encoded: string;
  oracle?: string | null;
  oracleAssigned?: boolean | null;
  oracleAssignedFee?: string | null;
  relayer?: string | null;
  relayerAssigned?: boolean | null;
  relayerAssignedFee?: string | null;
}

export interface ORMPMessageDispatched {
  id: string;
  blockNumber: string;
  transactionHash: string;
  blockTimestamp: string;
  chainId: string;
  targetChainId: string;
  msgHash: string;
  dispatchResult: boolean;
}

export interface MsgportMessageSent {
  id: string;
  blockNumber: string;
  transactionHash: string;
  blockTimestamp: string;
  transactionIndex: number;
  logIndex: number;
  chainId: string;
  portAddress: string;
  transactionFrom?: string | null;
  fromChainId: string;
  msgId: string;
  fromDapp: string;
  toChainId: string;
  toDapp: string;
  message: string;
  params: string;
}

export interface MsgportMessageSentsResponse {
  msgportMessageSents: MsgportMessageSent[];
}

export interface ORMPMessageAcceptedsResponse {
  ormpMessageAccepteds: ORMPMessageAccepted[];
}

export interface ORMPMessageDispatchedsResponse {
  ormpMessageDispatcheds: ORMPMessageDispatched[];
}

export interface TotalCountConnection {
  totalCount: number;
}

export interface MessageStatsResponse {
  total: TotalCountConnection;
}

export interface DispatchedOutcomeCountsResponse {
  success: TotalCountConnection;
  failed: TotalCountConnection;
}

export interface MsgportMessageSentsVariables {
  where?: Record<string, unknown>;
  orderBy?: string[];
  limit?: number;
  offset?: number;
}

export interface ORMPMessageAcceptedsVariables {
  where?: Record<string, unknown>;
  orderBy?: string[];
  limit?: number;
  offset?: number;
}

export interface ORMPMessageDispatchedsVariables {
  where?: Record<string, unknown>;
  orderBy?: string[];
  limit?: number;
  offset?: number;
}

export interface MessageStatsVariables {
  sentWhere?: Record<string, unknown>;
}

export interface DispatchedOutcomeCountsVariables {
  successWhere?: Record<string, unknown>;
  failedWhere?: Record<string, unknown>;
  orderBy: string[];
}
