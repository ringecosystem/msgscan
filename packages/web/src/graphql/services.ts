import { MESSAGE_STATUS } from '@/types/message';

import { client } from './client';
import {
  GET_MESSAGE_PORT_SENTS,
  GET_MESSAGE_STATS,
  GET_MESSAGE_PORT_SENT_SUMMARY,
  GET_ORMP_MESSAGE_ACCEPTEDS,
  GET_ORMP_MESSAGE_ACCEPTED_SUMMARY,
  GET_ORMP_MESSAGE_DISPATCHED_OUTCOME_COUNTS,
  GET_ORMP_MESSAGE_DISPATCHEDS,
  GET_ORMP_MESSAGE_DISPATCHED_SUMMARY
} from './queries';

import type {
  DispatchedOutcomeCountsResponse,
  DispatchedOutcomeCountsVariables,
  MessageStatsResponse,
  MessageStatsVariables,
  MsgportMessageSent,
  MsgportMessageSentsResponse,
  MsgportMessageSentsVariables,
  ORMPMessageAccepted,
  ORMPMessageAcceptedsResponse,
  ORMPMessageAcceptedsVariables,
  ORMPMessageDispatched,
  ORMPMessageDispatchedsResponse,
  ORMPMessageDispatchedsVariables
} from './type';
import type { CHAIN } from '@/types/chains';
import type { CompositeMessage, MessageFilters, MessagePaging, MessageStats } from '@/types/messages';

function hasKeys(value: Record<string, unknown> | undefined): value is Record<string, unknown> {
  return Boolean(value && Object.keys(value).length > 0);
}

function assertNotAborted(signal?: AbortSignal) {
  if (signal?.aborted) {
    throw new DOMException('The operation was aborted.', 'AbortError');
  }
}

