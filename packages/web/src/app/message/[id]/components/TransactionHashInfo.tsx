import { cn } from '@/lib/utils';
import { CodeFont } from '@/config/font';
import { toShortText } from '@/utils';
import ClipboardIconButton from '@/components/clipboard-icon-button';
import ExplorerLinkButton from '@/components/explorer-link-button';

import type { CHAIN } from '@/types/chains';

interface TransactionHashInfoProps {
  chain?: CHAIN;
  hash?: string;
}

const TransactionHashInfo = ({ chain, hash }: TransactionHashInfoProps) => {
  if (!hash) return <span className="text-xs text-muted-foreground">-</span>;

  let explorerUrl = `${chain?.blockExplorers?.default?.url}/tx/${hash}`;
  if (chain?.name.includes('Tron')) {
    explorerUrl = `${chain?.blockExplorers?.default?.url}/#/transaction/${hash.replace('0x', '')}`;
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className={cn('text-[13px]', CodeFont.className)} title={hash}>
        {toShortText({ text: hash, frontLength: 6, backLength: 4 })}
      </span>
      {chain && <ExplorerLinkButton url={explorerUrl} />}
      <ClipboardIconButton text={hash} size={14} />
    </div>
  );
};
export default TransactionHashInfo;
