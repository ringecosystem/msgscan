import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import useQueryParamState from '@/hooks/useQueryParamState';

import type { DateRange } from 'react-day-picker';
import type { DAppConfigKeys } from '@/utils';

function useFilter() {
  const queryClient = useQueryClient();

  const {
    setSelectedDapps,
    setSelectedStatuses,
    setDateFrom,
    setDateTo,
    setSelectedSourceChains,
    setSelectedTargetChains
  } = useQueryParamState();

  const handleDappChange = useCallback(
    (newDapps: DAppConfigKeys[]) => {
      queryClient.resetQueries({
        queryKey: ['messagePort']
      });
      setSelectedDapps(newDapps);
    },
    [setSelectedDapps, queryClient]
  );

  const handleStatusChange = useCallback(
    (newStatuses: number[]) => {
      queryClient.resetQueries({
        queryKey: ['messagePort']
      });
      setSelectedStatuses(newStatuses);
    },
    [setSelectedStatuses, queryClient]
  );

  const handleDateChange = useCallback(
    (newDate: DateRange) => {
      queryClient.resetQueries({
        queryKey: ['messagePort']
      });
      setDateFrom(newDate?.from ?? null);
      setDateTo(newDate?.to ?? null);
    },
    [setDateFrom, setDateTo, queryClient]
  );

  const handleSourceChainChange = useCallback(
    (newSourceChains: number[]) => {
      queryClient.resetQueries({
        queryKey: ['messagePort']
      });
      setSelectedSourceChains(newSourceChains);
    },
    [setSelectedSourceChains, queryClient]
  );

  const handleTargetChainChange = useCallback(
    (newTargetChains: number[]) => {
      queryClient.resetQueries({
        queryKey: ['messagePort']
      });
      setSelectedTargetChains(newTargetChains);
    },
    [setSelectedTargetChains, queryClient]
  );

  const handleReset = useCallback(() => {
    queryClient.resetQueries({
      queryKey: ['messagePort']
    });
    setSelectedDapps(null);
    setSelectedStatuses(null);
    setSelectedSourceChains(null);
    setSelectedTargetChains(null);
    setDateFrom(null);
    setDateTo(null);
  }, [
    setSelectedDapps,
    setDateFrom,
    setDateTo,
    setSelectedSourceChains,
    setSelectedStatuses,
    setSelectedTargetChains,
    queryClient
  ]);

  const handleResetStatus = useCallback(() => {
    queryClient.resetQueries({
      queryKey: ['messagePort']
    });
    setSelectedStatuses([]);
  }, [setSelectedStatuses, queryClient]);

  const handleResetDapps = useCallback(() => {
    queryClient.resetQueries({
      queryKey: ['messagePort']
    });
    setSelectedDapps([]);
  }, [setSelectedDapps, queryClient]);

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
