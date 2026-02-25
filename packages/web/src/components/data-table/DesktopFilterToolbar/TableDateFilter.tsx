import { ChevronDown } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import {
  FILTER_TRIGGER_BASE_CLASSNAME,
  FILTER_TRIGGER_FOCUS_CLASSNAME
} from './filterTriggerStyles';

import type { DateRange } from 'react-day-picker';

interface TableDateFilterProps {
  date?: DateRange;
  onChange?: (date: DateRange) => void;
  buttonClassName?: string;
  contentClassName?: string;
}

const TableDateFilter = ({
  date,
  onChange,
  buttonClassName,
  contentClassName
}: TableDateFilterProps) => {
  const [open, setOpen] = useState(false);

  const handleChange = useCallback(
    (selectedDate: DateRange | undefined) => {
      if (!selectedDate) return;
      const { from, to } = selectedDate;
      if (onChange) {
        onChange({
          from,
          to
        });
      }
    },
    [onChange]
  );

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
        <span className="shrink-0 text-secondary-foreground">Date:</span>
        <div className="flex items-center gap-[0.31rem]">
          <span className="text-sm text-foreground">
            {!date?.from && !date?.to
              ? 'All'
              : `${date.from?.toLocaleDateString() ?? ''} - ${date.to?.toLocaleDateString() ?? ''}`}
          </span>

          <ChevronDown
            size={16}
            strokeWidth={1.5}
            className={cn('transform transition-transform duration-200', open ? 'rotate-180' : 'rotate-0')}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className={cn('p-0', contentClassName)} align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          className="bg-card"
          onSelect={handleChange}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
};

export default TableDateFilter;
