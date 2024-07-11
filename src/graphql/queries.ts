import { gql } from 'graphql-request';

import { MESSAGE_PORT_FIELDS, ORMP_DETAILS } from './fragments';

export const GET_MESSAGE_PORT = gql`
  ${MESSAGE_PORT_FIELDS}
  ${ORMP_DETAILS}
  query GetMessagePort(
    $distinctOn: [MessagePort_select_column!]
    $limit: Int
    $offset: Int
    $orderBy: [MessagePort_order_by!]
    $where: MessagePort_bool_exp
  ) {
    MessagePort(
      distinct_on: $distinctOn
      limit: $limit
      offset: $offset
      order_by: $orderBy
      where: $where
    ) {
      ...BasicMessagePortInfo
    }
  }
`;

export const GET_MESSAGE_PORT_DETAIL = gql`
  ${MESSAGE_PORT_FIELDS}
  ${ORMP_DETAILS}
  query GetMessagePort(
    $distinctOn: [MessagePort_select_column!]
    $limit: Int
    $offset: Int
    $orderBy: [MessagePort_order_by!]
    $where: MessagePort_bool_exp
  ) {
    MessagePort(
      distinct_on: $distinctOn
      limit: $limit
      offset: $offset
      order_by: $orderBy
      where: $where
    ) {
      ...BasicMessagePortInfo
      ormp {
        ...OrmpDetails
      }
      ormp_id
    }
  }
`;

export const GET_MESSAGE_PROGRESS = gql`
  query GetMessageProgress {
    MessageProgress {
      id
      amount
    }
  }
`;
