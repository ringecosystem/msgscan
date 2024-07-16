import { Button } from '@/components/ui/button';
import { MESSAGE_STATUS_LIST } from '@/config/status';
import { cn } from '@/lib/utils';
import { getDappOptions } from '@/utils';
import useUrlParams from '@/hooks/urlParams';

import useFilter from '../hooks/useFilter';

import TableChainFilter from './TableChainFilter';
import TableDateFilter from './TableDateFilter';
import TableMultiSelectFilter from './TableMultiSelectFilter';

import type { CHAIN } from '@/types/chains';

const dappOptions = getDappOptions();

export interface TableFilterToolbarProps {
  chains: CHAIN[];
  className?: string;
  hideDappFilter?: boolean;
}
const TableFilterToolbar = ({ chains, className, hideDappFilter }: TableFilterToolbarProps) => {
  const CHAIN_OPTIONS = chains?.map((chain) => ({
    label: chain.name,
    value: chain.id
  }));
  const {
    handleDappChange,
    handleStatusChange,
    handleDateChange,
    handleSourceChainChange,
    handleTargetChainChange,
    handleReset,
    handleResetStatus,
    handleResetDapps
  } = useFilter();

  const {
    selectedDapps,
    selectedStatuses,
    dateFrom,
    dateTo,
    selectedSourceChains,
    selectedTargetChains
  } = useUrlParams();

  const limit = CHAIN_OPTIONS?.length;
  return (
    <div className={cn('flex items-center justify-between py-5', className)}>
      <div className="text-sm font-normal leading-[1.4rem] text-foreground">Messages</div>
      <div className="flex gap-3">
        {!hideDappFilter && (
          <TableMultiSelectFilter
            options={dappOptions}
            value={selectedDapps}
            onChange={handleDappChange}
            title="Dapp"
            onClearFilters={handleResetDapps}
            contentClassName="w-[10rem]"
          />
        )}

        <TableMultiSelectFilter
          options={MESSAGE_STATUS_LIST}
          value={selectedStatuses}
          onChange={handleStatusChange}
          title="Status"
          onClearFilters={handleResetStatus}
          contentClassName="w-[10rem]"
        />

        <TableDateFilter
          onChange={handleDateChange}
          date={{
            from: dateFrom,
            to: dateTo
          }}
          contentClassName="w-[35rem]"
        />

        <TableChainFilter
          options={CHAIN_OPTIONS}
          value={selectedSourceChains}
          onChange={handleSourceChainChange}
          title="Source"
          contentClassName="w-[28rem]"
          limit={limit}
        />

        <TableChainFilter
          options={CHAIN_OPTIONS}
          value={selectedTargetChains}
          onChange={handleTargetChainChange}
          title="Target"
          contentClassName="w-[28rem]"
          limit={limit}
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
