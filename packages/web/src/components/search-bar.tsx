'use client';
import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useId,
  Suspense
} from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { fetchMessageDetail } from '@/graphql/services';
import { getChainsByNetwork, getNetwork } from '@/utils/network';
import { useNetworkFromQuery } from '@/hooks/useNetwork';
import { REFRESH_INTERVAL } from '@/config/site';
import { Network } from '@/types/network';

import { Input } from './ui/input';

import type { CHAIN } from '@/types/chains';
import type {
  ChangeEventHandler,
  FormEventHandler} from 'react';

const SEARCH_TIMEOUT_MS = 60_000;
const SEARCH_KEYWORD_PATTERN = /^0x[a-f0-9]{10,}$/i;

export function isValidSearchKeyword(value: string): boolean {
  return SEARCH_KEYWORD_PATTERN.test(value.trim());
}

export function sleep(ms: number, signal?: AbortSignal) {
  if (ms <= 0) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const onAbort = () => {
      clearTimeout(timer);
      signal?.removeEventListener('abort', onAbort);
      reject(new DOMException('The operation was aborted.', 'AbortError'));
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);

    if (!signal) return;

    if (signal.aborted) {
      onAbort();
      return;
    }

    signal.addEventListener('abort', onAbort, { once: true });
  });
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

export const fetchMessageWithDelay = async (id: string, chains: CHAIN[], signal?: AbortSignal) => {
  try {
    let result = await fetchMessageDetail(id, chains, signal);
    if (!result) {
      const fallbackChains = chains.some((chain) => chain.testnet)
        ? getChainsByNetwork(Network.MAINNET)
        : getChainsByNetwork(Network.TESTNET);
      if (fallbackChains.length > 0) {
        result = await fetchMessageDetail(id, fallbackChains, signal);
      }
    }
    return result;
  } catch (error) {
    if (isAbortError(error)) {
      return null;
    }
    throw error;
  }
};

export function resolveMessageNetworkByChain(fromChainId: string | undefined, currentNetwork: string): Network {
  if (!fromChainId) {
    return getNetwork(currentNetwork);
  }
  const chainId = Number(fromChainId);
  if (!Number.isFinite(chainId)) return getNetwork(currentNetwork);

  const isTestnetChain = getChainsByNetwork(Network.TESTNET).some((item) => item.id === chainId);
  const isMainnetChain = getChainsByNetwork(Network.MAINNET).some((item) => item.id === chainId);
  if (!isTestnetChain && !isMainnetChain) return getNetwork(currentNetwork);

  return isTestnetChain ? Network.TESTNET : Network.MAINNET;
}

export function buildMessageDetailHref(
  keyword: string,
  fromChainId: string | undefined,
  currentNetwork: string
): string {
  const resolvedNetwork = resolveMessageNetworkByChain(fromChainId, currentNetwork);
  return `/message/${keyword}?network=${resolvedNetwork}`;
}

type SearchBarProps = {
  autoFocus?: boolean;
  onNavigate?: () => void;
};

