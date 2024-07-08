import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TableFilterOption } from '@/types/helper';
import { DAppConfigKeys } from '@/utils';
import { CheckIcon } from '@radix-ui/react-icons';

interface TableDappFilterProps {
  value: DAppConfigKeys[];
  options: TableFilterOption[];
  onChange: (newValue: DAppConfigKeys[]) => void;
  onClearFilters?: () => void;
}

const TableDappFilter = ({ value, options, onChange, onClearFilters }: TableDappFilterProps) => {
  const toggleItem = (itemValue: DAppConfigKeys) => {
    if (value.includes(itemValue)) {
      onChange(value.filter((s) => s !== itemValue));
    } else {
      onChange([...value, itemValue]);
    }
  };

  return (
    <>
      <div className="absolute left-0 top-0 w-[calc(100vw-3rem)] bg-background">
        {options.map(({ value: optionValue, label }) => {
          const isSelected = value.includes(optionValue as DAppConfigKeys);
          return (
            <div
              key={optionValue}
              onClick={() => toggleItem(optionValue as DAppConfigKeys)}
              className="flex items-center gap-2 py-[0.62rem]"
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
            </div>
          );
        })}
        <Button
          size="sm"
          className="mt-5 w-full border-none bg-card px-0 text-sm font-normal text-foreground hover:bg-card/80 hover:text-foreground/80"
          onClick={onClearFilters}
        >
          Reset
        </Button>
      </div>
    </>
  );
};

export default TableDappFilter;
