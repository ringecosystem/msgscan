import { Button } from '@/components/ui/button';

import { MESSAGE_STATUS_LIST } from '@/config/status';
import { useCallback, useMemo, useState } from 'react';
import MobileTableStatusFilter from './TableStatusFilter';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { SlidersHorizontal } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import DropdownButton from './DropdownButton';
import MobileFilterBack from './FilterBack';
import MobileTableChainFilter from './TableChainFilter';
import MobileTableDateFilter from './TableDateFilter';
import useFilter from '../hooks/useFilter';
import { CURRENT_FILTERS, CURRENT_FILTERS_LIST, CURRENT_FILTERS_STATE } from '@/types/filter';
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
  const [open, setOpen] = useState(false);

  const [currentFilterInfo, setCurrentFilterInfo] = useState<CURRENT_FILTERS_STATE>({
    title: CURRENT_FILTERS_LIST[CURRENT_FILTERS.DEFAULT],
    value: CURRENT_FILTERS.DEFAULT
  });

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
    const dateNumber = date?.from || date?.to ? 1 : 0;
    const selectedStatusesNumber = selectedStatuses?.length ? 1 : 0;
    const selectedSourceChainsNumber = selectedSourceChains?.length ? 1 : 0;
    const selectedTargetChainsNumber = selectedTargetChains?.length ? 1 : 0;
    return (
      dateNumber + selectedStatusesNumber + selectedSourceChainsNumber + selectedTargetChainsNumber
    );
  }, [date, selectedStatuses, selectedSourceChains, selectedTargetChains]);

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
                    {!date?.from && !date?.to
                      ? 'All'
                      : `${date.from?.toLocaleDateString() ?? ''} - ${date.to?.toLocaleDateString() ?? ''}`}
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

              {currentFilterInfo?.value === CURRENT_FILTERS.STATUS && (
                <MobileTableStatusFilter
                  options={MESSAGE_STATUS_LIST}
                  value={selectedStatuses}
                  onChange={handleStatusChange}
                  onClearFilters={handleResetStatus}
                />
              )}

              {currentFilterInfo?.value === CURRENT_FILTERS.DATE && (
                <MobileTableDateFilter date={date} onChange={handleDateChange} />
              )}

              {currentFilterInfo?.value === CURRENT_FILTERS.SOURCE_CHAIN && (
                <MobileTableChainFilter
                  options={CHAIN_OPTIONS}
                  value={selectedSourceChains}
                  onChange={handleSourceChainChange}
                  limit={6}
                />
              )}
              {currentFilterInfo?.value === CURRENT_FILTERS.TARGET_CHAIN && (
                <MobileTableChainFilter
                  options={CHAIN_OPTIONS}
                  value={selectedTargetChains}
                  onChange={handleTargetChainChange}
                  limit={6}
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
