import { gql } from 'graphql-request';

export const MESSAGE_FIELDS = gql`
  fragment MessageFields on Message {
    id
    protocol
    status
    payload
    params
    sourceChainId
    sourceBlockNumber
    sourceBlockTimestamp
    sourceTransactionHash
    sourceTransactionIndex
    sourceLogIndex
    sourceDappAddress
    sourcePortAddress
    targetChainId
    targetBlockNumber
    targetBlockTimestamp
    targetTransactionHash
    targetTransactionIndex
    targetLogIndex
    targetDappAddress
    targetPortAddress
    protocolInfoType
    protocolInfoId
  }
`;
