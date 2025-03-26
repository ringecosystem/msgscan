import {
  ArrowRightFromLine,
  ArrowRightToLine,
  LayoutGrid,
  MessageSquareCode,
  MessageSquareQuote,
  MessageSquareWarning,
  PackageSearch,
  SquareUser,
  Unplug
} from 'lucide-react';

import { FlipWords } from '@/components/ui/flip-words';
import { cn } from '@/lib/utils';
import { CodeFont } from '@/config/font';
import OrmpIcon from '@/components/icon/ormp';
import MessageStatus from '@/components/message-status';
import FadeInDown from '@/components/ui/fade-in-down';
import BackToTop from '@/components/ui/back-to-top';
import AddressDisplayFilterDappRemark from '@/components/address-display-filter-dapp-remark';


import TransactionHashInfo from './TransactionHashInfo';
import AddressInfo from './AddressInfo';
import ProtocolInfo from './ProtocolInfo';
import OrmpInfo from './OrmpInfo';
import Card from './Card';

import type { MessagePort } from '@/graphql/type';
import type { CHAIN } from '@/types/chains';


const words = ['Transaction Details'];

interface TxDetailProps {
  iconSize?: number;
  message: MessagePort;
  sourceChain?: CHAIN;
  targetChain?: CHAIN;
}
export default function TxDetail({ iconSize, sourceChain, targetChain, message }: TxDetailProps) {
  return (
    <FadeInDown duration={0.2}>
      <div>
        <header className="my-5 text-base font-light leading-8 text-foreground lg:text-xl">
          <FlipWords words={words} />
        </header>
        <div className="flex flex-col gap-[0.12rem]">
          <Card title="MsgId" icon={<SquareUser size={iconSize} strokeWidth={1.25} />}>
            <div className={cn('w-full break-words', CodeFont.className)}>{message?.id}</div>
          </Card>

          <Card title="Status" icon={<PackageSearch size={iconSize} strokeWidth={1.25} />}>
            {typeof message?.status !== 'undefined' && <MessageStatus status={message?.status} />}
          </Card>

          <Card
            title="Source Transaction Hash"
            icon={<ArrowRightFromLine size={iconSize} strokeWidth={1.25} />}
          >
            <TransactionHashInfo chain={sourceChain} hash={message?.sourceTransactionHash} />
          </Card>

          <Card
            title="Target Transaction Hash"
            icon={<ArrowRightToLine size={iconSize} strokeWidth={1.25} />}
          >
            <TransactionHashInfo chain={targetChain} hash={message?.targetTransactionHash} />
          </Card>

          <Card
            title="Messaging Protocol"
            icon={<MessageSquareCode size={iconSize} strokeWidth={1.25} />}
          >
            <ProtocolInfo protocol={message?.protocol} />
          </Card>

          <Card
            title="Message Payload"
            icon={<MessageSquareWarning size={iconSize} strokeWidth={1.25} />}
          >
            {message?.payload ? (
              <div
                className={cn('w-full break-words rounded bg-background p-5', CodeFont.className)}
              >
                {message?.payload}
              </div>
            ) : null}
          </Card>

          <Card
            title="Message Params"
            icon={<MessageSquareQuote size={iconSize} strokeWidth={1.25} />}
          >
            {message?.params ? (
              <div
                className={cn('w-full break-words rounded bg-background p-5', CodeFont.className)}
              >
                {message?.params}
              </div>
            ) : null}
          </Card>

          <Card
            title="Original Sender Address"
            icon={<LayoutGrid size={iconSize} strokeWidth={1.25} />}
          >
            <AddressInfo address={message?.sender} chain={sourceChain}></AddressInfo>
          </Card>

          <Card
            title="Source Dapp Address"
            icon={<LayoutGrid size={iconSize} strokeWidth={1.25} />}
          >
            <AddressInfo address={message?.sourceDappAddress} chain={sourceChain}>
              <AddressDisplayFilterDappRemark address={message?.sourceDappAddress || ''}>
                <span className="max-w-[calc(100vw-10rem)] truncate">
                  ({message?.sourceDappAddress})
                </span>
              </AddressDisplayFilterDappRemark>
            </AddressInfo>
          </Card>

          <Card title="Source Port Address" icon={<Unplug size={iconSize} strokeWidth={1.25} />}>
            <AddressInfo address={message?.sourcePortAddress} chain={sourceChain} />
          </Card>
          <Card title="Target Port Address" icon={<Unplug size={iconSize} strokeWidth={1.25} />}>
            <AddressInfo address={message?.targetPortAddress} chain={targetChain} />
          </Card>
          <Card
            title="Target Dapp Address"
            icon={<LayoutGrid size={iconSize} strokeWidth={1.25} />}
          >
            <AddressInfo address={message?.targetDappAddress} chain={targetChain}>
              <AddressDisplayFilterDappRemark address={message?.targetDappAddress || ''}>
                <span className="max-w-[calc(100vw-10rem)] truncate">
                  ({message?.targetDappAddress})
                </span>
              </AddressDisplayFilterDappRemark>
            </AddressInfo>
          </Card>
          <Card title="ORMP Info" icon={<OrmpIcon />}>
            {message?.ormp ? <OrmpInfo ormpInfo={message?.ormp} /> : null}
          </Card>
        </div>
        <div className="flex items-center justify-end pt-4">
          <BackToTop />
        </div>
      </div>
    </FadeInDown>
  );
}
