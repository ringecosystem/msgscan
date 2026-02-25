import { useCallback } from 'react';

import useQueryParamState from '@/hooks/useQueryParamState';

import type { DateRange } from 'react-day-picker';
import type { DAppConfigKeys } from '@/utils';

function useFilter() {
  const {
    setSelectedDapps,
    setSelectedStatuses,
    setDateRange,
    setSelectedSourceChains,
    setSelectedTargetChains
  } = useQueryParamState();

  const handleDappChange = useCallback(
    (newDapps: DAppConfigKeys[]) => {
      // Empty array means "All" (no filter) -> remove query param to keep URL clean.
      setSelectedDapps(newDapps.length ? newDapps : null);
    },
    [setSelectedDapps]
  );

  const handleStatusChange = useCallback(
    (newStatuses: number[]) => {
      // Empty array means "All" (no filter) -> remove query param to keep URL clean.
      setSelectedStatuses(newStatuses.length ? newStatuses : null);
    },
    [setSelectedStatuses]
  );

  const handleDateChange = useCallback(
    (newDate: DateRange) => {
      setDateRange(newDate?.from ?? null, newDate?.to ?? null);
    },
    [setDateRange]
  );

  const handleSourceChainChange = useCallback(
    (newSourceChains: number[]) => {
      // Empty array means "All" (no filter) -> remove query param to keep URL clean.
      setSelectedSourceChains(newSourceChains.length ? newSourceChains : null);
    },
    [setSelectedSourceChains]
  );

  const handleTargetChainChange = useCallback(
    (newTargetChains: number[]) => {
      // Empty array means "All" (no filter) -> remove query param to keep URL clean.
      setSelectedTargetChains(newTargetChains.length ? newTargetChains : null);
    },
    [setSelectedTargetChains]
  );

  const handleReset = useCallback(() => {
    setSelectedDapps(null);
    setSelectedStatuses(null);
    setSelectedSourceChains(null);
    setSelectedTargetChains(null);
    setDateRange(null, null);
  }, [
    setSelectedDapps,
    setDateRange,
    setSelectedSourceChains,
    setSelectedStatuses,
    setSelectedTargetChains
  ]);

  const handleResetStatus = useCallback(() => {
    setSelectedStatuses(null);
  }, [setSelectedStatuses]);

  const handleResetDapps = useCallback(() => {
    setSelectedDapps(null);
  }, [setSelectedDapps]);

  return {
    handleDappChange,
    handleStatusChange,
    handleDateChange,
    handleSourceChainChange,
    handleTargetChainChange,
    handleReset,
    handleResetStatus,
    handleResetDapps
  };
}

export default useFilter;
