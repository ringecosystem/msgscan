import type { MESSAGE_STATUS } from '@/types/message';
import type { MsgportMessageSent, ORMPMessageAccepted, ORMPMessageDispatched } from '@/graphql/type';

export type MessageProtocol = 'ormp';
export type UiMessageStatus = MESSAGE_STATUS | -1;

export interface MessageFilters {
  fromDapps?: string[];
  transactionFrom?: string;
  fromChainIds?: number[];
  toChainIds?: number[];
  statuses?: MESSAGE_STATUS[];
  dateFrom?: Date;
  dateTo?: Date;
}

export interface MessagePaging {
  offset: number;
  limit: number;
}

export interface MessageStats {
  total: number;
  success: number;
  failed: number;
  inflight: number;
}

export interface CompositeMessage {
  msgId: string;
  protocol: MessageProtocol;
  status: UiMessageStatus;

  transactionHash: string;
  targetTransactionHash?: string;
  transactionFrom?: string | null;

  fromChainId: string;
  toChainId: string;
  fromDapp: string;
  toDapp: string;

  portAddress: string;
  message: string;
  params: string;

  sentBlockTimestampSec: number;
  dispatchedBlockTimestampSec?: number;

  accepted?: ORMPMessageAccepted;
  dispatched?: ORMPMessageDispatched;

  // Raw step entities (useful for future Step3/Step4, but not required by the current UI).
  sent: MsgportMessageSent;
}
