import { useCallback, useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { MESSAGE_STATUS_LIST } from '@/config/status';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { getDappOptions } from '@/utils';
import { cn } from '@/lib/utils';
import { CURRENT_FILTERS, CURRENT_FILTERS_LIST } from '@/types/filter';
import useQueryParamState from '@/hooks/useQueryParamState';

import useFilter from '../hooks/useFilter';

import DropdownButton from './DropdownButton';
import MobileFilterBack from './FilterBack';
import MobileTableChainFilter from './TableChainFilter';
import MobileTableDateFilter from './TableDateFilter';
import MobileTableMultiSelectFilter from './TableMultiSelectFilter';

import type { CHAIN } from '@/types/chains';
import type { CURRENT_FILTERS_STATE } from '@/types/filter';

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
  const limit = CHAIN_OPTIONS?.length;

  const [open, setOpen] = useState(false);

  const [currentFilterInfo, setCurrentFilterInfo] = useState<CURRENT_FILTERS_STATE>({
    title: CURRENT_FILTERS_LIST[CURRENT_FILTERS.DEFAULT],
    value: CURRENT_FILTERS.DEFAULT
  });

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

  const handleDappOpen = useCallback(() => {
    setCurrentFilterInfo({
      title: CURRENT_FILTERS_LIST[CURRENT_FILTERS.DAPP],
      value: CURRENT_FILTERS.DAPP
    });
  }, []);
  const handleStatusOpen = useCallback(() => {
    setCurrentFilterInfo({
      title: CURRENT_FILTERS_LIST[CURRENT_FILTERS.STATUS],
      value: CURRENT_FILTERS.STATUS
    });
  }, []);

  const handleDateOpen = useCallback(() => {
    setCurrentFilterInfo({
      title: CURRENT_FILTERS_LIST[CURRENT_FILTERS.DATE],
      value: CURRENT_FILTERS.DATE
    });
  }, []);

  const handleSourceChainOpen = useCallback(() => {
    setCurrentFilterInfo({
      title: CURRENT_FILTERS_LIST[CURRENT_FILTERS.SOURCE_CHAIN],
      value: CURRENT_FILTERS.SOURCE_CHAIN
    });
  }, []);

  const handleTargetChainOpen = useCallback(() => {
    setCurrentFilterInfo({
      title: CURRENT_FILTERS_LIST[CURRENT_FILTERS.TARGET_CHAIN],
      value: CURRENT_FILTERS.TARGET_CHAIN
    });
  }, []);

  const handleFilterBack = useCallback(() => {
    setCurrentFilterInfo({
      title: CURRENT_FILTERS_LIST[CURRENT_FILTERS.DEFAULT],
      value: CURRENT_FILTERS.DEFAULT
    });
  }, []);

  const handleStatusChangeAndBack = useCallback(
    (newStatuses: number[]) => {
      handleStatusChange(newStatuses);
      handleFilterBack();
    },
    [handleStatusChange, handleFilterBack]
  );

  const handleResetStatusAndBack = useCallback(() => {
    handleResetStatus();
    handleFilterBack();
  }, [handleResetStatus, handleFilterBack]);

  const selectedNumber = useMemo(() => {
    const dappNumber = selectedDapps?.length ? 1 : 0;
    const dateNumber = dateFrom || dateTo ? 1 : 0;
    const selectedStatusesNumber = selectedStatuses?.length ? 1 : 0;
    const selectedSourceChainsNumber = selectedSourceChains?.length ? 1 : 0;
    const selectedTargetChainsNumber = selectedTargetChains?.length ? 1 : 0;
    return (
      dappNumber +
      dateNumber +
      selectedStatusesNumber +
      selectedSourceChainsNumber +
      selectedTargetChainsNumber
    );
  }, [
    selectedDapps,
    dateFrom,
    dateTo,
    selectedStatuses,
    selectedSourceChains,
    selectedTargetChains
  ]);
  const triggerFocusClassName =
    'focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50';

  return (
    <>
      <div className={cn('flex items-center justify-between pb-5', className)}>
        <div className="text-foreground text-sm leading-[1.4rem] font-normal">Messages</div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          className={cn(
            'flex items-center gap-[0.31rem] rounded-full border px-3 py-1.5 text-sm font-normal transition-colors',
            triggerFocusClassName,
            selectedNumber > 0
              ? 'border-primary/50 bg-primary/10 text-foreground'
              : 'border-border text-secondary-foreground'
          )}
        >
          <SlidersHorizontal size={16} strokeWidth={1.5} />
          <span className="text-xs">Filters</span>
          {selectedNumber > 0 && (
            <span className="bg-primary text-primary-foreground flex h-5 w-5 items-center justify-center rounded-full text-[0.625rem] font-medium">
              {selectedNumber}
            </span>
          )}
        </button>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="flex flex-col gap-0 p-0 overflow-hidden rounded-t-2xl max-h-[85vh]">
          {/* Header */}
          <div className="flex items-center gap-2 border-b px-4 py-4 pr-12 shrink-0">
            <MobileFilterBack
              title={currentFilterInfo.title}
              onClick={handleFilterBack}
              isShowIcon={currentFilterInfo.value !== CURRENT_FILTERS.DEFAULT}
            />
          </div>
          {/* Scrollable content */}
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-3">
            {currentFilterInfo?.value === CURRENT_FILTERS.DEFAULT && (
              <>
                {!hideDappFilter && (
                  <>
                    <DropdownButton
                      title="Source Dapp"
                      options={dappOptions}
                      value={selectedDapps}
                      onOpenChange={handleDappOpen}
                      className="hover:text-foreground/80 w-full justify-between px-0 hover:bg-transparent"
                    />
                    <Separator />
                  </>
                )}

                <DropdownButton
                  title="Status"
                  options={MESSAGE_STATUS_LIST}
                  value={selectedStatuses}
                  onOpenChange={handleStatusOpen}
                  className="hover:text-foreground/80 w-full justify-between px-0 hover:bg-transparent"
                />
                <Separator />
                <DropdownButton
                  title="Date"
                  onOpenChange={handleDateOpen}
                  className="hover:text-foreground/80 w-full justify-between px-0 hover:bg-transparent"
                >
                  {!dateFrom && !dateTo
                    ? 'All'
                    : `${dateFrom?.toLocaleDateString() ?? ''} - ${dateTo?.toLocaleDateString() ?? ''}`}
                </DropdownButton>
                <Separator />

                <DropdownButton
                  title="Source"
                  options={CHAIN_OPTIONS}
                  value={selectedSourceChains}
                  onOpenChange={handleSourceChainOpen}
                  className="hover:text-foreground/80 w-full justify-between px-0 hover:bg-transparent"
                />
                <Separator />
                <DropdownButton
                  title="Target"
                  options={CHAIN_OPTIONS}
                  value={selectedTargetChains}
                  onOpenChange={handleTargetChainOpen}
                  className="hover:text-foreground/80 w-full justify-between px-0 hover:bg-transparent"
                />
                <Separator />
                <Button
                  size="sm"
                  className="bg-card text-foreground hover:bg-card/80 hover:text-foreground/80 w-full border-none px-0 text-sm font-normal"
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </>
            )}

            {currentFilterInfo?.value === CURRENT_FILTERS.DAPP && (
              <MobileTableMultiSelectFilter
                title="Source Dapp"
                options={dappOptions}
                value={selectedDapps}
                onChange={handleDappChange}
                onClearFilters={handleResetDapps}
              />
            )}
            {currentFilterInfo?.value === CURRENT_FILTERS.STATUS && (
              <MobileTableMultiSelectFilter
                title="Status"
                options={MESSAGE_STATUS_LIST}
                value={selectedStatuses}
                onChange={handleStatusChangeAndBack}
                onClearFilters={handleResetStatusAndBack}
              />
            )}

            {currentFilterInfo?.value === CURRENT_FILTERS.DATE && (
              <MobileTableDateFilter
                date={{
                  from: dateFrom,
                  to: dateTo
                }}
                onChange={handleDateChange}
              />
            )}

            {currentFilterInfo?.value === CURRENT_FILTERS.SOURCE_CHAIN && (
              <MobileTableChainFilter
                title="Source"
                options={CHAIN_OPTIONS}
                value={selectedSourceChains}
                onChange={handleSourceChainChange}
                limit={limit}
              />
            )}
            {currentFilterInfo?.value === CURRENT_FILTERS.TARGET_CHAIN && (
              <MobileTableChainFilter
                title="Target"
                options={CHAIN_OPTIONS}
                value={selectedTargetChains}
                onChange={handleTargetChainChange}
                limit={limit}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
export default TableFilterToolbar;
