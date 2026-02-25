'use client';

import { useCallback } from 'react';

import { useMessage } from '@/hooks/services';

import Pending from './Pending';
import TxDetail from './TxDetail';
import NotFound from './NotFound';

import type { CHAIN, ChAIN_ID } from '@/types/chains';

interface ClientPageProps {
  id: string;
  chains: CHAIN[];
}
export default function ClientPage({ id, chains }: ClientPageProps) {
  const { data, isPending, isSuccess, isError, refetch } = useMessage(id as string, chains);

  const handleRetry = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const sourceChain = chains?.find(
    (chain) => chain.id === (Number(data?.fromChainId) as unknown as ChAIN_ID)
  );

  const targetChain = chains?.find(
    (chain) => chain.id === (Number(data?.toChainId) as unknown as ChAIN_ID)
  );
  const acceptedTargetChain = chains?.find(
    (chain) => chain.id === (Number(data?.accepted?.toChainId) as unknown as ChAIN_ID)
  );

  if ((isSuccess || isError) && !data) {
    return <NotFound />;
  }
  if (isPending) {
    return <Pending onRetry={handleRetry} />;
  }

  return (
    <>
      {isError && data ? (
        <div
          role="alert"
          className="mb-4 flex items-center justify-between gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3"
        >
          <span className="text-sm text-destructive">
            Failed to refresh latest message data. Showing the last known result.
          </span>
          <button
            type="button"
            className="shrink-0 rounded border border-destructive/40 px-2 py-0.5 text-xs text-destructive transition-colors hover:border-destructive/60 hover:bg-destructive/10"
            onClick={() => {
              void handleRetry();
            }}
          >
            Retry
          </button>
        </div>
      ) : null}
      {data ? (
        <TxDetail
          sourceChain={sourceChain}
          targetChain={targetChain}
          acceptedTargetChain={acceptedTargetChain}
          message={data}
        />
      ) : (
        <NotFound />
      )}
    </>
  );
}
