'use client';

import { cn } from '@/lib/utils';
import { CodeFont } from '@/config/font';
import { toShortText } from '@/utils';
import ClipboardIconButton from '@/components/clipboard-icon-button';
import AddressDisplayFilterDappRemark from '@/components/address-display-filter-dapp-remark';

interface DappAddressHeaderProps {
  address: string;
  dappName: string | null | undefined;
  effectiveNetwork: string;
}

export default function DappAddressHeader({ address, dappName, effectiveNetwork }: DappAddressHeaderProps) {
  return (
    <div className="py-4">
      <nav aria-label="breadcrumb" className="mb-1 flex items-center gap-1 text-sm text-muted-foreground">
        <span>Messages</span>
        <span aria-hidden="true">›</span>
        <span>{dappName ? 'Dapp' : 'Sender'}</span>
        <span className="ml-1.5 rounded-full bg-muted px-2 py-0.5 text-xs capitalize">{effectiveNetwork}</span>
      </nav>
      <header>
        {dappName ? (
          <>
            <h1 className="text-xl font-bold text-foreground sm:text-2xl">
              <AddressDisplayFilterDappRemark address={address} className="gap-2" />
            </h1>
            <div className="mt-1 flex items-center gap-1.5">
              <span className={cn('truncate text-sm text-muted-foreground', CodeFont.className)}>
                {toShortText({ text: address, frontLength: 6, backLength: 4 })}
              </span>
              <ClipboardIconButton text={address} size={14} />
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <h1
              className={cn('break-all text-xl font-bold text-foreground sm:text-2xl', CodeFont.className)}
              title={address}
            >
              {address}
            </h1>
            <ClipboardIconButton text={address} size={14} />
          </div>
        )}
      </header>
    </div>
  );
}
