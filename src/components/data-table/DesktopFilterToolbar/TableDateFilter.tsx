import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { DateRange, SelectRangeEventHandler } from 'react-day-picker';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useCallback, useState } from 'react';

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

  const handleChange = useCallback<SelectRangeEventHandler>(
    (selectedDate) => {
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
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'flex items-center gap-[0.31rem] border-none text-sm font-normal',
            buttonClassName
          )}
        >
          <span className="text-secondary-foreground">Date:</span>
          <div className="flex items-center gap-[0.31rem]">
            <span className="text-sm text-foreground">
              {!date?.from && !date?.to
                ? 'All'
                : `${date.from?.toLocaleDateString() ?? ''} - ${date.to?.toLocaleDateString() ?? ''}`}
            </span>

            <ChevronDown
              size={16}
              strokeWidth={1.5}
              className={cn('transform transition-transform', open ? 'rotate-180' : 'rotate-0')}
            />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('p-0', contentClassName)} align="end">
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
