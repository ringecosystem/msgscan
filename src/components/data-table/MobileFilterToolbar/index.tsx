import { useCallback, useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { MESSAGE_STATUS_LIST } from '@/config/status';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { getDappOptions } from '@/utils';
import { cn } from '@/lib/utils';
import { CURRENT_FILTERS, CURRENT_FILTERS_LIST } from '@/types/filter';
import useUrlParams from '@/hooks/urlParams';

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
  } = useUrlParams();

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

  return (
    <>
      <div className={cn('flex items-center justify-between pb-5', className)}>
        <div className="text-sm font-normal leading-[1.4rem] text-foreground">Messages</div>
        <div
          onClick={() => setOpen(true)}
          className="flex items-center gap-[0.31rem] border-none text-sm font-normal"
        >
          <SlidersHorizontal size={20} strokeWidth={1.25} className="text-secondary-foreground" />
          <span className="text-xs text-secondary-foreground">
            Filters {selectedNumber ? `(${selectedNumber})` : ''}
          </span>
        </div>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full pt-0 sm:w-full sm:max-w-full lg:w-[800px]">
          {
            <div className="relative mt-[4.375rem] flex flex-col items-start gap-3">
              {currentFilterInfo?.value === CURRENT_FILTERS.DEFAULT && (
                <>
                  {!hideDappFilter && (
                    <>
                      <DropdownButton
                        title="Dapp"
                        options={dappOptions}
                        value={selectedDapps}
                        onOpenChange={handleDappOpen}
                        className="w-full justify-between px-0 hover:bg-transparent hover:text-foreground/80"
                      />
                      <Separator />
                    </>
                  )}

                  <DropdownButton
                    title="Status"
                    options={MESSAGE_STATUS_LIST}
                    value={selectedStatuses}
                    onOpenChange={handleStatusOpen}
                    className="w-full justify-between px-0 hover:bg-transparent hover:text-foreground/80"
                  />
                  <Separator />
                  <DropdownButton
                    title="Date"
                    onOpenChange={handleDateOpen}
                    className="w-full justify-between px-0 hover:bg-transparent hover:text-foreground/80"
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
                    className="w-full justify-between px-0 hover:bg-transparent hover:text-foreground/80"
                  />
                  <Separator />
                  <DropdownButton
                    title="Target"
                    options={CHAIN_OPTIONS}
                    value={selectedTargetChains}
                    onOpenChange={handleTargetChainOpen}
                    className="w-full justify-between px-0 hover:bg-transparent hover:text-foreground/80"
                  />
                  <Separator />
                  <Button
                    size="sm"
                    className="w-full border-none bg-card px-0 text-sm font-normal text-foreground hover:bg-card/80 hover:text-foreground/80"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </>
              )}

              {currentFilterInfo?.value === CURRENT_FILTERS.DAPP && (
                <MobileTableMultiSelectFilter
                  options={dappOptions}
                  value={selectedDapps}
                  onChange={handleDappChange}
                  onClearFilters={handleResetDapps}
                />
              )}
              {currentFilterInfo?.value === CURRENT_FILTERS.STATUS && (
                <MobileTableMultiSelectFilter
                  options={MESSAGE_STATUS_LIST}
                  value={selectedStatuses}
                  onChange={handleStatusChange}
                  onClearFilters={handleResetStatus}
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
                  options={CHAIN_OPTIONS}
                  value={selectedSourceChains}
                  onChange={handleSourceChainChange}
                  limit={limit}
                />
              )}
              {currentFilterInfo?.value === CURRENT_FILTERS.TARGET_CHAIN && (
                <MobileTableChainFilter
                  options={CHAIN_OPTIONS}
                  value={selectedTargetChains}
                  onChange={handleTargetChainChange}
                  limit={limit}
                />
              )}
            </div>
          }
          {
            <MobileFilterBack
              title={currentFilterInfo.title}
              onClick={handleFilterBack}
              isShowIcon={currentFilterInfo.value !== CURRENT_FILTERS.DEFAULT}
            />
          }
        </SheetContent>
      </Sheet>
    </>
  );
};
export default TableFilterToolbar;
