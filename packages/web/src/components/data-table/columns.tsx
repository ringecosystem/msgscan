'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

import MessageStatus from '@/components/message-status';
import { chains } from '@/config/chains';
import AddressDisplayFilterDappRemark from '@/components/address-display-filter-dapp-remark';
import { formatTimeAgo, formatTimeAgoShort, toShortText } from '@/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { CodeFont } from '@/config/font';
import { cn } from '@/lib/utils';
import { getNetwork } from '@/utils/network';
import ClipboardIconButton from '@/components/clipboard-icon-button';

import type { ChAIN_ID } from '@/types/chains';
import type { CompositeMessage } from '@/types/messages';

type ColumnDataIndex =
  | 'status'
  | 'msgId'
  | 'fromChainId'
  | 'toChainId'
  | 'fromDapp'
  | 'transactionFrom'
  | 'transactionHash'
  | 'targetTransactionHash'
  | 'age';

type ColumnRenderValue = string | undefined;

export type Column = {
  dataIndex: ColumnDataIndex;
  title: string;
  width?: string;
  hiddenClass?: string;
  align?: 'left' | 'right' | 'center';
  render: (
    value: ColumnRenderValue,
    record: CompositeMessage,
    index: number,
    network: string
  ) => React.ReactNode;
};

function findChain(chainId: string | undefined) {
  if (!chainId) return undefined;
  return chains?.find((c) => c.id === (Number(chainId) as unknown as ChAIN_ID));
}

function buildTxLink(chain: ReturnType<typeof findChain>, txHash: string) {
  if (!chain?.blockExplorers?.default?.url) return undefined;
  if (chain.name.includes('Tron')) {
    return `${chain.blockExplorers.default.url}/#/transaction/${txHash.replace('0x', '')}`;
  }
  return `${chain.blockExplorers.default.url}/tx/${txHash}`;
}

function renderChainCell(chainId: string | undefined) {
  const chain = findChain(chainId);
  if (!chain) return null;

  return (
    <div className="flex min-w-0 items-center gap-2">
      <Image
        src={chain.iconUrl}
        alt={chain.name}
        width={20}
        height={20}
        className="size-5 shrink-0 rounded-full"
      />
      <span className="truncate text-sm" title={chain.name}>
        {chain.name}
      </span>
    </div>
  );
}

