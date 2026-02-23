import { useState, useEffect } from 'react';

import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { shouldShowAllOption } from '@/components/data-table/filter-option-policy';

import useChainFilterLogic from '../hooks/useChainFilterLogic';

import type { TableFilterOption } from '@/types/helper';

interface TableChainFilterProps {
  options: TableFilterOption[];
  value: number[];
  onChange: (newValue: number[]) => void;
  limit: number;
  title?: string;
}

const TableChainFilter = ({ options, value: valueProp, onChange, limit, title }: TableChainFilterProps) => {
  // Local state for immediate visual feedback, avoiding nuqs startTransition flicker
  const [value, setValue] = useState<number[]>(valueProp);

  useEffect(() => {
    setValue(valueProp);
  }, [valueProp]);

  const handleChange = (newValue: number[]) => {
    setValue(newValue);
    onChange(newValue);
  };
  const optionFocusClassName =
    'focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50';
  const actionFocusClassName =
    'focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50';
  const showAllOption = shouldShowAllOption(options.length);

  const { sortedOptions, toggleItem, handleSelectAll } = useChainFilterLogic({
    options,
    value,
    onChange: handleChange,
    limit,
    normalizeFullSelectionToAll: false
  });
  const isNoFilter = value.length === 0;
  const isAllChecked = limit > 0 && value.length === limit;
  const clearActionDisabled = isNoFilter;
  const clearActionLabel = isNoFilter ? 'No filter (All)' : 'Clear to All';
  const selectionSummary = isNoFilter
    ? 'No filter'
    : isAllChecked
      ? 'All selected'
      : `${value.length} / ${limit} Selected`;
  const regionAriaLabel = title ? `${title} chain filter options` : 'Chain filter options';

  return (
    <div
      role="region"
      aria-label={regionAriaLabel}
      className="w-full bg-background"
    >
      {showAllOption && (
        <>
          <div className="flex items-center justify-between py-[0.62rem]">
            <button
              type="button"
              onClick={handleSelectAll}
              className={cn(
                'rounded-sm px-0.5 py-0.5 text-sm',
                optionFocusClassName,
                clearActionDisabled
                  ? 'cursor-default text-muted-foreground'
                  : 'cursor-pointer text-foreground hover:opacity-80'
              )}
              disabled={clearActionDisabled}
            >
              {clearActionLabel}
            </button>
            <span className="text-sm text-secondary-foreground">{selectionSummary}</span>
          </div>
          <Separator />
        </>
      )}
      <div className="flex flex-col">
        {sortedOptions.map(({ value: optionValue, label }) => {
          const isSelected = value.includes(optionValue as number);
          const isDisabled = value.length === limit && !isSelected;
          return (
            <button
              type="button"
              key={optionValue}
              onClick={() => toggleItem(optionValue as number)}
              disabled={isDisabled}
              className={cn(
                'flex h-[3.125rem] items-center gap-[0.62rem] rounded-sm text-left transition-colors duration-200',
                optionFocusClassName,
                isDisabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
              )}
              aria-pressed={isSelected}
              aria-disabled={isDisabled}
            >
              <Checkbox
                checked={isSelected}
                disabled={isDisabled}
                className="pointer-events-none"
                aria-hidden="true"
              />
              <span
                className={cn(
                  'text-sm font-medium',
                  isSelected ? 'text-foreground' : 'text-secondary-foreground'
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
      {!showAllOption && (
        <>
          <div className="pb-1 text-xs text-secondary-foreground">
            {selectionSummary}
          </div>
          <Separator />
          <Button
            size="sm"
            className={cn(
              'bg-card text-foreground hover:bg-card/80 hover:text-foreground/80 mt-5 w-full border-none px-0 text-sm font-normal',
              actionFocusClassName
            )}
            onClick={handleSelectAll}
            disabled={clearActionDisabled}
          >
            {clearActionLabel}
          </Button>
        </>
      )}
    </div>
  );
};

export default TableChainFilter;
