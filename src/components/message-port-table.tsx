'use client';
import { memo, useCallback, useEffect, useState } from 'react';
import { produce } from 'immer';
import { MessagePortBoolExp, MessagePortQueryParams, OrderBy } from '@/graphql/type';
import { useShallow } from 'zustand/react/shallow';

import DataTable from '@/components/data-table';
import { createTimestampQuery, getAllDappAddressByKeys, getDappAddresses } from '@/utils';
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
  sender?: string;
}
const MessagePortTable = ({ chains, network, sourceAddress, sender }: MessagePortTableProps) => {
  const [queryVariables, setQueryVariables] =
    useState<MessagePortQueryParams>(defaultQueryVariables);

  const updateQueryVariables = useCallback((variables: Partial<MessagePortQueryParams>) => {
    setQueryVariables((prev) =>
      produce(prev, (draft) => {
        Object.assign(draft, variables);
      })
    );
  }, []);

  const { selectedDapps, selectedStatuses, date, selectedSourceChains, selectedTargetChains } =
    useFilterStore(
      useShallow((state) => {
        return {
          selectedDapps: state.selectedDapps,
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

    if (sourceAddress) {
      const sourceAddressList = getDappAddresses(sourceAddress) ?? [sourceAddress];
      where.sourceDappAddress = sourceAddress ? { _in: sourceAddressList } : undefined;
    } else if (selectedDapps && selectedDapps?.length > 0) {
      where.sourceDappAddress = {
        _in: getAllDappAddressByKeys(selectedDapps)
      };
    }

    if (sender) {
      where.sender = {
        _eq: sender
      };
    }

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
  }, [
    updateQueryVariables,
    selectedDapps,
    selectedStatuses,
    date,
    selectedSourceChains,
    selectedTargetChains,
    sourceAddress,
    sender
  ]);

  const { data, isFetching } = useMessagePort(queryVariables, chains);

  const handlePreviousPageClick = useCallback(() => {
    const offset = queryVariables?.offset;
    const limit = queryVariables?.limit || 10;
    if (offset === undefined) return;
    updateQueryVariables({ offset: Math.max(0, offset - limit) });
  }, [queryVariables, updateQueryVariables]);

  const handleNextPageClick = useCallback(() => {
    const offset = queryVariables?.offset;
    const limit = queryVariables?.limit || 10;
    if (offset === undefined) return;
    updateQueryVariables({ offset: offset + limit });
  }, [queryVariables, updateQueryVariables]);

  useEffect(() => {
    updateQueryVariables({ offset: 0 });
  }, [network, updateQueryVariables]);

  return (
    <DataTable
      loading={isFetching}
      network={network}
      chains={chains}
      dataSource={Array.isArray(data?.MessagePort) ? data?.MessagePort : []}
      offset={queryVariables?.offset}
      onPreviousPageClick={handlePreviousPageClick}
      onNextPageClick={handleNextPageClick}
      hideDappFilter={Boolean(sourceAddress)}
    />
  );
};

export default memo(MessagePortTable);
