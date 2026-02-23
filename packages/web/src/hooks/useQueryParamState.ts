'use client';

import {
  useQueryStates,
  parseAsString,
  parseAsInteger,
  parseAsArrayOf,
  parseAsIsoDateTime
} from 'nuqs';

import type { DAppConfigKeys } from '@/utils';

const queryStateOptions = {
  history: 'replace' as const,
  shallow: true as const
};

const queryParsers = {
  fromDapp: parseAsArrayOf(parseAsString).withOptions(queryStateOptions),
  status: parseAsArrayOf(parseAsInteger).withOptions(queryStateOptions),
  dateFrom: parseAsIsoDateTime.withOptions(queryStateOptions),
  dateTo: parseAsIsoDateTime.withOptions(queryStateOptions),
  fromChainId: parseAsArrayOf(parseAsInteger).withOptions(queryStateOptions),
  toChainId: parseAsArrayOf(parseAsInteger).withOptions(queryStateOptions)
};

const useQueryParamState = () => {
  const [queryState, setQueryState] = useQueryStates(queryParsers);

  const setSelectedDapps = (value: DAppConfigKeys[] | null) => {
    setQueryState({ fromDapp: value });
  };
  const setSelectedSourceChains = (value: number[] | null) => {
    setQueryState({ fromChainId: value });
  };
  const setSelectedTargetChains = (value: number[] | null) => {
    setQueryState({ toChainId: value });
  };
  const setSelectedStatuses = (value: number[] | null) => {
    setQueryState({ status: value });
  };
  const setDateFrom = (value: Date | null) => {
    setQueryState({ dateFrom: value });
  };
  const setDateTo = (value: Date | null) => {
    setQueryState({ dateTo: value });
  };
  const setDateRange = (from: Date | null, to: Date | null) => {
    setQueryState({ dateFrom: from, dateTo: to });
  };

  return {
    selectedDapps: (queryState.fromDapp as DAppConfigKeys[]) ?? [],
    selectedStatuses: queryState.status ?? [],
    dateFrom: queryState.dateFrom ?? undefined,
    dateTo: queryState.dateTo ?? undefined,
    selectedSourceChains: queryState.fromChainId ?? [],
    selectedTargetChains: queryState.toChainId ?? [],
    setSelectedDapps,
    setSelectedStatuses,
    setDateFrom,
    setDateTo,
    setDateRange,
    setSelectedSourceChains,
    setSelectedTargetChains
  };
};
export default useQueryParamState;