export const SearchBar = ({ autoFocus = false, onNavigate }: SearchBarProps) => {
  const router = useRouter();
  const hasNavigatedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchFeedbackId = useId();

  const network = useNetworkFromQuery();

  // Focus search input when "/" is pressed (outside of other inputs)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [keyword, setKeyword] = useState<string>('');
  const [submitKeyword, setSubmitKeyword] = useState<string>('');
  const [searchDeadline, setSearchDeadline] = useState<number | null>(null);
  const [hasSearchTimedOut, setHasSearchTimedOut] = useState(false);

  const isErrorMessage = Boolean(submitKeyword && !isValidSearchKeyword(submitKeyword));

  const handleKeywordChange = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
    setKeyword(e.target.value);
    hasNavigatedRef.current = false;
    setHasSearchTimedOut(false);
    setSubmitKeyword('');
    setSearchDeadline(null);
  }, []);

  const handleClearKeyword = useCallback(() => {
    setKeyword('');
    setSubmitKeyword('');
    setSearchDeadline(null);
    setHasSearchTimedOut(false);
    hasNavigatedRef.current = false;
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault();
      const trimmed = keyword.trim();
      if (!trimmed) return;
      if (!isValidSearchKeyword(trimmed)) {
        hasNavigatedRef.current = false;
        setHasSearchTimedOut(false);
        setSearchDeadline(null);
        setSubmitKeyword(trimmed);
        toast.error('Please enter a valid Msg ID or Tx Hash.');
        return;
      }
      hasNavigatedRef.current = false;
      setHasSearchTimedOut(false);
      setSearchDeadline(Date.now() + SEARCH_TIMEOUT_MS);
      setSubmitKeyword(trimmed);
    },
    [keyword]
  );

  const { data, isFetching } = useQuery({
    queryKey: ['messageSearch', submitKeyword, network],
    queryFn: async ({ signal }) =>
      fetchMessageWithDelay(submitKeyword, getChainsByNetwork(network), signal),
    enabled: Boolean(submitKeyword) && !isErrorMessage,
    refetchOnWindowFocus: false,
    refetchInterval(query) {
      if (searchDeadline && Date.now() >= searchDeadline) {
        return false;
      }
      return query?.state?.data?.msgId ? undefined : REFRESH_INTERVAL;
    }
  });

  useEffect(() => {
    if (!submitKeyword || !searchDeadline || hasNavigatedRef.current || data?.msgId) {
      return;
    }

    const remain = searchDeadline - Date.now();
    if (remain <= 0) {
      setHasSearchTimedOut(true);
      setSubmitKeyword('');
      setSearchDeadline(null);
      toast.info('Search timed out. Please try again later.');
      return;
    }

    const timer = setTimeout(() => {
      setHasSearchTimedOut(true);
      setSubmitKeyword('');
      setSearchDeadline(null);
      toast.info('Search timed out. Please try again later.');
    }, remain);

    return () => {
      clearTimeout(timer);
    };
  }, [data, searchDeadline, submitKeyword]);

  useEffect(() => {
    if (!submitKeyword) return;
    const id = data?.msgId;
    if (!id) return;
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;

    const href = buildMessageDetailHref(submitKeyword, data.fromChainId, network);
    setKeyword('');
    setSubmitKeyword('');
    setSearchDeadline(null);
    setHasSearchTimedOut(false);
    onNavigate?.();
    router.push(href);
  }, [data, network, onNavigate, router, submitKeyword]);

  const assistiveFeedback = isErrorMessage
    ? 'Please enter a valid Msg ID or Tx Hash.'
    : hasSearchTimedOut
      ? 'Search timed out. Please retry.'
      : isFetching
        ? 'Searching by message ID or transaction hash.'
        : '';

  return (
    <div className="w-full max-w-md">
      <form className="relative" onSubmit={handleSubmit}>
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          name="search"
          placeholder="Search by Msg ID or Tx Hash"
          className="h-9 w-full rounded-lg border-border/50 bg-muted/50 pl-9 pr-24 text-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
          value={keyword}
          onChange={handleKeywordChange}
          autoComplete="off"
          autoFocus={autoFocus}
          spellCheck={false}
          enterKeyHint="search"
          aria-label="Search by message ID or transaction hash"
          aria-invalid={isErrorMessage}
          aria-describedby={assistiveFeedback ? searchFeedbackId : undefined}
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
          {keyword ? (
            <button
              type="button"
              onClick={handleClearKeyword}
              className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Clear search input"
            >
              <X className="size-4" />
            </button>
          ) : null}
          {isFetching ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          ) : !keyword ? (
            <kbd
              className="pointer-events-none hidden items-center justify-center rounded-md border border-border bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium leading-none text-muted-foreground md:inline-flex"
              aria-label="Press slash key to focus search"
              title="Press / to focus"
            >
              /
            </kbd>
          ) : null}
        </div>
        {assistiveFeedback ? (
          <p
            id={searchFeedbackId}
            role={isErrorMessage ? 'alert' : 'status'}
            aria-live={isErrorMessage ? 'assertive' : 'polite'}
            className="sr-only"
          >
            {assistiveFeedback}
          </p>
        ) : null}
      </form>
    </div>
  );
};

const SearchBarWrapper = ({ autoFocus = false, onNavigate }: SearchBarProps) => {
  return (
    <Suspense fallback={<div className="h-9 w-full max-w-md" />}>
      <SearchBar autoFocus={autoFocus} onNavigate={onNavigate} />
    </Suspense>
  );
};
export default SearchBarWrapper;
