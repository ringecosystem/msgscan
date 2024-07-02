import { cn } from '@/lib/utils';
import { TableFilterOption } from '@/types/helper';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import useChainFilterLogic from '../hooks/useChainFilterLogic';

interface TableChainFilterProps {
  options: TableFilterOption[];
  value: number[];
  onChange: (newValue: number[]) => void;
  limit: number;
}

const TableChainFilter = ({ options, value, onChange, limit }: TableChainFilterProps) => {
  const { sortedOptions, toggleItem, handleSelectAll, checkedAll } = useChainFilterLogic({
    options,
    value,
    onChange,
    limit
  });

  return (
    <div className="absolute left-0 top-0 w-[calc(100vw-3rem)] bg-background">
      <div className="flex items-center justify-between py-[0.62rem]">
        <div className="flex items-center gap-[0.62rem]" onClick={handleSelectAll}>
          <Checkbox checked={checkedAll}></Checkbox>
          <label
            className={cn(
              'text-sm',
              'cursor-pointer',
              checkedAll ? 'text-foreground' : 'text-secondary-foreground'
            )}
          >
            All
          </label>
        </div>
        <span className="text-sm text-secondary-foreground">
          {value.length || '0'} / {limit} Selected
        </span>
      </div>
      <Separator />
      <div className="flex flex-col">
        {sortedOptions.map(({ value: optionValue, label }) => {
          const isSelected = value.includes(optionValue);
          return (
            <div
              key={optionValue}
              onClick={() => toggleItem(optionValue)}
              className={cn(
                'flex h-[3.125rem] items-center gap-[0.62rem]',
                value.length < limit || isSelected ? 'cursor-pointer' : 'cursor-not-allowed'
              )}
            >
              <Checkbox
                checked={isSelected}
                disabled={value.length === limit && !isSelected}
              ></Checkbox>
              <label
                className={cn(
                  'text-sm',
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
    </div>
  );
};

export default TableChainFilter;
