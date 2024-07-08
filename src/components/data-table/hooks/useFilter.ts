import { useCallback } from 'react';
import useFilterStore from '@/store/filter';
import { DateRange } from 'react-day-picker';
import { DAppConfigKeys } from '@/utils';

function useFilter() {
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
      setSelectedDapps(newDapps);
    },
    [setSelectedDapps]
  );

  const handleStatusChange = useCallback(
    (newStatuses: number[]) => {
      setSelectedStatuses(newStatuses);
    },
    [setSelectedStatuses]
  );

  const handleDateChange = useCallback(
    (newDate: DateRange) => {
      setDate(newDate);
    },
    [setDate]
  );

  const handleSourceChainChange = useCallback(
    (newSourceChains: number[]) => {
      setSelectedSourceChains(newSourceChains);
    },
    [setSelectedSourceChains]
  );

  const handleTargetChainChange = useCallback(
    (newTargetChains: number[]) => {
      setSelectedTargetChains(newTargetChains);
    },
    [setSelectedTargetChains]
  );

  const handleReset = useCallback(() => {
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
    setSelectedTargetChains
  ]);

  const handleResetStatus = useCallback(() => {
    setSelectedStatuses([]);
  }, [setSelectedStatuses]);

  const handleResetDapps = useCallback(() => {
    setSelectedDapps([]);
  }, [setSelectedDapps]);
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
