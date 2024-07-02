import { client } from './client';
import { GET_MESSAGE_PORT, GET_MESSAGE_PROGRESS } from './queries';
import type {
  MessagePortQueryParams,
  MessagePortResponse,
  MessageProgressResponse,
  MessagePortBoolExp,
  MessageProgressQueryParams
} from './type';
import { CHAIN } from '@/types/chains';

export async function fetchMessagePort(
  variables: MessagePortQueryParams = {},
  chains: CHAIN[]
): Promise<MessagePortResponse | null> {
  const defaultSourceChainId: MessagePortBoolExp['sourceChainId'] = {
    _in: chains?.map((chain) => chain.id)
  };
  try {
    const effectiveVariables: MessagePortQueryParams = {
      ...variables,
      where: {
        ...(variables.where || {}),
        sourceChainId: variables.where?.sourceChainId || defaultSourceChainId
      }
    };
    const response = await client.request<MessagePortResponse, MessagePortQueryParams>(
      GET_MESSAGE_PORT,
      effectiveVariables
    );
    return response;
  } catch (error) {
    console.error('messagePort request failed:', error);
    return null;
  }
}

export async function fetchMessage(
  id: string,
  chains: CHAIN[]
): Promise<MessagePortResponse['MessagePort']['0'] | null> {
  const defaultSourceChainId: MessagePortBoolExp['sourceChainId'] = {
    _in: chains?.map((chain) => chain.id)
  };
  try {
    const response = await client.request<MessagePortResponse, MessagePortQueryParams>(
      GET_MESSAGE_PORT,
      {
        where: {
          sourceChainId: defaultSourceChainId,
          _or: [
            {
              id: {
                _eq: id
              }
            },
            {
              sourceTransactionHash: {
                _eq: id
              }
            }
          ]
        }
      }
    );
    return response?.MessagePort?.[0] ?? null;
  } catch (error) {
    console.error('message request failed:', error);
    return null;
  }
}

export async function fetchMessageProgress(): Promise<MessageProgressResponse | null> {
  try {
    const response = await client.request<MessageProgressResponse>(GET_MESSAGE_PROGRESS);
    return response;
  } catch (error) {
    console.error('messageProgress request failed:', error);
    return null;
  }
}
