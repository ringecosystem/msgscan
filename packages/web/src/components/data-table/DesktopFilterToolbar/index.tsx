import { MESSAGE_STATUS_LIST } from '@/config/status';
import { cn } from '@/lib/utils';
import { getDappOptions } from '@/utils';
import useQueryParamState from '@/hooks/useQueryParamState';

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
  } = useQueryParamState();

  const limit = CHAIN_OPTIONS?.length;

  const hasActiveFilters =
    (selectedDapps?.length ?? 0) > 0 ||
    (selectedStatuses?.length ?? 0) > 0 ||
    Boolean(dateFrom) ||
    Boolean(dateTo) ||
    (selectedSourceChains?.length ?? 0) > 0 ||
    (selectedTargetChains?.length ?? 0) > 0;

  return (
    <div className={cn('mt-3 mb-2 flex flex-wrap items-center justify-end gap-2', className)}>
      <div className="flex flex-wrap items-center gap-2">
        {!hideDappFilter && (
          <TableMultiSelectFilter
            options={dappOptions}
            value={selectedDapps}
            onChange={handleDappChange}
            title="Source Dapp"
            onClearFilters={handleResetDapps}
            contentClassName="min-w-[10rem]"
          />
        )}
        <TableMultiSelectFilter
          options={MESSAGE_STATUS_LIST}
          value={selectedStatuses}
          onChange={handleStatusChange}
          title="Status"
          onClearFilters={handleResetStatus}
          contentClassName="min-w-[10rem]"
        />
        <TableDateFilter
          onChange={handleDateChange}
          date={{
            from: dateFrom,
            to: dateTo
          }}
          contentClassName="w-fit max-w-[calc(100vw-2rem)]"
        />
        <TableChainFilter
          options={CHAIN_OPTIONS}
          value={selectedSourceChains}
          onChange={handleSourceChainChange}
          title="Source"
          contentClassName="w-[22rem]"
          limit={limit}
        />
        <TableChainFilter
          options={CHAIN_OPTIONS}
          value={selectedTargetChains}
          onChange={handleTargetChainChange}
          title="Target"
          contentClassName="w-[22rem]"
          limit={limit}
        />
        {hasActiveFilters && <div className="bg-border mx-1 h-4 w-px" />}
        {hasActiveFilters && (
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground cursor-pointer text-xs transition-colors hover:underline"
            onClick={handleReset}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};
export default TableFilterToolbar;
