import React from 'react';
import Link from 'next/link';
import { toShortText } from '@/utils';
import { CHAIN } from '@/types/chains';
import { cn } from '@/lib/utils';
import { CodeFont } from '@/config/font';

interface BlockchainAddressLinkProps {
  chain?: CHAIN;
  href?: string;
  address: string;
  className?: string;
  frontLength?: number;
  backLength?: number;
}
const BlockchainAddressLink = ({
  chain,
  href,
  address,
  className,
  frontLength = 6,
  backLength = 4
}: BlockchainAddressLinkProps) => {
  if (href) {
    return (
      <Link
        title={address}
        href={href}
        className={cn('hover:underline', CodeFont.className, className)}
      >
        {toShortText(address, frontLength, backLength)}
      </Link>
    );
  }
  const getUrl = () => {
    return `${chain?.blockExplorers?.default?.url}/address/${address}`;
  };

  if (chain) {
    return (
      <Link
        title={address}
        href={getUrl()}
        className={cn('hover:underline', CodeFont.className, className)}
        target="_blank"
        rel="noreferrer noopener"
      >
        {toShortText(address, frontLength, backLength)}
      </Link>
    );
  }

  return (
    <span title={address} className={className}>
      {toShortText(address, frontLength, backLength)}
    </span>
  );
};

export default BlockchainAddressLink;
