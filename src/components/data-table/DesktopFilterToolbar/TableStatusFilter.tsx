import SelectedLabels from '@/components/selected-labels';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { TableFilterOption } from '@/types/helper';
import { CheckIcon } from '@radix-ui/react-icons';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface TableStatusFilterProps {
  options: TableFilterOption[];
  value: number[];
  onChange: (newValue: number[]) => void;
  title: React.ReactNode;
  onClearFilters?: () => void;
  buttonClassName?: string;
  contentClassName?: string;
}

const TableStatusFilter = ({
  options,
  value,
  onChange,
  title,
  onClearFilters,
  buttonClassName,
  contentClassName
}: TableStatusFilterProps) => {
  const [open, setOpen] = useState(false);

  const toggleItem = (itemValue: number) => {
    if (value.includes(itemValue)) {
      onChange(value.filter((s) => s !== itemValue));
    } else {
      onChange([...value, itemValue]);
    }
  };

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
      <PopoverContent className={cn('p-0', contentClassName)} align="end">
        <Command>
          <CommandList>
            <CommandGroup className="p-0">
              {options.map(({ value: optionValue, label }) => {
                const isSelected = value.includes(optionValue);
                return (
                  <CommandItem
                    key={optionValue}
                    onSelect={() => toggleItem(optionValue)}
                    className="cursor-pointer px-[1.25rem] py-[0.62rem]"
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground [&_svg]:visible'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <CheckIcon className={cn('h-4 w-4', isSelected ? 'visible' : 'invisible')} />
                    </div>
                    <span
                      className={cn(
                        'text-sm',
                        isSelected ? 'text-foreground' : 'text-secondary-foreground'
                      )}
                    >
                      {label}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {value.length > 0 && (
              <>
                <CommandGroup>
                  <CommandItem
                    onSelect={onClearFilters}
                    className="cursor-pointer justify-center text-center text-sm text-secondary-foreground"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TableStatusFilter;
