'use client';

import Link from 'next/link';

import MessageStatus from '@/components/message-status';
import { chains } from '@/config/chains';
import { protocols } from '@/config/protocols';
import { formatTimeAgo, formatTimeDifference } from '@/utils';
import ChainTxDisplay from '@/components/chain-tx-display';
import BlockchainAddressLink from '@/components/blockchain-address-link';
import { Skeleton } from '@/components/ui/skeleton';
import { CodeFont } from '@/config/font';
import { cn } from '@/lib/utils';
import { getNetwork } from '@/utils/network';

import type { ChAIN_ID } from '@/types/chains';
import type { MessagePort } from '@/graphql/type';

export type Column = {
  dataIndex: string;
  title: string;
  width?: string;
  render: (value: any, record: MessagePort, index: number, network: string) => React.ReactNode;
};

export const columns: Column[] = [
  {
    dataIndex: 'status',
    title: 'Status',
    width: '6rem',
    render(value, record) {
      if (record?.status === -1) {
        return <Skeleton className="h-[22px] w-full rounded-full" />;
      }
      return <MessageStatus status={value} />;
    }
  },
  {
    dataIndex: 'id',
    title: 'Msg ID',
    width: '10rem',
    render(value, record, index, network) {
      if (record?.status === -1) {
        return <Skeleton className="h-[22px] w-full rounded-full" />;
      }
      return (
        <Link
          href={`/message/${value}?network=${getNetwork(network)}`}
          className={cn('hover:underline', CodeFont.className)}
          title={value}
        >
          {value}
        </Link>
      );
    }
  },
  {
    dataIndex: 'protocol',
    title: 'Protocol',
    width: '5rem',
    render(value, record) {
      if (record?.status === -1) {
        return <Skeleton className="h-[22px] w-full rounded-full" />;
      }
      const protocol = protocols?.find((protocol) => protocol.value === value);
      if (protocol) {
        const Icon = protocol.icon;
        return (
          <div className="flex items-center gap-[0.31rem]">
            <Icon />
            <span className="text-sm">{protocol.title}</span>
          </div>
        );
      }
    }
  },
  {
    dataIndex: 'sender',
    title: 'Original Sender',
    width: '8rem',
    render(value, record, index, network) {
      if (record?.status === -1) {
        return <Skeleton className="h-[22px] w-full rounded-full" />;
      }
      if (!value) return '';
      const chain = chains?.find(
        (chain) => chain.id === (Number(record?.sourceChainId) as unknown as ChAIN_ID)
      );
      const href = `/sender/${value}?network=${getNetwork(network)}`;
      return <BlockchainAddressLink chain={chain} address={value} href={href} />;
    }
  },
  {
    dataIndex: 'sourceTransactionHash',
    title: 'Source Tx Hash',
    width: '8rem',
    render(value, record, index, network) {
      if (record?.status === -1) {
        return <Skeleton className="h-[22px] w-full rounded-full" />;
      }
      if (!value) return '';
      const chain = chains?.find(
        (chain) => chain.id === (Number(record?.sourceChainId) as unknown as ChAIN_ID)
      );
      return (
        <ChainTxDisplay
          chain={chain}
          value={value}
          isLink
          href={`/message/${value}?network=${getNetwork(network)}`}
        />
      );
    }
  },
  {
    dataIndex: 'targetTransactionHash',
    title: 'Target Tx Hash',
    width: '8rem',
    render(value, record) {
      if (record?.status === -1) {
        return <Skeleton className="h-[22px] w-full rounded-full" />;
      }
      const chain = chains?.find(
        (chain) => chain.id === (Number(record?.targetChainId) as unknown as ChAIN_ID)
      );
      return <ChainTxDisplay chain={chain} value={value} isLink />;
    }
  },
  {
    dataIndex: 'sourceDappAddress',
    title: 'Dapp',
    width: '8rem',
    render(value, record, index, network) {
      if (record?.status === -1) {
        return <Skeleton className="h-[22px] w-full rounded-full" />;
      }
      if (!value) return '';
      const chain = chains?.find(
        (chain) => chain.id === (Number(record?.sourceChainId) as unknown as ChAIN_ID)
      );
      const href = `/sent_by/${value}?network=${getNetwork(network)}`;
      return <BlockchainAddressLink chain={chain} address={value} href={href} />;
    }
  },
  {
    dataIndex: 'age',
    title: 'Age',
    width: '6rem',
    render(value, record) {
      if (record?.status === -1) {
        return <Skeleton className="h-[22px] w-full rounded-full" />;
      }
      return record?.sourceBlockTimestamp
        ? formatTimeAgo(String(record?.sourceBlockTimestamp))
        : '';
    }
  },
  {
    dataIndex: 'timeSpent',
    title: 'Time Spent',
    width: '6rem',

    render(value, record) {
      if (record?.status === -1) {
        return <Skeleton className="h-[22px] w-full rounded-full" />;
      }
      return record.sourceBlockTimestamp && record?.targetBlockTimestamp
        ? formatTimeDifference(
            String(record.sourceBlockTimestamp),
            String(record?.targetBlockTimestamp)
          )
        : '';
    }
  }
];
