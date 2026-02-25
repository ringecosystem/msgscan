import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';

import SelectedLabels from '@/components/selected-labels';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { shouldShowAllOption } from '@/components/data-table/filter-option-policy';

import {
  FILTER_TRIGGER_BASE_CLASSNAME,
  FILTER_TRIGGER_FOCUS_CLASSNAME
} from './filterTriggerStyles';

import type { TableFilterOption } from '@/types/helper';

interface TableMultiSelectFilterProps<T> {
  options: TableFilterOption[];
  value: T[];
  onChange: (newValue: T[]) => void;
  title: React.ReactNode;
  onClearFilters?: () => void;
  showAllOption?: boolean;
  buttonClassName?: string;
  contentClassName?: string;
}

const TableMultiSelectFilter = <T extends string | number>({
  options,
  value,
  onChange,
  title,
  onClearFilters,
  showAllOption,
  buttonClassName,
  contentClassName
}: TableMultiSelectFilterProps<T>) => {
  const [open, setOpen] = useState(false);
  const optionFocusClassName = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50';
  const actionFocusClassName =
    'focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50';
  const safeValue = value ?? [];
  const groupAriaLabel = typeof title === 'string' ? `${title} filter options` : 'Filter options';

  const toggleItem = (itemValue: T) => {
    if (safeValue.includes(itemValue)) {
      onChange(safeValue.filter((s) => s !== itemValue));
    } else {
      onChange([...safeValue, itemValue]);
    }
  };

  const handleClearToAll = () => {
    if (onClearFilters) {
      onClearFilters();
      return;
    }
    onChange([]);
  };

  const isAllSelected = safeValue.length === 0;
  const resolvedShowAllOption = showAllOption ?? shouldShowAllOption(options.length);
  const clearActionDisabled = isAllSelected;

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
          <SelectedLabels options={options} value={safeValue} />
          <ChevronDown
            size={16}
            strokeWidth={1.5}
            className={cn('transform transition-transform duration-200', open ? 'rotate-180' : 'rotate-0')}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className={cn('p-0', contentClassName)} align="start">
        <div role="group" aria-label={groupAriaLabel} className="p-0 flex flex-col">
          {resolvedShowAllOption && (
            <div className="flex flex-col">
              <div className="flex items-center justify-between px-[1.25rem] py-[0.62rem] text-xs text-secondary-foreground">
                <button
                  type="button"
                  onClick={handleClearToAll}
                  disabled={clearActionDisabled}
                  className={cn(
                    'rounded-sm px-0.5 py-0.5 text-left text-sm transition-colors duration-200',
                    optionFocusClassName,
                    clearActionDisabled
                      ? 'cursor-default text-muted-foreground'
                      : 'cursor-pointer text-foreground hover:opacity-80 hover:bg-muted/50'
                  )}
                >
                  {isAllSelected ? 'No filter (All)' : 'Clear to All'}
                </button>
                <span>{isAllSelected ? 'No filter' : `${safeValue.length} / ${options.length} Selected`}</span>
              </div>
              <Separator />
            </div>
          )}
          <div className="flex flex-col py-1">
            {options.map(({ value: optionValue, label }) => {
              const isSelected = safeValue.includes(optionValue as T);
              return (
                <button
                  type="button"
                  key={optionValue}
                  role="checkbox"
                  aria-checked={isSelected}
                  onClick={() => toggleItem(optionValue as T)}
                  className={cn(
                    'flex w-full cursor-pointer items-center gap-2 px-[1.25rem] py-[0.62rem] text-left transition-colors duration-200 hover:bg-muted/50',
                    optionFocusClassName,
                    isSelected && 'bg-accent hover:bg-accent/80'
                  )}
                >
                  <div
                    className={cn(
                      'mr-2 flex h-4 w-4 items-center justify-center rounded-[4px] border transition-colors duration-200',
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-input dark:bg-input/30'
                    )}
                  >
                    <Check className={cn('h-3.5 w-3.5 transition-transform duration-200', isSelected ? 'scale-100' : 'scale-0')} />
                  </div>
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
          {!resolvedShowAllOption && onClearFilters && (
            <>
              <Separator />
              <div className="p-2">
                <Button
                  size="sm"
                  className={cn(
                    'bg-card text-foreground hover:bg-card/80 hover:text-foreground/80 w-full border-none px-0 text-sm font-normal',
                    actionFocusClassName
                  )}
                  onClick={handleClearToAll}
                  disabled={clearActionDisabled}
                >
                  {isAllSelected ? 'No filter (All)' : 'Clear to All'}
                </Button>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TableMultiSelectFilter;
