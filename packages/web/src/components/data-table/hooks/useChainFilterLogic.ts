import { useMemo, useCallback } from 'react';

import type { TableFilterOption } from '@/types/helper';

type UseChainFilterLogicType = {
  options: TableFilterOption[];
  value: number[];
  onChange: (newValue: number[]) => void;
  limit: number;
  normalizeFullSelectionToAll?: boolean;
};
function useChainFilterLogic({
  options,
  value,
  onChange,
  limit,
  normalizeFullSelectionToAll = true
}: UseChainFilterLogicType) {
  const sortedOptions = useMemo(() => {
    return [...options].sort((a, b) => (a?.label as string)?.localeCompare(b.label as string));
  }, [options]);

  const toggleItem = useCallback(
    (itemValue: number) => {
      // Empty value means "All" (no filter). Picking any option switches to custom filtering.
      if (value.length === 0) {
        onChange([itemValue]);
        return;
      }

      if (value.includes(itemValue)) {
        onChange(value.filter((s) => s !== itemValue));
        return;
      }

      if (value.length >= limit) return;

      const next = [...value, itemValue];
      // If user ends up selecting every option, normalize back to "All" to keep URL/state clean.
      if (normalizeFullSelectionToAll && limit > 0 && options.length === limit && next.length === limit) {
        onChange([]);
        return;
      }

      onChange(next);
    },
    [value, onChange, limit, options.length, normalizeFullSelectionToAll]
  );

  const handleSelectAll = useCallback(() => {
    // "All" is represented by an empty array.
    onChange([]);
  }, [onChange]);

  const checkedAll = useMemo(() => {
    return (
      value.length === 0 ||
      (normalizeFullSelectionToAll && options.length === limit && value.length === limit)
    );
  }, [value, limit, options.length, normalizeFullSelectionToAll]);

  const indeterminateAll = useMemo(() => {
    return !checkedAll && value.length > 0 && value.length < limit;
  }, [checkedAll, value.length, limit]);

  return {
    sortedOptions,
    toggleItem,
    handleSelectAll,
    checkedAll,
    indeterminateAll
  };
}

export default useChainFilterLogic;
