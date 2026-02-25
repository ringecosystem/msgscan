'use client';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, PauseCircle } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import DataTable from '@/components/data-table';
import DesktopFilterToolbar from '@/components/data-table/DesktopFilterToolbar';
import MobileFilterToolbar from '@/components/data-table/MobileFilterToolbar';
import { getAllDappAddressByKeys, getDappAddresses } from '@/utils';
import { useMessages } from '@/hooks/services';
import useQueryParamState from '@/hooks/useQueryParamState';
import useFilter from '@/components/data-table/hooks/useFilter';
import { cn } from '@/lib/utils';

import type { CHAIN } from '@/types/chains';
import type { CompositeMessage, MessageFilters, MessagePaging } from '@/types/messages';
import type { MESSAGE_STATUS } from '@/types/message';

function buildPagingKey(value: MessagePaging): string {
  return JSON.stringify({
    limit: value.limit ?? null,
    offset: value.offset ?? null
  });
}

const defaultPaging: MessagePaging = {
  offset: 0,
  limit: 15
};

const SLOW_LOADING_THRESHOLD = 3000;
const STATUS_SCAN_TIMEOUT_MS = 60_000;

interface MessagePortTableProps {
  chains: CHAIN[];
  network: string;
  sourceAddress?: string;
  sender?: string;
}

interface LastRealDataState {
  scopeKey: string;
  rows: CompositeMessage[];
}

