import { create } from 'zustand';

import type { DateRange } from 'react-day-picker';
import type { DAppConfigKeys } from '@/utils';

export type State = {
  selectedDapps: DAppConfigKeys[];
  selectedStatuses: number[];
  date: DateRange | undefined;
  selectedSourceChains: number[];
  selectedTargetChains: number[];
};
export type Action = {
  setSelectedDapps: (dapps: DAppConfigKeys[]) => void;
  setSelectedStatuses: (status: number[]) => void;
  setDate: (date: DateRange | undefined) => void;
  setSelectedSourceChains: (chains: number[]) => void;
  setSelectedTargetChains: (chains: number[]) => void;
  reset: () => void;
};

const useFilterStore = create<State & Action>((set) => ({
  selectedDapps: [],
  selectedStatuses: [],
  date: { from: undefined, to: undefined },
  selectedSourceChains: [],
  selectedTargetChains: [],
  setSelectedDapps: (dapps) => set({ selectedDapps: dapps }),
  setSelectedStatuses: (status) => set({ selectedStatuses: status }),
  setDate: (date) => set({ date }),
  setSelectedSourceChains: (chains) => set({ selectedSourceChains: chains }),
  setSelectedTargetChains: (chains) => set({ selectedTargetChains: chains }),
  reset: () =>
    set({
      selectedStatuses: [],
      date: { from: undefined, to: undefined },
      selectedSourceChains: [],
      selectedTargetChains: []
    })
}));

export default useFilterStore;
