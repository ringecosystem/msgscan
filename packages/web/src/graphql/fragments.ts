import { gql } from 'graphql-request';

export const MSGPORT_MESSAGE_SENT_FIELDS = gql`
  fragment MsgportMessageSentFields on MsgportMessageSent {
    id
    blockNumber
    transactionHash
    blockTimestamp
    transactionIndex
    logIndex
    chainId
    portAddress
    transactionFrom
    fromChainId
    msgId
    fromDapp
    toChainId
    toDapp
    message
    params
  }
`;

export const ORMP_MESSAGE_ACCEPTED_FIELDS = gql`
  fragment ORMPMessageAcceptedFields on ORMPMessageAccepted {
    id
    blockNumber
    transactionHash
    blockTimestamp
    chainId
    logIndex
    msgHash
    channel
    index
    fromChainId
    from
    toChainId
    to
    gasLimit
    encoded
    oracle
    oracleAssigned
    oracleAssignedFee
    relayer
    relayerAssigned
    relayerAssignedFee
  }
`;

export const ORMP_MESSAGE_DISPATCHED_FIELDS = gql`
  fragment ORMPMessageDispatchedFields on ORMPMessageDispatched {
    id
    blockNumber
    transactionHash
    blockTimestamp
    chainId
    targetChainId
    msgHash
    dispatchResult
  }
`;