function isAbortError(error: unknown): boolean {
  return (
    (error instanceof DOMException && error.name === 'AbortError') ||
    (error instanceof Error && error.name === 'AbortError')
  );
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function normalizeHex(value: string): string {
  return value.trim().toLowerCase();
}

function toBigIntString(value: number): string | undefined {
  if (!Number.isFinite(value)) return undefined;
  try {
    return BigInt(Math.trunc(value)).toString();
  } catch {
    return undefined;
  }
}

function blockTimestampMsToSec(value: string | number | undefined): number | undefined {
  if (typeof value === 'undefined') return undefined;
  try {
    const ms = BigInt(value.toString());
    const sec = ms / BigInt(1000);
    return Number(sec);
  } catch {
    return undefined;
  }
}

function endOfDay(date: Date): Date {
  const end = new Date(date);
  end.setDate(end.getDate() + 1);
  end.setMilliseconds(-1);
  return end;
}

function buildSentWhere(options: {
  filters?: MessageFilters;
  defaultFromChainIds: string[];
}): Record<string, unknown> {
  const { filters, defaultFromChainIds } = options;
  const where: Record<string, unknown> = {};

  if (filters?.fromDapps && filters.fromDapps.length > 0) {
    where.fromDapp_in = filters.fromDapps.map(normalizeHex);
  }

  if (filters?.transactionFrom) {
    where.transactionFrom_eq = normalizeHex(filters.transactionFrom);
  }

  if (filters?.fromChainIds && filters.fromChainIds.length > 0) {
    where.fromChainId_in = filters.fromChainIds.map((value) => value.toString());
  } else if (defaultFromChainIds.length > 0) {
    where.fromChainId_in = defaultFromChainIds;
  }

  if (filters?.toChainIds && filters.toChainIds.length > 0) {
    where.toChainId_in = filters.toChainIds.map((value) => value.toString());
  }

  if (filters?.dateFrom) {
    const gte = toBigIntString(filters.dateFrom.getTime());
    if (gte) where.blockTimestamp_gte = gte;
  }

  if (filters?.dateTo) {
    const lte = toBigIntString(endOfDay(filters.dateTo).getTime());
    if (lte) where.blockTimestamp_lte = lte;
  }

  return where;
}

type TimedCache<T> = Map<
  string,
  {
    expiresAt: number;
    data: T;
  }
>;

function pruneTimedCache<T>(cache: TimedCache<T>, maxSize: number) {
  const now = Date.now();

  cache.forEach((value, key) => {
    if (value.expiresAt <= now) {
      cache.delete(key);
    }
  });

  while (cache.size > maxSize) {
    const firstKey = cache.keys().next().value as string | undefined;
    if (!firstKey) break;
    cache.delete(firstKey);
  }
}

const MESSAGE_STATS_CACHE_TTL = 120_000;
const MESSAGE_STATS_CACHE_MAX = 16;
const STATUS_SCAN_CACHE_TTL = 30_000;
const STATUS_SCAN_CACHE_MAX = 24;
const STATUS_SCAN_CACHE_MAX_COLLECTED = 2_000;
const DISPATCHED_OUTCOME_CACHE_TTL = 120_000;
const DISPATCHED_OUTCOME_CACHE_MAX = 8;

const messageStatsCache = new Map<
  string,
  {
    expiresAt: number;
    data: MessageStats;
  }
>();

interface SentSummary {
  msgId: string;
  transactionHash: string;
  blockTimestamp: string;
}

interface AcceptedSummary {
  msgHash: string;
  transactionHash: string;
}

interface DispatchedSummary {
  id: string;
  msgHash: string;
  dispatchResult: boolean;
  targetChainId: string;
  blockTimestamp: string;
}

interface SentStatusSummary extends SentSummary {
  status: number;
}

interface StatusScanProgress {
  collectedMsgIds: string[];
  collectedStartIndex: number;
  matchedCount: number;
  snapshotTopMsgId?: string;
  snapshotTopBlockTimestamp?: string;
  scanOffset: number;
  exhausted: boolean;
}

interface DispatchedOutcomeCacheData {
  success: number;
  failed: number;
}

const statusScanCache = new Map<
  string,
  {
    expiresAt: number;
    data: StatusScanProgress;
  }
>();
const dispatchedOutcomeCache = new Map<
  string,
  {
    expiresAt: number;
    data: DispatchedOutcomeCacheData;
  }
>();

function deriveStatus3(dispatched?: ORMPMessageDispatched): MESSAGE_STATUS {
  if (!dispatched) return MESSAGE_STATUS.PENDING;
  return dispatched.dispatchResult ? MESSAGE_STATUS.SUCCESS : MESSAGE_STATUS.FAILED;
}

function mapSentToCompositeMessage(options: {
  sent: MsgportMessageSent;
  acceptedByMsgHash: Map<string, ORMPMessageAccepted>;
  acceptedByTxHash: Map<string, ORMPMessageAccepted[]>;
  dispatchedByMsgHash: Map<string, ORMPMessageDispatched>;
}): CompositeMessage {
  const { sent, acceptedByMsgHash, acceptedByTxHash, dispatchedByMsgHash } = options;

  const acceptedByTxCandidates = acceptedByTxHash.get(sent.transactionHash) ?? [];
  const accepted =
    acceptedByMsgHash.get(sent.msgId) ??
    (acceptedByTxCandidates.length === 1 ? acceptedByTxCandidates[0] : undefined);
  const resolvedMsgHash = accepted?.msgHash ?? sent.msgId;
  const dispatched = dispatchedByMsgHash.get(resolvedMsgHash);

  const sentSec = blockTimestampMsToSec(sent.blockTimestamp) ?? 0;
  const dispatchedSec = dispatched ? blockTimestampMsToSec(dispatched.blockTimestamp) : undefined;

  return {
    msgId: sent.msgId,
    protocol: 'ormp',
    status: deriveStatus3(dispatched),
    transactionHash: sent.transactionHash,
    targetTransactionHash: dispatched?.transactionHash,
    transactionFrom: sent.transactionFrom ?? null,
    fromChainId: sent.fromChainId,
    toChainId: dispatched?.targetChainId ?? sent.toChainId,
    fromDapp: sent.fromDapp,
    toDapp: sent.toDapp,
    portAddress: sent.portAddress,
    message: sent.message,
    params: sent.params,
    sentBlockTimestampSec: sentSec,
    dispatchedBlockTimestampSec: dispatchedSec,
    accepted,
    dispatched,
    sent
  };
}

async function fetchSentBatch(options: {
  where?: Record<string, unknown>;
  orderBy?: string[];
  limit?: number;
  offset?: number;
  signal?: AbortSignal;
}): Promise<MsgportMessageSent[]> {
  const response = await client.request<MsgportMessageSentsResponse, MsgportMessageSentsVariables>({
    document: GET_MESSAGE_PORT_SENTS,
    variables: {
      where: options.where,
      orderBy: options.orderBy,
      limit: options.limit,
      offset: options.offset
    },
    signal: options.signal
  });

  return response?.msgportMessageSents ?? [];
}

async function fetchAccepteds(options: {
  sentRefs: Array<{
    msgId: string;
    txHash: string;
  }>;
  signal?: AbortSignal;
}): Promise<ORMPMessageAccepted[]> {
  const { sentRefs, signal } = options;
  assertNotAborted(signal);
  const msgIds = unique(sentRefs.map((item) => item.msgId));
  const resultById = new Map<string, ORMPMessageAccepted>();

  if (msgIds.length > 0) {
    const primaryResponse = await client.request<
      ORMPMessageAcceptedsResponse,
      ORMPMessageAcceptedsVariables
    >({
      document: GET_ORMP_MESSAGE_ACCEPTEDS,
      variables: {
        where: {
          msgHash_in: msgIds
        },
        orderBy: ['blockTimestamp_DESC'],
        limit: Math.max(msgIds.length * 2, 20)
      },
      signal
    });

    (primaryResponse?.ormpMessageAccepteds ?? []).forEach((item) => {
      resultById.set(item.id, item);
    });
  }

  const matchedMsgHashes = new Set<string>(
    Array.from(resultById.values()).map((item) => item.msgHash)
  );
  const fallbackTxHashes = unique(
    sentRefs.filter((item) => !matchedMsgHashes.has(item.msgId)).map((item) => item.txHash)
  );

  if (fallbackTxHashes.length > 0) {
    assertNotAborted(signal);
    const fallbackResponse = await client.request<
      ORMPMessageAcceptedsResponse,
      ORMPMessageAcceptedsVariables
    >({
      document: GET_ORMP_MESSAGE_ACCEPTEDS,
      variables: {
        where: {
          transactionHash_in: fallbackTxHashes
        },
        orderBy: ['blockTimestamp_DESC'],
        limit: Math.max(fallbackTxHashes.length * 2, 20)
      },
      signal
    });

    (fallbackResponse?.ormpMessageAccepteds ?? []).forEach((item) => {
      if (!resultById.has(item.id)) {
        resultById.set(item.id, item);
      }
    });
  }

  return Array.from(resultById.values());
}

async function fetchDispatchedsByMsgHash(
  msgHashes: string[],
  signal?: AbortSignal
): Promise<ORMPMessageDispatched[]> {
  if (msgHashes.length === 0) return [];
  assertNotAborted(signal);

  const response = await client.request<
    ORMPMessageDispatchedsResponse,
    ORMPMessageDispatchedsVariables
  >({
    document: GET_ORMP_MESSAGE_DISPATCHEDS,
    variables: {
      where: {
        msgHash_in: msgHashes
      },
      orderBy: ['blockTimestamp_DESC'],
      limit: Math.max(msgHashes.length * 2, 20)
    },
    signal
  });

  return response?.ormpMessageDispatcheds ?? [];
}

async function fetchDispatchedSummaryByMsgHashes(
  msgHashes: string[],
  signal?: AbortSignal
): Promise<Map<string, DispatchedSummary>> {
  const result = new Map<string, DispatchedSummary>();
  if (msgHashes.length === 0) return result;
  assertNotAborted(signal);

  const chunkSize = 200;

  for (let index = 0; index < msgHashes.length; index += chunkSize) {
    assertNotAborted(signal);
    const chunk = msgHashes.slice(index, index + chunkSize);
    const response = await client.request<
      {
        ormpMessageDispatcheds: DispatchedSummary[];
      },
      ORMPMessageDispatchedsVariables
    >({
      document: GET_ORMP_MESSAGE_DISPATCHED_SUMMARY,
      variables: {
        where: {
          msgHash_in: chunk
        },
        orderBy: ['blockTimestamp_DESC'],
        limit: Math.max(chunk.length * 8, 400)
      },
      signal
    });

    (response?.ormpMessageDispatcheds ?? []).forEach((item) => {
      if (!result.has(item.msgHash)) {
        result.set(item.msgHash, item);
      }
    });
  }

  return result;
}

async function enrichSentList(
  sentList: MsgportMessageSent[],
  signal?: AbortSignal
): Promise<CompositeMessage[]> {
  if (sentList.length === 0) return [];
  assertNotAborted(signal);

  const sentRefs = sentList.map((item) => ({
    msgId: item.msgId,
    txHash: item.transactionHash
  }));
  const msgIds = unique(sentRefs.map((item) => item.msgId));

  const accepteds = await fetchAccepteds({ sentRefs, signal });

  const acceptedByMsgHash = new Map<string, ORMPMessageAccepted>();
  const acceptedByTxHash = new Map<string, ORMPMessageAccepted[]>();
  accepteds.forEach((item) => {
    if (!acceptedByMsgHash.has(item.msgHash)) {
      acceptedByMsgHash.set(item.msgHash, item);
    }

    const candidates = acceptedByTxHash.get(item.transactionHash) ?? [];
    candidates.push(item);
    acceptedByTxHash.set(item.transactionHash, candidates);
  });

  const dispatchedMsgHashes = unique([...msgIds, ...accepteds.map((item) => item.msgHash)]);
  const dispatcheds = await fetchDispatchedsByMsgHash(dispatchedMsgHashes, signal);

  const dispatchedByMsgHash = new Map<string, ORMPMessageDispatched>();
  dispatcheds.forEach((item) => {
    if (!dispatchedByMsgHash.has(item.msgHash)) {
      dispatchedByMsgHash.set(item.msgHash, item);
    }
  });

  return sentList.map((sent) =>
    mapSentToCompositeMessage({
      sent,
      acceptedByMsgHash,
      acceptedByTxHash,
      dispatchedByMsgHash
    })
  );
}

async function fetchAcceptedSummaryByTxHashes(
  txHashes: string[],
  signal?: AbortSignal
): Promise<Map<string, string[]>> {
  const txToMsgHashes = new Map<string, string[]>();
  if (txHashes.length === 0) return txToMsgHashes;
  assertNotAborted(signal);

  const chunkSize = 200;
  for (let index = 0; index < txHashes.length; index += chunkSize) {
    assertNotAborted(signal);
    const chunk = txHashes.slice(index, index + chunkSize);
    const response = await client.request<
      {
        ormpMessageAccepteds: AcceptedSummary[];
      },
      ORMPMessageAcceptedsVariables
    >({
      document: GET_ORMP_MESSAGE_ACCEPTED_SUMMARY,
      variables: {
        where: {
          transactionHash_in: chunk
        },
        orderBy: ['blockTimestamp_DESC'],
        limit: Math.max(chunk.length * 8, 400)
      },
      signal
    });

    (response?.ormpMessageAccepteds ?? []).forEach((item) => {
      const hashes = txToMsgHashes.get(item.transactionHash) ?? [];
      if (!hashes.includes(item.msgHash)) {
        hashes.push(item.msgHash);
      }
      txToMsgHashes.set(item.transactionHash, hashes);
    });
  }

  return txToMsgHashes;
}

function buildStatusScanCacheKey(options: {
  where?: Record<string, unknown>;
  orderBy?: string[];
  statusSet: Set<number>;
}): string {
  return JSON.stringify({
    where: options.where ?? null,
    orderBy: options.orderBy ?? ['blockTimestamp_DESC'],
    statuses: Array.from(options.statusSet).sort((a, b) => a - b)
  });
}

function buildStatusScanWhere(
  where: Record<string, unknown> | undefined,
  snapshotTopBlockTimestamp?: string
): Record<string, unknown> | undefined {
  if (!snapshotTopBlockTimestamp) {
    return where;
  }

  const snapshotConstraint: Record<string, unknown> = {
    blockTimestamp_lte: snapshotTopBlockTimestamp
  };

  if (!where) {
    return snapshotConstraint;
  }

  return {
    AND: [where, snapshotConstraint]
  };
}

function buildDispatchedOutcomeScopeKey(targetChainIds?: string[]): string {
  if (!targetChainIds || targetChainIds.length === 0) {
    return 'all';
  }
  return targetChainIds.slice().sort().join(',');
}

async function resolveSentStatusBatch(
  sentSummaries: SentSummary[],
  signal?: AbortSignal
): Promise<SentStatusSummary[]> {
  const unresolved: SentSummary[] = [];
  const statusByMsgId = new Map<string, number>();
  assertNotAborted(signal);

  const directDispatchedByMsgHash = await fetchDispatchedSummaryByMsgHashes(
    unique(sentSummaries.map((item) => item.msgId)),
    signal
  );

  sentSummaries.forEach((sent) => {
    const directDispatchResult = directDispatchedByMsgHash.get(sent.msgId)?.dispatchResult;
    if (typeof directDispatchResult !== 'undefined') {
      statusByMsgId.set(
        sent.msgId,
        directDispatchResult ? MESSAGE_STATUS.SUCCESS : MESSAGE_STATUS.FAILED
      );
      return;
    }

    unresolved.push(sent);
  });

  if (unresolved.length > 0) {
    const unresolvedTxHashes = unique(unresolved.map((item) => item.transactionHash));
    const acceptedByTx = await fetchAcceptedSummaryByTxHashes(unresolvedTxHashes, signal);
    const fallbackMsgHashes = unique(Array.from(acceptedByTx.values()).flat());
    const fallbackDispatchedByMsgHash = await fetchDispatchedSummaryByMsgHashes(
      fallbackMsgHashes,
      signal
    );

    unresolved.forEach((sent) => {
      const matchedMsgHashes = acceptedByTx.get(sent.transactionHash) ?? [];
      if (matchedMsgHashes.length === 1) {
        const fallbackDispatchResult =
          fallbackDispatchedByMsgHash.get(matchedMsgHashes[0])?.dispatchResult;
        if (typeof fallbackDispatchResult !== 'undefined') {
          statusByMsgId.set(
            sent.msgId,
            fallbackDispatchResult ? MESSAGE_STATUS.SUCCESS : MESSAGE_STATUS.FAILED
          );
          return;
        }
      }

      statusByMsgId.set(sent.msgId, MESSAGE_STATUS.PENDING);
    });
  }

  return sentSummaries.map((sent) => ({
    ...sent,
    status: statusByMsgId.get(sent.msgId) ?? MESSAGE_STATUS.PENDING
  }));
}

async function pickPageMsgIdsByStatus(options: {
  where?: Record<string, unknown>;
  orderBy?: string[];
  statusSet: Set<number>;
  offset: number;
  limit: number;
  signal?: AbortSignal;
}): Promise<string[]> {
  const { where, statusSet, offset, limit, signal } = options;
  const orderBy = options.orderBy ?? ['blockTimestamp_DESC'];
  const targetEnd = offset + limit;
  if (targetEnd <= 0) return [];
  assertNotAborted(signal);

  const scanCacheKey = buildStatusScanCacheKey({
    where,
    orderBy,
    statusSet
  });
  pruneTimedCache(statusScanCache, STATUS_SCAN_CACHE_MAX);

  const scanCache = statusScanCache.get(scanCacheKey);
  const cachedCollected = scanCache?.data.collectedMsgIds ?? [];
  const cachedCollectedStartIndex = scanCache?.data.collectedStartIndex ?? 0;
  const cachedMatchedCount =
    scanCache?.data.matchedCount ?? (cachedCollectedStartIndex + cachedCollected.length);
  const cachedSnapshotTopMsgId = scanCache?.data.snapshotTopMsgId;

  // Cache keeps a sliding window of matched ids. If requested page is older than
  // the current window start, or caller asks first page, restart scan to pick up
  // newly indexed rows and preserve correctness.
  let shouldResetProgress = offset === 0 || offset < cachedCollectedStartIndex;
  if (!shouldResetProgress && cachedSnapshotTopMsgId) {
    const latestHeadResponse = await client.request<
      {
        msgportMessageSents: SentSummary[];
      },
      MsgportMessageSentsVariables
    >({
      document: GET_MESSAGE_PORT_SENT_SUMMARY,
      variables: {
        where,
        orderBy,
        limit: 1,
        offset: 0
      },
      signal
    });

    const latestHeadMsgId = latestHeadResponse?.msgportMessageSents?.[0]?.msgId ?? null;
    if (latestHeadMsgId !== cachedSnapshotTopMsgId) {
      shouldResetProgress = true;
    }
  }
  const collected = shouldResetProgress ? [] : [...cachedCollected];
  let collectedStartIndex = shouldResetProgress ? 0 : cachedCollectedStartIndex;
  let matchedCount = shouldResetProgress ? 0 : cachedMatchedCount;
  let snapshotTopMsgId = shouldResetProgress ? undefined : cachedSnapshotTopMsgId;
  let snapshotTopBlockTimestamp = shouldResetProgress
    ? undefined
    : scanCache?.data.snapshotTopBlockTimestamp;
  let scanOffset = shouldResetProgress ? 0 : (scanCache?.data.scanOffset ?? 0);
  let exhausted = shouldResetProgress ? false : (scanCache?.data.exhausted ?? false);
  const batchSize = Math.max(200, limit * 20);
  const pageMsgIds: string[] = [];
  const cachedWindowEnd = collectedStartIndex + collected.length;
  const cacheHitStart = Math.max(offset, collectedStartIndex);
  const cacheHitEnd = Math.min(targetEnd, cachedWindowEnd);
  if (cacheHitStart < cacheHitEnd) {
    pageMsgIds.push(
      ...collected.slice(cacheHitStart - collectedStartIndex, cacheHitEnd - collectedStartIndex)
    );
  }

  while (!exhausted && matchedCount < targetEnd) {
    assertNotAborted(signal);
    const response = await client.request<
      {
        msgportMessageSents: SentSummary[];
      },
      MsgportMessageSentsVariables
    >({
      document: GET_MESSAGE_PORT_SENT_SUMMARY,
      variables: {
        where: buildStatusScanWhere(where, snapshotTopBlockTimestamp),
        orderBy,
        limit: batchSize,
        offset: scanOffset
      },
      signal
    });

    const sentBatch = response?.msgportMessageSents ?? [];
    if (sentBatch.length === 0) {
      exhausted = true;
      break;
    }
    if (!snapshotTopMsgId) {
      snapshotTopMsgId = sentBatch[0]?.msgId;
    }
    if (!snapshotTopBlockTimestamp) {
      snapshotTopBlockTimestamp = sentBatch[0]?.blockTimestamp;
    }

    const statusBatch = await resolveSentStatusBatch(sentBatch, signal);
    statusBatch.forEach((item) => {
      if (statusSet.has(item.status)) {
        if (matchedCount >= offset && matchedCount < targetEnd) {
          pageMsgIds.push(item.msgId);
        }
        if (collected.length >= STATUS_SCAN_CACHE_MAX_COLLECTED) {
          collected.shift();
          collectedStartIndex += 1;
        }
        collected.push(item.msgId);
        matchedCount += 1;
      }
    });

    scanOffset += sentBatch.length;
    if (sentBatch.length < batchSize) {
      exhausted = true;
      break;
    }
  }

  statusScanCache.set(scanCacheKey, {
    expiresAt: Date.now() + STATUS_SCAN_CACHE_TTL,
    data: {
      collectedMsgIds: collected,
      collectedStartIndex,
      matchedCount,
      snapshotTopMsgId,
      snapshotTopBlockTimestamp,
      scanOffset,
      exhausted
    }
  });
  pruneTimedCache(statusScanCache, STATUS_SCAN_CACHE_MAX);

  return pageMsgIds;
}

async function fetchDispatchedOutcomeTotals(options?: {
  targetChainIds?: string[];
}): Promise<{
  success: number;
  failed: number;
}> {
  const scopeKey = buildDispatchedOutcomeScopeKey(options?.targetChainIds);
  pruneTimedCache(dispatchedOutcomeCache, DISPATCHED_OUTCOME_CACHE_MAX);
  const cached = dispatchedOutcomeCache.get(scopeKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const buildOutcomeWhere = (dispatchResult: boolean): Record<string, unknown> => {
    const conditions: Record<string, unknown>[] = [{ dispatchResult_eq: dispatchResult }];
    if (options?.targetChainIds && options.targetChainIds.length > 0) {
      conditions.push({
        targetChainId_in: options.targetChainIds
      });
    }
    if (conditions.length === 1) {
      return conditions[0];
    }
    return { AND: conditions };
  };

  const response = await client.request<
    DispatchedOutcomeCountsResponse,
    DispatchedOutcomeCountsVariables
  >({
    document: GET_ORMP_MESSAGE_DISPATCHED_OUTCOME_COUNTS,
    variables: {
      successWhere: buildOutcomeWhere(true),
      failedWhere: buildOutcomeWhere(false),
      // Subsquid connection requires an explicit orderBy.
      orderBy: ['id_ASC']
    }
  });

  const result = {
    success: response?.success?.totalCount ?? 0,
    failed: response?.failed?.totalCount ?? 0
  };

  dispatchedOutcomeCache.set(scopeKey, {
    expiresAt: Date.now() + DISPATCHED_OUTCOME_CACHE_TTL,
    data: result
  });
  pruneTimedCache(dispatchedOutcomeCache, DISPATCHED_OUTCOME_CACHE_MAX);

  return result;
}

export async function fetchMessages(options: {
  filters?: MessageFilters;
  paging?: Partial<MessagePaging>;
  chains: CHAIN[];
  signal?: AbortSignal;
}): Promise<CompositeMessage[]> {
  const { filters, paging, chains, signal } = options;
  assertNotAborted(signal);
  const defaultFromChainIds = chains?.map((chain) => chain.id.toString()) ?? [];

  const limit = paging?.limit ?? 15;
  const offset = paging?.offset ?? 0;

  const mappedWhere = buildSentWhere({ filters, defaultFromChainIds });
  const where = hasKeys(mappedWhere) ? mappedWhere : undefined;
  const orderBy = ['blockTimestamp_DESC'];

  const statuses = filters?.statuses ?? [];
  const statusSet = new Set<number>(statuses);

  try {
    if (statusSet.size === 0) {
      const sentList = await fetchSentBatch({
        where,
        limit,
        offset,
        orderBy,
        signal
      });

      return enrichSentList(sentList, signal);
    }

    const pageMsgIds = await pickPageMsgIdsByStatus({
      where,
      orderBy,
      statusSet,
      offset,
      limit,
      signal
    });

    if (pageMsgIds.length === 0) return [];

    const resolveFilteredMessages = async (msgIds: string[]): Promise<CompositeMessage[]> => {
      if (msgIds.length === 0) {
        return [];
      }

      const sentWhereByIds: Record<string, unknown> = where
        ? {
            AND: [where, { msgId_in: msgIds }]
          }
        : {
            msgId_in: msgIds
          };

      const sentPage = await fetchSentBatch({
        where: sentWhereByIds,
        limit: msgIds.length,
        offset: 0,
        orderBy,
        signal
      });

      if (sentPage.length === 0) {
        return [];
      }

      const sentByMsgId = new Map(sentPage.map((item) => [item.msgId, item]));
      const orderedSentPage = msgIds
        .map((msgId) => sentByMsgId.get(msgId))
        .filter((item): item is MsgportMessageSent => Boolean(item));

      const enriched = await enrichSentList(orderedSentPage, signal);
      const enrichedByMsgId = new Map(enriched.map((item) => [item.msgId, item]));

      return msgIds
        .map((msgId) => enrichedByMsgId.get(msgId))
        .filter((item): item is CompositeMessage => Boolean(item))
        // Status-index cache can be stale. Re-apply predicate after enrichment.
        .filter((item) => statusSet.has(item.status));
    };

    const candidateMsgIds = [...pageMsgIds];
    let filteredMessages = await resolveFilteredMessages(candidateMsgIds);
    let nextOffset = offset + pageMsgIds.length;
    const maxCandidateMsgIds = Math.max(limit * 10, 100);

    while (filteredMessages.length < limit && candidateMsgIds.length < maxCandidateMsgIds) {
      const remainingSlots = maxCandidateMsgIds - candidateMsgIds.length;
      const requestLimit = Math.min(limit, remainingSlots);
      const extraMsgIds = await pickPageMsgIdsByStatus({
        where,
        orderBy,
        statusSet,
        offset: nextOffset,
        limit: requestLimit,
        signal
      });

      if (extraMsgIds.length === 0) {
        break;
      }

      nextOffset += extraMsgIds.length;
      const existingIds = new Set(candidateMsgIds);
      let hasNewId = false;
      extraMsgIds.forEach((msgId) => {
        if (!existingIds.has(msgId)) {
          candidateMsgIds.push(msgId);
          existingIds.add(msgId);
          hasNewId = true;
        }
      });

      if (!hasNewId) {
        break;
      }

      filteredMessages = await resolveFilteredMessages(candidateMsgIds);
    }

    return filteredMessages.slice(0, limit);
  } catch (error) {
    if (isAbortError(error)) {
      throw error;
    }
    console.error('messages request failed:', error);
    throw error;
  }
}

export async function fetchMessageDetail(
  id: string,
  chains: CHAIN[],
  signal?: AbortSignal
): Promise<CompositeMessage | null> {
  const defaultFromChainIds = chains?.map((chain) => chain.id.toString()) ?? [];

  try {
    assertNotAborted(signal);
    const normalizedId = normalizeHex(id);

    if (!/^0x[a-f0-9]{10,}$/i.test(normalizedId)) {
      return null;
    }

    // Some indexer backends treat sibling filters with OR in unexpected ways.
    // Force explicit boolean grouping to keep detail lookup semantically strict:
    // (msgId == id OR txHash == id) AND fromChain in selected network.
    const whereClauses: Record<string, unknown>[] = [
      {
        OR: [{ msgId_eq: normalizedId }, { transactionHash_eq: normalizedId }]
      }
    ];

    if (defaultFromChainIds.length > 0) {
      whereClauses.push({
        fromChainId_in: defaultFromChainIds
      });
    }

    const where: Record<string, unknown> = whereClauses.length === 1
      ? whereClauses[0]
      : { AND: whereClauses };

    const sentList = await fetchSentBatch({
      where,
      orderBy: ['blockTimestamp_DESC'],
      limit: 1,
      signal
    });

    const sent = sentList[0];
    if (!sent) return null;

    const messages = await enrichSentList([sent], signal);
    return messages[0] ?? null;
  } catch (error) {
    if (isAbortError(error)) {
      throw error;
    }
    console.error('message detail request failed:', error);
    return null;
  }
}

export async function fetchMessageStats(chains: CHAIN[]): Promise<MessageStats> {
  const selectedChainIds = chains?.map((chain) => chain.id.toString()) ?? [];
  const cacheKey = selectedChainIds.length > 0 ? selectedChainIds.join(',') : 'all';

  pruneTimedCache(messageStatsCache, MESSAGE_STATS_CACHE_MAX);
  const cached = messageStatsCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  try {
    // Progress cards are calculated by destination chain scope.
    const sentWhere =
      selectedChainIds.length > 0
        ? {
            toChainId_in: selectedChainIds
          }
        : undefined;

    const stats = await client.request<MessageStatsResponse, MessageStatsVariables>(
      GET_MESSAGE_STATS,
      {
        sentWhere
      } satisfies MessageStatsVariables
    );

    const total = stats?.total?.totalCount ?? 0;
    const { success, failed } = await fetchDispatchedOutcomeTotals({
      targetChainIds: selectedChainIds
    });
    const resolved = Math.min(total, success + failed);
    const inflight = Math.max(0, total - resolved);

    const result: MessageStats = {
      total,
      success,
      failed,
      inflight
    };

    messageStatsCache.set(cacheKey, {
      expiresAt: Date.now() + MESSAGE_STATS_CACHE_TTL,
      data: result
    });
    pruneTimedCache(messageStatsCache, MESSAGE_STATS_CACHE_MAX);

    return result;
  } catch (error) {
    console.error('message stats request failed:', error);
    throw error;
  }
}
