import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MESSAGE_STATUS } from '@/types/message';

import { fetchMessages } from './services';
import {
  GET_MESSAGE_PORT_SENT_SUMMARY,
  GET_MESSAGE_PORT_SENTS,
  GET_ORMP_MESSAGE_ACCEPTEDS,
  GET_ORMP_MESSAGE_ACCEPTED_SUMMARY,
  GET_ORMP_MESSAGE_DISPATCHEDS,
  GET_ORMP_MESSAGE_DISPATCHED_SUMMARY
} from './queries';

import type { CHAIN } from '@/types/chains';

const { requestMock } = vi.hoisted(() => ({
  requestMock: vi.fn()
}));

vi.mock('./client', () => ({
  client: {
    request: requestMock
  }
}));

const TOTAL_SENT = 4_201;
const TARGET_INDEX = 4_200;
const TARGET_MSG_ID = `0xmsg${TARGET_INDEX}`;
const TARGET_TX_HASH = `0xtx${TARGET_INDEX}`;

function buildSentSummary(index: number) {
  return {
    msgId: `0xmsg${index}`,
    transactionHash: `0xtx${index}`,
    blockTimestamp: String(1_800_000_000_000 - index)
  };
}

function buildSentEntity(index: number) {
  return {
    id: `sent-${index}`,
    blockNumber: String(100_000 + index),
    transactionHash: `0xtx${index}`,
    blockTimestamp: String(1_800_000_000_000 - index),
    transactionIndex: 0,
    logIndex: 0,
    chainId: '1',
    portAddress: '0xport',
    transactionFrom: '0xfrom',
    fromChainId: '1',
    msgId: `0xmsg${index}`,
    fromDapp: '0xdapp1',
    toChainId: '2',
    toDapp: '0xdapp2',
    message: '0x',
    params: '0x'
  };
}

describe('fetchMessages status scan', () => {
  beforeEach(() => {
    requestMock.mockReset();
    requestMock.mockImplementation(async (args: { document: unknown; variables?: Record<string, unknown> }) => {
      const { document, variables } = args;

      if (document === GET_MESSAGE_PORT_SENT_SUMMARY) {
        const offset = Number(variables?.offset ?? 0);
        const limit = Number(variables?.limit ?? 0);
        const start = Math.max(0, offset);
        const end = Math.min(TOTAL_SENT, start + limit);
        const batch = Array.from({ length: Math.max(0, end - start) }, (_, idx) =>
          buildSentSummary(start + idx)
        );
        return { msgportMessageSents: batch };
      }

      if (document === GET_ORMP_MESSAGE_DISPATCHED_SUMMARY) {
        const msgHashes = ((variables?.where as { msgHash_in?: string[] } | undefined)?.msgHash_in ??
          []) as string[];
        if (msgHashes.includes(TARGET_MSG_ID)) {
          return {
            ormpMessageDispatcheds: [
              {
                id: 'dispatch-summary-target',
                msgHash: TARGET_MSG_ID,
                dispatchResult: false,
                targetChainId: '2',
                blockTimestamp: '1799999999999'
              }
            ]
          };
        }
        return { ormpMessageDispatcheds: [] };
      }

      if (document === GET_ORMP_MESSAGE_ACCEPTED_SUMMARY) {
        return { ormpMessageAccepteds: [] };
      }

      if (document === GET_MESSAGE_PORT_SENTS) {
        const where = variables?.where as
          | {
              msgId_in?: string[];
              AND?: Array<{ msgId_in?: string[] }>;
            }
          | undefined;
        let msgIds: string[] = where?.msgId_in ?? [];
        if (msgIds.length === 0 && Array.isArray(where?.AND)) {
          const withIds = where.AND.find((item) => Array.isArray(item?.msgId_in));
          msgIds = withIds?.msgId_in ?? [];
        }

        return {
          msgportMessageSents: msgIds.map((msgId) => {
            const index = Number(msgId.replace('0xmsg', ''));
            return buildSentEntity(index);
          })
        };
      }

      if (document === GET_ORMP_MESSAGE_ACCEPTEDS) {
        return { ormpMessageAccepteds: [] };
      }

      if (document === GET_ORMP_MESSAGE_DISPATCHEDS) {
        const msgHashes = ((variables?.where as { msgHash_in?: string[] } | undefined)?.msgHash_in ??
          []) as string[];
        if (msgHashes.includes(TARGET_MSG_ID)) {
          return {
            ormpMessageDispatcheds: [
              {
                id: 'dispatch-target',
                blockNumber: '200001',
                transactionHash: TARGET_TX_HASH,
                blockTimestamp: '1799999999999',
                chainId: '2',
                targetChainId: '2',
                msgHash: TARGET_MSG_ID,
                dispatchResult: false
              }
            ]
          };
        }
        return { ormpMessageDispatcheds: [] };
      }

      throw new Error('unexpected query document');
    });
  });

  it('keeps scanning past 20 batches so deep failed rows remain reachable', async () => {
    const chains = [{ id: 1, name: 'Ethereum', iconUrl: '/eth.svg' }] as CHAIN[];

    const messages = await fetchMessages({
      filters: {
        statuses: [MESSAGE_STATUS.FAILED]
      },
      paging: {
        offset: 0,
        limit: 1
      },
      chains
    });

    expect(messages).toHaveLength(1);
    expect(messages[0]?.msgId).toBe(TARGET_MSG_ID);
    expect(messages[0]?.status).toBe(MESSAGE_STATUS.FAILED);

    const summaryCalls = requestMock.mock.calls.filter(
      ([firstArg]) =>
        (firstArg as { document?: unknown } | undefined)?.document === GET_MESSAGE_PORT_SENT_SUMMARY
    );
    expect(summaryCalls.length).toBeGreaterThan(20);
  });
});
