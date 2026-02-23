import { cn } from '@/lib/utils';
import { CodeFont } from '@/config/font';
import { toShortText } from '@/utils';
import ClipboardIconButton from '@/components/clipboard-icon-button';
import AddressDisplayFilterDappRemark from '@/components/address-display-filter-dapp-remark';

import AddressInfo from '../AddressInfo';

import { SectionLabel, DetailRow } from './shared';

import type { CHAIN } from '@/types/chains';
import type { CompositeMessage } from '@/types/messages';

interface MessageInfoSectionProps {
  message: CompositeMessage;
  sourceChain?: CHAIN;
  targetChain?: CHAIN;
  acceptedTargetChain?: CHAIN;
}

function DappDisplay({ address, chain }: { address?: string; chain?: CHAIN }) {
  if (!address) return <span className="text-[13px] text-muted-foreground">-</span>;

  return (
    <div className="flex min-w-0 overflow-hidden">
      <AddressInfo address={address} chain={chain}>
        <AddressDisplayFilterDappRemark
          address={address}
          formatAddress={(a) => toShortText({ text: a, frontLength: 6, backLength: 4 })}
        >
          <span className="min-w-0 truncate">({toShortText({ text: address, frontLength: 6, backLength: 4 })})</span>
        </AddressDisplayFilterDappRemark>
      </AddressInfo>
    </div>
  );
}

export default function MessageInfoSection({
  message,
  sourceChain,
  targetChain,
  acceptedTargetChain,
}: MessageInfoSectionProps) {
  return (
    <div className="space-y-3.5">
      <SectionLabel>Message Info</SectionLabel>

      <div className="rounded-xl border border-border/50 bg-card p-6">
        <div className="grid gap-x-10 sm:grid-cols-2 [&>*:nth-last-child(-n+2)]:border-b-0">
          {/* Message ID — full width */}
          <DetailRow label="Message ID" className="sm:col-span-2">
            <div className="flex items-center gap-1.5">
              <span className={cn('text-[13px]', CodeFont.className)} title={message.msgId}>
                {toShortText({ text: message.msgId, frontLength: 10, backLength: 4 })}
              </span>
              <ClipboardIconButton text={message.msgId} size={14} />
            </div>
          </DetailRow>

          {/* Source Dapp | Target Dapp */}
          <DetailRow label="Source Dapp">
            <DappDisplay address={message.fromDapp} chain={sourceChain} />
          </DetailRow>

          <DetailRow label="Target Dapp">
            <DappDisplay
              address={message.toDapp}
              chain={acceptedTargetChain ?? targetChain}
            />
          </DetailRow>

          {/* Source Port | Target Port */}
          <DetailRow label="Source Port">
            <AddressInfo address={message.portAddress} chain={sourceChain} />
          </DetailRow>

          <DetailRow label="Target Port">
            <AddressInfo
              address={message.accepted?.to}
              chain={acceptedTargetChain ?? targetChain}
            />
          </DetailRow>
        </div>
      </div>
    </div>
  );
}
