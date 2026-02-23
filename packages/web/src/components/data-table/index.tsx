'use client';
import { memo, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Inbox } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { getNetwork } from '@/utils/network';
import MessageCard from '@/components/message/message-card';

import { columns } from './columns';

import type { CompositeMessage } from '@/types/messages';

interface TableProps {
  loading: boolean;
  network: string;
  dataSource: CompositeMessage[];
  pageSize: number;
  offset: number;
  onPreviousPageClick: () => void;
  onNextPageClick: () => void;
  onResetFilters?: () => void;
}

function isInteractiveDescendant(target: EventTarget | null, container: HTMLElement): boolean {
  if (!(target instanceof Element)) return false;
  const interactive = target.closest('a,button,input,select,textarea,[role="link"],[data-interactive]');
  return Boolean(interactive && interactive !== container);
}

function getColumnValue(message: CompositeMessage, dataIndex: string): string | undefined {
  if (dataIndex === 'age') {
    return typeof message.sentBlockTimestampSec === 'undefined'
      ? undefined
      : String(message.sentBlockTimestampSec);
  }

  const value = message[dataIndex as keyof CompositeMessage];
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return undefined;
}

const DataTable = ({
  loading,
  network,
  dataSource,
  pageSize,
  offset,
  onPreviousPageClick,
  onNextPageClick,
  onResetFilters
}: TableProps) => {
  const router = useRouter();
  const [activePageType, setActivePageType] = useState<'previous' | 'next' | ''>('');
  const realRowCount = dataSource.filter((message) => message.status !== -1).length;
  const visibleRowCount = realRowCount > 0 ? realRowCount : dataSource.length;

  const showPagination = Boolean(visibleRowCount || offset !== 0);
  const enablePreviousPage = offset !== 0;
  const enableNextPage = !loading && realRowCount >= pageSize;
  const hasData = dataSource?.length > 0;

  const paginationLabel = !enableNextPage && offset > 0
    ? 'End of results'
    : !enableNextPage && offset === 0
      ? `${visibleRowCount} message${visibleRowCount === 1 ? '' : 's'}`
      : `Showing ${offset + 1}–${offset + visibleRowCount}`;

  const handlePreviousPageClick = useCallback(() => {
    setActivePageType('previous');
    onPreviousPageClick();
  }, [onPreviousPageClick]);

  const handleNextPageClick = useCallback(() => {
    setActivePageType('next');
    onNextPageClick();
  }, [onNextPageClick]);

  const handleRowClick = useCallback(
    (message: CompositeMessage, event?: React.MouseEvent<HTMLTableRowElement>) => {
      if (message.status === -1) return;
      if (event && isInteractiveDescendant(event.target, event.currentTarget)) return;
      router.push(`/message/${message.msgId}?network=${getNetwork(network)}`);
    },
    [router, network]
  );

  const handleRowKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTableRowElement>, message: CompositeMessage) => {
      if (message.status === -1) return;
      if (e.defaultPrevented || isInteractiveDescendant(e.target, e.currentTarget)) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleRowClick(message);
      }
    },
    [handleRowClick]
  );

  useEffect(() => {
    if (!loading) {
      setActivePageType('');
    }
  }, [loading]);

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden bg-card">
      {/* Mobile: Card list */}
      <div className="space-y-3 px-4 py-4 md:hidden">
        {hasData ? (
          dataSource.map((message) =>
            message.status === -1 ? (
              <div key={message.msgId} className="rounded-xl border border-border/50 p-4">
                <Skeleton className="mb-3 h-5 w-32" />
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <MessageCard key={message.msgId} message={message} network={network} />
            )
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted/50">
              <Inbox className="size-8 text-muted-foreground/40" />
            </div>
            <p className="text-sm font-medium text-foreground/70">No messages found</p>
            <p className="mt-1 text-xs text-muted-foreground">Try adjusting your filters or check back later</p>
            {onResetFilters && (
              <Button variant="outline" size="sm" className="mt-4" onClick={onResetFilters}>
                Reset Filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Desktop: Table */}
      <div className="hidden overflow-x-auto md:block">
        <Table className="min-w-[760px] table-auto lg:min-w-0">
          <TableHeader>
            <TableRow className="border-none bg-card-elevated">
              {columns.map((column, index) => (
                <TableHead
                  className={cn(
                    'h-12 truncate overflow-hidden px-3 text-xs font-medium text-muted-foreground',
                    index === 0 && 'pl-4',
                    index === columns.length - 1 && 'pr-4',
                    column.align === 'right' && 'text-right',
                    column.hiddenClass
                  )}
                  style={column.width ? { minWidth: column.width } : undefined}
                  key={column.dataIndex}
                >
                  {column.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="transition-opacity duration-200 opacity-100">
            {hasData ? (
              dataSource.map((message) => (
                <TableRow
                  key={message?.msgId}
                  className={cn(
                    'h-14 border-b border-b-border/30 transition-colors duration-200',
                    message.status !== -1 && 'cursor-pointer hover:bg-muted/50 active:bg-muted/70'
                  )}
                  role={message.status !== -1 ? 'link' : undefined}
                  aria-label={message.status !== -1 ? `Open message ${message.msgId} details` : undefined}
                  onClick={(e) => handleRowClick(message, e)}
                  onKeyDown={(e) => handleRowKeyDown(e, message)}
                  tabIndex={message.status !== -1 ? 0 : undefined}
                >
                  {columns.map((column, index) => (
                    <TableCell
                      key={column.dataIndex}
                      className={cn(
                        'px-3',
                        index === 0 && 'pl-4',
                        index === columns.length - 1 && 'pr-4',
                        column.hiddenClass
                      )}
                      style={column.width ? { minWidth: column.width } : undefined}
                    >
                      <div className={cn('truncate text-sm', column.align === 'right' && 'text-right')}>
                        {column.render(
                          getColumnValue(message, column.dataIndex),
                          message,
                          0,
                          network
                        )}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="border-none">
                <TableCell colSpan={columns.length} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted/50">
                      <Inbox className="size-8 text-muted-foreground/40" />
                    </div>
                    <p className="text-sm font-medium text-foreground/70">No messages found</p>
                    <p className="mt-1 text-xs text-muted-foreground">Try adjusting your filters or check back later</p>
                    {onResetFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={onResetFilters}
                      >
                        Reset Filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination ? (
        <div className="flex items-center justify-center border-t border-border px-4 py-3 sm:px-6 md:justify-between">
          <span className="hidden text-xs text-muted-foreground md:inline">
            {paginationLabel}
          </span>
          <Pagination className="mx-0 w-auto justify-end gap-2">
            <PaginationContent className="items-center gap-2">
              <PaginationItem className="rounded bg-card">
                <PaginationPrevious
                  loading={loading && activePageType === 'previous'}
                  disabled={!enablePreviousPage}
                  onClick={handlePreviousPageClick}
                  className={cn(
                    enablePreviousPage
                      ? 'cursor-pointer'
                      : 'cursor-not-allowed text-muted-foreground hover:bg-transparent hover:text-muted-foreground'
                  )}
                />
              </PaginationItem>
              <span
                className="text-xs text-muted-foreground md:hidden"
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                {paginationLabel}
              </span>
              <PaginationItem className="rounded bg-card">
                <PaginationNext
                  loading={loading && activePageType === 'next'}
                  disabled={!enableNextPage}
                  onClick={handleNextPageClick}
                  className={cn(
                    enableNextPage
                      ? 'cursor-pointer'
                      : 'cursor-not-allowed text-muted-foreground hover:bg-transparent hover:text-muted-foreground'
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : null}
    </div>
  );
};

export default memo(DataTable);
