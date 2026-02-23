import Link from 'next/link';

import ClipboardIconButton from '@/components/clipboard-icon-button';
import ExplorerLinkButton from '@/components/explorer-link-button';
import { CodeFont } from '@/config/font';
import { toShortText } from '@/utils';
import { cn } from '@/lib/utils';

import type { CHAIN } from '@/types/chains';

interface AddressInfoProps {
  address?: string;
  chain?: CHAIN;
  href?: string;
}
const AddressInfo = ({ address, chain, href, children }: React.PropsWithChildren<AddressInfoProps>) => {
  if (!address) return <span className="text-[13px] text-muted-foreground">-</span>;

  const content = children ?? toShortText({ text: address, frontLength: 6, backLength: 4 });

  return (
    <div className="flex items-center gap-1.5">
      {href ? (
        <Link href={href} className={cn('text-[13px] hover:underline', CodeFont.className)} title={address}>
          {content}
        </Link>
      ) : (
        <span className={cn('text-[13px]', CodeFont.className)} title={address}>
          {content}
        </span>
      )}
      <ClipboardIconButton text={address} size={14} />
      {chain ? (
        <ExplorerLinkButton url={`${chain?.blockExplorers?.default?.url}/address/${address}`} />
      ) : null}
    </div>
  );
};

export default AddressInfo;
