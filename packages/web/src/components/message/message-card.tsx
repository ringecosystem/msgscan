'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { chains as configuredChains } from '@/config/chains';
import { formatTimeAgo, toShortText } from '@/utils';
import { CodeFont } from '@/config/font';
import MessageStatus from '@/components/message-status';
import AddressDisplayFilterDappRemark from '@/components/address-display-filter-dapp-remark';
import ChainTxDisplay from '@/components/chain-tx-display';
import { getNetwork } from '@/utils/network';

import type { ChAIN_ID } from '@/types/chains';
import type { CompositeMessage } from '@/types/messages';

interface MessageCardProps {
  message: CompositeMessage;
  network: string;
}

export default function MessageCard({ message, network }: MessageCardProps) {
  const router = useRouter();
  
  const sourceChain = configuredChains.find(
    (c) => c.id === (Number(message.fromChainId) as unknown as ChAIN_ID)
  );
  const targetChain = configuredChains.find(
    (c) => c.id === (Number(message.toChainId) as unknown as ChAIN_ID)
  );

  const normalizedNetwork = getNetwork(network);
  const messageHref = `/message/${message.msgId}?network=${normalizedNetwork}`;
  const senderAddress = message.transactionFrom ?? undefined;

  const handleOpenMessage = (e: React.MouseEvent | React.KeyboardEvent) => {
    // Prevent navigation if the user clicked on an interactive element like a link
    if ((e.target as HTMLElement).closest('a, button')) return;
    router.push(messageHref);
  };

  return (
    <article 
      className="rounded-xl border border-border/50 bg-card p-4 transition-colors hover:bg-muted/30 active:bg-muted/50 cursor-pointer focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      onClick={handleOpenMessage}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpenMessage(e);
        }
      }}
      tabIndex={0}
      aria-label={`Open message ${message.msgId} details`}
    >
      {/* Row 1: Status + Age */}
      <div className="flex items-center justify-between mb-3">
        {message.status !== -1 && <MessageStatus status={message.status} />}
        <span className="text-xs text-muted-foreground">
          {message.sentBlockTimestampSec
            ? formatTimeAgo(String(message.sentBlockTimestampSec))
            : ''}
        </span>
      </div>

      {/* Row 2: Source -> Target chain route */}
      <div className="flex items-center gap-2 mb-4 rounded-lg bg-muted/40 px-3 py-2.5">
        <div className="flex items-center gap-2">
          {sourceChain?.iconUrl && (
            <Image
              src={sourceChain.iconUrl}
              alt={sourceChain.name}
              width={20}
              height={20}
              className="size-5 rounded-full"
            />
          )}
          <span className="text-sm font-medium">{sourceChain?.name ?? 'Unknown'}</span>
        </div>
        <ArrowRight className="mx-1 size-3.5 shrink-0 text-muted-foreground/60" />
        <div className="flex items-center gap-2">
          {targetChain?.iconUrl && (
            <Image
              src={targetChain.iconUrl}
              alt={targetChain.name}
              width={20}
              height={20}
              className="size-5 rounded-full"
            />
          )}
          <span className="text-sm font-medium">{targetChain?.name ?? 'Unknown'}</span>
        </div>
      </div>

      {/* Row 3: Details */}
      <div className="space-y-3 border-t border-border/40 pt-3">
        <div className="hidden sm:flex items-center gap-4 text-xs">
          <span className="w-16 shrink-0 font-medium uppercase tracking-wider text-muted-foreground/70">Dapp</span>
          {message.fromDapp ? (
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <Link 
                href={`/dapp/${message.fromDapp}?network=${normalizedNetwork}`}
                className="hover:underline flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm"
              >
                <AddressDisplayFilterDappRemark
                  address={message.fromDapp}
                  formatAddress={(address) =>
                    toShortText({
                      text: address,
                      frontLength: 6,
                      backLength: 4
                    })
                  }
                />
              </Link>
            </span>
          ) : (
            <span className="font-medium text-muted-foreground/40">--</span>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="w-16 shrink-0 font-medium uppercase tracking-wider text-muted-foreground/70">Src Tx</span>
          {message.transactionHash ? (
            <ChainTxDisplay
              chain={sourceChain}
              value={message.transactionHash}
              showIcon={false}
              className="text-info"
            />
          ) : (
            <span className="font-medium text-muted-foreground/40">--</span>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="w-16 shrink-0 font-medium uppercase tracking-wider text-muted-foreground/70">Tgt Tx</span>
          {message.targetTransactionHash ? (
            <ChainTxDisplay
              chain={targetChain}
              value={message.targetTransactionHash}
              showIcon={false}
              className="text-info"
            />
          ) : (
            <span className="font-medium text-muted-foreground/40">--</span>
          )}
        </div>
      </div>

      <div className="mt-3 border-t border-border/40 pt-3">
        <div className="flex items-center gap-4 text-xs">
          <span className="w-16 shrink-0 font-medium uppercase tracking-wider text-muted-foreground/70">Sender</span>
          {senderAddress ? (
            <Link
              href={`/sender/${encodeURIComponent(senderAddress)}?network=${normalizedNetwork}`}
              className={cn('font-medium hover:underline text-info focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm', CodeFont.className)}
              title={senderAddress}
            >
              {toShortText({ text: senderAddress, frontLength: 6, backLength: 4 })}
            </Link>
          ) : (
            <span className="font-medium text-muted-foreground/40">--</span>
          )}
        </div>
      </div>
    </article>
  );
}