export const columns: Column[] = [
  {
    dataIndex: 'status',
    title: 'Status',
    width: '5.5rem',
    render(_value, record) {
      if (record?.status === -1) {
        return <Skeleton className="h-[22px] w-full rounded-full" />;
      }
      return <MessageStatus status={record.status} />;
    }
  },
  {
    dataIndex: 'msgId',
    title: 'Msg ID',
    width: '9rem',
    render(value, record) {
      if (record?.status === -1) {
        return <Skeleton className="h-[22px] w-full rounded-full" />;
      }
      return (
        <div className="flex items-center gap-1">
          <span
            className={cn(
              'truncate text-sm text-muted-foreground transition-colors hover:underline hover:underline-offset-2',
              CodeFont.className
            )}
            title={value}
          >
            {toShortText({ text: value, frontLength: 6, backLength: 4 })}
          </span>
          <ClipboardIconButton text={value} size={12} />
        </div>
      );
    }
  },
  {
    dataIndex: 'fromChainId',
    title: 'Source',
    width: '7rem',
    render(value, record) {
      if (record?.status === -1) {
        return <Skeleton className="h-[22px] w-full rounded-full" />;
      }
      return renderChainCell(value);
    }
  },
  {
    dataIndex: 'toChainId',
    title: 'Target',
    width: '7rem',
    render(value, record) {
      if (record?.status === -1) {
        return <Skeleton className="h-[22px] w-full rounded-full" />;
      }
      return renderChainCell(value);
    }
  },
  {
    dataIndex: 'fromDapp',
    title: 'Dapp',
    width: '8rem',
    render(value, record, _index, network) {
      if (record?.status === -1) {
        return <Skeleton className="h-[22px] w-full rounded-full" />;
      }
      if (!value) return <span className="text-sm text-muted-foreground">--</span>;

      const href = `/dapp/${encodeURIComponent(value)}?network=${getNetwork(network)}`;

      return (
        <Link
          href={href}
          className={cn('truncate text-sm hover:underline', CodeFont.className)}
          title={value}
          onClick={(e) => e.stopPropagation()}
        >
          <AddressDisplayFilterDappRemark
            address={value}
            formatAddress={(address) => toShortText({ text: address, frontLength: 6, backLength: 4 })}
          />
        </Link>
      );
    }
  },
  {
    dataIndex: 'transactionFrom',
    title: 'Original Sender',
    width: '8rem',
    render(value, record, _index, network) {
      if (record?.status === -1) {
        return <Skeleton className="h-[22px] w-full rounded-full" />;
      }
      if (!value) return <span className="text-sm text-muted-foreground">--</span>;

      const href = `/sender/${encodeURIComponent(value)}?network=${getNetwork(network)}`;

      return (
        <Link
          href={href}
          className={cn('truncate text-sm hover:underline', CodeFont.className)}
          title={value}
          onClick={(e) => e.stopPropagation()}
        >
          {toShortText({ text: value, frontLength: 6, backLength: 4 })}
        </Link>
      );
    }
  },
  {
    dataIndex: 'transactionHash',
    title: 'Source Tx Hash',
    width: '9rem',
    hiddenClass: 'hidden md:table-cell',
    render(value, record) {
      if (record?.status === -1) {
        return <Skeleton className="h-[22px] w-full rounded-full" />;
      }
      if (!value) return <span className="text-sm text-muted-foreground">--</span>;
      const chain = findChain(record?.fromChainId);
      const href = buildTxLink(chain, value);
      const short = toShortText({ text: value, frontLength: 6, backLength: 4 });
      if (href) {
        return (
          <Link
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            className={cn('flex items-center gap-1 text-sm text-info hover:underline', CodeFont.className)}
            title={value}
            onClick={(e) => e.stopPropagation()}
          >
            {short}
            <ExternalLink className="size-3 shrink-0" />
          </Link>
        );
      }
      return (
        <span className={cn('truncate text-sm text-muted-foreground', CodeFont.className)} title={value}>
          {short}
        </span>
      );
    }
  },
  {
    dataIndex: 'targetTransactionHash',
    title: 'Target Tx Hash',
    width: '9rem',
    hiddenClass: 'hidden lg:table-cell',
    render(value, record) {
      if (record?.status === -1) {
        return <Skeleton className="h-[22px] w-full rounded-full" />;
      }
      if (!value) return <span className="text-sm text-muted-foreground">--</span>;
      const chain = findChain(record?.toChainId);
      const href = buildTxLink(chain, value);
      const short = toShortText({ text: value, frontLength: 6, backLength: 4 });
      if (href) {
        return (
          <Link
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            className={cn('flex items-center gap-1 text-sm text-info hover:underline', CodeFont.className)}
            title={value}
            onClick={(e) => e.stopPropagation()}
          >
            {short}
            <ExternalLink className="size-3 shrink-0" />
          </Link>
        );
      }
      return (
        <span className={cn('truncate text-sm text-muted-foreground', CodeFont.className)} title={value}>
          {short}
        </span>
      );
    }
  },
  {
    dataIndex: 'age',
    title: 'Age',
    width: '5rem',
    align: 'right',
    render(_value, record) {
      if (record?.status === -1) {
        return <Skeleton className="h-[22px] w-full rounded-full" />;
      }
      const fullAge = record?.sentBlockTimestampSec
        ? formatTimeAgo(String(record?.sentBlockTimestampSec))
        : '';
      const shortAge = record?.sentBlockTimestampSec
        ? formatTimeAgoShort(String(record?.sentBlockTimestampSec))
        : '';
      return (
        <span className={cn('text-xs text-muted-foreground', CodeFont.className)} title={fullAge || undefined}>
          {shortAge}
        </span>
      );
    }
  }
];
