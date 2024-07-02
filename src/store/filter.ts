import { DateRange } from 'react-day-picker';
import { create } from 'zustand';

export type State = {
  selectedStatuses: number[];
  date: DateRange | undefined;
  selectedSourceChains: number[];
  selectedTargetChains: number[];
};
export type Action = {
  setSelectedStatuses: (status: number[]) => void;
  setDate: (date: DateRange | undefined) => void;
  setSelectedSourceChains: (chains: number[]) => void;
  setSelectedTargetChains: (chains: number[]) => void;
};

const useFilterStore = create<State & Action>((set) => ({
  selectedStatuses: [],
  date: { from: undefined, to: undefined },
  selectedSourceChains: [],
  selectedTargetChains: [],
  setSelectedStatuses: (status) => set({ selectedStatuses: status }),
  setDate: (date) => set({ date }),
  setSelectedSourceChains: (chains) => set({ selectedSourceChains: chains }),
  setSelectedTargetChains: (chains) => set({ selectedTargetChains: chains })
}));

export default useFilterStore;
