'use client';

import Link from 'next/link';
import MessageStatus from '@/components/message-status';
import { MessagePort } from '@/graphql/type';
import { chains } from '@/config/chains';
import { ChAIN_ID } from '@/types/chains';
import { protocols } from '@/config/protocols';
import { formatTimeAgo, formatTimeDifference } from '@/utils';

import ChainTxDisplay from '@/components/chain-tx-display';
import BlockchainAddressLink from '@/components/blockchain-address-link';
import { Skeleton } from '@/components/ui/skeleton';
import { CodeFont } from '@/config/font';
import { cn } from '@/lib/utils';
import { getNetwork } from '@/utils/network';

export type Column = {
  dataIndex: string;
  title: string;
  width?: string;
  render: (value: any, record: MessagePort, index: number, network: string) => any;
};

export const columns: Column[] = [
  {
    dataIndex: 'status',
    title: 'Status',
    width: '8.7rem',
    render(value, record) {
      if (record?.status === -1) {
        return <Skeleton className="h-[22px] w-full rounded-full" />;
      }
      return <MessageStatus status={value} />;
    }
  },
  {
    dataIndex: 'id',
    title: 'Msgid',
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
    width: '7.78rem',
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
    dataIndex: 'sourceTransactionHash',
    title: 'Source Tx Hash',
    width: '10rem',
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
    dataIndex: 'sourceDappAddress',
    title: 'From',
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
    dataIndex: 'targetTransactionHash',
    title: 'Target Tx Hash',
    width: '10rem',
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
    dataIndex: 'targetDappAddress',
    title: 'To',
    width: '8rem',
    render(value, record) {
      if (record?.status === -1) {
        return <Skeleton className="h-[22px] w-full rounded-full" />;
      }
      if (!value) return '';
      const chain = chains?.find(
        (chain) => chain.id === (Number(record?.targetChainId) as unknown as ChAIN_ID)
      );
      return <BlockchainAddressLink chain={chain} address={value} />;
    }
  },
  {
    dataIndex: 'age',
    title: 'Age',
    width: '5rem',
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
    title: 'TimeSpent',
    width: '5rem',

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
