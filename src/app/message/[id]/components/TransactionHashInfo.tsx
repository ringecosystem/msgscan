import ChainTxDisplay from '@/components/chain-tx-display';
import ClipboardIconButton from '@/components/clipboard-icon-button';
import ExplorerLinkButton from '@/components/explorer-link-button';
import type { CHAIN } from '@/types/chains';

interface TransactionHashInfoProps {
  chain?: CHAIN;
  hash?: string;
}

const TransactionHashInfo = ({ chain, hash }: TransactionHashInfoProps) => {
  return (
    <div className="flex items-center">
      <ChainTxDisplay
        chain={chain}
        className="w-[90%] max-w-[calc(100vw-14rem)]"
        rootClassName="gap-[0.62rem]"
        isFullText
        value={hash}
        isLink={false}
      >
        {hash && <ClipboardIconButton text={hash} size={16} />}
        {hash && chain ? (
          <ExplorerLinkButton url={`${chain?.blockExplorers?.default?.url}/tx/${hash}`} />
        ) : null}
      </ChainTxDisplay>
    </div>
  );
};
export default TransactionHashInfo;
