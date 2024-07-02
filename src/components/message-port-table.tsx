'use client';
import { useCallback, useEffect, useState } from 'react';
import { produce } from 'immer';
import { useQueryClient } from '@tanstack/react-query';
import { MessagePortBoolExp, MessagePortQueryParams, OrderBy } from '@/graphql/type';
import { useShallow } from 'zustand/react/shallow';

import DataTable from '@/components/data-table';
import { createTimestampQuery } from '@/utils';
import useFilterStore from '@/store/filter';
import { useMessagePort } from '@/hooks/services';

import { CHAIN } from '@/types/chains';

const defaultQueryVariables: MessagePortQueryParams = {
  offset: 0,
  limit: 15,
  orderBy: [
    {
      sourceBlockTimestamp: OrderBy.Desc
    }
  ]
};

interface MessagePortTableProps {
  chains: CHAIN[];
  network: string;
  sourceAddress?: string;
}
const MessagePortTable = ({ chains, network, sourceAddress }: MessagePortTableProps) => {
  const queryClient = useQueryClient();

  const [queryVariables, setQueryVariables] =
    useState<MessagePortQueryParams>(defaultQueryVariables);

  const updateQueryVariables = (updates: Partial<MessagePortQueryParams>) => {
    setQueryVariables((prev) =>
      produce(prev, (draft) => {
        Object.assign(draft, updates);
      })
    );
  };
  const { selectedStatuses, date, selectedSourceChains, selectedTargetChains } = useFilterStore(
    useShallow((state) => {
      return {
        selectedStatuses: state.selectedStatuses,
        date: state.date,
        selectedSourceChains: state.selectedSourceChains,
        selectedTargetChains: state.selectedTargetChains
      };
    })
  );

  useEffect(() => {
    const where: Partial<MessagePortBoolExp> = {};

    where.status =
      selectedStatuses && selectedStatuses?.length > 0
        ? {
            _in: selectedStatuses
          }
        : undefined;

    where.sourceDappAddress = sourceAddress ? { _eq: sourceAddress } : undefined;

    where.sourceChainId =
      selectedSourceChains && selectedSourceChains?.length > 0
        ? {
            _in: selectedSourceChains
          }
        : undefined;

    where.targetChainId =
      selectedTargetChains && selectedTargetChains?.length > 0
        ? {
            _in: selectedTargetChains
          }
        : undefined;

    if (date && (date?.from || date?.to)) {
      Object.assign(where, {
        sourceBlockTimestamp: createTimestampQuery(date)
      });
    } else {
      where.sourceBlockTimestamp = undefined;
    }

    let params: MessagePortQueryParams = {
      where: Object.values(where).some((value) => value !== undefined) ? where : undefined
    };
    if (params.where) {
      params.offset = 0;
    }

    updateQueryVariables(params);
    queryClient.resetQueries({
      queryKey: ['messagePort']
    });
  }, [
    queryClient,
    selectedStatuses,
    date,
    selectedSourceChains,
    selectedTargetChains,
    sourceAddress
  ]);

  const { data, isFetching } = useMessagePort(queryVariables, chains);

  const handlePreviousPageClick = useCallback(() => {
    const offset = queryVariables?.offset;
    const limit = queryVariables?.limit || 10;
    if (offset === undefined) return;
    updateQueryVariables({ offset: Math.max(0, offset - limit) });
  }, [queryVariables]);

  const handleNextPageClick = useCallback(() => {
    const offset = queryVariables?.offset;
    const limit = queryVariables?.limit || 10;
    if (offset === undefined) return;
    updateQueryVariables({ offset: offset + limit });
  }, [queryVariables]);

  useEffect(() => {
    queryClient.resetQueries({
      queryKey: ['messagePort']
    });
    updateQueryVariables({ offset: 0 });
  }, [queryClient, network]);

  return (
    <DataTable
      loading={isFetching}
      network={network}
      chains={chains}
      dataSource={Array.isArray(data?.MessagePort) ? data?.MessagePort : []}
      offset={queryVariables?.offset}
      onPreviousPageClick={handlePreviousPageClick}
      onNextPageClick={handleNextPageClick}
    />
  );
};

export default MessagePortTable;
