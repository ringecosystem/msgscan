import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import SelectedLabels from '@/components/selected-labels';
import { shouldShowAllOption } from '@/components/data-table/filter-option-policy';

import useChainFilterLogic from '../hooks/useChainFilterLogic';

import {
  FILTER_TRIGGER_BASE_CLASSNAME,
  FILTER_TRIGGER_FOCUS_CLASSNAME
} from './filterTriggerStyles';

import type { TableFilterOption } from '@/types/helper';

interface TableChainFilterProps {
  options: TableFilterOption[];
  value: number[];
  onChange: (newValue: number[]) => void;
  title: React.ReactNode;
  limit: number;
  buttonClassName?: string;
  contentClassName?: string;
}

const TableChainFilter = ({
  options,
  value,
  onChange,
  title,
  limit,
  buttonClassName,
  contentClassName
}: TableChainFilterProps) => {
  const [open, setOpen] = useState(false);
  const optionFocusClassName =
    'focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50';
  const actionFocusClassName =
    'focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50';
  const showAllOption = shouldShowAllOption(options.length);
  const { sortedOptions, toggleItem, handleSelectAll } = useChainFilterLogic({
    options,
    value,
    onChange,
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

  return (
    <Popover onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={cn(
              FILTER_TRIGGER_BASE_CLASSNAME,
              FILTER_TRIGGER_FOCUS_CLASSNAME,
              buttonClassName
            )}
          />
        }
      >
        <span className="shrink-0 text-secondary-foreground">{title}:</span>
        <div className="flex items-center gap-[0.31rem]">
          <SelectedLabels options={options} value={value} />
          <ChevronDown
            size={16}
            strokeWidth={1.5}
            className={cn('transform transition-transform duration-200', open ? 'rotate-180' : 'rotate-0')}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={cn('gap-0 p-0 text-xs text-secondary-foreground flex flex-col', contentClassName)}
        align="start"
      >
        {showAllOption && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between px-[1.25rem] py-[0.62rem]">
              <button
                type="button"
                onClick={handleSelectAll}
                  className={cn(
                    'rounded-sm px-0.5 py-0.5 text-sm transition-colors duration-200',
                    optionFocusClassName,
                    clearActionDisabled
                      ? 'cursor-default text-muted-foreground'
                      : 'cursor-pointer text-foreground hover:opacity-80 hover:bg-muted/50'
                  )}
                disabled={clearActionDisabled}
              >
                {clearActionLabel}
              </button>
              <span>{selectionSummary}</span>
            </div>
            <Separator />
          </div>
        )}
        <div className="flex flex-col gap-1 px-[1.25rem] pt-1 pb-[1.25rem] lg:grid lg:grid-cols-3 lg:gap-1.5">
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
                  'flex items-center gap-[0.62rem] rounded-md px-1 py-[0.62rem] text-left transition-colors duration-200 hover:bg-muted/50',
                  optionFocusClassName,
                  isSelected && 'bg-accent hover:bg-accent/80',
                  isDisabled ? 'cursor-not-allowed opacity-40 hover:bg-transparent' : 'cursor-pointer'
                )}
                aria-pressed={isSelected}
                aria-disabled={isDisabled}
              >
                <Checkbox
                  checked={isSelected}
                  disabled={isDisabled}
                  className={cn('pointer-events-none', !isSelected && 'border-muted-foreground/40')}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    'text-sm',
                    isSelected ? 'font-medium text-foreground' : 'text-muted-foreground'
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
            <div className="px-[1.25rem] pb-1 text-xs text-secondary-foreground">
              {selectionSummary}
            </div>
            <Separator />
            <div className="p-2">
              <Button
                size="sm"
                className={cn(
                  'bg-card text-foreground hover:bg-card/80 hover:text-foreground/80 w-full border-none px-0 text-sm font-normal',
                  actionFocusClassName
                )}
                onClick={handleSelectAll}
                disabled={clearActionDisabled}
              >
                {clearActionLabel}
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default TableChainFilter;
