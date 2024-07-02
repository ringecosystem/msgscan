import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { TableFilterOption } from '@/types/helper';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import SelectedLabels from '@/components/selected-labels';
import useChainFilterLogic from '../hooks/useChainFilterLogic';

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
  const { sortedOptions, toggleItem, handleSelectAll, checkedAll } = useChainFilterLogic({
    options,
    value,
    onChange,
    limit
  });

  return (
    <Popover onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'flex items-center gap-[0.31rem] border-none text-sm font-normal',
            buttonClassName
          )}
        >
          <span className="text-secondary-foreground">{title}:</span>
          <div className="flex items-center gap-[0.31rem]">
            <SelectedLabels options={options} value={value} />
            <ChevronDown
              size={16}
              strokeWidth={1.5}
              className={cn('transform transition-transform', open ? 'rotate-180' : 'rotate-0')}
            />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn('p-0 text-xs text-secondary-foreground', contentClassName)}
        align="end"
      >
        <div className="flex items-center justify-between px-[1.25rem] py-[0.62rem]">
          <div className="flex items-center gap-[0.62rem]" onClick={handleSelectAll}>
            <Checkbox checked={checkedAll}></Checkbox>
            <label
              className={cn(
                'cursor-pointer',
                checkedAll ? 'text-foreground' : 'text-secondary-foreground'
              )}
            >
              All
            </label>
          </div>
          <span>
            {value.length || '0'} / {limit} Selected
          </span>
        </div>
        <Separator />
        <div className="flex flex-col px-[1.25rem] lg:grid lg:grid-cols-3">
          {sortedOptions.map(({ value: optionValue, label }) => {
            const isSelected = value.includes(optionValue);
            return (
              <div
                key={optionValue}
                onClick={() => toggleItem(optionValue)}
                className={cn(
                  'flex items-center gap-[0.62rem] py-[0.62rem]',
                  value.length < limit || isSelected ? 'cursor-pointer' : 'cursor-not-allowed'
                )}
              >
                <Checkbox
                  checked={isSelected}
                  disabled={value.length === limit && !isSelected}
                ></Checkbox>
                <label
                  className={cn(
                    'cursor-pointer',
                    isSelected ? 'text-foreground' : 'text-secondary-foreground'
                  )}
                >
                  {label}
                </label>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TableChainFilter;
