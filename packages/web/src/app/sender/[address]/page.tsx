import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { getChainsByNetwork, getNetwork } from '@/utils/network';
import MessagePortTable from '@/components/message-port-table';
import ClipboardIconButton from '@/components/clipboard-icon-button';
import { CodeFont } from '@/config/font';
import { cn } from '@/lib/utils';

interface PageProps {
  params: Promise<{
    address: string;
  }>;
  searchParams: Promise<{
    network?: string;
  }>;
}
export default async function Page({ params, searchParams }: PageProps) {
  const [{ address }, { network }] = await Promise.all([params, searchParams]);
  const effectiveNetwork = getNetwork(network);
  const chains = getChainsByNetwork(effectiveNetwork);

  return (
    <div className="py-6">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href={`/?network=${effectiveNetwork}`} className="hover:text-foreground">
          Messages
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">Sender</span>
      </nav>

      {/* Address header */}
      <div className="mb-6">
        <span className="text-xs text-muted-foreground">Sender Address</span>
        <div className="mt-1 flex items-center gap-2">
          <h1 className={cn('truncate text-sm font-medium sm:text-base', CodeFont.className)}>
            {address}
          </h1>
          <ClipboardIconButton text={address} size={16} />
        </div>
      </div>

      <MessagePortTable network={effectiveNetwork} sender={address} chains={chains} />
    </div>
  );
}
