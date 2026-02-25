import { useCallback } from 'react';

import { Calendar } from '@/components/ui/calendar';

import type { DateRange } from 'react-day-picker';

interface TableDateFilterProps {
  date?: DateRange;
  onChange?: (date: DateRange) => void;
}

const TableDateFilter = ({ date, onChange }: TableDateFilterProps) => {
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
    <div className="w-full bg-background">
      <Calendar
        initialFocus
        mode="range"
        defaultMonth={date?.from}
        selected={date}
        className="bg-card w-full"
        onSelect={handleChange}
        numberOfMonths={1}
      />
    </div>
  );
};

export default TableDateFilter;
