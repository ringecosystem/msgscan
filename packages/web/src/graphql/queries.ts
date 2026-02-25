import { gql } from 'graphql-request';

import {
  MSGPORT_MESSAGE_SENT_FIELDS,
  ORMP_MESSAGE_ACCEPTED_FIELDS,
  ORMP_MESSAGE_DISPATCHED_FIELDS
} from './fragments';

export const GET_MESSAGE_PORT_SENTS = gql`
  ${MSGPORT_MESSAGE_SENT_FIELDS}
  query GetMessagePortSents(
    $where: MsgportMessageSentWhereInput
    $limit: Int
    $offset: Int
    $orderBy: [MsgportMessageSentOrderByInput!]
  ) {
    msgportMessageSents(where: $where, limit: $limit, offset: $offset, orderBy: $orderBy) {
      ...MsgportMessageSentFields
    }
  }
`;

export const GET_MESSAGE_PORT_SENT_SUMMARY = gql`
  query GetMessagePortSentSummary(
    $where: MsgportMessageSentWhereInput
    $limit: Int
    $offset: Int
    $orderBy: [MsgportMessageSentOrderByInput!]
  ) {
    msgportMessageSents(where: $where, limit: $limit, offset: $offset, orderBy: $orderBy) {
      msgId
      transactionHash
      blockTimestamp
    }
  }
`;

export const GET_ORMP_MESSAGE_ACCEPTED_SUMMARY = gql`
  query GetOrmpMessageAcceptedSummary(
    $where: ORMPMessageAcceptedWhereInput
    $limit: Int
    $offset: Int
    $orderBy: [ORMPMessageAcceptedOrderByInput!]
  ) {
    ormpMessageAccepteds(where: $where, limit: $limit, offset: $offset, orderBy: $orderBy) {
      msgHash
      transactionHash
    }
  }
`;

export const GET_ORMP_MESSAGE_DISPATCHED_SUMMARY = gql`
  query GetOrmpMessageDispatchedSummary(
    $where: ORMPMessageDispatchedWhereInput
    $limit: Int
    $offset: Int
    $orderBy: [ORMPMessageDispatchedOrderByInput!]
  ) {
    ormpMessageDispatcheds(where: $where, limit: $limit, offset: $offset, orderBy: $orderBy) {
      id
      msgHash
      dispatchResult
      targetChainId
      blockTimestamp
    }
  }
`;

export const GET_ORMP_MESSAGE_DISPATCHED_OUTCOME_COUNTS = gql`
  query GetOrmpMessageDispatchedOutcomeCounts(
    $successWhere: ORMPMessageDispatchedWhereInput
    $failedWhere: ORMPMessageDispatchedWhereInput
    $orderBy: [ORMPMessageDispatchedOrderByInput!]!
  ) {
    success: ormpMessageDispatchedsConnection(where: $successWhere, orderBy: $orderBy) {
      totalCount
    }
    failed: ormpMessageDispatchedsConnection(where: $failedWhere, orderBy: $orderBy) {
      totalCount
    }
  }
`;

export const GET_ORMP_MESSAGE_ACCEPTEDS = gql`
  ${ORMP_MESSAGE_ACCEPTED_FIELDS}
  query GetOrmpMessageAccepteds(
    $where: ORMPMessageAcceptedWhereInput
    $limit: Int
    $offset: Int
    $orderBy: [ORMPMessageAcceptedOrderByInput!]
  ) {
    ormpMessageAccepteds(where: $where, limit: $limit, offset: $offset, orderBy: $orderBy) {
      ...ORMPMessageAcceptedFields
    }
  }
`;

export const GET_ORMP_MESSAGE_DISPATCHEDS = gql`
  ${ORMP_MESSAGE_DISPATCHED_FIELDS}
  query GetOrmpMessageDispatcheds(
    $where: ORMPMessageDispatchedWhereInput
    $limit: Int
    $offset: Int
    $orderBy: [ORMPMessageDispatchedOrderByInput!]
  ) {
    ormpMessageDispatcheds(where: $where, limit: $limit, offset: $offset, orderBy: $orderBy) {
      ...ORMPMessageDispatchedFields
    }
  }
`;

export const GET_MESSAGE_STATS = gql`
  query GetMessageStats($sentWhere: MsgportMessageSentWhereInput) {
    total: msgportMessageSentsConnection(orderBy: [id_ASC], where: $sentWhere) {
      totalCount
    }
  }
`;

export const GET_MESSAGE_TREND = gql`
  query GetMessageTrend(
    $day0Where: MsgportMessageSentWhereInput
    $day1Where: MsgportMessageSentWhereInput
    $day2Where: MsgportMessageSentWhereInput
    $day3Where: MsgportMessageSentWhereInput
    $day4Where: MsgportMessageSentWhereInput
    $day5Where: MsgportMessageSentWhereInput
    $day6Where: MsgportMessageSentWhereInput
  ) {
    day0: msgportMessageSentsConnection(orderBy: [id_ASC], where: $day0Where) {
      totalCount
    }
    day1: msgportMessageSentsConnection(orderBy: [id_ASC], where: $day1Where) {
      totalCount
    }
    day2: msgportMessageSentsConnection(orderBy: [id_ASC], where: $day2Where) {
      totalCount
    }
    day3: msgportMessageSentsConnection(orderBy: [id_ASC], where: $day3Where) {
      totalCount
    }
    day4: msgportMessageSentsConnection(orderBy: [id_ASC], where: $day4Where) {
      totalCount
    }
    day5: msgportMessageSentsConnection(orderBy: [id_ASC], where: $day5Where) {
      totalCount
    }
    day6: msgportMessageSentsConnection(orderBy: [id_ASC], where: $day6Where) {
      totalCount
    }
  }
`;
