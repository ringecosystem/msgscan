import { gql } from 'graphql-request';

export const MESSAGE_PORT_FIELDS = gql`
  fragment BasicMessagePortInfo on MessagePort {
    id
    sender
    params
    payload
    protocol
    sourceBlockNumber
    sourceBlockTimestamp
    sourceChainId
    sourceDappAddress
    sourcePortAddress
    sourceTransactionHash
    status
    targetBlockTimestamp
    targetChainId
    targetDappAddress
    targetPortAddress
    targetTransactionHash
  }
`;

export const ORMP_DETAILS = gql`
  fragment OrmpDetails on ORMP_MessageAccepted {
    msgHash
    index
    gasLimit
    encoded
    channel
  }
`;
