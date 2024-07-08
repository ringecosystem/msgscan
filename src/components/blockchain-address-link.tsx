import React from 'react';
import Link from 'next/link';
import { toShortText } from '@/utils';
import { CHAIN } from '@/types/chains';
import { cn } from '@/lib/utils';
import { CodeFont } from '@/config/font';
import AddressDisplayFilterDappRemark from './AddressDisplayFilterDappRemark';

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
        <AddressDisplayFilterDappRemark address={address}>
          {toShortText(address, frontLength, backLength)}
        </AddressDisplayFilterDappRemark>
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
        <AddressDisplayFilterDappRemark address={address}>
          {toShortText(address, frontLength, backLength)}
        </AddressDisplayFilterDappRemark>
      </Link>
    );
  }

  return (
    <span title={address} className={className}>
      <AddressDisplayFilterDappRemark address={address}>
        {toShortText(address, frontLength, backLength)}
      </AddressDisplayFilterDappRemark>
    </span>
  );
};

export default BlockchainAddressLink;
