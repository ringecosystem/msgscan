'use client';

import {
  useQueryState,
  parseAsString,
  parseAsInteger,
  parseAsArrayOf,
  parseAsIsoDateTime
} from 'nuqs';

import type { DAppConfigKeys } from '@/utils';

const useUrlParams = () => {
  const [selectedDapps, setSelectedDapps] = useQueryState('dapp', parseAsArrayOf(parseAsString));
  const [selectedStatuses, setSelectedStatuses] = useQueryState(
    'status',
    parseAsArrayOf(parseAsInteger)
  );
  const [dateFrom, setDateFrom] = useQueryState('dateFrom', parseAsIsoDateTime);
  const [dateTo, setDateTo] = useQueryState('dateTo', parseAsIsoDateTime);
  const [selectedSourceChains, setSelectedSourceChains] = useQueryState(
    'sourceChain',
    parseAsArrayOf(parseAsInteger)
  );
  const [selectedTargetChains, setSelectedTargetChains] = useQueryState(
    'targetChain',
    parseAsArrayOf(parseAsInteger)
  );

  return {
    selectedDapps: (selectedDapps as DAppConfigKeys[]) ?? [],
    selectedStatuses: selectedStatuses ?? [],
    dateFrom: dateFrom ?? undefined,
    dateTo: dateTo ?? undefined,
    selectedSourceChains: selectedSourceChains ?? [],
    selectedTargetChains: selectedTargetChains ?? [],
    setSelectedDapps,
    setSelectedStatuses,
    setDateFrom,
    setDateTo,
    setSelectedSourceChains,
    setSelectedTargetChains
  };
};
export default useUrlParams;
