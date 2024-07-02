import { Button } from '@/components/ui/button';

import { MESSAGE_STATUS_LIST } from '@/config/status';
import TableChainFilter from './TableChainFilter';
import TableStatusFilter from './TableStatusFilter';
import TableDateFilter from './TableDateFilter';

import useFilter from '../hooks/useFilter';
import { cn } from '@/lib/utils';
import { CHAIN } from '@/types/chains';

export interface TableFilterToolbarProps {
  chains: CHAIN[];
  className?: string;
}
const TableFilterToolbar = ({ chains, className }: TableFilterToolbarProps) => {
  const CHAIN_OPTIONS = chains?.map((chain) => ({
    label: chain.name,
    value: chain.id
  }));
  const {
    selectedStatuses,
    date,
    selectedSourceChains,
    selectedTargetChains,
    handleStatusChange,
    handleDateChange,
    handleSourceChainChange,
    handleTargetChainChange,
    handleReset,
    handleResetStatus
  } = useFilter();

  return (
    <div className={cn('flex items-center justify-between py-5', className)}>
      <div className="text-sm font-normal leading-[1.4rem] text-foreground">Messages</div>
      <div className="flex gap-3">
        <TableStatusFilter
          options={MESSAGE_STATUS_LIST}
          value={selectedStatuses}
          onChange={handleStatusChange}
          title="Status"
          onClearFilters={handleResetStatus}
          contentClassName="w-[10rem]"
        />

        <TableDateFilter onChange={handleDateChange} date={date} contentClassName="w-[35rem]" />

        <TableChainFilter
          options={CHAIN_OPTIONS}
          value={selectedSourceChains}
          onChange={handleSourceChainChange}
          title="Source"
          contentClassName="w-[28rem]"
          limit={6}
        />

        <TableChainFilter
          options={CHAIN_OPTIONS}
          value={selectedTargetChains}
          onChange={handleTargetChainChange}
          title="Target"
          contentClassName="w-[28rem]"
          limit={6}
        />

        <Button
          variant="outline"
          size="sm"
          className="border-none text-sm font-normal text-secondary-foreground"
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};
export default TableFilterToolbar;
