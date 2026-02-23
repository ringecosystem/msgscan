import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { shouldShowAllOption } from '@/components/data-table/filter-option-policy';

import type { TableFilterOption } from '@/types/helper';

interface TableMultiSelectFilterProps<T> {
  options: TableFilterOption[];
  value: T[];
  onChange: (newValue: T[]) => void;
  onClearFilters?: () => void;
  showAllOption?: boolean;
  title?: string;
}

const TableMultiSelectFilter = <T extends number | string>({
  options,
  value: valueProp,
  onChange,
  onClearFilters,
  showAllOption,
  title
}: TableMultiSelectFilterProps<T>) => {
  // Local state for immediate visual feedback, avoiding nuqs startTransition flicker
  const [value, setValue] = useState<T[]>(valueProp);

  useEffect(() => {
    setValue(valueProp);
  }, [valueProp]);

  const handleChange = (newValue: T[]) => {
    setValue(newValue);
    onChange(newValue);
  };

  const handleClearWithLocal = () => {
    setValue([]);
    if (onClearFilters) {
      onClearFilters();
    } else {
      onChange([]);
    }
  };
  const optionFocusClassName = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50';
  const actionFocusClassName =
    'focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50';
  const safeValue = value ?? [];
  const groupAriaLabel = title ? `${title} filter options` : 'Filter options';

  const toggleItem = (itemValue: T) => {
    const next = safeValue.includes(itemValue)
      ? safeValue.filter((s) => s !== itemValue)
      : [...safeValue, itemValue];
    handleChange(next);
  };

  const isAllSelected = safeValue.length === 0;
  const resolvedShowAllOption = showAllOption ?? shouldShowAllOption(options.length);
  const clearActionDisabled = isAllSelected;

  return (
    <>
      <div
        role="group"
        aria-label={groupAriaLabel}
        className="bg-background w-full"
      >
        {resolvedShowAllOption && (
          <>
            <div className="flex items-center justify-between py-[0.62rem] text-xs text-secondary-foreground">
              <button
                type="button"
                onClick={handleClearWithLocal}
                disabled={clearActionDisabled}
                className={cn(
                  'rounded-sm px-0.5 py-0.5 text-sm',
                  optionFocusClassName,
                  clearActionDisabled
                    ? 'cursor-default text-muted-foreground'
                    : 'cursor-pointer text-foreground hover:opacity-80'
                )}
              >
                {isAllSelected ? 'No filter (All)' : 'Clear to All'}
              </button>
              <span>{isAllSelected ? 'No filter' : `${safeValue.length} / ${options.length} Selected`}</span>
            </div>
            <Separator />
          </>
        )}
        {options.map(({ value: optionValue, label }) => {
          const isSelected = safeValue.includes(optionValue as T);
          return (
            <button
              type="button"
              key={optionValue}
              onClick={() => toggleItem(optionValue as T)}
              role="checkbox"
              aria-checked={isSelected}
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-2 py-[0.62rem] text-left transition-colors duration-200',
                optionFocusClassName,
                isSelected && 'bg-accent'
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
                  'text-sm font-medium',
                  isSelected ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
        {!resolvedShowAllOption && onClearFilters && (
          <Button
            size="sm"
            className={cn(
              'bg-card text-foreground hover:bg-card/80 hover:text-foreground/80 mt-5 w-full border-none px-0 text-sm font-normal',
              actionFocusClassName
            )}
            onClick={handleClearWithLocal}
            disabled={clearActionDisabled}
          >
            {isAllSelected ? 'No filter (All)' : 'Clear to All'}
          </Button>
        )}
      </div>
    </>
  );
};

export default TableMultiSelectFilter;
