import { TableFilterOption } from '@/types/helper';
import { CheckedState } from '@radix-ui/react-checkbox';
import { useMemo, useCallback } from 'react';

type UseChainFilterLogicType = {
  options: TableFilterOption[];
  value: number[];
  onChange: (newValue: number[]) => void;
  limit: number;
};
function useChainFilterLogic({ options, value, onChange, limit }: UseChainFilterLogicType) {
  const sortedOptions = useMemo(() => {
    return [...options].sort((a, b) => (a?.label as string)?.localeCompare(b.label as string));
  }, [options]);

  const toggleItem = useCallback(
    (itemValue: number) => {
      if (value.length >= limit && !value.includes(itemValue)) {
        return;
      }
      if (value.includes(itemValue)) {
        onChange(value.filter((s) => s !== itemValue));
      } else {
        onChange([...value, itemValue]);
      }
    },
    [value, onChange, limit]
  );

  const handleSelectAll = useCallback(() => {
    if (value.length === limit) {
      onChange([]);
    } else {
      const newValue = new Set(value);
      for (const option of sortedOptions) {
        if (newValue.size >= limit) break;
        newValue.add(option.value);
      }
      onChange(Array.from(newValue));
    }
  }, [value, onChange, limit, sortedOptions]);

  const checkedAll = useMemo<CheckedState>(() => {
    if (value.length === limit) return true;
    if (value.length !== 0) return 'indeterminate';
    return false;
  }, [value, limit]);

  return {
    sortedOptions,
    toggleItem,
    handleSelectAll,
    checkedAll
  };
}

export default useChainFilterLogic;
