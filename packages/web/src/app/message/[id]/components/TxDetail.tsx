'use client';

import BackToTop from '@/components/ui/back-to-top';

import DetailHeader from './sections/DetailHeader';
import OverviewPanel from './sections/OverviewPanel';
import TransactionSummary from './sections/TransactionSummary';
import MessageInfoSection from './sections/MessageInfoSection';
import ProtocolDetailsSection from './sections/ProtocolDetailsSection';
import RawDataSection from './sections/RawDataSection';

import type { CHAIN } from '@/types/chains';
import type { CompositeMessage } from '@/types/messages';

interface TxDetailProps {
  message: CompositeMessage;
  sourceChain?: CHAIN;
  targetChain?: CHAIN;
  acceptedTargetChain?: CHAIN;
}

export default function TxDetail({
  sourceChain,
  targetChain,
  acceptedTargetChain,
  message,
}: TxDetailProps) {
  return (
    <div className="py-6 pb-12 md:py-8 md:pb-16">
      <DetailHeader msgId={message.msgId} />

      {/* Overview panel */}
      <div className="mb-6 md:mb-8">
        <OverviewPanel
          message={message}
          sourceChain={sourceChain}
          targetChain={targetChain}
        />
      </div>

      {/* Transaction summary */}
      <div className="mb-6 md:mb-8">
        <TransactionSummary
          message={message}
          sourceChain={sourceChain}
          targetChain={targetChain}
        />
      </div>

      {/* Message information */}
      <div className="mb-6 md:mb-8">
        <MessageInfoSection
          message={message}
          sourceChain={sourceChain}
          targetChain={targetChain}
          acceptedTargetChain={acceptedTargetChain}
        />
      </div>

      {/* Protocol details (collapsible) */}
      {message.accepted && (
        <div className="mb-6 md:mb-8">
          <ProtocolDetailsSection
            accepted={message.accepted}
            targetChain={acceptedTargetChain ?? targetChain}
          />
        </div>
      )}

      {/* Raw data (collapsible) */}
      {(message.message || message.params) && (
        <div className="mb-6 md:mb-8">
          <RawDataSection message={message.message} params={message.params} />
        </div>
      )}

      <div className="flex items-center justify-end pt-4">
        <BackToTop />
      </div>
    </div>
  );
}
