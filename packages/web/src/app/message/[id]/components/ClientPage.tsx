'use client';

import { useEffect, useState } from 'react';

import { useMessage } from '@/hooks/services';
import useBreakpoint from '@/hooks/breakpoint';

import Pending from './Pending';
import TxDetail from './TxDetail';
import NotFound from './NotFound';

import type { CHAIN, ChAIN_ID } from '@/types/chains';

interface ClientPageProps {
  id: string;
  chains: CHAIN[];
}
export default function ClientPage({ id, chains }: ClientPageProps) {
  const breakpoint = useBreakpoint();
  const [iconSize, setIconSize] = useState(22);
  const { data, isPending, isSuccess, isError } = useMessage(id as string, chains);

  const sourceChain = chains?.find(
    (chain) => chain.id === (Number(data?.sourceChainId) as unknown as ChAIN_ID)
  );

  const targetChain = chains?.find(
    (chain) => chain.id === (Number(data?.targetChainId) as unknown as ChAIN_ID)
  );

  useEffect(() => {
    if (breakpoint === 'desktop') {
      setIconSize(22);
    } else {
      setIconSize(18);
    }
  }, [breakpoint]);

  if ((isSuccess || isError) && !data) {
    return <NotFound />;
  }
  if (isPending) {
    return <Pending />;
  }
  return data ? (
    <TxDetail
      sourceChain={sourceChain}
      targetChain={targetChain}
      message={data}
      iconSize={iconSize}
    />
  ) : null;
}