const MessagePortTable = ({ chains, network, sourceAddress, sender }: MessagePortTableProps) => {
  const queryClient = useQueryClient();
  const [paging, setPaging] = useState<MessagePaging>(defaultPaging);
  const [isSlowLoading, setIsSlowLoading] = useState(false);
  const slowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusScanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scanTickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scanStartedAtRef = useRef<number | null>(null);

  const [scanPausedReason, setScanPausedReason] = useState<null | 'user' | 'timeout'>(null);
  const [scanElapsedSec, setScanElapsedSec] = useState(0);

  const updatePaging = useCallback((next: Partial<MessagePaging>) => {
    setPaging((prev) => {
      const merged: MessagePaging = {
        ...prev,
        ...next
      };

      if (buildPagingKey(prev) === buildPagingKey(merged)) {
        return prev;
      }

      return merged;
    });
  }, []);

  const {
    selectedDapps,
    selectedStatuses,
    selectedSourceChains,
    selectedTargetChains,
    dateFrom,
    dateTo
  } = useQueryParamState();

  const { handleReset } = useFilter();

  const filters = useMemo<MessageFilters>(() => {
    const next: MessageFilters = {};

    next.statuses =
      selectedStatuses && selectedStatuses.length > 0
        ? (selectedStatuses as MESSAGE_STATUS[])
        : undefined;

    if (sourceAddress) {
      const fromDapps = getDappAddresses(sourceAddress) ?? [sourceAddress];
      next.fromDapps = fromDapps;
    } else if (selectedDapps && selectedDapps.length > 0) {
      next.fromDapps = getAllDappAddressByKeys(selectedDapps);
    }

    if (sender) {
      next.transactionFrom = sender;
    }

    next.fromChainIds =
      selectedSourceChains && selectedSourceChains.length > 0 ? selectedSourceChains : undefined;
    next.toChainIds =
      selectedTargetChains && selectedTargetChains.length > 0 ? selectedTargetChains : undefined;

    next.dateFrom = dateFrom || undefined;
    next.dateTo = dateTo || undefined;

    return next;
  }, [
    selectedStatuses,
    sourceAddress,
    selectedDapps,
    sender,
    selectedSourceChains,
    selectedTargetChains,
    dateFrom,
    dateTo
  ]);

  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);
  const hasStatusFilter = Boolean(filters.statuses && filters.statuses.length > 0);
  const scanEnabled = !scanPausedReason;

  useEffect(() => {
    updatePaging({ offset: 0 });
  }, [filtersKey, network, updatePaging]);

  useEffect(() => {
    // Any filter change should resume scanning by default.
    setScanPausedReason(null);
  }, [filtersKey, network]);

  useEffect(() => {
    // Non-status views should never carry paused scan state.
    if (!hasStatusFilter) {
      setScanPausedReason(null);
    }
  }, [hasStatusFilter]);

  const { data, isFetching, isError } = useMessages(filters, paging, chains, {
    enabled: scanEnabled
  });

  const pagingKey = buildPagingKey(paging);
  const chainsKey = chains?.map((c) => c.id).join(',') || 'all';
  const queryKey = useMemo(
    () => ['messages', filtersKey, pagingKey, chainsKey],
    [filtersKey, pagingKey, chainsKey]
  );
  const queryScopeKey = useMemo(
    () => `${filtersKey}|${pagingKey}|${chainsKey}`,
    [filtersKey, pagingKey, chainsKey]
  );
  const [lastRealDataState, setLastRealDataState] = useState<LastRealDataState>(() => ({
    scopeKey: queryScopeKey,
    rows: []
  }));

  useEffect(() => {
    // Keep fallback cache scoped to the active query only.
    setLastRealDataState({
      scopeKey: queryScopeKey,
      rows: []
    });
  }, [queryScopeKey]);

  const hasAnyData = Array.isArray(data);
  const isEmptyResult = hasAnyData && data.length === 0;
  const isPlaceholderOnly =
    hasAnyData && data.length > 0 && data.every((item) => item.status === -1);
  const hasRealData = hasAnyData && data.length > 0 && data.some((item) => item.status !== -1);

  useEffect(() => {
    if (hasRealData && data) {
      setLastRealDataState((prev) => {
        // Guard against stale effect commits from previous query scopes.
        if (prev.scopeKey !== queryScopeKey) {
          return prev;
        }
        return {
          scopeKey: prev.scopeKey,
          rows: data
        };
      });
    }
  }, [hasRealData, data, queryScopeKey]);

  const lastRealData = useMemo(
    () => (lastRealDataState.scopeKey === queryScopeKey ? lastRealDataState.rows : []),
    [lastRealDataState, queryScopeKey]
  );

  const dataSource = useMemo(() => {
    if (!hasAnyData) {
      return lastRealData;
    }
    if (isEmptyResult) {
      return [];
    }
    if (isPlaceholderOnly && lastRealData.length > 0) {
      return lastRealData;
    }
    return data;
  }, [hasAnyData, isEmptyResult, isPlaceholderOnly, data, lastRealData]);

  const handleCancelStatusScan = useCallback(() => {
    queryClient.cancelQueries({ queryKey, exact: true });
    setScanPausedReason('user');
  }, [queryClient, queryKey]);

  const handleResumeStatusScan = useCallback(() => {
    setScanPausedReason(null);
  }, []);

  useEffect(() => {
    if (isFetching && hasStatusFilter) {
      slowTimerRef.current = setTimeout(() => {
        setIsSlowLoading(true);
      }, SLOW_LOADING_THRESHOLD);
    } else {
      setIsSlowLoading(false);
      if (slowTimerRef.current) {
        clearTimeout(slowTimerRef.current);
        slowTimerRef.current = null;
      }
    }

    return () => {
      if (slowTimerRef.current) {
        clearTimeout(slowTimerRef.current);
        slowTimerRef.current = null;
      }
    };
  }, [isFetching, hasStatusFilter]);

  useEffect(() => {
    // Track elapsed scan time and auto-pause after a hard timeout, to avoid "infinite pending".
    if (!hasStatusFilter || !scanEnabled || !isFetching) {
      if (statusScanTimerRef.current) {
        clearTimeout(statusScanTimerRef.current);
        statusScanTimerRef.current = null;
      }
      if (scanTickRef.current) {
        clearInterval(scanTickRef.current);
        scanTickRef.current = null;
      }
      scanStartedAtRef.current = null;
      setScanElapsedSec(0);
      return;
    }

    if (!scanStartedAtRef.current) {
      scanStartedAtRef.current = Date.now();
    }

    statusScanTimerRef.current = setTimeout(() => {
      queryClient.cancelQueries({ queryKey, exact: true });
      setScanPausedReason('timeout');
    }, STATUS_SCAN_TIMEOUT_MS);

    scanTickRef.current = setInterval(() => {
      const startedAt = scanStartedAtRef.current;
      if (!startedAt) return;
      setScanElapsedSec(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => {
      if (statusScanTimerRef.current) {
        clearTimeout(statusScanTimerRef.current);
        statusScanTimerRef.current = null;
      }
      if (scanTickRef.current) {
        clearInterval(scanTickRef.current);
        scanTickRef.current = null;
      }
    };
  }, [hasStatusFilter, scanEnabled, isFetching, queryClient, queryKey]);

  const handlePreviousPageClick = useCallback(() => {
    const { offset, limit } = paging;
    updatePaging({ offset: Math.max(0, offset - limit) });
  }, [paging, updatePaging]);

  const handleNextPageClick = useCallback(() => {
    const { offset, limit } = paging;
    updatePaging({ offset: offset + limit });
  }, [paging, updatePaging]);

  const hideDappFilter = Boolean(sourceAddress);

  return (
    <div>
      <MobileFilterToolbar
        className="flex md:hidden"
        chains={chains}
        hideDappFilter={hideDappFilter}
      />
      <DesktopFilterToolbar
        className="hidden md:flex"
        chains={chains}
        hideDappFilter={hideDappFilter}
      />
      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-in-out',
          hasStatusFilter && (isSlowLoading || scanPausedReason)
            ? 'grid-rows-[1fr]'
            : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          <div
            role="status"
            aria-live="polite"
            aria-atomic="false"
            className="border-border/50 bg-card mb-2 flex items-center gap-2 rounded-xl border px-4 py-3"
          >
            {scanPausedReason ? (
              <PauseCircle className="text-muted-foreground h-4 w-4 shrink-0" />
            ) : (
              <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
            )}
            <span className="text-muted-foreground flex-1 text-sm">
              {scanPausedReason === 'timeout'
                ? 'Scan paused (timeout). Showing partial results.'
                : scanPausedReason === 'user'
                  ? 'Scan paused. Showing partial results.'
                  : `Scanning messages by status filter — this may take a moment…${scanElapsedSec ? ` (${scanElapsedSec}s)` : ''}`}
            </span>
            {scanPausedReason ? (
              <button
                type="button"
                className="shrink-0 rounded border border-border px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                onClick={handleResumeStatusScan}
              >
                Resume
              </button>
            ) : (
              <button
                type="button"
                className="shrink-0 rounded border border-border px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                onClick={handleCancelStatusScan}
              >
                Pause
              </button>
            )}
          </div>
        </div>
      </div>
      {isError && !hasRealData && !isFetching && (
        <div className="mb-3 flex items-center justify-between gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3">
          <span className="text-sm text-destructive">Failed to load messages. Please try again.</span>
          <button
            type="button"
            className="shrink-0 rounded border border-destructive/40 px-2 py-0.5 text-xs text-destructive transition-colors hover:border-destructive/60 hover:bg-destructive/10"
            onClick={() => queryClient.invalidateQueries({ queryKey })}
          >
            Retry
          </button>
        </div>
      )}
      <DataTable
        loading={isFetching}
        network={network}
        dataSource={dataSource}
        pageSize={paging.limit}
        offset={paging.offset}
        onPreviousPageClick={handlePreviousPageClick}
        onNextPageClick={handleNextPageClick}
        onResetFilters={handleReset}
      />
    </div>
  );
};

export default memo(MessagePortTable);
