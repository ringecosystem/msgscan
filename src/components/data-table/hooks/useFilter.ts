import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import useFilterStore from '@/store/filter';

import type { DateRange } from 'react-day-picker';
import type { DAppConfigKeys } from '@/utils';

function useFilter() {
  const queryClient = useQueryClient();

  const {
    selectedDapps,
    selectedStatuses,
    date,
    selectedSourceChains,
    selectedTargetChains,
    setSelectedDapps,
    setSelectedStatuses,
    setDate,
    setSelectedSourceChains,
    setSelectedTargetChains
  } = useFilterStore((state) => ({
    selectedDapps: state.selectedDapps,
    selectedStatuses: state.selectedStatuses,
    date: state.date,
    selectedSourceChains: state.selectedSourceChains,
    selectedTargetChains: state.selectedTargetChains,
    setSelectedDapps: state.setSelectedDapps,
    setSelectedStatuses: state.setSelectedStatuses,
    setDate: state.setDate,
    setSelectedSourceChains: state.setSelectedSourceChains,
    setSelectedTargetChains: state.setSelectedTargetChains
  }));

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
      setDate(newDate);
    },
    [setDate, queryClient]
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
    setSelectedDapps([]);
    setSelectedStatuses([]);
    setSelectedSourceChains([]);
    setSelectedTargetChains([]);
    setDate({ from: undefined, to: undefined });
  }, [
    setSelectedDapps,
    setDate,
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
    selectedDapps,
    selectedStatuses,
    date,
    selectedSourceChains,
    selectedTargetChains,
    handleDappChange,
    handleStatusChange,
    handleDateChange,
    handleSourceChainChange,
    handleTargetChainChange,
    handleReset,
    handleResetStatus,
    handleResetDapps,
    setDate
  };
}

export default useFilter;
